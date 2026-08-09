# Cabtecni website (Cabtecni2)

Marketing site for **CABTECNI, Lda** — a 100% Angolan owned engineering
procurement and industrial services company based in Luanda. Client contact:
António Maieco.

This is the Next.js build of the site. It is separate from the plain
HTML/CSS/JS build that lives in `../cabtecni` (see that folder's `HANDOFF.md`).

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Runs on [vinext](https://github.com/cloudflare/vinext) (Cloudflare Workers)
  for local dev and `npm run build`; `vercel.json` targets a plain
  `next build` for Vercel
- One hand-written stylesheet, `app/globals.css`. No Tailwind utilities are
  used in the markup despite the `@import "tailwindcss"` at the top
- Poppins is self-hosted from `public/brand/fonts/`. It is the **only** font
  family the site ships, and `--font-display` / `--font-body` both resolve to
  it. Do not reintroduce a family that is not in that folder: the layout was
  originally written against "Barlow Condensed", which was never shipped, so
  every heading silently fell back to the platform sans-serif until this was
  fixed

## Commands

```bash
npm install
```

```bash
npm run dev
```

```bash
npm test
```

`npm test` runs `npm run build` first, then asserts against the server-rendered
HTML in `dist/`.

## Layout

```
app/
  layout.tsx        metadata, JSON-LD, font preloads
  page.tsx          homepage
  about|services|capabilities|industries|contact/page.tsx
  not-found.tsx     branded 404
  sitemap.ts        /sitemap.xml
  robots.ts         /robots.txt
  site-config.ts    business facts + request-origin resolution
  site-data.ts      service and industry content
  navigation.ts     primary nav (shared by header and mobile menu)
  globals.css       the whole stylesheet
  components/
    SiteHeader / SiteFooter / InteriorHero
    HeroCarousel    client: homepage hero
    MobileMenu      client: nav under 900px
    EnquiryForm     client: contact form
    ScrollReveal    client: reveal-on-scroll + stat count-up
public/
  images/cabtecni/  photography scraped from the current cabtecni.com
  brand/            logo, fonts, apple-touch-icon
content/scrape/     inventory of the original site's copy and assets
```

## Utility scripts

### Recraft remove-background (via kie.ai)

`scripts/kie/remove-background.mjs` calls the [kie.ai Recraft remove-background
API](https://docs.kie.ai/market/recraft/remove-background) and downloads the
transparent PNG. Useful for prepping product/service photos with clean cutouts.

Setup once:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and paste your `KIE_API_KEY`. Never commit it — the
gitignore keeps `.env.local` out (only the `.example` is tracked).

Run against a public URL (`--env-file` requires Node ≥ 20):

```bash
node --env-file=.env.local scripts/kie/remove-background.mjs https://example.com/photo.jpg --out cleaned.png
```

The script creates a task, polls until it succeeds or fails, and writes the
result. Full flags via `--help`.

**Local files.** The API only accepts a URL, not a file upload. To process
a local file the script spins up a temporary HTTP server on `127.0.0.1`,
tunnels it through `trycloudflare.com` (or ngrok) just long enough for
kie.ai to fetch the image once, then tears both down. Install cloudflared
once (no account needed):

```bash
brew install cloudflared
```

Then a local file works the same as a URL:

```bash
node --env-file=.env.local scripts/kie/remove-background.mjs ./public/images/cabtecni/mining.jpg --out mining-nobg.png
```

### Image generation (via kie.ai)

`scripts/kie/generate.mjs` generates an image from a text prompt (optionally
guided by reference images) and downloads it. Uses the same `.env.local` /
`KIE_API_KEY` setup as remove-background above.

```bash
node --env-file=.env.local scripts/kie/generate.mjs \
  "Photorealistic offshore oil rig at golden hour, cinematic wide shot" \
  --aspect 16:9 --out hero-oilrig.png
```

Default model is `nano-banana-2-lite` (4 credits/image on kie.ai). It was
picked over pricier options by checking real numbers, not vibes: as of
2026-08 it ranks **#7 on the [LMArena text-to-image
leaderboard](https://arena.ai/leaderboard/text-to-image)** (Elo 1250) while
costing a quarter of `nano-banana-pro` (18 credits, Elo ~1245) and beating
`flux-1-kontext-pro` (5 credits, Elo ~1059) outright. If kie.ai's catalog or
pricing shifts, re-check both the leaderboard and `https://kie.ai/pricing`
before changing the default — don't assume a higher price means better
output.

Other presets available via `--model`: `nano-banana-2` (higher resolution
tiers), `nano-banana-pro` (current highest LMArena rank on kie.ai, at 18–24
credits), `seedream-5-pro` (best-ranked option that also takes reference
images for edits). Full flags via `--help`.

`scripts/kie/client.mjs` holds the shared create/poll/download logic both
kie.ai scripts use — add a new model preset in `generate.mjs`'s
`MODEL_PRESETS`, don't duplicate the polling loop.

## AI assistant (OpenRouter)

A floating chat widget on every page, answering questions about Cabtecni's
services, sectors and way of working, in whichever of the four languages the
visitor is browsing.

Setup: add an OpenRouter API key to `.env.local` (get one at
<https://openrouter.ai/keys>; the default model is free):

```bash
OPENROUTER_API_KEY=your-key-here
```

On a real deploy, set the same variable in the Vercel or Cloudflare dashboard.
Without a key the widget still renders but reports that it is not configured,
so a missing key degrades rather than breaks.

**Why OpenRouter and not the Gemini API directly.** This was originally built
against Google's Gemini Developer API. Pinned model ids kept getting retired
from the free tier: `gemini-2.5-flash-lite` returned
`404 "no longer available to new users"` on a brand-new key, while still being
listed by the models endpoint. OpenRouter fronts many providers behind one
OpenAI-compatible schema, so changing model or provider is now a single env
var rather than a rewrite.

How it is wired:

- **The key never reaches the browser.** `app/api/chat/route.ts` is the only
  thing that touches it. Upstream error bodies are logged, never forwarded,
  because provider error shapes can echo credentials back.
- **The assistant is grounded in this site's own copy.** `system-prompt.ts`
  builds the instruction from the same dictionary the page renders, so it
  cannot drift from what the visitor can read. It is explicitly forbidden from
  inventing prices, lead times, certifications or client references, and is
  told to route those to the contact page.
- **Quota protection**: 800-character message cap, 10-turn history cap,
  400-token output cap, and a per-IP burst limiter. Note the limiter is an
  in-memory `Map`, so on Workers/serverless it is per-isolate: a speed bump
  against one abusive client, not a hard guarantee. For a real cap, back it
  with KV/D1.
- The widget stores history as `{role: "model"}` (Gemini's vocabulary); the
  route maps that to `assistant` at the API boundary.

**Privacy caveat on the default model.** `poolside/laguna-s-2.1:free` is free
because, per its OpenRouter model page, inputs and outputs may be used to
train the provider's models. Visitors may type real business requirements into
this box. If that is not acceptable, set `OPENROUTER_MODEL` to a paid model
with a no-training policy.

## Things worth knowing

- **The homepage carousel is a real component.** Arrows, dots, autoplay,
  pause on hover/focus/tab-hidden, keyboard arrows, and
  `prefers-reduced-motion` are all wired. Inactive slides get `inert` so their
  links stay out of the tab order.
- **Reveal animations degrade safely.** `[data-reveal]` is only hidden inside
  `@media (scripting: enabled)`, so if the JS never runs the content is
  visible rather than permanently transparent.
- **The contact form has no backend.** It validates in the browser and then
  hands a fully composed message to the visitor's mail client, addressed to
  `sales@cabtecni.com`. To send server-side instead, POST the values from the
  marked seam in `app/components/EnquiryForm.tsx` and keep the same success
  state.
- **The EN / PT / AO chips in the top bar are decorative.** There is no
  translation layer on this build. Either wire one up or remove the control
  before this goes in front of a client.
- **Copy is not client-approved.** Service descriptions, the delivery model and
  the NAS GLOBAL framing were written for this rebuild; the original site had
  none of it. Brand facts (100% Angolan, Luanda base, contact details) were
  checked against cabtecni.com.
- **No em dashes in copy**, in any language. This is a standing preference from
  the site owner.
