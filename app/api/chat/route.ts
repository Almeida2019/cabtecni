import { isLocale, DEFAULT_LOCALE, type Locale } from "../../i18n/config";
import { buildSystemPrompt } from "./system-prompt";

/**
 * OpenRouter (OpenAI-compatible chat completions).
 *
 * Switched from the Gemini Developer API, which kept returning 404s as models
 * were retired from the free tier. OpenRouter fronts many providers behind one
 * schema, so swapping models later is a single env var rather than a rewrite.
 */
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "poolside/laguna-s-2.1:free";

// Input caps. These protect the free-tier quota as much as the server.
const MAX_MESSAGE_CHARS = 800;
const MAX_HISTORY_TURNS = 10;
const MAX_OUTPUT_TOKENS = 400;

// Naive per-IP burst limiter. In a Workers/serverless deployment this Map is
// per-isolate, so it is a speed bump against a single abusive client, NOT a
// real quota guarantee. For hard limits use a durable store (KV/D1/Redis).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT_MAX;
}

/** The widget speaks Gemini's vocabulary internally; OpenAI uses "assistant". */
type ClientMessage = { role: "user" | "model"; text: string };

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return json({ error: "unconfigured" }, 503);

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  let payload: { message?: unknown; history?: unknown; locale?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message) return json({ error: "bad_request" }, 400);
  if (message.length > MAX_MESSAGE_CHARS) return json({ error: "too_long" }, 413);

  const locale: Locale =
    typeof payload.locale === "string" && isLocale(payload.locale) ? payload.locale : DEFAULT_LOCALE;

  // Only trust role/text, and only the most recent turns. The client controls
  // this array, so it is treated as untrusted input, not as state.
  const history: ClientMessage[] = Array.isArray(payload.history)
    ? payload.history
        .filter(
          (m): m is ClientMessage =>
            !!m &&
            typeof m === "object" &&
            ((m as ClientMessage).role === "user" || (m as ClientMessage).role === "model") &&
            typeof (m as ClientMessage).text === "string",
        )
        .slice(-MAX_HISTORY_TURNS)
        .map((m) => ({ role: m.role, text: m.text.slice(0, MAX_MESSAGE_CHARS) }))
    : [];

  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  const body = {
    model,
    messages: [
      { role: "system", content: buildSystemPrompt(locale) },
      ...history.map((m) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.text,
      })),
      { role: "user", content: message },
    ],
    temperature: 0.3,
    max_tokens: MAX_OUTPUT_TOKENS,
    top_p: 0.9,
  };

  const referer = process.env.OPENROUTER_SITE_URL;
  const title = process.env.OPENROUTER_SITE_NAME;

  let upstream: Response;
  try {
    upstream = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        // Optional attribution for OpenRouter's rankings. Harmless if unset.
        ...(referer ? { "HTTP-Referer": referer } : {}),
        ...(title ? { "X-Title": title } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return json({ error: "upstream_unreachable" }, 502);
  }

  if (!upstream.ok) {
    if (upstream.status === 429) return json({ error: "rate_limited" }, 429);
    // Log, never forward: upstream error bodies can echo credentials and are
    // not useful to the visitor either way.
    const detail = await upstream.text().catch(() => "");
    console.error(`[chat] OpenRouter ${upstream.status} for ${model}: ${detail.slice(0, 300)}`);
    return json({ error: "upstream_error" }, 502);
  }

  const data = (await upstream.json()) as {
    choices?: { message?: { content?: string }; finish_reason?: string }[];
    error?: { message?: string; code?: number };
  };

  // OpenRouter can return HTTP 200 with an error object in the body.
  if (data.error) {
    console.error(`[chat] OpenRouter body error: ${data.error.code} ${data.error.message}`);
    return json({ error: "upstream_error" }, 502);
  }

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) return json({ error: "empty" }, 200);

  return json({ reply }, 200);
}
