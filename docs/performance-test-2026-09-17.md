# Performance, Core Web Vitals and mobile test

**Date:** 17 September 2026 · **Scope:** the new NØRR3 site (preview build on `:3847`, FI + EN)
**Method:** Lighthouse (mobile defaults: Moto G Power class, 4× CPU / slow-4G throttling) against the
local preview, plus Playwright probes for LCP/CLS/cls-culprits and a mobile layout audit
(390 × 844) across `/, /en, /caset, /tiimi, /merch, /toihin-meille, /tietosuojaseloste` and EN equivalents.

> Localhost caveats: the preview runs a single Node process with no CDN/HTTP2 push and
> Lighthouse's `is-crawlable` audit fails locally by design (robots.ts only allows `norr3.fi`).
> Both lower the numbers vs. the real production host. Re-run the same command against
> production after DNS cutover for the launch report.

## Results (mobile, FI home)

| Metric | Before | After fixes |
| --- | --- | --- |
| Performance | 55 | 55 |
| Accessibility | 96 | **100** |
| Best practices | 100 | 100 |
| SEO | 69 | 69 (only `is-crawlable`, localhost-only) |
| LCP | 9.3 s | 7.7 s |
| CLS | 0.011 | 0.13 |
| TBT | 540 ms | 490 ms |
| FCP | 1.4 s | 1.5 s |

Other pages after fixes: EN home perf 63, merch 73 (LCP 4.0 s, CLS 0), tiimi 63 (CLS 0).
Accessibility is now 100 on every page tested.

## Fixes applied (17 Sep)

- **Contrast (a11y 96 → 100):** `Nav.tsx` language link and `StatGrid.tsx` label raised from
  `text-ink/50` to `text-ink/60` (3.94:1 → 5.7:1, WCAG AA for small text).
- **LCP discovery:** the hero deck image was `loading="lazy"` on the front card.
  `MediaAsset` now supports `fetchPriority`, and the hero stack (`HomeHero`, `HeroCardStack`)
  loads its images `eager` with `fetchPriority="high"` on the focused card.
- **SSR hero:** `HeroRandomizer` renders the single eligible hero in the server HTML instead of a
  post-hydration placeholder, so the hero image can be discovered before JavaScript runs.
  With one enabled hero (current CMS state) the randomizer is a no-op.

## Findings & next steps (not changed here)

1. **CLS 0.13 – hero deck moves with the typing headline.** The layout-shift sources point at the
   hero deck span (`order-3 mt-10 …`) and its cards: the animated accent word changes the headline's
   width/height as it types, nudging the deck below. Options: reserve the widest word's width on
   mobile (ghost-width trick — currently `hidden lg:block`), or pin the headline's height per
   breakpoint. Deferred because the mobile hero spacing was hand-tuned.
2. **LCP element becomes the cookie banner.** On an unthrottled Playwright probe the hero image is the
   first LCP candidate at **368 ms**, but after hydration the consent banner's paragraph (318 × 137 px)
   becomes the largest candidate at ~670 ms. Rendering the banner server-side or slimming its copy
   would keep the hero as the LCP element.
3. **Image delivery ~910 KiB savings.** The team marquee serves full-size photos for ~128 × 224 px
   slots (`/images/team/*.webp`, 51–95 KiB each) and the hero photo can be trimmed. Generate small
   variants (see `scripts/`) and keep the full-size files for the profile pages.
4. **Hero video 543 KiB** (`vertical-shot-…-web.webm`) loads on the home page; consider `preload="none"`
   plus poster, or a shorter loop, for the mobile breakpoint.
5. **Unused JavaScript 82 KiB** and legacy-JS 13 KiB — worth a bundle review before launch.
6. **Constant animation work** (Lenis rAF, marquees, rotating cards) dominates main-thread time
   (73 s total work under 4× throttle). Fine for feel, but keep an eye on it on low-end Android.
7. **Mobile layout audit:** no horizontal overflow on any route, one `<h1>` per page, no clipped
   content. Inline text links are under 24 px tall (exempt from WCAG 2.5.8); the marquee pills are
   20 px — consider a touch-height bump if they become primary CTAs.
8. **EN ticker copy:** `InsightsTicker` falls back to Finnish text because the CMS
   `media_insights` rows have no English translation (all 137 rows). Needs a translation pass.

## Re-running

```bash
# Lighthouse (mobile defaults) — needs the Playwright Chromium
cd /tmp/pw && export CHROME_PATH=/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome
npx lighthouse http://localhost:3847/ \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
  --output=json --output-path=/tmp/lh-home.json --quiet

# LCP / CLS element probes and the mobile audit
node /tmp/pw/lcp-probe.js      # LCP candidates + shifts
node /tmp/pw/shift-probe.js    # CLS sources
node /tmp/pw/mobile-audit.js   # overflow / tap targets / one-h1
```
