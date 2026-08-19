# NØRR3 — norr3.fi

The marketing site for **NØRR3** (NORR3 Oy), a Nordic insight and media agency in Helsinki.
Bilingual (Finnish / English), fully static, and built to the NØRR3 brand guidelines.

## Stack

| Concern    | Choice |
| ---------- | ------ |
| Framework  | Next.js 16 (App Router, React 19, TypeScript) |
| Styling    | Tailwind CSS v4 — CSS-first config in `src/app/globals.css` (`@theme inline`), no `tailwind.config.js` |
| Motion     | Framer Motion (reveals, staggers, chart bars) + GSAP (hover lift, parallax) + Lenis (smooth scroll) |
| Icons      | Google Material Symbols — **outlined only**, via the `material-symbols` package |
| Typeface   | Host Grotesk, self-hosted through `next/font` |
| i18n       | Hand-rolled dictionary keyed by locale (`next-intl` is installed but routing/copy is local) |
| Content    | NØRR3 CMS on port 3848 — see [Content](#content) below; `src/content/*` is the fallback |

## Commands

```bash
npm install
npm run dev     # dev server on http://localhost:3000 (redirects / → /fi)
npm run build   # production build — must pass clean before any commit
npm run start   # serve the production build
npm run lint    # eslint (eslint-config-next)
```

## Structure

```
src/
  app/
    layout.tsx              root shell: fonts, metadata, pre-hydration theme script
    globals.css             Tailwind v4 entry — brand tokens, dark variant, keyframes
    page.tsx                / → redirects to the default locale
    [locale]/
      layout.tsx            nav, footer, announcement bar, cookie consent, smooth scroll
      page.tsx              home
      services/  engine/  cases/  team/  insights/  contact/
      privacy/  terms/      legal pages (see the note below)
  components/               presentational + motion components
    cards/                  ServiceCard, CaseCard, BlogCard, BenefitCard, TeamMemberCard, CultureCard
    marquee/                LogoStrip, PillMarquee, HighlightsBand
    simulator/              MediaMixSimulator (Engine page)
  content/                  all copy and data: dictionary.ts, cases, insights, team, services, channels
  i18n/config.ts            locale list + guard
  lib/dictionary.ts         getDictionary(locale)
public/images/brand/        real photography and OG images
```

Pages are server components; anything with state, motion hooks or browser APIs is
a `"use client"` component under `src/components/`.

## Brand

The design system is the NØRR3 brand bible; the short version:

The design system is **editable from the CMS at runtime**. `globals.css` declares
the theme with plain `@theme` (not `@theme inline`) so every utility compiles to
`var(--color-purple)` rather than a baked `#7a06d3`; `ThemeStyle` in the root
layout emits a `:root` block for whatever the CMS has customised, and an
unlayered rule beats Tailwind's `@layer theme` without needing `!important`.
Colours, the dark theme, `--radius-card`, card padding/gap and the type scale are
all reachable from CMS → Design. Anything untouched there injects nothing.

- **Colours are Tailwind tokens, never raw hex in JSX.** Defined in `globals.css`:
  `purple` (#7a06d3, the primary — links and accents), `violet` (dark sections and
  icon tiles), `light-purple` / `pastel-purple` (card tints), `grey`, `ink` (black
  framing, body text, primary buttons), `offwhite`. `yellow` and `lime` are
  **saturated accents** — index numbers, icon tiles and infographics only, never
  general decoration. The `accent-*` colours exist for categorical data-viz.
- **Type:** Host Grotesk only. Medium (500) for headlines and stats, Regular (400)
  for body and labels. Scale tokens: `text-display` 120px, `text-stat` 110px,
  `text-h3` 40px, `text-h4` 26px; body 15–18px.
- **Cards:** `rounded-[25px]` (token: `--radius-card`), 36px padding, 26px gaps,
  alternating pastel-purple / light-purple tints. Icon tiles are square-ish with a
  5px radius, violet background + white icon (or yellow + black on service cards).
- **Buttons** (`PillButton`): primary = solid `ink` pill with a white uppercase
  label, secondary = outlined pill, `text` = label + arrow.
- **Tone of voice:** confident, plain-spoken, growth-driven, Nordic. "Making Media
  a Growth Engine", "every euro of your media", "without the jargon". No fluff.

### Dark mode

Class-based (`@custom-variant dark` in `globals.css`), toggled by `ThemeToggle` and
applied to `<html>` by a tiny pre-hydration script in `src/app/layout.tsx` so the
page never flashes light first. The house dark theme is a near-black violet base
(`#0e0b16`) with off-white text; the purple/violet/yellow accents are deliberately
**not** remapped because they were designed to pop on dark. Two conventions recur:
black pills become `purple` in dark mode, and elevated surfaces become
`dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10`.

**Every visual change must be checked in both themes.**

### Motion

Scroll reveals, card hover and the marquee speeds are configured in the CMS and
reach the components two ways: the marquees read CSS custom properties
(`--marquee-logos` and friends), and `Reveal`, `StaggerGrid`, `HoverLift` and
`RouteWipe` read `MotionSettingsProvider` context. `MotionConfig` stays on
`reducedMotion="user"` and that is not configurable — honouring the OS setting is
not an editorial decision.

Per-block overrides come from the page editor's Style tab and are applied by
`StyleScope` in `src/components/blocks/BlockShell.tsx`, which also scopes a block's
corner radius by setting `--radius-card` on its subtree.

## Content

Copy and collections come from the **NØRR3 CMS** (`/root/norr3-cms`, port 3848),
not from the files in `src/content/`. Those files are still the source of the
*types* and the fallback data:

```
src/lib/cms.ts            fetches the CMS bundle, merges it over src/content/*
src/lib/dictionary.ts     getDictionary(locale) — now async
src/components/blocks/    BlockRenderer: draws CMS-composed pages
src/app/[locale]/[...slug]  serves pages built in the CMS page editor
src/app/[locale]/cms-preview  live preview target for that editor
src/app/api/revalidate    the CMS calls this on publish
src/app/api/cms-status    reports whether we are on CMS or fallback content
src/app/api/contact|brief forward form submissions into the CMS inbox
```

Two properties this layer guarantees:

1. **The site never goes dark.** If the CMS is unreachable or answers with
   something malformed, every accessor falls back to the committed content.
   `curl localhost:3847/api/cms-status` tells you which is in use.
2. **A missing key cannot crash a render.** The CMS payload is merged *over* the
   bundled dictionary, so a value nobody has filled in resolves to the committed
   string rather than `undefined`.

Configuration lives in `.env.local`:

```
NORR3_CMS_URL=http://127.0.0.1:3848
NORR3_CMS_REVALIDATE_SECRET=…    # must match the CMS's Settings → Website connection
NORR3_CMS_INGEST_SECRET=…        # ditto
```

Static routes always beat the catch-all, so every hand-built page here keeps
winning and `[...slug]` only picks up slugs this repo has no code for. That is
what lets an editor publish a new page without a deploy.

`next.config.ts` sets `allowedDevOrigins` for the VPS IP: without it `next dev`
answers 403 for its own JS chunks when the site is opened over anything but
`localhost`, the page never hydrates, and every scroll-reveal stays at opacity 0.

## Internationalisation

Finnish is the default locale; `/` redirects to `/fi`. The *shape* of the copy is
defined in `src/content/dictionary.ts` as two objects, `fi` and `en`, where `en`
is typed as `Dictionary = typeof fi` — so a missing or renamed key is a build
error, and **FI/EN parity is still enforced by the compiler**. The *values* are
edited in the CMS under Site copy and merged over this file at request time. Longer-form content (cases, insights,
team, services) lives in the other `src/content/*.ts` files with `fi` / `en` fields
per entry.

Any new or sharpened copy must be added to both locales. Locale-specific alt text
and labels that only exist in one page can be inlined there with a
`locale === "fi" ? … : …` ternary, following the existing pages.

## Legal pages

`/[locale]/privacy` and `/[locale]/terms` render from `legal` in `dictionary.ts`
through the shared `LegalArticle` component. **The wording is a structured
placeholder** for a Finnish marketing agency (data collection, cookies, retention,
GDPR rights, IP, liability, governing law) and is marked as such in the page
source. It needs a review by legal counsel before launch.
