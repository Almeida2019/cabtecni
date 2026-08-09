#!/usr/bin/env node
/**
 * Generate an image via kie.ai and download the result.
 *
 * Usage:
 *   node --env-file=.env.local scripts/kie/generate.mjs "<prompt>" [options]
 *
 * Examples:
 *   node --env-file=.env.local scripts/kie/generate.mjs \
 *     "Photorealistic oil rig at sunset, teal and orange industrial lighting, cinematic" \
 *     --aspect 16:9 --out hero-oilrig.png
 *
 *   node --env-file=.env.local scripts/kie/generate.mjs \
 *     "Same site, but overcast and blue-toned" \
 *     --reference https://example.com/oilrig.jpg --model nano-banana-2-lite
 *
 * Default model: nano-banana-2-lite (Google Gemini 3.1 Flash Lite Image).
 * Picked for the best quality-per-credit on kie.ai as of 2026-08: rank #7 on
 * the LMArena text-to-image leaderboard (Elo 1250), 4 credits/image, cheaper
 * AND higher-rated than nano-banana-pro (18 credits, Elo ~1245) and flux-1-
 * kontext-pro (5 credits, Elo ~1059). See https://arena.ai/leaderboard/text-to-image
 * and https://kie.ai/pricing if prices or rankings shift — swap MODEL_PRESETS
 * below rather than hardcoding a new default elsewhere.
 *
 * Docs:
 *   https://docs.kie.ai/market/google/nano-banana-2-lite
 *   https://docs.kie.ai/market/common/get-task-detail
 */

import { createTask, pollTask, downloadTo, KieError } from "./client.mjs";

const MODEL_PRESETS = {
  "qwen3-pro": {
    model: "qwen3/pro-text-to-image",
    credits: 12, // "2K"; 6.4 at "1K"
    // NOTE: this model names things differently from the Google presets:
    // `image_size` carries the ASPECT RATIO and `resolution` carries 1K/2K.
    // Passing `aspect_ratio`/`size` is silently ignored (verified), so a typo
    // here fails quietly at 1K/16:9 rather than erroring.
    aspectRatios: ["1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16", "21:9"],
    maxReferences: 0,
    buildInput: (prompt, { aspect, resolution, negative }) => ({
      prompt,
      image_size: aspect ?? "16:9",
      resolution: resolution === "1K" ? "1K" : "2K",
      output_format: "png",
      // Default is true, which rewrites the prompt. Our prompts are already
      // detailed and art-directed, so keep control and switch it off.
      prompt_extend: false,
      negative_prompt: negative ?? "watermark, signature, logo, caption, text overlay, distorted hands, extra fingers, deformed anatomy",
    }),
  },
  "nano-banana-2-lite": {
    model: "nano-banana-2-lite",
    credits: 4,
    aspectRatios: ["1:1", "1:4", "1:8", "2:3", "3:2", "3:4", "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9", "auto"],
    maxReferences: 10,
    buildInput: (prompt, { aspect, references }) => ({
      prompt,
      aspect_ratio: aspect ?? "auto",
      ...(references.length ? { image_urls: references } : {}),
    }),
  },
  "nano-banana-2": {
    model: "nano-banana-2",
    credits: 8, // 1K; 12 at 2K, 18 at 4K — pass --resolution to change
    aspectRatios: ["1:1", "2:3", "3:2", "16:9", "9:16", "auto"],
    maxReferences: 14,
    buildInput: (prompt, { aspect, references, resolution }) => ({
      prompt,
      aspect_ratio: aspect ?? "auto",
      resolution: resolution ?? "1K",
      output_format: "png",
      image_input: references,
    }),
  },
  "nano-banana-pro": {
    model: "nano-banana-pro",
    credits: 18, // 1K/2K; 24 at 4K
    aspectRatios: ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9", "auto"],
    maxReferences: 8,
    buildInput: (prompt, { aspect, references, resolution }) => ({
      prompt,
      aspect_ratio: aspect ?? "1:1",
      resolution: resolution ?? "2K",
      output_format: "png",
      image_input: references,
    }),
  },
  "seedream-5-pro": {
    model: "seedream/5-pro-text-to-image",
    credits: 7, // "basic" quality (1K); 14 at "high" (2K)
    aspectRatios: ["1:1", "4:3", "3:4", "16:9", "9:16", "2:3", "3:2", "21:9"],
    // Text-to-image only — no image_urls / reference-image support is
    // documented for this endpoint. maxReferences: 0 makes --reference
    // fail fast instead of silently doing nothing.
    maxReferences: 0,
    buildInput: (prompt, { aspect, resolution }) => ({
      prompt,
      aspect_ratio: aspect ?? "1:1",
      quality: resolution === "2K" ? "high" : "basic",
      output_format: "png",
    }),
  },
};

const DEFAULT_MODEL = "nano-banana-2-lite";

function die(message, code = 1) {
  console.error(`\x1b[31m✗\x1b[0m ${message}`);
  process.exit(code);
}

function printHelp() {
  const modelList = Object.entries(MODEL_PRESETS)
    .map(([key, cfg]) => `    ${key.padEnd(18)} ${cfg.credits} credits (base tier)`)
    .join("\n");

  console.log(`Usage: node --env-file=.env.local scripts/kie/generate.mjs "<prompt>" [options]

  --out, -o <path>        Where to save the image. Default: ./generated-<ts>.png
  --model <name>          Model preset (default: ${DEFAULT_MODEL})
  --aspect <ratio>         e.g. 16:9, 1:1, 9:16, 21:9 (model-dependent; default varies)
  --resolution <res>      1K / 2K / 4K, where the model supports it
  --negative <text>       Negative prompt, where the model supports it
  --reference <url>       Reference/input image URL. Repeatable, up to model's max.
  --callback <url>        Optional webhook for completion notification.
  --help, -h              Show this message.

Model presets and approximate kie.ai cost (see https://kie.ai/pricing for current):
${modelList}

Default model choice: nano-banana-2-lite ranks #7 on the LMArena text-to-image
leaderboard (Elo 1250) at 4 credits/image — better rated AND cheaper than
nano-banana-pro (18 credits) or flux-1-kontext-pro (5 credits, Elo ~1059).

Requires KIE_API_KEY in the environment.`);
}

function parseArgs(argv) {
  const args = { prompt: null, out: null, model: DEFAULT_MODEL, aspect: null, resolution: null, references: [], callback: null, negative: null };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out" || a === "-o") args.out = argv[++i];
    else if (a === "--model") args.model = argv[++i];
    else if (a === "--aspect") args.aspect = argv[++i];
    else if (a === "--resolution") args.resolution = argv[++i];
    else if (a === "--negative") args.negative = argv[++i];
    else if (a === "--reference") args.references.push(argv[++i]);
    else if (a === "--callback") args.callback = argv[++i];
    else if (a === "--help" || a === "-h") { printHelp(); process.exit(0); }
    else positional.push(a);
  }
  args.prompt = positional.join(" ") || null;
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.prompt) { printHelp(); process.exit(2); }

  if (!process.env.KIE_API_KEY) {
    die("KIE_API_KEY is not set. Add it to .env.local and re-run with `node --env-file=.env.local ...`.");
  }

  const preset = MODEL_PRESETS[args.model];
  if (!preset) {
    die(`Unknown model "${args.model}". Options: ${Object.keys(MODEL_PRESETS).join(", ")}`);
  }
  if (args.aspect && !preset.aspectRatios.includes(args.aspect)) {
    die(`"${args.aspect}" is not a valid aspect ratio for ${args.model}. Options: ${preset.aspectRatios.join(", ")}`);
  }
  const maxRefs = preset.maxReferences ?? 0;
  if (args.references.length > maxRefs) {
    die(maxRefs === 0
      ? `${args.model} does not support --reference (text-to-image only).`
      : `${args.model} accepts at most ${maxRefs} --reference image(s), got ${args.references.length}.`);
  }

  const out = args.out ?? `generated-${Date.now()}.png`;
  const input = preset.buildInput(args.prompt, { aspect: args.aspect, references: args.references, resolution: args.resolution, negative: args.negative });

  console.log(`→ Model: ${preset.model}  (~${preset.credits} credits)`);
  console.log(`→ Prompt: ${args.prompt}`);
  if (args.references.length) console.log(`→ References: ${args.references.join(", ")}`);

  try {
    console.log("→ Creating task…");
    const taskId = await createTask({ model: preset.model, input, ...(args.callback ? { callBackUrl: args.callback } : {}) });
    console.log(`  taskId: ${taskId}`);

    console.log("→ Polling for result…");
    let lastState = "";
    const { resultUrls, creditsConsumed } = await pollTask(taskId, {
      onState: (state) => {
        process.stdout.write(`\r  state: ${state.padEnd(12)}`);
        lastState = state;
      },
    });
    if (lastState) process.stdout.write("\n");
    console.log(`  result URL: ${resultUrls[0]}`);
    if (creditsConsumed != null) console.log(`  credits consumed: ${creditsConsumed}`);

    console.log(`→ Downloading to ${out}…`);
    const { bytes, path: savedPath } = await downloadTo(resultUrls[0], out);
    if (savedPath !== out) console.log(`  (actual format didn't match "${out}"'s extension, saved as ${savedPath} instead)`);
    console.log(`\x1b[32m✓\x1b[0m Saved ${(bytes / 1024).toFixed(1)} KB to ${savedPath}`);
  } catch (err) {
    if (err instanceof KieError) die(err.message);
    throw err;
  }
}

main().catch((err) => die(err.stack ?? String(err)));
