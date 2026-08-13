# NØRR3 Interior Pages Redesign — Round 2 Spec

_Orchestrated pass (Creative Director · UI · UX · Content · SEO · Translator). Implementation by Claude Code CLI (opus). Round 1 (homepage, commit f25c363) is the quality/consistency reference: real 2026 brand photography + a reduced-motion-safe interaction layer built from the shared component kit (HeroCollage, PhotoInterstitial, TeamMarquee, ParallaxImage, HoverLift, Reveal, StaggerGrid, SplitHeadline, CountUpStat)._

## 0. Round-2 concept — "Everywhere the homepage promised, deliver"

The homepage now sells "the humans behind the growth" with real faces + tasteful motion. Every interior page still leans on `office/*.jpg` placeholders and picsum. Round 2 removes the last placeholder from the site and brings each page to the same bar: **real Helsinki-studio photography, the same motion vocabulary, the same brand tokens** — while giving each page one distinct, purposeful moment so the site doesn't feel like one page repeated.

**Global rules (all pages):**
- Photos: WebP only, lazy below the fold, dimensions reserved (fixed-height or `aspect-[…]` wrappers) → no CLS. Use the **fresh** shots below — never re-use a homepage photo on an interior page.
- Motion: reuse `Reveal`, `StaggerGrid`, `HoverLift`, `ParallaxImage`; all already `prefers-reduced-motion`-aware. No new scroll-jacking. No gaudy effects.
- Brand: Host Grotesk; Purple `#7A06D3`, Violet `#5517A7`, Yellow `#F6FF4F`, Lime `#DAEB45`; cards 25px radius / 36px pad; Material Symbols outlined; black primary pill / outlined secondary / text-link tertiary.
- Copy: full FI/EN parity for every new/changed string (in `dictionary.ts`). Descriptive, localized `alt` on every real photo (empty `alt=""` only on decorative/duplicate images).
- SEO: per-page `generateMetadata` (title + description + canonical + og:locale/url + og image). New `dict.seo.<page>` block holds localized title/description.
- Verify `npm run build` after every page.

## 1. Fresh photo manifest (converted this round, in repo)

All under `public/images/`. Dims exact (for CLS-safe wrappers). Homepage already used N9/28/29/30/31/35/37/39/40 — none reused here.

| File | Dims | Src | Page / placement | Alt (EN) |
|---|---|---|---|---|
| `brand/team-attitude.webp` | 1600×1066 | N42 | Team — "Attitude." pillar | NØRR3 colleagues in a lively meeting-room discussion in the Helsinki studio |
| `brand/team-technology.webp` | 1600×1066 | N27 | Team — "Technology." pillar | Two NØRR3 specialists analysing campaign data on an iMac together |
| `brand/team-talent.webp` | 1600×1066 | N38 | Team — "Talent." pillar | NØRR3 team laughing together on the studio lounge sofa |
| `brand/team-space.webp` | 2000×1333 | N41 | Team — values interstitial (parallax) | The NØRR3 studio's open lounge with soft evening light |
| `brand/services-planning.webp` | 1600×1066 | N32 | Services — Insights interstitial / lead | NØRR3 planners reviewing a media plan on a laptop in a bright meeting room |
| `brand/services-collab.webp` | 1600×1066 | N34 | Services — "why/features" companion | Two NØRR3 colleagues sharing a campaign result with a smile |
| `brand/engine-workflow.webp` | 1600×1066 | N43 | Engine — product/workflow band | A NØRR3 specialist working in the Marketing Engine on a laptop |
| `brand/contact-portrait.webp` | 1200×800 | N25 | Contact — human photo beside form | A friendly NØRR3 colleague ready to help, in the Helsinki studio |
| `cases/flow-festival.webp` | 1600×1066 | N36 | Case — Flow Festival | The NØRR3 team celebrating on the studio lounge sofa |
| `cases/terveystalo.webp` | 1600×1066 | N8 | Case — Terveystalo | The full NØRR3 team gathered around the studio's NORR3 letters |
| `cases/kokkola.webp` | 1600×1066 | N33 | Case — Kokkola | A relaxed NØRR3 colleague with the office dog on the studio sofa |
| `cases/st1.webp` | 1600×1066 | N10 | Case — ST1 | The NØRR3 team posing with the giant NORR3 letters in the studio |

**Case-photo note:** the shoot has no real client-campaign imagery, so case cards/detail heroes lead with authentic NØRR3 studio photography (candids that read as "the team behind this work") rather than misleading stock. This is an honest, on-brand step up from picsum; real client photography remains a future round. Each case gets a *distinct* candid so the grid isn't repetitive.

---

## PAGE 1 — TEAM  (`team/page.tsx`, `TeamMemberCard.tsx`)

**Before:** hero + sliding `TeamMarquee`; 3 pillars on `office-09/01/13.jpg` placeholders; culture cards; interstitial on `office-04.jpg`; **management grid shows only `team.slice(0,5)` of 17 headshots** + yellow ViewAll tile; open roles; banner.

**After (highest priority):**
1. **Wire all 17 real headshots.** Management grid renders the full roster (`team.map`, not `slice(0,5)`) as `TeamMemberCard`s, with the yellow `ViewAllTile` as the final (18th) cell → keeps the brand card-grid-CTA pattern.
2. **Warmer, more human `TeamMemberCard`:** wrap each in `HoverLift`; photo in `aspect-square` (720×720 → reserved, no CLS); on hover, image lifts to full colour + a thin purple keyline; name always visible, role shown when present. **Per-person mailto + LinkedIn:** add optional `email`/`linkedin` to `TeamMember`; the card's LinkedIn link uses `member.linkedin` (fallback company LinkedIn) and email uses `mailto:${member.email ?? "info@norr3.fi"}` with `aria-label` including the name. CEO (Antti) shows role. Keep it tasteful — no gaudy overlays.
3. **Pillars → real photos:** `team-attitude` / `team-technology` / `team-talent` (localized alt), replacing the three `office/*.jpg`. Keep the alternating layout + `CountUpStat`s.
4. **Interstitial → `team-space.webp`** with localized alt (replaces `office-04.jpg`).
5. Keep hero `TeamMarquee`, culture cards, open roles, StatGrid, banner.
6. **Copy:** update `team.management.body` (FI/EN) to warmly introduce the *whole* team (not just "management up close"); keep heading "Management Team" (Figma-faithful).
7. **SEO:** `generateMetadata` → `dict.seo.team` title/description; og image `group.webp` fallback (brand og). Add descriptive alt everywhere.

**Distinct moment:** the fully-populated 17-face grid with warm hover is the page's signature — the site's most human screen.

---

## PAGE 2 — SERVICES  (`services/page.tsx`)

**Before:** hero + pill marquee; black Media-Insights band w/ AudienceChart; yellow banner; logostrip; "why" benefit cards; interstitial on `office-11.jpg`; reliable-data cards + stats; features (bar mock + list); related cases/posts.

**After:**
1. **Add the 6 service-area grid** (the brand's numbered `ServiceCard`s — same as homepage) as a proper section near the top: heading `dict.services.areas.heading` + body, `StaggerGrid` of all 6 `serviceCards`, each linking to `/services`. This makes the page actually present "6 service areas" (currently it jumps straight into Media Insights).
2. **Interstitial → `services-planning.webp`** (localized alt) replacing `office-11.jpg`.
3. **"Why choose" section gets a real photo companion:** two-column — left `services-collab.webp` in a 25px-radius card w/ caption, right the existing benefit cards (or place the photo as a lead-in). Wrap benefit/service/data cards in `HoverLift` for tactile feedback (consistent w/ homepage service cards).
4. Keep AudienceChart, reliable-data cards, features, related cases/posts. Related cases now show real case photos automatically (via cases.ts change).
5. **Strong CTAs:** hero primary "Contact us" + keep the Media-Insights demo CTA. Add an outlined "All cases"/"Access demo" where natural.
6. **SEO:** `dict.seo.services`.

**Distinct moment:** the numbered 6-area service grid + the collab photo — clearly a capabilities page.

---

## PAGE 3 — ENGINE  (`engine/page.tsx`)

**Before:** hero + pills; DashboardMock band; black MediaMixSimulator band; purple pull-quote; logostrip; related cases; banner.

**After (make it feel like a product):**
1. **Product intro / two-column hero support:** below the hero, a "people + product" row like the homepage engine section — left `engine-workflow.webp` (25px card + caption "Built in-house, not licensed"), right a short **feature list** (`dict.engine.product.features`: 3–4 icon+title+body rows: real-time optimisation, one unified platform, AI budget reallocation, proof/measurement). Wrap feature rows in `Reveal`.
2. **Keep** DashboardMock (product screenshot), MediaMixSimulator (the interactive demo — this IS the "try it" moment), pull-quote, related cases.
3. **Demo CTA:** hero already has "Access demo" (→ `#simulator`) + "Contact us". Add a clear **"Book a demo"** primary CTA in a dedicated band before the footer banner (`dict.common.bookDemo` → `/contact`), so the product page closes on conversion.
4. **A "how it works" 3-step strip** (`dict.engine.workflow.steps`: Brief → Plan & buy → Prove) as a light numbered row, reinforcing the product narrative. Yellow index numbers, Material icons.
5. **SEO:** `dict.seo.engine`.

**Distinct moment:** product feature list + workflow steps + the live simulator = a real product page, not a marketing stub.

---

## PAGE 4 — CASES  +  case DETAIL  (`cases/page.tsx`, `cases/[slug]/page.tsx`, `cases.ts`, `CaseCard.tsx`)

**cases.ts change (data):** replace picsum `image` with local `image: /images/cases/<slug>.webp`; **remove** the `detailImages` picsum field + the `img()` helper + the type member (the editorial detail no longer needs 3 stock photos).

**CASES INDEX — before:** hero + `office/*.jpg` collage strip w/ a purple "+47%" tile; logostrip; asymmetric CaseCard grid; banner; related posts.
**After:**
1. **Hero collage → real case photos.** Replace the 5 `office/*.jpg` tiles with 4 real `cases/*.webp` tiles; keep the purple stat tile treatment but make the stat honest & sourced from a real case metric ("+13% top-of-mind" from Terveystalo, or "27.5M impressions" from Flow). Keep `Reveal` stagger + `aspect`-locked heights (no CLS).
2. CaseCard grid unchanged structurally — now photo-led with real imagery + existing hover-zoom. Ensure `alt` = localized "<Client> — <tagline>".
3. Keep banner + related posts.

**CASE DETAIL — before:** plain big client title; intro; alternating objectives/solution on picsum `detailImages`; methods; results on picsum; StatGrid; banners.
**After (editorial):**
1. **Editorial hero:** full-width (or 16/9) hero **photo** (`study.image`) with the client name as an oversized overlaid headline + tagline + `CUSTOMER CASE` pill + Contact CTA — a magazine opener, replacing the plain title block. Reserve height (aspect wrapper) for no CLS. Photo lazy except this LCP → eager.
2. **Big pull-quote:** style `study.tagline[locale]` as a large centered editorial quote (Violet or Purple band, like engine's quote card) after the intro — no fabricated named testimonial (honest: it's the case's own thesis line).
3. Objectives / Solution: keep alternating layout but **drop the stock photos** — use a clean two-column text + a single accent (numbered `01/02`, or a purple keyline). Methods grid kept. 
4. **Results block:** keep the `StatGrid` (results in numbers, count-ups) as the emotional payoff; precede with the results paragraph. Optionally one real `cases/<slug>.webp` echo here (same photo, different crop) — but no picsum.
5. Keep More-Cases + banners.
6. **SEO:** `dict.seo.cases` for the index; detail uses `generateMetadata` per case (`title: "<Client> — NØRR3 case"`, description = `study.tagline[locale]`, og image = `study.image`).

**Distinct moment:** the magazine-style photo hero + pull-quote on each case.

---

## PAGE 5 — INSIGHTS  +  article DETAIL  (`insights/page.tsx`, `insights/[slug]/page.tsx`)

**INDEX — before:** hero headline "Blog" + body; 4-col BlogCard grid (2 photo, 2 ghost tiles); banner.
**After:**
1. **Featured article** treatment: promote the newest post (`insights[0]`, Tre Kronor) to a wide 2-column feature at the top (large photo left, date/title/excerpt/read-more right) — editorial index, like a real magazine. Remaining posts in the existing grid below.
2. Keep ghost tiles for photoless posts (brand-correct). BlogCards already hover-zoom + `alt`=title.
3. **SEO:** `dict.seo.insights`.

**ARTICLE DETAIL — before:** back-link; pill; date; title; excerpt; single photo; body paragraphs; related posts; banner. (Already fairly clean.)
**After (more readable + editorial):**
1. **Reading affordances:** add estimated read time (`dict.insights.minRead`, computed from body word count) + a hairline meta row (date · read time) under the title. Keep max-w prose column.
2. **Photo hero:** move `post.image` up as a wider hero (aspect-locked, LCP eager) above the prose; localized/empty alt. Ghost-tile posts get a lavender ghost hero instead (consistent w/ card).
3. **Typographic polish:** drop-cap or larger lead paragraph; `Reveal` on the body; a pull-quote style for the middle paragraph is optional (tasteful). Keep related posts + banner.
4. **SEO:** article `generateMetadata` (`title: content.title`, description = `content.excerpt`, og image = `post.image` when present, `type: article`).

**Distinct moment:** the featured-article index header + readable article hero.

---

## PAGE 6 — CONTACT  (`contact/page.tsx`)

**Before:** yellow hero band; two-col (direct contact details | working ContactForm w/ fixed focus rings); logostrip.
**After:**
1. **Add a human photo:** `contact-portrait.webp` in a 25px-radius card in/above the left column ("or reach us directly") — a real face makes the form less transactional. Localized alt. Reserve dims.
2. **Office / location:** a small **map-style location block** — address (already in footer dict) + a static styled "Helsinki · Pursimiehenkatu 26 C" card with a Material `location_on` icon and an optional embedded OpenStreetMap `<iframe>` (lazy, no key) OR a tasteful static map card (no external key → use a styled card, not a live map, to avoid CLS/keys). Keep it on-brand (lavender card).
3. **Keep the working form** exactly (focus rings already fixed) — do not regress.
4. **Clear CTA:** the form's Send button stays; add response-time reassurance line ("We usually reply within one business day" — `dict.contact.responseTime`).
5. **SEO:** `dict.seo.contact` + `ContactPage`/`LocalBusiness`-ish JSON-LD is optional; at minimum metadata.

**Distinct moment:** the human portrait + location card warms up a normally cold page.

---

## 7. dictionary.ts additions (FI/EN parity)

Add a `seo` block (per-page title/description, both locales), plus:
- `common.bookDemo` — EN "Book a demo" · FI "Varaa demo"
- `common.viewProfile` — EN "View profile" · FI "Katso profiili"
- `insights.minRead` — EN "min read" · FI "min lukuaika"
- `insights.featuredLabel` — EN "Featured" · FI "Nostettu"
- `services.areas` — `{ heading, body }` (EN "What we do" / "Six service areas…"; FI "Mitä teemme" / …)
- `engine.product` — `{ heading, body, features:[{icon,title,body}×4] }`
- `engine.workflow` — `{ heading, caption, steps:[{icon,title,body}×3] }`
- `engine.bookDemo` band `{ heading, body }`
- `contact.responseTime`, `contact.locationHeading`, `contact.photoAlt`
- Tweak `team.management.body` (warmer, whole-team) FI/EN.

`seo` keys (title ≤60 chars, description ≤155):
- team · services · engine · cases · insights · contact.

## 8. Build / commit order
Per page: edit content/dict → hand page spec to Claude Code → `npm run build` → fix. Order: Team → Services → Engine → Cases(+detail+cases.ts+CaseCard alt) → Insights(+detail) → Contact. Then full `git add -A`, detailed per-page commit, `git push origin main`.
