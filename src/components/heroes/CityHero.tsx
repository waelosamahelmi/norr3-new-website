"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useMotionAllowed } from "@/components/heroes/useMotionAllowed";
import type { Locale } from "@/i18n/config";

/**
 * Cityscape hero — a layered Helsinki skyline parallax with a magnetic dot
 * grid and the big "A new way to grow." title floating between building layers.
 *
 * Faithful port of the user's hand-built hero/index.html, adapted to React +
 * Next 16 with NØRR3 brand content. The background is dark (purple night
 * cityscape) so the nav always renders its dark-mode variant on this hero.
 *
 * Decorative layers use data-speed for the scroll parallax; the magnetic dot
 * canvas sits behind the buildings. Reduced-motion users get static layers.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Magnetic dot grid (ported verbatim from the user's JS) ──────────────
const SPACING = 22;
const DOT_RADIUS = 1.5;
const INFLUENCE_R = 180;
const SPRING_K = 0.055;
const DAMPING = 0.11;
const MAG_STRENGTH = 16;
const LERP_FACTOR = 0.06;
const MOUSE_LERP = 0.14;

type Dot = { restX: number; restY: number; x: number; y: number; vx: number; vy: number };

function MagneticDots() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionAllowed = useMotionAllowed();

  useEffect(() => {
    if (!motionAllowed) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouse = { x: 0, y: 0, active: false };
    let hoverStr = 0;
    let smoothMx = -99999;
    let smoothMy = -99999;
    let dots: Dot[] = [];
    let cw = 0, ch = 0, dpr = 1;
    let rafId = 0;
    let alive = true;

    function build() {
      dpr = window.devicePixelRatio || 1;
      const rect = wrap!.getBoundingClientRect();
      cw = rect.width;
      ch = rect.height;
      if (!cw || !ch) return;
      canvas!.width = Math.round(cw * dpr);
      canvas!.height = Math.round(ch * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(cw / SPACING) + 1;
      const rows = Math.ceil(ch / SPACING) + 1;
      const ox = (cw % SPACING) / 2;
      const oy = (ch % SPACING) / 2;
      const prev = new Map<string, Dot>();
      for (const d of dots) prev.set(d.restX + "," + d.restY, d);
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rx = ox + c * SPACING;
          const ry = oy + r * SPACING;
          const key = rx + "," + ry;
          if (prev.has(key)) dots.push(prev.get(key)!);
          else dots.push({ restX: rx, restY: ry, x: rx, y: ry, vx: 0, vy: 0 });
        }
      }
    }

    function frame() {
      if (!alive) return;
      const targetStr = mouse.active ? 1 : 0;
      hoverStr += (targetStr - hoverStr) * LERP_FACTOR;
      if (mouse.active) {
        if (smoothMx === -99999) { smoothMx = mouse.x; smoothMy = mouse.y; }
        smoothMx += (mouse.x - smoothMx) * MOUSE_LERP;
        smoothMy += (mouse.y - smoothMy) * MOUSE_LERP;
      } else {
        smoothMx = -99999;
        smoothMy = -99999;
      }
      const r2 = INFLUENCE_R * INFLUENCE_R;
      ctx!.clearRect(0, 0, cw, ch);
      ctx!.fillStyle = "rgba(255,255,255,0.28)";
      for (const d of dots) {
        if (hoverStr > 0.001) {
          const dx = d.x - smoothMx;
          const dy = d.y - smoothMy;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < r2 && dist2 > 0.01) {
            const dist = Math.sqrt(dist2);
            const t = 1 - dist / INFLUENCE_R;
            const force = t * t * MAG_STRENGTH * hoverStr;
            d.vx += (-dx / dist) * force;
            d.vy += (-dy / dist) * force;
          }
        }
        d.vx += (d.restX - d.x) * SPRING_K;
        d.vy += (d.restY - d.y) * SPRING_K;
        d.vx *= (1 - DAMPING);
        d.vy *= (1 - DAMPING);
        d.x += d.vx;
        d.y += d.vy;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx!.fill();
      }
      rafId = requestAnimationFrame(frame);
    }

    function updateMouse(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
    }

    const onMouseMove = (e: MouseEvent) => { mouse.active = true; updateMouse(e.clientX, e.clientY); };
    const onMouseLeave = () => { mouse.active = false; };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) { mouse.active = true; updateMouse(t.clientX, t.clientY); }
    };
    const onTouchEnd = () => { mouse.active = false; };

    wrap.addEventListener("mousemove", onMouseMove);
    wrap.addEventListener("mouseleave", onMouseLeave);
    wrap.addEventListener("touchmove", onTouchMove, { passive: true });
    wrap.addEventListener("touchend", onTouchEnd);

    build();
    frame();
    const ro = new ResizeObserver(build);
    ro.observe(wrap);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      wrap.removeEventListener("mousemove", onMouseMove);
      wrap.removeEventListener("mouseleave", onMouseLeave);
      wrap.removeEventListener("touchmove", onTouchMove);
      wrap.removeEventListener("touchend", onTouchEnd);
    };
  }, [motionAllowed]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-x-0 bottom-0 top-auto h-[135%]"
      style={{ zIndex: 2 }}
    >
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
    </div>
  );
}

// ─── Parallax layers ──────────────────────────────────────────────────────
const LAYERS: { src: string; speed: number; z: number; className?: string }[] = [
  { src: "/images/hero-cityscape/bg.webp", speed: 0, z: 0, className: "mix-blend-screen" },
  { src: "/images/hero-cityscape/cathedral.webp", speed: -0.15, z: 1 },
  { src: "/images/hero-cityscape/buildings2.webp", speed: 0.28, z: 2 },
  { src: "/images/hero-cityscape/buildings.webp", speed: 0.48, z: 4 },
];

const TITLE_SPEED = -0.36;

// ─── Main component ───────────────────────────────────────────────────────
export function CityHero({ locale }: { locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);
  const motionAllowed = useMotionAllowed();
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Cycling accent word — same Plan → Act → Grow as the HomeHero
  const CYCLE = locale === "fi"
    ? ["Suunnittele", "Toimi", "Kasva"]
    : ["Plan", "Act", "Grow"];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    if (!motionAllowed) return;
    const interval = setInterval(() => {
      setWordIdx((i) => (i + 1) % CYCLE.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [motionAllowed, CYCLE]);

  // NØRR3-adapted copy
  const content = useMemo(() => {
    if (locale === "fi") {
      return {
        eyebrow: "Mediaa kasvun moottorina",
        titlePrefix: "Uusi tapa",
        body: "Yhdistämme haastajan asenteen, viimeisimmän teknologian ja osaamisen — jokaisella eurolla mitattavaa tulosta.",
        cta: "Tutustu toimintaan",
      };
    }
    return {
      eyebrow: "Making media a growth engine",
      titlePrefix: "A new way to",
      body: "We combine a challenger attitude, the latest technology and deep expertise — turning every euro of media into measurable growth.",
      cta: "See how we work",
    };
  }, [locale]);

  // Scroll parallax
  useEffect(() => {
    if (!motionAllowed) return;
    const hero = heroRef.current;
    if (!hero) return;
    let raf = 0;
    let targetScroll = 0;
    let currentScroll = 0;

    function onScroll() {
      targetScroll = Math.min(window.scrollY, hero!.offsetHeight);
      if (!raf) raf = requestAnimationFrame(update);
    }

    function update() {
      raf = 0;
      currentScroll += (targetScroll - currentScroll) * 0.14;
      const s = currentScroll;
      for (const ref of layerRefs.current) {
        if (!ref) continue;
        const speed = parseFloat(ref.dataset.speed || "0");
        ref.style.transform = `translate3d(0,${(-s * speed).toFixed(2)}px,0)`;
      }
      if (titleRef.current) {
        titleRef.current.style.transform = `translate3d(0,${(-s * TITLE_SPEED).toFixed(2)}px,0)`;
      }
      if (Math.abs(targetScroll - currentScroll) > 0.1) {
        raf = requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [motionAllowed]);

  return (
    <section
      ref={heroRef}
      data-city-hero
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-purple"
      style={{ isolation: "isolate", marginTop: "-44px" }}
    >
      {/* Dark gradient overlay (top + bottom) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 5, background: "linear-gradient(180deg, rgba(8,7,15,0.22), transparent 45%, rgba(8,7,15,0.66))" }}
      />

      {/* Parallax image layers */}
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          ref={(el) => { layerRefs.current[i] = el; }}
          data-speed={layer.speed}
          className={`absolute inset-0 will-change-transform ${layer.className || ""}`}
          style={{ zIndex: layer.z, pointerEvents: "none" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={layer.src}
            alt=""
            className="h-full w-full"
            style={{
              objectFit: "cover",
              objectPosition: i === LAYERS.length - 1 ? "center bottom" : "center center",
            }}
            loading="eager"
            decoding="async"
            aria-hidden
          />
        </div>
      ))}

      {/* Magnetic dot grid */}
      <MagneticDots />

      {/* Title floating between layers — cycles Plan → Act → Grow */}
      <h1
        ref={titleRef}
        data-speed={TITLE_SPEED}
        className="absolute inset-0 flex flex-col items-center justify-center text-center font-medium leading-[0.88] tracking-[-0.06em] text-white will-change-transform"
        style={{ zIndex: 3, fontSize: "clamp(2rem, 9vw, 9rem)", padding: "0 24px", pointerEvents: "none" }}
        aria-label={`${content.titlePrefix} ${CYCLE[wordIdx]}`}
      >
        <span aria-hidden>{content.titlePrefix}</span>
        <span
          aria-hidden
          key={wordIdx}
          className="mt-2 text-yellow"
          style={{ animation: motionAllowed ? "accent-swap 0.5s cubic-bezier(0.16,1,0.3,1)" : undefined }}
        >
          {CYCLE[wordIdx]}
        </span>
      </h1>

      {/* Content: eyebrow + body + CTA */}
      <div
        className="absolute bottom-[clamp(48px,10vh,112px)] left-[clamp(24px,7vw,104px)] w-[min(560px,calc(100%-48px))]"
        style={{ zIndex: 7, pointerEvents: "auto" }}
      >
        <div className="mb-5 flex items-center gap-2.5 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#e6cfff]">
          <span className="block h-px w-7 bg-current" />
          {content.eyebrow}
        </div>
        <p className="max-w-[35ch] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.5] text-white/76">
          {content.body}
        </p>
        <a
          href={`/${locale}/services`}
          className="mt-7 inline-flex items-center gap-4 rounded-full border border-white/55 px-[18px] py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#17131d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {content.cta}
          <span aria-hidden className="text-lg leading-none">→</span>
        </a>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-[clamp(48px,10vh,112px)] right-[clamp(24px,7vw,104px)] hidden gap-3 justify-items-center text-[0.7rem] uppercase tracking-[0.12em] text-white/72 sm:grid"
        style={{ zIndex: 7 }}
        aria-hidden
      >
        Scroll to explore
        <span className="block h-14 w-px bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}