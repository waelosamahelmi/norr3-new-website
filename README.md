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

## Internationalisation

Finnish is the default locale; `/` redirects to `/fi`. All copy lives in
`src/content/dictionary.ts` as two objects, `fi` and `en`, where `en` is typed as
`Dictionary = typeof fi` — so a missing or renamed key is a build error, and
**FI/EN parity is enforced by the compiler**. Longer-form content (cases, insights,
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
