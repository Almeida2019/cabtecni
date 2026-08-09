/**
 * Thin wrapper around kie.ai's job API: create a task, poll for the result,
 * download the returned asset. Shared by every model-specific CLI in this
 * folder so we're never re-implementing the same retry / error handling.
 *
 * Docs:
 *   https://docs.kie.ai/                              (auth, task lifecycle)
 *   https://docs.kie.ai/market/common/get-task-detail (result polling)
 */

import { writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";

const CREATE_URL = "https://api.kie.ai/api/v1/jobs/createTask";
const DETAIL_URL = "https://api.kie.ai/api/v1/jobs/recordInfo";
const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

export class KieError extends Error {
  constructor(message) { super(message); this.name = "KieError"; }
}

function requireApiKey() {
  const key = process.env.KIE_API_KEY;
  if (!key) throw new KieError(
    "KIE_API_KEY is not set. Add it to .env.local and re-run with `node --env-file=.env.local ...`.",
  );
  return key;
}

/**
 * Create a task and return its taskId. `body` is the full kie.ai request:
 *   { model, input, callBackUrl? }
 */
export async function createTask(body) {
  const apiKey = requireApiKey();
  const response = await fetch(CREATE_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new KieError(`createTask HTTP ${response.status}: ${text.slice(0, 500)}`);
  let json;
  try { json = JSON.parse(text); } catch { throw new KieError(`createTask non-JSON response: ${text.slice(0, 500)}`); }
  if (json.code !== 200) throw new KieError(`createTask API error ${json.code}: ${json.msg ?? "unknown"}`);
  const taskId = json.data?.taskId;
  if (!taskId) throw new KieError(`createTask response missing data.taskId: ${text.slice(0, 500)}`);
  return taskId;
}

/**
 * Poll for a task until it succeeds or fails. Calls `onState(state)` on
 * every state transition (waiting → queuing → generating → success).
 * Resolves with `{ resultUrls, creditsConsumed, costTime }`.
 */
export async function pollTask(taskId, { onState } = {}) {
  const apiKey = requireApiKey();
  const startedAt = Date.now();
  let lastState = "";

  while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
    const response = await fetch(`${DETAIL_URL}?taskId=${encodeURIComponent(taskId)}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });
    if (!response.ok) throw new KieError(`recordInfo HTTP ${response.status}`);
    const { data, code, msg } = await response.json();
    if (code !== 200) throw new KieError(`recordInfo API error ${code}: ${msg ?? "unknown"}`);

    if (data.state !== lastState) {
      onState?.(data.state);
      lastState = data.state;
    }

    if (data.state === "success") {
      let result;
      try { result = JSON.parse(data.resultJson ?? "{}"); }
      catch { throw new KieError(`Cannot parse resultJson: ${data.resultJson}`); }
      const urls = result?.resultUrls ?? [];
      if (urls.length === 0) throw new KieError(`Task succeeded but no resultUrls: ${data.resultJson}`);
      return {
        resultUrls: urls,
        creditsConsumed: data.creditsConsumed,
        costTime: data.costTime,
      };
    }
    if (data.state === "fail") {
      throw new KieError(`Task failed. ${data.failCode ?? ""} ${data.failMsg ?? ""}`.trim());
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new KieError(`Timed out after ${POLL_TIMEOUT_MS / 1000}s waiting for task ${taskId}.`);
}

const EXT_BY_CONTENT_TYPE = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/**
 * Download a URL to a local file. Returns `{ bytes, path }`.
 *
 * Some models return a different format than the extension in `--out`
 * implies (e.g. nano-banana-2-lite has no `output_format` field and often
 * comes back as JPEG). If the actual content-type doesn't match the
 * requested extension, this corrects the extension rather than writing a
 * mislabeled file — a `.png` that's actually JPEG bytes still opens fine in
 * most viewers, but breaks anything that trusts the extension.
 */
export async function downloadTo(url, path) {
  const response = await fetch(url);
  if (!response.ok) throw new KieError(`Downloading result HTTP ${response.status}`);
  const buf = Buffer.from(await response.arrayBuffer());

  const contentType = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  const correctExt = contentType && EXT_BY_CONTENT_TYPE[contentType];
  const currentExt = path.slice(path.lastIndexOf(".")).toLowerCase();
  let finalPath = path;
  if (correctExt && correctExt !== currentExt) {
    finalPath = path.slice(0, path.lastIndexOf(".")) + correctExt;
  }

  await writeFile(finalPath, buf);
  return { bytes: buf.length, path: finalPath };
}
