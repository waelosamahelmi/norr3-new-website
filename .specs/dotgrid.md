# DotGrid interactive background behind the home hero

Add an interactive canvas dot-grid background behind the homepage hero section, using NØRR3 colors at low opacity.

## Create: src/components/DotGrid.tsx  ("use client")
Port this exact interaction (a canvas dot grid where pointer movement brightens+enlarges nearby dots with eased falloff). Reference behavior + tuned NØRR3 values:

- SPACING = 22 (px between dots)
- RADIUS = 150 (px pointer influence)
- Resting dot: rgb 122,6,211 (NØRR3 purple #7A06D3) at alpha 0.07
- Highlight (peak) dot: same purple 122,6,211 at alpha 0.55
- Dot draws as a filled square, size 1 + b*1.6 px
- Ease: tgt = dist2 < RADIUS^2 ? Math.pow(1 - sqrt(dist2)/RADIUS, 1.5) : 0
- Brightness follow: d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b); clamp tiny to 0
- alpha = baseAlpha + (peakAlpha - baseAlpha) * d.b

Implementation requirements:
- Absolutely positioned canvas filling its parent: `className="pointer-events-none absolute inset-0 h-full w-full"` (pointer-events-none so it never blocks clicks on hero content/CTA).
- Track the pointer from window mousemove/touchmove (passive), convert to canvas-local coords via getBoundingClientRect; clear pointer on mouseleave/touchend so the grid settles.
- devicePixelRatio-aware sizing; ResizeObserver on the parent to rebuild the grid on resize.
- requestAnimationFrame loop; cancel on unmount; StrictMode-safe cleanup (remove listeners, disconnect RO, cancel rAF).
- prefers-reduced-motion: render the static resting grid once (no rAF loop, no pointer reactivity) — draw all dots at baseAlpha and return.
- Accept optional props to tune later but default to the values above:
  ```ts
  { spacing?, radius?, baseAlpha?, peakAlpha?, dotRgb?, className? }
  ```
  Default dotRgb = "122,6,211", baseAlpha = 0.07, peakAlpha = 0.55.
- No text, no label, no theme-color logic — ONLY the animated dot background. Colors are fixed NØRR3 purple (do not read dark mode / card theme).
- No raw hex needed (rgb string is fine); this is decorative canvas.

## Wire into the hero: src/app/[locale]/page.tsx
The hero is the first `<Container className="pb-14 pt-10 lg:pt-16">` holding `<HomeHero .../>` + the Reveal with body/CTA. Wrap the hero so the DotGrid sits BEHIND the content:

- Put a positioned wrapper `<section className="relative overflow-hidden">` around the hero Container (or add `relative` and place DotGrid as first child inside a relative wrapper).
- Render `<DotGrid />` as an absolutely-positioned first child of that wrapper (behind), then the existing `<Container>` hero content with `className` gaining `relative z-10` so it sits above the grid.
- The grid should span the hero area only (the hero section height), NOT the whole page. So the relative wrapper is just around the hero Container, and DotGrid fills it via absolute inset-0.
- Keep the JSON-LD script, LogoStrip, and everything else unchanged.

## Constraints
- Must not block interaction (pointer-events-none on canvas).
- Hero content (HomeHero, body, CTA) must remain fully visible and above the grid.
- `npm run build` must pass clean.
- SSR-safe: the canvas is a client component; the hero text/HomeHero still prerender normally.
- Do NOT commit; build green and report changed files.
