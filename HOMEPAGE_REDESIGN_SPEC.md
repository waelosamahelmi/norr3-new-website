# NØRR3 Homepage Redesign — Round 1 Spec (Homepage only)

_Orchestrated creative pass combining Creative Director, UI, UX, Content, SEO, and Translator roles. Implementation is executed by Claude Code CLI. Photos are REAL 2026 brand photography from the Drive shoot, already optimized to WebP under `public/images/`._

---

## 0. Concept — "The people behind the growth"

NØRR3's real edge is a **senior, in-house team** plus **their own technology**. The current homepage hides that behind generic placeholder office stock and a static hero collage. The customer‑magnetic move is to **lead with real faces, the real studio, and real candid energy**, then let tasteful interactivity (pointer‑parallax hero, scroll parallax, hover‑lift, count‑ups, an interactive sliding team band) signal "modern, on top of tech, human." Photography sells the emotion; motion sells the competence. Nothing gaudy — every motion respects `prefers-reduced-motion`.

**Before → After in one line:** placeholder office JPEGs + static collage → real Helsinki‑studio photography, real 17‑person team band, a "humans behind the numbers" narrative, and a delightful, reduced‑motion‑safe interaction layer.

---

## 1. Photo manifest (already converted, in repo)

All under `public/images/`. Dimensions are exact (use for CLS‑safe `width`/`height` or aspect wrappers).

### Brand scenes — `public/images/brand/`
| File | Dims | Source | Placement | Alt (EN) | Alt (FI) |
|---|---|---|---|---|---|
| `hero-human.webp` | 1400×933 | N30 | Hero collage — card 02 (main human) | Two NØRR3 colleagues laughing over coffee at a laptop in the Helsinki studio | Kaksi NØRR3:n kollegaa nauramassa kahvin ääressä läppärillä Helsingin studiolla |
| `hero-data.webp` | 1200×800 | N29 | Hero collage — card 03 (dark data) | NØRR3 team reviewing campaign data together on screen | NØRR3:n tiimi tarkastelee kampanjadataa yhdessä näytöltä |
| `space-lounge.webp` | 2000×1333 | N40 | Values interstitial (full‑bleed parallax) | The NØRR3 studio lounge in Helsinki — open, bright and relaxed | NØRR3:n studiolounge Helsingissä — avoin, valoisa ja rento |
| `engine-team.webp` | 1500×1000 | N31 | Marketing Engine companion card | NØRR3 specialists collaborating around a laptop | NØRR3:n asiantuntijat työskentelevät yhdessä läppärin ääressä |
| `team-couch.webp` | 1400×933 | N35 | About — "Our Team" card | The NØRR3 team laughing together on the studio sofa | NØRR3:n tiimi nauramassa yhdessä studion sohvalla |
| `team-energy.webp` | 1600×1066 | N9 | About — "Join Us" card | The NØRR3 team celebrating with arms raised under the studio's NORR3 letters | NØRR3:n tiimi juhlii kädet ilmassa studion NORR3‑kirjainten alla |
| `award.webp` | 1400×933 | N37 | About — "Agency of the Year" card | The NØRR3 team with an industry award in the studio lounge | NØRR3:n tiimi alan palkinnon kanssa studion loungessa |
| `space-arch.webp` | 1500×1000 | N39 | Blog — "Tre Kronor" card | NØRR3's loft studio with its signature arched windows | NØRR3:n loft‑studio ja sen tunnusomaiset kaari‑ikkunat |
| `data-desk.webp` | 1400×933 | N28 | Blog — "Media mix 2026" card | NØRR3 analysts at their desks with campaign dashboards | NØRR3:n analyytikot työpöytiensä ääressä kampanjadashboardien parissa |
| `group.webp` | 2000×1333 | group | Spare / social | The full NØRR3 team in the Helsinki studio | Koko NØRR3:n tiimi Helsingin studiolla |
| `og-image.jpg` | 1200×630 | group | OpenGraph/Twitter card image | — | — |

### Team headshots — `public/images/team/<id>.webp` (all 720×720, 1:1)
`maria-malila, antti-ujainen, anne-mari-lahtinen, elina-rossi, anton-kallio, anna-liina-harrivaara, maija-etokari, dina-barbis, marika-salovaara, lotta-brech, salla-sofia-lahti, aino-lehtinen, geir-siirde, janne-savela, teppo-lipsanen, karoliina-makela, michael-oshea` — matched by the shoot's named files (Allu→anna‑liina, Sallis→salla‑sofia, Karo→karoliina, Mike→michael). Consistent teal‑window loft background, high‑key light. Alt = person's name.

**Decision — Cases section keeps its picsum images this round.** The 3 case cards represent *client campaigns* (Flow Festival, Kokkola, ST1), not the NØRR3 team; substituting our team candids there would misrepresent the work. Real client imagery is a future round. Everything else that used `/images/office/*` placeholders is replaced with real brand photography.

---

## 2. Section‑by‑section (before → after)

1. **Hero** — keep the signature split headline `A New Way to · [collage] · _Grow`. Replace `HeroCollage` placeholder office photos with **hero-human** (card 02) and **hero-data** (card 03); keep the yellow pixel block, lavender panel, purple poster, numbered 01/02/03 depth and the caret blink. **Add pointer‑parallax** (see §3). Hero photo = LCP → eager + high fetch priority.
2. **LogoStrip** — unchanged (client trust marquee).
3. **Services grid** — unchanged (6 cards already hover‑lift + real links).
4. **Values interstitial** — swap `office-07.jpg` → **space-lounge.webp**; keep GSAP scroll parallax + value‑pill marquee; pass localized `alt` + refined caption.
5. **Cases** — unchanged (client imagery; see decision above).
6. **HighlightsBand** + **LogoStrip** — unchanged.
7. **Marketing Engine** — becomes a two‑column "people + product": left = **engine-team.webp** in a 25px‑radius card with the caption "The team behind the Engine — built in‑house, not licensed."; right = the existing `DashboardMock`. Stacks on mobile (photo, then dashboard).
8. **Contact banner (yellow)** — unchanged.
9. **About Us** — swap the 3 story photos: Join Us → **team-energy**, Our Team → **team-couch**, Agency of the Year → **award** (localized alt). **Insert the interactive `TeamMarquee` (real headshots)** as a "humans behind the numbers" band between the story cards and the StatGrid, with a `home.people` heading + `Meet the team` CTA. Keep StatGrid (count‑ups).
10. **Blog** — swap `office-10` → **space-arch** (Tre Kronor) and `office-12` → **data-desk** (media mix); keep the two ghost tiles. BlogCard alt = post title.
11. **Contact banner (lavender)** — unchanged.

---

## 3. Interaction layer (UX)

- **Hero pointer‑parallax (new):** whole collage tilts subtly toward the cursor; each of the 3 cards shifts by a depth multiplier (`0.4 / 0.8 / 1.2`, max ~10px, plus ≤1.5° rotate). Use framer‑motion `useMotionValue` + `useSpring`; keep the existing drop‑in entrance (opacity + y). **Disable** under `prefers-reduced-motion` and on coarse pointers (`matchMedia('(pointer: coarse)')`). rAF/spring‑driven, no layout thrash.
- **Existing, keep working:** interstitial scroll parallax (`ParallaxImage`), ServiceCard/CaseCard/BlogCard hover, `TeamMarquee` slide + hover‑to‑reveal (pauses on hover/focus, expands active card), StatGrid + DashboardMock scroll animations. All already reduced‑motion‑aware.
- No new scroll‑jacking. Lenis smooth scroll stays as configured.

---

## 4. Copy changes (Content) — with full FI/EN parity (Translator)

**Add** to `src/content/dictionary.ts` in **both** `fi` and `en`:

- `common.meetTeam` — EN `"Meet the team"` · FI `"Tutustu tiimiin"`
- `home.people.heading` — EN `"Meet the humans behind the numbers"` · FI `"Numeroiden takana on ihmisiä"`
- `home.people.body` — EN `"Fourteen permanent specialists, nearly all partners — the people who plan, buy and prove every euro of your media."` · FI `"Neljätoista vakituista asiantuntijaa, lähes kaikki partnereita — ihmiset, jotka suunnittelevat, ostavat ja todentavat jokaisen mediaeurosi."`
- `home.engine.photoCaption` — EN `"The team behind the Engine — built in‑house, not licensed."` · FI `"Enginen takana oleva tiimi — rakennettu talon sisällä, ei lisensoitu."`

**Fix (parity bug):** `home.engine.body` in the **fi** dict is currently English. Set FI to `"Älykäs markkinoinnin automaatio, joka yhdistää datan, tekoälyn ja monikanavaisen toteutuksen yhdeksi alustaksi."` (EN stays unchanged.)

**Interstitial caption:** keep `home.valuesCaption` (already localized and fits the lounge photo).

No other copy changes this round.

---

## 5. team.ts change

For each of the 17 members, change **only** the `photo` field from the `randomuser.me` placeholder to `"/images/team/<id>.webp"` (id already matches the object's `id`). Leave `selectedShot`, `role`, `bio` untouched. Do **not** invent roles.

---

## 6. SEO / performance

**`src/app/layout.tsx` (root metadata):** add `metadataBase: new URL("https://norr3.fi")`, `openGraph` (type website, siteName "NØRR3", title, description, `images: ["/images/brand/og-image.jpg"]` 1200×630), `twitter` (`card: "summary_large_image"`, same image), `robots: { index: true, follow: true }`, keep Host Grotesk font.

**`src/app/[locale]/layout.tsx` `generateMetadata`:** add `alternates: { canonical: `/${locale}`, languages: { "fi-FI": "/fi", "en-US": "/en" } }`, and `openGraph.locale` (`fi_FI`/`en_US`) + `openGraph.url = `https://norr3.fi/${locale}``. Reuse dict title/description.

**JSON‑LD (homepage `page.tsx`):** inject `<script type="application/ld+json">` with `@graph` of:
- `Organization` — name `"NØRR3"`, alternateName `"NORR3 Oy"`, url `https://norr3.fi`, `logo https://norr3.fi/wp-content/uploads/2025/02/Logo-01.png`, description (dict.meta.description), `foundingDate "2019"`, `address` (PostalAddress: Pursimiehenkatu 26 C, 00150 Helsinki, FI), `email "info@norr3.fi"`, `telephone "+358 46 8100 118"`. Do **not** fabricate social URLs (omit `sameAs`).
- `WebSite` — url, name `"NØRR3"`, description, `inLanguage: ["fi","en"]`.

**Alt text:** hero collage photos, interstitial, engine photo, about photos → localized descriptive alt from §1 (pass from `page.tsx`/props since those components need locale‑aware strings). `BlogCard` → `alt={content.title}` when a photo exists. `TeamMarquee` → `alt={member.name}` on the first (visible) copy, `alt=""` on the aria‑hidden duplicate. `CaseCard` already uses client name.

**LCP:** hero primary photo (`hero-human`) → `loading="eager"` + `fetchPriority="high"`; other hero photos and everything below the fold stay `loading="lazy"`.

**CLS:** all new images sit in fixed‑height or `aspect-[…]` wrappers (hero collage container is fixed‑height; interstitial `max-h`; about/blog `aspect-[4/3]`/`[5/4]`; team tiles fixed w/h; engine photo card `aspect-[3/2]`). Add explicit `width`/`height` on the engine companion `<img>` (1500×1000) to be safe.

---

## 7. Implementation batches (for Claude Code) & verification

Run `npm run build` after each batch; fix any type/lint errors before moving on.

- **Batch A — data & copy:** `dictionary.ts` (add keys + FI engine.body fix), `team.ts` (17 photo paths). Build.
- **Batch B — hero & interstitial:** `HeroCollage.tsx` (real photos, localized alt props, pointer‑parallax, LCP priority), `page.tsx` hero wiring, `PhotoInterstitial.tsx` (+`alt` prop) + `page.tsx` interstitial → `space-lounge`. Build.
- **Batch C — engine, about, team band, blog:** `page.tsx` engine two‑column + companion photo/caption; `page.tsx` about 3‑photo swap + insert `TeamMarquee` + `home.people` heading + Meet‑the‑team CTA; `TeamMarquee.tsx` alt text; `insights.ts` two image swaps; `BlogCard.tsx` alt. Build.
- **Batch D — SEO:** root + `[locale]` metadata, homepage JSON‑LD. Build.

**Then:** `git add -A` → detailed commit → `git push origin main`.

---

## 8. Guardrails
- Host Grotesk only; brand palette only (Purple #7A06D3, Violet #5517A7, Yellow #F6FF4F, Lime #DAEB45); cards 25px radius / 36px pad; Material Symbols outlined. No new colors/fonts.
- Homepage only — do not restructure other routes (team.ts/insights.ts edits are shared but only swap image paths/photos, which only improves other pages).
- Keep the Next.js 16 AGENTS.md block intact; follow the in‑repo Next docs.
- WebP everywhere; lazy‑load below the fold; reserve dimensions; respect reduced motion.
