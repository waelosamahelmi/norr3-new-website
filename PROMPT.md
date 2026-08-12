# NØRR3 New Website — Build Prompt

**Purpose of this document:** hand this whole file to a coding agent (Claude Code) as the single source of truth for building the new norr3.fi. It fuses three things that currently live in three separate places — the Figma design ("Norr3 Shared" → Web Front / Web Team / Web Services / Web Cases), the brand strategy (Marbella Workshop deck), and the approved tone-of-voice copy — into one build spec, plus a concrete, opinionated animation/interaction direction so "well animated, effective, unique" doesn't stay vague.

Reference alongside this file: the `norr3-ui` skill / `Docs/BRAND_GUIDELINES.md` for exact hex/type/grid/component tokens. This prompt does not repeat every token value — it tells you what to build and how it should move; pull exact values from that doc.

---

## 1. What this site has to do

NØRR3 is repositioning from **challenger** to **Nordic opinion leader** — without losing the challenger edge that got it here. The current site (and most agency sites) reads as a services brochure. The new site has to read as proof that a media agency can out-build the AI/tech companies at their own game while still sounding like a Finnish challenger who says no when the media split looks dumb.

Concretely, the site must:
1. **Prove Technology** — not claim it. If the brand core says "advanced tools, models and AI built into how we plan, buy and prove media," the site's *own* build quality (motion, performance, an interactive product demo) is the first piece of evidence a visitor sees.
2. **Prove Attitude** — the copy is not allowed to be soft. Every claim needs a number attached. No "one of the best agencies."
3. **Speak to the C-suite, not just marketing managers** — per the brand strategy's shift from "Marketing manager relevance → C-suite relevance," language and framing should read as investment language (growth, ROI, competitive advantage), not agency language (channels, campaigns, creative).
4. **Carry the visual system already built** (Host Grotesk, the violet/purple palette, the pill-chip and numbered-card components) so the new site feels like the same company as the dashboard/product, not a rebrand.

### Brand core (this is the filter every page/section/animation decision runs through)
- **Attitude** — "Challenger by design. We never accept the inherited status quo of media."
- **Technology** — "Advanced tools, models and AI built into how we plan, buy and prove media."
- **Talent** — "Senior talent who can hold their own in any boardroom."

**Vision:** *Pohjoismaiden innovatiivisin mediatoimisto.* / "The most innovative media agency in the Nordics."
**Mission:** *Autamme pohjoismaisia edelläkävijäyrityksiä muuttamaan mediainvestoinnit kasvuksi ja kilpailueduksi.* / "We help progressive Nordic companies turn media investments into growth and competitive advantage."
**Values:** Yhteistyö (Collaboration) · Ilo (Joy) · Ketteryys (Agility) · Tasapaino (Balance)
**Slogan (approved, matches the corrected TOV hero copy — see §3):** *"Uusi tapa kasvaa."* / **"A new way to grow."**

Do not use the other slogan candidates from the strategy deck ("Attitude. Technology. Talent.", "Data. Media. Kasvu. NORR3.", etc.) as the primary hero line — they're positioning language for internal/pitch use. "A new way to grow" is the one that was actually run through tone-of-voice correction and approved for the site hero.

---

## 2. Tone of voice — the rules, not just the vocabulary

These are load-bearing. A generic "we're an innovative agency" paragraph anywhere on this site is a bug, not a style choice.

1. **Evidence over adjectives.** Never write an unprovable superlative. Instead of "one of the best agencies," write the provable version: "Agency of the year — shortlisted three years running." Every hero/section claim should resolve to a number, a named client result, or a quote.
2. **The numeric-triad rhythm.** This is NØRR3's signature copy pattern — three short clauses, escalating or contrasting, ending on the sharpest one. Real examples already approved:
   - *"Yksi alusta. 200+ kanavaa. Nolla turhaa klikkiä."* / "One platform. 200+ channels. Zero wasted clicks."
   - *"150 toimistoa. 1 brändi. 0 manuaalia."* (Kiinteistömaailma case line)
   - *"Yksi tiimi. Neljä palvelua. Nolla välikäsiä."*
   Use this pattern for section sub-headers and case-study pull-quotes throughout — it's a recognizable NØRR3 "sound," not a one-off line, so it should recur 3-5 times across the site, not just in the hero.
3. **Challenger edge, stated plainly.** *"Mediatoimisto, joka ei pelkää sanoa ei."* / "A media agency that isn't afraid to say no." / "We don't sell what we don't believe in. If the media split looks dumb, we say so. Even when money is tight." This voice belongs in the Services/Engine pages, not just brand copy — e.g. a pricing or process section is a good place for a "we'll tell you when not to spend" aside.
4. **Verb-first, short CTAs.** *"Briiffaa AI:n avulla"* / "Brief with AI" is the model: action verb, no filler. Avoid "Learn more," "Get started," "Discover" — every CTA should name the actual next action ("See the Engine," "Book a call," "Read the case").
5. **Direct address ("sinä"/"you"), especially in hiring/careers.** *"3 paikkaa. Sinun nimesi tulee?"* — the Team/careers page should talk to "you," not about "candidates."
6. **Warmth is real but minority-share.** The chatbot ("Mira": *"Moi! Mira tässä — tarvitsetko apua?"*) and the newsletter can be casual, even use emoji — but that register stays confined to those two surfaces. Don't let it bleed into service/product copy, which stays precise and evidence-led.
7. **Radical candor, no algorithmic ghosting (careers specifically).** *"We read every application by hand... we always reply."* State this plainly on the careers section — it's a real differentiator, not filler.
8. **Locale correctness.** FI uses comma decimals, EN uses period decimals. Don't let a shared component silently reuse the wrong locale's number formatting.
9. **"Knowledge speaks, wisdom listens."** House philosophy for how the brand talks: if a line needs explaining, cut it. Test every hero/section headline against this — if it needs a sub-line to clarify what it means, the headline is wrong, not the sub-line.

### Approved page copy to build from (FI / EN — use the corrected/final versions below, not earlier drafts)

**Home hero**
- FI: *"Uusi tapa kasvaa."*
- EN: **"A new way to grow."**
- This is also the Figma hero pattern: a two-line headline with an underscore immediately before the key word (Figma shows *"A New Way to `_Grow`"* on Web Front, and the same device recurs on Services: *"Insight and `_Strategy`"*). Treat the underscore-accent-word as a reusable typographic component — see §5.

**Home — Marketing Engine teaser / product section**
- Lead with the platform triad line: *"Yksi alusta. 200+ kanavaa. Nolla turhaa klikkiä."* / "One platform. 200+ channels. Zero wasted clicks."
- Pair with "Briiffaa AI:n avulla" / "Brief with AI" as the CTA into the product demo.

**Marketing Engine page — case proof**
- Kiinteistömaailma case pull-quote: *"150 toimistoa. 1 brändi. 0 manuaalia."* — use this as a large pull-quote/stat treatment, not a paragraph.

**Cases**
- Flow Festival, with real stats — use verbatim, don't round or soften: **27,5 miljoonaa mainosnäyttöä** (27.5 million ad impressions), **5,5 miljoonaa festivaalikävijää** reached (5.5 million festival-goers). Structure per the Figma case-detail pattern: numbered narrative sections (1. Tavoitteet / Objectives → 2. Ratkaisu / Solution → results), not a single essay block.

**Team / careers**
- Hero direct-address line: *"3 paikkaa. Sinun nimesi tulee?"* / a "3 open roles — is your name next?" register.
- Candor line for the hiring-process section: *"We read every application by hand... we always reply."*

**Footer**
- Tagline slot: "NORR3 — Making Media a Growth Engine" (existing tagline) — decide with the user whether this is replaced by "A new way to grow." for consistency with the new hero; recommend replacing it, since running two different taglines on one site undercuts the "knowledge speaks, wisdom listens" precision principle.

**Chatbot widget**
- Persona "Mira": *"Moi! Mira tästä — tarvitsetko apua?"* — this is the one place on the site where tone can be casual/emoji-friendly, per §2.6 above.

For any page/section not listed here verbatim (Insights, Contact form copy, secondary nav pages), write new copy following the 9 rules above rather than inventing a different voice — run every new headline through the "does the triad rhythm or a number fit here" test before finalizing it.

---

## 3. Site structure (from the Figma "Norr3 Shared" file — Web Front / Web Services / Web Team / Web Cases)

Global nav pattern, confirmed consistent across every page examined: **Services · Engine · Cases · Team · Insights · Contact**, with a small violet dot indicator next to whichever nav item matches the current page (build this as a real active-state indicator, not decorative — it should animate in on route change, not just snap). Logo left, EN/FI language toggle right.

### Home ("Web Front")
- Hero: two-line headline with the underscore-accent word (*"A new way to `_grow`."*), sub-line, primary CTA pill button.
2. **Product/Marketing Engine section** — a real embedded product-demo visual (dashboard chart/stat cards, matching the actual product's dark-navy KPI-card look from `BRAND_GUIDELINES.md` §8), not a generic screenshot-in-a-browser-frame. This is the single most important trust-building element on the page — it has to look and move like the product genuinely runs on live data.
3. **Category/media pill row** — horizontally scrollable chips (Vision, Streaming, Social Media, Radio, Distribution, …), each with an icon. This exact component reappears on the Services page — build it once as a shared component.
4. Services grid, numbered feature cards (icon tile + number + short label — the icon-tile spec from `BRAND_GUIDELINES.md` §5).
5. Photo/team interstitial.
6. Values pills (Yhteistyö · Ilo · Ketteryys · Tasapaino).
7. Cases preview strip.
8. Footer.

### Services ("Web Services")
- Hero: pill badge "SERVICES," headline *"Insight and `_Strategy`,"* body copy (FI, per TOV register — evidence-led, not generic), CTA "Contact us."
- Repeats the category-pill component from Home, now as a primary content section (media-groups breakdown) rather than a teaser.
- Numbered feature-card grid (same icon-tile component as Home) detailing service lines.
- A simple text feature list (lighter-weight variant, for sub-services or deliverables under each main service).
- Related Cases section — reuses the case-card component (see Cases below).

### Marketing Engine / product page
- This is where the "Yksi alusta. 200+ kanavaa. Nolla turhaa klikkiä." triad and the "Briiffaa AI:n avulla" CTA live, per TOV.
- Needs a real interactive product walkthrough moment — this is the highest-leverage place in the whole site to prove the Technology brand pillar (see §4 "signature moment" below).
- Case proof section with the Kiinteistömaailma "150 toimistoa. 1 brändi. 0 manuaalia." pull-quote as a large stat/quote treatment.

### Team
- Hero + culture section ("Periaate 02" / culture principle callouts).
- Careers: direct-address hero (*"3 paikkaa. Sinun nimesi tulee?"*), radical-candor hiring copy, open-roles list.

### Cases
- **Listing page** ("Web Cases Koontisivu") — grid of case cards; each card: client logo/name, one-line result stat, category tag.
- **Case detail** (e.g. "Web Cases: Terveystalo") — numbered narrative structure: 1. Tavoitteet (Objectives) → 2. Ratkaisu (Solution) → Results/stats block, hero image, related-cases footer. Use the Flow Festival stats (27.5M impressions, 5.5M festival-goers reached) as the model for how a results block should read: big numbers, no adjectives around them.

### Insights
- Not yet explored in Figma in detail — build as an editorial/blog listing + article template using the same card and typography system; don't invent new components for it.

### Contact
- Simple, high-intent: direct CTA, contact form, no filler copy. This is a "verb-first CTA" page — make the primary button say the actual action ("Book a call"), not "Submit."

---

## 4. Animation & interaction direction (concrete, not vibes)

The instruction was "nice, well animated, in a very effective and unique way." Here is what that means in implementable terms, built around the brand core (Attitude/Technology/Talent) rather than generic scroll-fade-ins.

### Motion principles (apply everywhere, before any specific effect)
1. **Motion communicates confidence, not decoration.** NØRR3's attitude is "challenger who doesn't hedge" — animation should be decisive: fast in, considered pause, fast out. Avoid soft, slow, "premium lifestyle brand" easing (long 800ms+ fades) — that's the wrong brand. Use snappy, slightly overshooting eases (`cubic-bezier(0.16, 1, 0.3, 1)` — "expo-out" family) for entrances, 150-300ms for most UI feedback, 400-600ms for section-level reveals. Nothing should feel lazy.
2. **Numbers earn special treatment.** Since the brand voice's entire currency is provable numbers (27.5M impressions, 200+ channels, "150 toimistoa. 1 brändi. 0 manuaalia."), every stat on the site should **count up** from 0 on scroll-into-view, not just fade in. This is the single highest-ROI animation because it's the exact place brand voice and motion reinforce each other — a static number undersells the brand's own core argument.
3. **The underscore-accent word is a live element, not static styling.** The hero pattern is "A new way to `_grow`." Build the underscore itself as an animating cursor/caret — it should blink or extend like a text-input caret before the accent word types/reveals in, then settle as a static underline. This turns the brand's own typographic signature into the first interactive/kinetic moment a visitor sees, and it's specific to NØRR3 rather than a generic reveal-on-scroll.
4. **Respect `prefers-reduced-motion`.** Every effect below needs a reduced-motion fallback that keeps the content instantly legible (opacity/position final-state, no counting, no parallax) — non-negotiable, not optional polish.

### The one signature interaction moment (build this properly — it's the differentiator)
Pick **one** of these as the site's centerpiece, on the Marketing Engine/product page, and make it genuinely interactive (not a looping video):
- **A live-feeling channel/media mix simulator**: user drags a budget slider or toggles channels (Meta, TikTok, Radio, PDOOH, …) from the category-pill component, and a chart (matching the real dashboard's stat-card/bar-chart visual language) re-renders in real time to show projected reach/spend split. This directly dramatizes "Yksi alusta. 200+ kanavaa." and the Technology brand pillar — a visitor *does* the thing the product does, in miniature, in the browser.
- If a full simulator is out of scope for v1, the fallback is a **scroll-scrubbed product demo**: as the user scrolls through the product section, the embedded dashboard visual advances through 3-4 real states (briefing → media plan generated → live campaign → results dashboard) keyed to scroll position, so the product demo feels driven by the visitor rather than autoplaying at them.

Either way: this section should be the one place motion is tied to user *input*, not just scroll position, because that's what separates "well animated" from "actually effective and unique." Everything else on the site can be well-crafted scroll-triggered motion; this one section should feel like software, because it's selling software-grade capability.

### Section-by-section reveal choreography
- **Hero**: caret/underscore reveal on the accent word (see above) → headline settles → sub-line and CTA stagger in 80-100ms apart → nav fades in last (it's chrome, not content — never let nav steal the first-paint moment from the headline).
- **Stat/number sections** (case results, "27,5 miljoonaa," "200+ kanavaa"): count-up on scroll-into-view, with the digits sized/weighted per the existing 110px stat-number type scale — the number itself is the visual, not a supporting label.
- **Category/media pill row**: this is already a scroll-carousel in Figma — give it momentum-based drag/inertia scrolling (not a stepped/paginated carousel), and have each pill's icon do a small scale/color pop on hover — reinforces "many channels, all live," matching the "200+ channels" claim kinetically.
- **Numbered feature cards**: stagger in by their number (card 01 before 02 before 03) with a short (60-80ms) delay between — the numbering is already in the design, motion should make the sequence *felt*, not just printed.
- **Case cards (listing page)**: hover state does a subtle lift + the result-stat count-up triggers on hover, not just on page-load scroll — rewards exploration.
- **Triad-rhythm copy lines** (*"Yksi alusta. 200+ kanavaa. Nolla turhaa klikkiä."*): reveal the three clauses sequentially, each with its own short beat, so the copy's own rhythm (short/short/short-and-sharpest) is mirrored in timing — the last clause should land with slightly more emphasis (scale or weight shift) since it's written as the punchline.
- **Page transitions**: given the violet/purple palette, a fast (200-250ms) wipe/fade using the brand's Purple/Violet as a transition color between routes reinforces brand presence during navigation — avoid a generic white flash between pages.

### Explicitly avoid
- Looping decorative background animation with no relationship to content (particles, generic gradient blobs) — it reads as template, not "unique," and works against the evidence-first tone of voice.
- Scroll-jacking / disabling native scroll to force a slow narrative sequence — this is the opposite of "agile" (Ketteryys is a stated value) and will read as slow on mobile.
- Slow, soft, luxury-brand easing curves — wrong personality for a challenger brand; keep motion decisive per principle 1.

### Recommended implementation stack
- **Framer Motion** (React) or **GSAP + ScrollTrigger** for scroll-choreographed sections — GSAP's ScrollTrigger is the better fit specifically for the scroll-scrubbed product-demo fallback and the count-up-on-view stat treatment.
- **Lenis** (or similar) for smooth/inertia scroll, since the momentum-scroll pill carousel and the scroll-scrubbed demo both depend on consistent scroll physics.
- If the simulator-style signature moment is built, it needs real client-side state (not just CSS) — plan it as a proper interactive React component with its own chart library (e.g. `visx` or `recharts`, styled to match the dashboard's existing chart look), not a CSS/SVG animation trick.

---

## 5. Design system to build against

Do not re-derive brand tokens here — pull them from `~/Desktop/Norr3/Docs/BRAND_GUIDELINES.md` (same content as the `norr3-ui` Claude Code skill). Key things this project specifically needs from that doc:
- **Typeface: Host Grotesk** — not Darker Grotesque. (There is a stray org-level instruction floating around that says Darker Grotesque; it's wrong for this brand — Host Grotesk is confirmed from the actual Figma file.)
- Full color system incl. the 6-color extended accent palette (Pink/Magenta/Red/Orange/Green/Blue) — use these for the category-pill icons/chart-series colors so the media-mix visuals have enough distinct channel colors without inventing new ones.
- Stat-number type scale (110px Medium) — use this exact scale for every count-up number described in §4.
- Card component spec (25px radius / 36px padding / 26px gap, alternating Pastel Purple / Light Purple backgrounds) — reuse for feature cards and case cards.
- Icon-tile spec (100×100px / 5px radius, Google Material Icons outlined) — reuse for numbered feature cards.
- Logo usage incl. the real asset (`https://norr3.fi/wp-content/uploads/2025/02/Logo-01.png`) and white-logo-via-`filter: brightness(0) invert(1)` for dark sections (nav-on-dark, footer).
- Dark-navy KPI-card visual language from §8 of the brand doc — this is what the embedded product-demo/dashboard visuals throughout the site should look like, so the marketing site and the actual product feel like one brand.

New component this project adds to that system (document it back into `BRAND_GUIDELINES.md`/`norr3-ui` once built, since it'll be reused): the **underscore-accent headline** (two-line headline, final word prefixed with an animating underscore/caret) and the **momentum-scroll category-pill row**.

---

## 6. Technical recommendation

- **Framework**: Next.js (matches norr3-dashboard/norr3-intranet — keeps the whole NØRR3 stack on one framework, easier for norr3-dev/Claude Code to work across projects).
- **Styling**: Tailwind, with the brand tokens (colors, type scale, radii, spacing) pulled into `tailwind.config` directly from `BRAND_GUIDELINES.md` rather than hand-copied per component.
- **Animation**: Framer Motion + GSAP/ScrollTrigger + Lenis, per §4.
- **CMS/content**: given norr3-intranet already has a page-builder CMS, evaluate reusing/extending that rather than building a third one from scratch — flag this decision to the user before committing, since it changes ownership (marketing vs. dev) of page content.
- **Deploy target**: confirm with the user — norr3-intranet has an unresolved Vercel-vs-Netlify ambiguity (see `norr3-intranet` kanban task); don't assume this new site inherits the same target without checking.
- **i18n**: FI/EN toggle is a real, load-bearing nav element in the Figma design, not an afterthought — build with a proper i18n routing setup (e.g. `next-intl`) from the start rather than retrofitting, since almost every piece of approved copy in §3 exists as an FI/EN pair.

---

## 7. What to hand back before writing code

Before scaffolding, confirm with the user:
1. Whether the footer tagline should be unified to "A new way to grow." (recommended) or keep "Making Media a Growth Engine" alongside it.
2. Whether the Marketing Engine signature interaction is the full drag-and-simulate media-mix tool or the lighter scroll-scrubbed demo fallback (§4) — this materially changes scope/timeline.
3. CMS approach (extend norr3-intranet's builder vs. new) and deploy target — both open questions above.
4. Whether Insights/blog needs real content migration from an existing source or is being seeded fresh.

Everything else in this document (structure, copy, components, motion direction) is specific enough to start building against directly.
