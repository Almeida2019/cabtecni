/**
 * Exposes a single local file at a public https URL, just long enough for
 * kie.ai (or any other URL-only API) to fetch it once.
 *
 * How it works:
 *  1. Start an HTTP server on 127.0.0.1:<random port> that serves ONLY the
 *     provided file at a single random path — never the rest of the disk.
 *  2. Spawn a tunnel (cloudflared for trycloudflare.com by default; ngrok
 *     as a fallback if cloudflared isn't installed) pointing at that port.
 *  3. Wait for the tunnel's stdout to print the public URL.
 *  4. Return `{ url, close }` — you call `close()` when done and both the
 *     tunnel and the local server shut down.
 *
 * Requires either `cloudflared` or `ngrok` on PATH. cloudflared is easier
 * because trycloudflare.com needs no account; the script prints a one-line
 * install command if neither is present.
 */

import { spawn } from "node:child_process";
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { basename, extname } from "node:path";
import { randomBytes } from "node:crypto";

const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const CLOUDFLARE_URL_RE = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/i;
const NGROK_URL_RE = /https:\/\/[a-z0-9-]+\.ngrok(?:-free)?\.app/i;

function which(command) {
  return new Promise((resolve) => {
    const child = spawn("command", ["-v", command], { shell: true, stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (chunk) => { out += chunk; });
    child.on("close", (code) => resolve(code === 0 ? out.trim() : null));
  });
}

function startLocalFileServer(filePath) {
  const size = statSync(filePath).size;
  const mime = MIME_BY_EXT[extname(filePath).toLowerCase()] ?? "application/octet-stream";
  // Random path so the file isn't guessable if the tunnel URL leaks.
  const secretPath = `/${randomBytes(12).toString("hex")}/${basename(filePath)}`;

  const server = createServer((req, res) => {
    if (req.method !== "GET" || req.url !== secretPath) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      "Content-Type": mime,
      "Content-Length": size,
      "Cache-Control": "no-store",
    });
    createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      resolve({ server, port, secretPath });
    });
  });
}

function spawnCloudflared(port) {
  const child = spawn("cloudflared", [
    "tunnel",
    "--url", `http://127.0.0.1:${port}`,
    "--no-autoupdate",
    "--loglevel", "info",
  ], { stdio: ["ignore", "pipe", "pipe"] });

  const urlPromise = new Promise((resolve, reject) => {
    let buffer = "";
    const onData = (chunk) => {
      buffer += chunk.toString();
      const match = buffer.match(CLOUDFLARE_URL_RE);
      if (match) resolve(match[0]);
    };
    // cloudflared prints the tunnel URL on stderr.
    child.stderr.on("data", onData);
    child.stdout.on("data", onData);
    child.once("exit", (code) => reject(new Error(`cloudflared exited (code ${code}) before printing a tunnel URL`)));
    setTimeout(() => reject(new Error("cloudflared did not print a URL within 20s")), 20_000);
  });

  return { child, urlPromise };
}

function spawnNgrok(port) {
  const child = spawn("ngrok", ["http", "--log", "stdout", String(port)], { stdio: ["ignore", "pipe", "pipe"] });
  const urlPromise = new Promise((resolve, reject) => {
    let buffer = "";
    const onData = (chunk) => {
      buffer += chunk.toString();
      const match = buffer.match(NGROK_URL_RE);
      if (match) resolve(match[0]);
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.once("exit", (code) => reject(new Error(`ngrok exited (code ${code}) before printing a tunnel URL`)));
    setTimeout(() => reject(new Error("ngrok did not print a URL within 20s")), 20_000);
  });
  return { child, urlPromise };
}

async function pickTunnel(port) {
  if (await which("cloudflared")) return { name: "cloudflared", ...spawnCloudflared(port) };
  if (await which("ngrok")) return { name: "ngrok", ...spawnNgrok(port) };
  throw new Error(
    "No tunnel binary found. Install one of:\n" +
    "  • cloudflared (recommended, no account needed):  brew install cloudflared\n" +
    "  • ngrok (requires signup):                       brew install ngrok\n" +
    "…then re-run.",
  );
}

/**
 * Serve `filePath` over a public https URL. Resolves with `{ url, close }`.
 * The caller MUST call `close()` when finished so the tunnel and local
 * server shut down.
 */
export async function serveOverPublicTunnel(filePath) {
  const { server, port, secretPath } = await startLocalFileServer(filePath);
  let tunnel;
  try {
    tunnel = await pickTunnel(port);
  } catch (err) {
    server.close();
    throw err;
  }

  const close = () => {
    try { tunnel.child.kill("SIGTERM"); } catch {}
    server.close();
  };
  // Also clean up if the process dies unexpectedly.
  const onExit = () => close();
  process.once("exit", onExit);
  process.once("SIGINT", () => { close(); process.exit(130); });
  process.once("SIGTERM", () => { close(); process.exit(143); });

  try {
    const baseUrl = await tunnel.urlPromise;
    return {
      via: tunnel.name,
      url: `${baseUrl}${secretPath}`,
      close: () => { process.removeListener("exit", onExit); close(); },
    };
  } catch (err) {
    close();
    throw err;
  }
}
