# Dark mode — remaining pages (round 2)

Dark mode already works on the HOME page + shared chrome (nav, footer, announcement, cookie). The `.dark` class + tokens are already set up in globals.css (`@custom-variant dark`, `--background:#0e0b16`, `--foreground:#f9f8f6`; brand accent tokens purple/violet/yellow/lime unchanged). The ThemeToggle already flips `.dark` on <html> and persists.

TASK: extend dark-mode `dark:` variants to ALL the remaining pages and their page-specific components, so the whole site looks correct in dark. Ground everything in the NØRR3 brand dark theme (norr3-ui §8): near-black violet base, off-white text, violet-tinted elevated surfaces, purple/violet accents KEPT, white logo on dark, yellow/lime accents kept for their sparing accent role.

## Brand-derived dark conventions (apply consistently — match what home already uses)
- Page/section light backgrounds (`bg-white`, `bg-offwhite`, no bg) → dark base (inherit body `--background` #0e0b16, or `dark:bg-[#0e0b16]`).
- Light-purple / pastel-purple tinted sections & cards (`bg-light-purple`, `bg-pastel-purple`, `bg-pastel-purple/40`, `bg-grey`) → violet-tinted dark surface: `dark:bg-white/[0.04]` with `dark:border dark:border-white/10` (elevated card feel), or `dark:bg-violet/15` for larger bands. Match how home's ContactBanner/Engine band were handled.
- Body text `text-ink` / `text-ink/80` / `text-ink/70` → `dark:text-white` / `dark:text-white/80` / `dark:text-white/70`.
- Headings `text-ink` → `dark:text-white`.
- Borders `border-black/5`, `border-black/10`, `border-ink/10` → `dark:border-white/10`.
- Black primary pill buttons (`bg-ink text-white`) → `dark:bg-purple dark:hover:bg-violet` (they vanish on the near-black base otherwise — same rule used on home for the nav CTA / PillButton / cookie Accept).
- Outlined/secondary buttons (black or purple border) → `dark:border-white/30 dark:text-white` (keep purple-border variants purple).
- Purple text/links (`text-purple`) → keep (purple pops on dark) — no change needed, but ensure sufficient contrast; if a purple sits on a dark violet surface and looks muddy, lighten to `dark:text-light-purple`.
- Yellow/lime accent tiles & index numbers → keep as-is (designed to pop on dark).
- Images/photos → unchanged.
- Any embedded dark UI (the Engine dashboard mock) is already dark — leave it.

## Pages + their components to cover
Add `dark:` variants everywhere these hardcode light colors. READ each file first, then patch.

### Pages
- src/app/[locale]/services/page.tsx
- src/app/[locale]/engine/page.tsx
- src/app/[locale]/cases/page.tsx
- src/app/[locale]/cases/[slug]/page.tsx
- src/app/[locale]/team/page.tsx
- src/app/[locale]/insights/page.tsx
- src/app/[locale]/insights/[slug]/page.tsx
- src/app/[locale]/contact/page.tsx

### Page-specific components (grep src/components for light-color usage and add dark: variants)
Likely includes (verify by reading): TeamMemberCard, ServiceCard (may already be partly done — home uses it), CaseCard, BlogCard, StatGrid, SectionHeader, PillButton, ContactBanner, ContactForm, PhotoInterstitial, HighlightsBand, DashboardMock (leave its internal dark UI), TeamMarquee, any "band"/section wrappers on the interior pages, the cases/[slug] editorial hero + pull-quote, insights/[slug] article prose (make prose readable on dark: body text off-white, but keep it comfortable).

IMPORTANT for the CONTACT FORM: inputs/textareas likely have `bg-white`, `border-*`, `text-ink`, focus rings. Give them dark variants: `dark:bg-white/5 dark:border-white/15 dark:text-white dark:placeholder-white/40`, keep the purple focus ring. Labels → `dark:text-white/80`.

IMPORTANT for the insights article prose (insights/[slug]): the readable body copy must be off-white on dark, with the lead paragraph and any pull-quotes adjusted. Links stay purple (or `dark:text-light-purple` if low-contrast).

## Method
- For each file: read it, identify every hardcoded light color (bg-white, bg-offwhite, bg-light-purple, bg-pastel-purple, bg-grey, text-ink*, border-black/*, border-ink/*, bg-ink buttons), and add the corresponding `dark:` variant per the conventions above. Do NOT change light-mode classes — only ADD `dark:` variants.
- Be thorough but consistent; reuse the exact dark surface values home uses so the whole site feels coherent.
- Reduced-motion / other behavior: untouched.

## Verify
- `npm run build` must pass clean.
- Light mode must be UNCHANGED across all pages (only additive dark: variants).
- Spot-check by grepping that each interior page + its cards now have dark: variants on their section backgrounds, headings, body text, and buttons.
- Do NOT commit. Build green and report: files changed + a short list of any component where the dark treatment was non-obvious (e.g. contact form, article prose).
