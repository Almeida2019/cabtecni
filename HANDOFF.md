# CABTECNI2 — Handoff (2026-08-06)

Start a new chat and say: **"Read HANDOFF.md in the Cabtecni2 project and continue from there."**
That alone should be enough for a fresh session to pick this up correctly.

## What this is

The **Next.js** rebuild of the website for **CABTECNI, Lda** (Angolan engineering
procurement and industrial services, based in Luanda). Client contact:
**António Maieco**.

- **Local path:** `/Users/almeidajose/Documents/A/App/C/Cabtecni2`
- Separate from the plain HTML/CSS/JS build in `../cabtecni` (that one has its
  own `HANDOFF.md`). Do not confuse the two.
- **Committed locally as of 2026-08-09** (`7e6e6b7`), but **not pushed** — see
  "Deployment" below, this is the most urgent open item.

## Stack

Next.js 16 App Router, React 19, TypeScript. Runs on **vinext** (Cloudflare
Workers) for `npm run dev` / `npm run build`; `vercel.json` targets plain
`next build` for Vercel.

One hand-written stylesheet: `app/globals.css`. No Tailwind utilities are used
in the markup despite the `@import "tailwindcss"` at the top.

```bash
npm run dev     # vinext dev on :3000
npm test        # runs build first, then asserts on the rendered HTML in dist/
npm run lint
./node_modules/.bin/tsc --noEmit
```

Current state: **typecheck clean, lint 0 errors, 10/10 tests pass.**

## Keys (`.env.local`, gitignored)

| Var | Status | Purpose |
|---|---|---|
| `KIE_API_KEY` | ✅ set (`d7d0…`), **55.2 credits** | image generation |
| `GEMINI_API_KEY` | ✅ set | only used by the one-off voice-note transcription script; the chatbot no longer uses it |
| `OPENROUTER_API_KEY` | ❌ **EMPTY** | the chatbot. **Until this is set the assistant returns `{"error":"unconfigured"}`** |

`.env.local.example` is the tracked template. Get an OpenRouter key at
<https://openrouter.ai/keys>.

## Architecture

```
app/
  layout.tsx          root html/head/body, anti-flash theme script, SiteChrome
  theme-script.ts     inline pre-paint script (storage key: cabtecni-theme-v2)
  page.tsx + about/ services/ capabilities/ industries/ contact/
                      ^ English routes at the site ROOT
  [locale]/           pt | es | fr routes (same pages, localised)
    layout.tsx        per-locale metadata + <html lang> correction
  views/*View.tsx     the actual page content, shared by both route trees
  i18n/               en.ts (source of truth) + pt.ts, es.ts, fr.ts, config.ts
  components/         SiteHeader/Footer, HeroCarousel, ChatWidget, ThemeToggle,
                      LanguageSwitcher, MobileMenu, ScrollReveal, SiteChrome,
                      ProofBand, SeoJsonLd, EnquiryForm, InteriorHero
  api/chat/route.ts   OpenRouter proxy + system-prompt.ts
  site-data.ts        image path arrays ONLY (copy lives in i18n)
```

**Routing:** English is served from `/`, other locales from `/pt`, `/es`, `/fr`.
`/en` deliberately **404s** so English is not duplicated at two URLs. Adding a
page means adding a route file in *both* `app/` and `app/[locale]/`, each a thin
wrapper around the shared `views/` component.

**i18n:** `en.ts` is the source of truth and its type (`Dictionary`) constrains
the other three, so a missing key is a **build error**, not a blank string.
`pt` is **European Portuguese**, not Brazilian: `contactos` (not *contatos*),
`equipa` (not *equipe*). There is a test asserting the pt-BR forms never appear.

## Hard-won gotchas — read before changing these

1. **Fonts.** Poppins is the ONLY self-hosted family (`public/brand/fonts/`).
   The layout was originally written against "Barlow Condensed", which was
   never shipped, so every heading silently fell back to the platform
   sans-serif. A test now fails if any `font-family` names an unshipped face.

2. **Dark mode token layers.** `globals.css` has three: brand constants,
   **fixed** ink/on-dark tokens, and theme-swapping semantic tokens. Sections
   built on photography or navy bands stay dark in *both* themes and MUST use
   the ink/on-dark tokens. Using a swapping token there makes text vanish.

3. **Scroll reveal must never animate opacity.** `[data-reveal]` animates
   `transform` only. An earlier opacity-based version left whole pages blank
   when the observer did not fire. Content is always visible; the animation is
   layered on top.

4. **Preview-pane quirk.** The browser pane often reports
   `document.hidden === true`, which suspends `requestAnimationFrame`, CSS
   transitions and IntersectionObserver. Screenshots below the fold come back
   blank or stale. **Verify via DOM state / computed styles, not screenshots.**
   This masquerades as real bugs — it burned a lot of time.

5. **Buttons: white on the brand gradient fails contrast.** White on the green
   end is 1.96:1. Anything with white text uses solid `--brand-blue` (5.55:1).

6. **The NAS GLOBAL partner logo sits on a white plate** in the footer. Its navy
   wordmark measures 1.98:1 on the near-black footer. António explicitly wants
   his partner's original colour artwork, so the plate is how both are honoured.

7. **Scroll-driven CSS animations (`animation-timeline: view()`) cannot be
   verified in the preview pane either**, and not for the same reason as #4.
   `getAnimations()` reports the timeline as attached and correct, but its
   `playState` reads `finished` at scroll positions that are nowhere near the
   end of the element's range, and `requestAnimationFrame` loops used to give
   the compositor time to recompute simply hang. The CSS itself — selectors,
   nesting, `@supports`/`prefers-reduced-motion` gating, keyframe values — is
   fully verifiable via `document.styleSheets` and `getComputedStyle`, and was
   verified that way for the parallax effects below. Whether they actually
   move on scroll was **not** watched by Claude in this pane; that needs a
   human, on a real scroll gesture, in a real browser.

8. **`resolveOrigin()` is PINNED in production** (`app/site-config.ts`). It
   returns `SITE.fallbackOrigin` whenever `VERCEL_ENV === "production"`, and
   only falls back to the request host on previews and locally. This is what
   stops the three production hostnames (`cabtecni.com`, `www.cabtecni.com`,
   `cabtecni-industrial.vercel.app`) from each self-canonicalising into three
   indexable copies of the site. Do not "simplify" it back to always using the
   request host.

9. **`<html lang>` comes from middleware, not from the locale layout.** The
   root layout renders the only `<html>` and gets no params, so `middleware.ts`
   forwards the pathname as `x-pathname` and the layout derives `lang` from it.
   An earlier version patched it client-side, which left the server HTML —
   what crawlers read — declaring `/pt`, `/es` and `/fr` as English. If
   middleware is ever removed, `lang` silently reverts to `en` everywhere.

10. **`title.absolute` and `title.template` must BOTH stay in
    `app/[locale]/layout.tsx`.** `absolute` stops the root template
    double-branding the localised home pages ("Cabtecni | Soluções ... |
    Cabtecni"). But declaring `absolute` alone also clears the inherited
    template for CHILD routes, which silently dropped the suffix from "Sobre
    Nós | Cabtecni". Both keys together is correct; removing either one breaks
    a different set of pages, and neither breakage is obvious without checking
    a locale home AND a locale child page.

## Images (kie.ai)

`scripts/kie/generate.mjs` — presets in `MODEL_PRESETS`. **19.2 credits left**
(was 55.2; the three 9:16 carousel slides cost 12 each on 2026-08-07). Check the
live balance rather than trusting this number:

```bash
node --env-file=.env.local -e 'const r=await fetch("https://api.kie.ai/api/v1/chat/credit",{headers:{Authorization:`Bearer ${process.env.KIE_API_KEY}`}});console.log((await r.json()).data)'
```

- **`qwen3-pro`** (12 credits @2K) is the current best pick. **Its parameter
  names differ from the Google presets: `image_size` carries the ASPECT RATIO
  and `resolution` carries 1K/2K.** Passing `aspect_ratio`/`size` is *silently
  ignored* — you get 1K/16:9 with no error. This cost two wasted calls.
- `nano-banana-2-lite` (4 credits) is the cheap default.
- **Gemini/nano-banana models stamp a four-pointed sparkle watermark** in the
  bottom-right corner. Always check that corner before shipping a generated
  image. Qwen does not do this.

`scripts/kie/remove-background.mjs` needs a public URL; local files are served
through a temporary cloudflared tunnel (`brew install cloudflared`).

## Client photo set (wired in 2026-08-06)

The 14 images in `~/Downloads/Cabtecni images/` replaced the previous art
**in place**, reusing the existing filenames, so no code changed: `site-data.ts`
and the views already pointed at those paths. Originals stay in Downloads.

Resized and re-encoded with `sharp` (already a dependency) at WebP q80,
`fit: cover`, `position: attention`:

| Slot | Files | Output |
|---|---|---|
| 8 service tiles | `procurement_service`, `logistics`, `bort_torquing`, `rental_equipament`, `labour_suplly`, `electric_motor`, `valves_service-1`, `piping` | 1200x900 |
| interior heroes | `about-hero`, `contact-hero`, `hero-industry` | 1920x1080 |
| `.ownership-image` panel | `wellcome` | 1400x1050 |
| no slot yet | `about-banner`, `cta-banner` | 1920x1080 |

`logistics.webp` is the exception at **1600x1200**: besides the service tile it
also backs `.network-image`, a 640x650 full-bleed panel on the capabilities
page, where the old 512x512 file was being upscaled. `wellcome.webp` had the
same problem in `.ownership-image` (640px tall, was 587x371).

Total for the twelve replaced files: 584 KB to 1.5 MB, for 2 to 4x the pixel
dimensions.

Two things worth knowing about these files:

- They carry **no camera EXIF** and their dimensions (5376x3072, 4352x3584) are
  generator output sizes, so despite the earlier note in this file calling them
  commissioned photography, they look **AI-generated**. They are still a clear
  upgrade on what they replaced, and they are consistent with each other. Worth
  confirming their provenance with António before any print use.
- Bottom-right corners were checked on all 14: **no sparkle watermark**.

### Phone art direction (the `-mobile.webp` files)

The wide files are already cropped to 16:9, so letting `cover` crop them a
second time into a 375x520 band left only about **17% of the original frame**:
the about hero became an accidental close-up of one engineer's face, clipped at
the top. Five slots now get a portrait variant cut straight from the
full-resolution original, centred, keeping 43-95% of the frame:

`about-hero-mobile`, `hero-industry-mobile`, `contact-hero-mobile`,
`wellcome-mobile`, `logistics-mobile`.

Wiring:

- `InteriorHero` sets `--hero-image` and optional `--hero-image-mobile` as
  inline custom properties (same pattern as `--trust-image` on `.trust-slide`).
  A media query picks the variant; pages without one fall back automatically,
  so **capabilities and industries need no change**.
- `wellcome` is an `<img>`, so it uses `<picture>` + a `media` source. That
  wrapper breaks the `height: 100%` chain, hence
  `.ownership-image picture { display: block; height: 100% }`. Don't remove it.
- `.network-image` swaps via plain CSS.

**The breakpoint is 560px, not the usual 700px.** At 700px wide the band is
landscape again, where the wide crop is the correct one. Do not fold these
rules into the 700px block.

Centring itself was already correct everywhere before this (every container
computed to `50% 50%`, and lines 845/874/892 already forced `center center` on
mobile). The problem was never alignment, it was crop severity.

### Carousel: generated 9:16, not cropped (2026-08-07)

The phone carousel band is **375x660 (0.568)**, so a 16:9 slide showed about a
third of its width.

| Slide | Phone file | How it was made | Size |
|---|---|---|---|
| 1 oil & gas | `hero-oilgas-fpso-mobile` | generated 9:16, `qwen3-pro` 2K | 900x1575 |
| 2 procurement | `hero-engineering-procurement-mobile` | **cropped** from the 16:9 | 675x1200 |
| 3 engineering | `hero-engineering-mobile` | **cropped** from the 16:9 | 432x768 |

**Read this before generating carousel art again.** All three were first
generated at 9:16 (36 credits). António rejected slides 2 and 3 on sight: next
to the existing photographs they "look AIish" and reduced the perceived quality
of the site. They were replaced with plain centre crops of the art already
there, and the 24 credits spent on those two are gone. The lesson is that
matching the surrounding photography matters more than filling the frame.

Slide 1 kept its generated frame, and was not objected to. It is the one slide
that genuinely cannot be cropped: the platform and the tanker sit at opposite
edges, so a portrait crop lands in the empty water between them.

The cost of cropping is resolution. **Slide 3 is only 432x768** because its
source is just 1376x768, which is soft on a 2x or 3x screen. It is deliberate,
not an oversight. Nothing is upscaled. If it ever needs to be sharp, the fix is
a better landscape source, not a bigger resize.

**Crop on the subject, not the frame.** Slide 3 was first cut with a plain
centre crop, which pushed the technician against the right edge and sliced off
her tablet, because she stands at x~885 in a 1376px-wide frame. It is now an
explicit `extract({ left: 669, top: 0, width: 432, height: 768 })`, which puts
her body centre in the middle of the band. If that image is ever recut, keep
the subject centred rather than reaching for `position: "center"`.

Because slide 3 is now cropped from the wind farm image again, **desktop and
phone agree on every slide.** The earlier decision to move slide 3 to an
industrial subject is effectively reverted.

Wired like the interior heroes: `HeroCarousel` sets `--slide-image` and optional
`--slide-image-mobile`, and the 560px block swaps them.

## Home page restructure + scroll parallax (2026-08-09)

António's brief was that the site needed to feel more industry-focused with
stronger visuals; the follow-up complaint was that the home page still felt
monotonous on a phone despite already carrying 17 image surfaces. The
diagnosis was never image count — it was a page that ran ~20 screens with four
stretches over a full screen of nothing but stacked text cards, all in the same
kicker → heading → green rule → card rhythm.

Three changes, in order of effect:

1. **Home service list cut from 8 to 4.** It duplicated `/services` entirely.
   The projects grid immediately below was *also* showing the first four
   services again under the heading "Our service portfolio" — so the page
   would have shown the same four services twice had the list simply been
   truncated. Projects now shows services 05-08 instead, so all eight still
   appear, none twice. `HOME_SERVICE_COUNT` in `HomeView.tsx` is the single
   place that number lives; the tail-end assertion in
   `tests/rendered-html.test.mjs` was widened from a literal `serviceData.map`
   match to tolerate an intervening `.slice(...)` — the intent (home still
   renders from the dictionary, not hardcoded copy) is unchanged.
2. **The process section became a full-bleed photographic band**
   (`.process-band`, `industry-petrochemical.webp` behind a scrim), the one
   section that deliberately breaks the card-stack rhythm rather than adding
   another one. Every colour token in it comes from the fixed ink/on-dark set
   per gotcha #2 — checked in both themes, not just light.
3. **The industries and contact strips went full-bleed** (`margin-inline:
   -16px` off a shell that's already `100% - 32px`, not a `100vw` rule — that
   would have reopened a horizontal scrollbar) and grew from 176px to 300px.

Scroll parallax followed as a fourth pass, on `.process-band` and the two
full-bleed strips only. Deliberately not everywhere: `.trust-slide` already
tried sitewide parallax (`background-attachment: fixed`) and disabled it on
mobile (line ~945, `background-attachment: scroll`) because fixed attachment
janks on iOS Safari — reusing that technique broadly would repeat a decision
already reversed. And a 15,000px page with motion on every transition stops
reading as deliberate and starts reading as a template. Three bands beat
seventeen.

Technique is `animation-timeline: view()` — scroll position drives the
keyframe directly, on the compositor, no JS scroll listener (there's already
one in `SiteChrome.tsx` for the header progress bar; a second per-frame
handler is exactly the kind of thing that janks on the mid-range Android
hardware this audience actually uses). Every instance is wrapped in
`@supports (animation-timeline: view())` so it is simply absent, not broken,
in Firefox — and separately in `@media (prefers-reduced-motion: no-preference)`.
That second guard is NOT redundant with the `animation-duration: .01ms`
!important rule near the bottom of `globals.css`: that rule neutralises
TIME-based animations, but a view()-timeline's progress is driven by scroll
position, not the clock, so forcing its duration near zero does not stop it
moving. See gotcha #7 for why none of this could be watched actually animate
from this tooling, only verified structurally correct.

**The capability image (`.capability-image`) deliberately did NOT get
parallax**, despite being a fourth strong candidate. It already has a hover
zoom (`transform: scale(1.06)` on `::before`, added earlier this session) and
a `view()`-driven animation on the same `transform` property would silently
win the cascade over that hover state every time the 640px-tall band is on
screen, i.e. always. Composing both cleanly needs a `@property`-registered
custom property so the hover easing survives independently of the per-frame
scroll value — a real technique, but not one to ship unverified when hover
*also* cannot be triggered in this pane (see the capability-image comment in
`globals.css` and the earlier hover-effect entry in this file). Someone who
can actually watch it move should add it.

## Chatbot

Floating widget on every page, all four languages. `app/api/chat/route.ts`
proxies **OpenRouter** (OpenAI-compatible), default model
`poolside/laguna-s-2.1:free`.

- Originally built on Gemini; abandoned because pinned free-tier model ids kept
  getting retired (`gemini-2.5-flash-lite` returned *"no longer available to
  new users"* on a brand-new key **while still being listed** by the models
  endpoint).
- Grounded in the site's own dictionary via `system-prompt.ts`. Verified under
  adversarial testing: refuses to invent prices or delivery dates, declines
  off-topic requests, resists prompt injection, admits it is an AI.
- Caps: 800-char message, 10-turn history, 400-token output, per-IP burst
  limiter (in-memory `Map`, so per-isolate on Workers — a speed bump, not a
  hard quota).
- **Two open questions:** the default model is a *coding* model (a general
  instruct model may suit customer questions better), and being free it may
  use visitor inputs for training. Both are noted in the README.

## António's feedback (voice notes, 2026-08-05) — ALL DONE

Audio and transcripts are in `Latest_from_Antonio/` (`.txt` files hold the
Portuguese, an English translation, and extracted action points).

| Ask | Status |
|---|---|
| Homepage must open on oil & gas: FPSO / platform / rig | ✅ `hero-oilgas-fpso.jpg` is slide 1 |
| Background too dark, wants brighter | ✅ light is now the default theme |
| Use the ORIGINAL NAS GLOBAL logo, in colour | ✅ colour logo on a white plate |
| Add agriculture imagery | ✅ |
| Each industry shows matching imagery | ✅ order matches his exact sequence |
| Add the LinkedIn link | ✅ footer, opens in a new tab |

## Suggested next steps

1. **Add `OPENROUTER_API_KEY`** — the chatbot is dead without it.
2. Consider a non-coding model for the chatbot, and a no-training one if
   visitor messages are sensitive.
3. ~~Wire in the 14 photos from `~/Downloads/Cabtecni images/`.~~ **Done
   2026-08-06** (see "Client photo set" below). Two of the fourteen,
   `about-banner.webp` and `cta-banner.webp`, are converted and sitting in
   `public/images/cabtecni/` but are **not referenced by anything yet**.
4. Images still use `<img>` rather than `next/image` (the 10 remaining lint
   warnings). `next/image` on Cloudflare Workers needs a custom loader, which
   is a deployment decision.
5. ~~Nothing is committed.~~ Committed locally 2026-08-09 as `7e6e6b7`, but the
   **push failed** — see "Deployment" below. `origin/main` is still at
   `85d91c3`, so a fresh clone does not reproduce the live site. This remains
   the most urgent item until someone with push access runs it.
6. **The 16px horizontal-overflow bug is still open.** Every page can be
   scrolled sideways slightly at phone widths; it's `.top-actions`/
   `.top-socials` in the header (confirmed on `/capabilities`, which shares
   none of the other markup touched this session), not anything from the
   mobile-image or parallax work. Queued as a background task, not yet done.
7. **Parallax exists on three bands but has not been watched moving by
   anyone.** See "Home page restructure + scroll parallax" above and gotcha
   #7. Worth five minutes on a real phone before calling it finished.

## Deployment

Vercel project **`cabtecni-industrial`** (`.vercel/project.json`), production
alias <https://cabtecni-industrial.vercel.app>.

**Two independent ways production gets updated, and both are live:**
`vercel --prod` uploads the working tree directly and does not involve git.
Separately, **the project has GitHub auto-deploy configured** — confirmed
2026-08-09 when a `git push origin main` alone produced a new production
deployment with no `vercel --prod` run, evidenced by the
`cabtecni-industrial-git-main-almeidayalamo.vercel.app` alias that only
git-triggered deploys get. Discovered by accident; it had not been mentioned
anywhere before this. **Practical effect: once push access works, `git push
origin main` ships to production by itself.** A local commit that hasn't been
pushed is not on production; a push, even without an explicit deploy step,
is.

`vercel.json` pins `npx next build`, not the vinext build `npm run build` uses,
so validate with `npx next build` before deploying.

The generated `*-<hash>-almeidayalamo.vercel.app` URL sits behind Vercel
Deployment Protection and returns a 302 to an SSO page. That is not a broken
deploy; check the alias above instead.

Do not confuse this with the separate **`cabtecni`** Vercel project
(`cabtecni.vercel.app`), which is the plain HTML build. The two repos have
crossed names: this project pushes to `Almeida2019/cabtecni.git`, while
`../cabtecni` pushes to `Almeida2019/cabtecni2.git`.

**`git push origin main` fails as of 2026-08-09**:
`Permission to Almeida2019/cabtecni.git denied to Leornadia.` The SSH key
active on this machine authenticates as `Leornadia`, which has no write access
to `Almeida2019/cabtecni` — deploys have been going out via `vercel --prod`
regardless, since that uploads the working tree directly and never touches
git. Fix by either adding that key to the `Almeida2019` account, or by
repointing the remote (`git remote set-url origin <url the key can write
to>`) — check which before doing it, since the crossed-names issue above means
the obvious-looking alternate remote may be the wrong project.

**`Almeida2019/cabtecni` is a PUBLIC repository.** Confirmed via an
unauthenticated GitHub API read (200, no auth needed). `Latest_from_Antonio/`
is gitignored specifically because of this — it holds voice recordings of a
named individual, and git history is not realistically purgeable once pushed.
Do not remove that gitignore entry without first making the repo private, and
know that flipping visibility later does not retroactively protect anything
that was public before the flip (clones/forks/crawlers may already have it).

Last production deploy: **2026-08-07**, `dpl_Cw4pmscZ71tHSySXtPyqa3FyyDyK`.

## Standing preferences

- **No em dashes anywhere, in any language.** The owner considers them a tell
  of AI-written text.
- Copy is **not client-approved**: service descriptions, the delivery model and
  the NAS GLOBAL framing were written for this rebuild. Brand facts (100%
  Angolan, Luanda, contact details) were checked against cabtecni.com.
