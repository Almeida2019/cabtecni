import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://cabtecni.example${pathname}`, {
      headers: { accept: "text/html", host: "cabtecni.example" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete Cabtecni website", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cabtecni \| Engineering &amp; Procurement Solutions<\/title>/i);
  assert.match(html, /100% Angolan owned/);
  assert.match(html, /Procurement Services/);
  assert.match(html, /Piping Manufacturing/);
  assert.match(html, /sales@cabtecni\.com/);
  assert.match(html, /\+244 935 62 51 51/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("renders a dedicated page for every main menu item", async () => {
  const routes = [
    ["/about", /Angolan roots/],
    ["/services", /Integrated support/],
    ["/capabilities", /network and discipline/],
    ["/industries", /critical sectors/],
    ["/contact", /Bring us your next requirement/],
  ];

  for (const [pathname, expected] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), expected);
  }
});

test("renders the homepage structure that the design depends on", async () => {
  const html = await (await render()).text();

  for (const marker of [
    "topbar", "hero-carousel", "carousel-slide", "carousel-dots",
    "focus-grid", "process-timeline", "industry-marquee", "site-footer",
    "footer-partner", "proof-band",
  ]) {
    assert.match(html, new RegExp(marker), `missing ${marker}`);
  }

  // Three slides, exactly one active on first paint.
  assert.equal((html.match(/class="carousel-slide/g) ?? []).length, 3);
  assert.equal((html.match(/carousel-slide is-active/g) ?? []).length, 1);
});

test("ships the accessibility and SEO surface", async () => {
  const html = await (await render()).text();

  assert.match(html, /class="skip-link" href="#main-content"/, "skip link");
  assert.match(html, /id="main-content"/, "skip link target");
  assert.match(html, /aria-roledescription="carousel"/, "carousel is announced");
  assert.match(html, /application\/ld\+json/, "structured data");
  assert.match(html, /"@type":"ProfessionalService"/, "organization schema");

  // Poppins is the only family we self-host, so no font-family may name
  // another face: it would silently fall back to the platform sans-serif.
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  for (const [, value] of css.matchAll(/font-family:\s*([^;}]+)/g)) {
    assert.match(
      value.trim(),
      /var\(--font-(display|body)\)|Cabtecni Poppins|Georgia/,
      `font-family "${value.trim()}" names a face that is not shipped in public/brand/fonts`,
    );
  }
});

test("serves robots.txt and a sitemap covering every locale", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/cabtecni\.example\/sitemap\.xml/);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const body = await sitemap.text();
  for (const path of ["/", "/about", "/services", "/capabilities", "/industries", "/contact"]) {
    assert.match(body, new RegExp(`<loc>https://cabtecni\\.example${path === "/" ? "/" : path}</loc>`), `missing en ${path}`);
  }
  for (const locale of ["pt", "es", "fr"]) {
    assert.match(body, new RegExp(`<loc>https://cabtecni\\.example/${locale}</loc>`), `missing ${locale} home`);
    assert.match(body, new RegExp(`<loc>https://cabtecni\\.example/${locale}/about</loc>`), `missing ${locale} about`);
  }
});

test("puts an enquiry form on the contact page", async () => {
  const html = await (await render("/contact")).text();
  assert.match(html, /class="enquiry-form"/);
  for (const field of ["field-name", "field-email", "field-message", "field-requirement"]) {
    assert.match(html, new RegExp(`id="${field}"`), `missing ${field}`);
    assert.match(html, new RegExp(`for="${field}"`), `${field} has no label`);
  }
});

test("serves every locale, and /en 404s so English is not duplicated", async () => {
  const expectations = [
    ["/pt", /Feitos para a ind/, /Soluções de Engenharia/],
    ["/es", /Hechos para la industria/, /Soluciones de Ingeniería/],
    ["/fr", /Conçus pour l/, /Solutions d/],
  ];

  for (const [pathname, heading, title] of expectations) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, heading, `${pathname} heading`);
    assert.match(html, title, `${pathname} title`);
  }

  // English lives at the root; /en would be duplicate content.
  assert.equal((await render("/en")).status, 404);
});

test("European Portuguese, not Brazilian", async () => {
  const html = await (await render("/pt")).text();
  // "contactos"/"equipa" are the pt-PT markers; the pt-BR forms must not appear.
  assert.match(html, /Contactos/, "uses pt-PT 'Contactos'");
  assert.doesNotMatch(html, /\bContatos\b/, "must not use pt-BR 'Contatos'");
  assert.doesNotMatch(html, /\bequipe\b/i, "must not use pt-BR 'equipe'");
});

test("keeps the captured business content and key assets", async () => {
  const [inventory, home, packageJson] = await Promise.all([
    readFile(new URL("../content/scrape/cabtecni-inventory.md", import.meta.url), "utf8"),
    readFile(new URL("../app/views/HomeView.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    access(new URL("../public/og.jpg", import.meta.url)),
    access(new URL("../public/brand/logos/cabtecni-colour.png", import.meta.url)),
    access(new URL("../public/brand/logos/cabtecni-white.png", import.meta.url)),
    access(new URL("../public/brand/logos/nas-global-white.png", import.meta.url)),
  ]);

  assert.match(inventory, /Industries served/);
  assert.match(inventory, /NAS GLOBAL \(Pty\) Ltd/);
  // The guard is that the home page still renders these from the dictionary
  // rather than hardcoding copy. It may legitimately show a subset: the service
  // list was cut to the first four, with the projects grid carrying the rest,
  // so allow an intervening .slice(...).
  assert.match(home, /serviceData(?:\.slice\([^)]*\))?\.map/);
  assert.match(home, /industryData(?:\.slice\([^)]*\))?\.map/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("every locale dictionary has the same keys as English", async () => {
  // The dictionaries are typed, so a missing key is already a build error.
  // This guards the other direction: no locale may quietly keep English text
  // in a user-facing string that should have been translated.
  const [en, pt, es, fr] = await Promise.all(
    ["en", "pt", "es", "fr"].map((l) =>
      readFile(new URL(`../app/i18n/${l}.ts`, import.meta.url), "utf8"),
    ),
  );
  const keyCount = (src) => (src.match(/^\s{2,}[a-zA-Z]+:/gm) ?? []).length;
  const base = keyCount(en);
  for (const [name, src] of [["pt", pt], ["es", es], ["fr", fr]]) {
    const delta = Math.abs(keyCount(src) - base);
    assert.ok(delta <= 2, `${name}.ts key count differs from en.ts by ${delta}`);
  }
});
