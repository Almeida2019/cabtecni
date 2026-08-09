#!/usr/bin/env node
/**
 * Recraft remove-background via kie.ai.
 *
 * Usage:
 *   node --env-file=.env.local scripts/kie/remove-background.mjs \
 *     <image-url-or-local-path> [--out <output.png>] [--callback <url>]
 *
 * Examples:
 *   node --env-file=.env.local scripts/kie/remove-background.mjs \
 *     https://example.com/photo.jpg --out cleaned.png
 *
 *   node --env-file=.env.local scripts/kie/remove-background.mjs \
 *     ./public/images/cabtecni/mining.jpg --out mining-nobg.png
 *
 * Reads KIE_API_KEY from the environment (set via `--env-file=.env.local`,
 * or exported in your shell, or provided by your deploy platform).
 *
 * Docs:
 *   https://docs.kie.ai/market/recraft/remove-background
 *   https://docs.kie.ai/market/common/get-task-detail
 *
 * The API requires an image URL (PNG/JPG/WEBP, ≤5MB, ≤16MP, 256–4096px) — it
 * does not accept base64 data URLs (confirmed: returns "image file type not
 * supported"). Local files are served through a temporary public tunnel;
 * see tunnel.mjs.
 */

import { access } from "node:fs/promises";
import { statSync } from "node:fs";
import { extname, resolve } from "node:path";
import { serveOverPublicTunnel } from "./tunnel.mjs";
import { createTask, pollTask, downloadTo, KieError } from "./client.mjs";

const ALLOWED_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function die(message, code = 1) {
  console.error(`\x1b[31m✗\x1b[0m ${message}`);
  process.exit(code);
}

function parseArgs(argv) {
  const args = { image: null, out: null, callback: null };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out" || a === "-o") args.out = argv[++i];
    else if (a === "--callback") args.callback = argv[++i];
    else if (a === "--help" || a === "-h") { printHelp(); process.exit(0); }
    else positional.push(a);
  }
  args.image = positional[0] ?? null;
  return args;
}

function printHelp() {
  console.log(`Usage: node --env-file=.env.local scripts/kie/remove-background.mjs <image> [--out <path>] [--callback <url>]

  <image>       Public URL, or local file path (PNG/JPG/WEBP, <= 5MB).
  --out, -o     Where to save the transparent PNG. Default: ./bg-removed-<ts>.png
  --callback    Optional webhook URL for completion notification.
  --help, -h    Show this message.

Requires KIE_API_KEY in the environment.`);
}

/**
 * Turns the CLI input into a URL kie.ai can fetch, along with a `cleanup`
 * hook. If the input is already a URL, `cleanup` is a no-op. If it's a
 * local file, we serve it over a temporary public tunnel and return the
 * tunnel URL; `cleanup` shuts the tunnel down.
 */
async function prepareImageUrl(input) {
  if (/^https?:\/\//i.test(input)) return { url: input, cleanup: async () => {}, via: "direct" };

  const path = resolve(input);
  try { await access(path); }
  catch (err) { die(`Cannot read local file "${path}": ${err.message}`); }

  if (!ALLOWED_EXTS.has(extname(path).toLowerCase()))
    die(`Unsupported file extension for "${path}". Use PNG, JPG or WEBP.`);

  const size = statSync(path).size;
  if (size > 5 * 1024 * 1024)
    die(`"${path}" is ${(size / 1024 / 1024).toFixed(2)} MB. The API max is 5 MB.`);

  process.stdout.write("  starting local tunnel…\n");
  const tunnel = await serveOverPublicTunnel(path);
  return { url: tunnel.url, cleanup: async () => tunnel.close(), via: tunnel.via };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.image) { printHelp(); process.exit(2); }

  if (!process.env.KIE_API_KEY) {
    die("KIE_API_KEY is not set. Add it to .env.local and re-run with `node --env-file=.env.local ...`.");
  }

  const out = args.out ?? `bg-removed-${Date.now()}.png`;

  console.log(`→ Preparing image: ${args.image}`);
  const { url: image, cleanup, via } = await prepareImageUrl(args.image);
  if (via !== "direct") console.log(`  serving via ${via} at ${image}`);

  try {
    console.log("→ Creating task…");
    const taskId = await createTask({
      model: "recraft/remove-background",
      input: { image },
      ...(args.callback ? { callBackUrl: args.callback } : {}),
    });
    console.log(`  taskId: ${taskId}`);

    console.log("→ Polling for result…");
    let lastState = "";
    const { resultUrls } = await pollTask(taskId, {
      onState: (state) => {
        process.stdout.write(`\r  state: ${state.padEnd(12)}`);
        lastState = state;
      },
    });
    if (lastState) process.stdout.write("\n");
    console.log(`  result URL: ${resultUrls[0]}`);

    console.log(`→ Downloading to ${out}…`);
    const { bytes, path: savedPath } = await downloadTo(resultUrls[0], out);
    if (savedPath !== out) console.log(`  (actual format didn't match "${out}"'s extension, saved as ${savedPath} instead)`);
    console.log(`\x1b[32m✓\x1b[0m Saved ${(bytes / 1024).toFixed(1)} KB to ${savedPath}`);
  } catch (err) {
    if (err instanceof KieError) die(err.message);
    throw err;
  } finally {
    await cleanup();
  }
}

main().catch((err) => die(err.stack ?? String(err)));
