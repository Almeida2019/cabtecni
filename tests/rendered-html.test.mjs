import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://cabtecni.example/", {
      headers: { accept: "text/html", host: "cabtecni.example" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete Cabtecni website", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cabtecni \| Engineering &amp; Procurement Solutions<\/title>/i);
  assert.match(html, /Engineering procurement/);
  assert.match(html, /100% Angolan owned/);
  assert.match(html, /Procurement Services/);
  assert.match(html, /Piping Manufacturing/);
  assert.match(html, /sales@cabtecni\.com/);
  assert.match(html, /\+244 935 62 51 51/);
  assert.match(html, /https:\/\/cabtecni\.example\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the captured business content and key assets", async () => {
  const [inventory, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../content/scrape/cabtecni-inventory.md", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/images/cabtecni/slide1.jpg", import.meta.url)),
    access(new URL("../public/images/cabtecni/cropped-Artboard-1.png", import.meta.url)),
  ]);

  assert.match(inventory, /Industries served/);
  assert.match(inventory, /NAS GLOBAL \(Pty\) Ltd/);
  assert.match(inventory, /LinkedIn/);
  assert.equal((page.match(/className="carousel-slide/g) ?? []).length, 3);
  assert.match(page, /topbar/);
  assert.match(page, /hero-carousel/);
  assert.match(page, /focus-grid/);
  assert.match(page, /process-timeline/);
  assert.match(page, /services\.slice\(0, 6\)\.map/);
  assert.match(page, /services\.map/);
  assert.match(page, /industries\.map/);
  assert.match(layout, /generateMetadata/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
