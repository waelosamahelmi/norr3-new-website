"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bodies, Body, Composite, Engine, Mouse, MouseConstraint, Runner, type Body as MatterBody } from "matter-js";
import { useMotionAllowed } from "@/components/heroes/useMotionAllowed";
import { DotGrid } from "@/components/DotGrid";
import type { Locale } from "@/i18n/config";

type Sticker = {
  body: MatterBody;
  text: string;
  color: string;
  width: number;
  height: number;
  emoji?: boolean;
};

const COLORS = ["#F6FF4F", "#DAEB45", "#FF97E8", "#46A8FF", "#A5FF37", "#FFBD00"];
const QUOTES = {
  en: [
    "Plan with purpose", "Data makes the difference", "Make media work harder", "Measure what matters", "Grow with confidence",
    "Right message, right moment", "Build competitive advantage", "Ideas in motion", "Test. Learn. Grow.", "Every euro counts",
    "Audience first", "Make the signal louder", "Strategy meets creativity", "Less guesswork, more growth",
  ],
  fi: [
    "Suunnittele tarkoituksella", "Data tekee eron", "Tee mediasta tehokkaampaa", "Mittaa merkityksellistä", "Kasva luottavaisesti",
    "Oikea viesti, oikea hetki", "Rakenna kilpailuetua", "Ideat liikkeelle", "Testaa. Opi. Kasva.", "Jokainen euro ratkaisee",
    "Yleisö ensin", "Tee signaalista vahvempi", "Strategia kohtaa luovuuden", "Vähemmän arvailua, enemmän kasvua",
  ],
};
const EMOJIS = ["✦", "↗", "+", "∞", "●", "✳", "◎", "↘", "★", "□", "△", "◌", "✺", "→", "◈", "✚", "~", "※"];
const BACKGROUND_IMAGES = [
  "/images/brand/award.webp",
  "/images/brand/engine-team.webp",
  "/images/brand/og-image.jpg",
  "/images/brand/hero-data.webp",
  "/images/brand/space-arch.webp",
];
const GRAVITY = 0.0012;
const MAX_STICKERS = 34;
const FONT = "600 15px 'Host Grotesk', sans-serif";

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function measureSticker(ctx: CanvasRenderingContext2D, text: string) {
  ctx.font = FONT;
  return { width: Math.min(220, Math.max(104, ctx.measureText(text).width + 30)), height: 44 };
}

export function StickerHero({ locale }: { locale: Locale }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stickersRef = useRef<Sticker[]>([]);
  const displayedAccentRef = useRef("Grow");
  const motionAllowed = useMotionAllowed();
  const [accentIndex, setAccentIndex] = useState(2);
  const [displayedAccent, setDisplayedAccent] = useState("Grow");
  const accentWords = locale === "fi" ? ["Suunnittele", "Toimi", "Kasva"] : ["Plan", "Act", "Grow"];
  const accentWord = accentWords[accentIndex];

  useEffect(() => {
    if (!motionAllowed) return;
    const timer = window.setInterval(() => setAccentIndex((index) => (index + 1) % 3), 2400);
    return () => window.clearInterval(timer);
  }, [motionAllowed]);

  useEffect(() => {
    if (!motionAllowed) return;
    let cancelled = false;
    let eraseTimer = 0;
    let typeTimer = 0;
    let pauseTimer = 0;
    let current = displayedAccentRef.current;

    const typeNext = () => {
      let position = 0;
      typeTimer = window.setInterval(() => {
        if (cancelled) return;
        position += 1;
        current = accentWord.slice(0, position);
        displayedAccentRef.current = current;
        setDisplayedAccent(current);
        if (position >= accentWord.length) window.clearInterval(typeTimer);
      }, 70);
    };

    eraseTimer = window.setInterval(() => {
      if (cancelled) return;
      current = current.slice(0, -1);
      displayedAccentRef.current = current;
      setDisplayedAccent(current);
      if (!current) {
        window.clearInterval(eraseTimer);
        pauseTimer = window.setTimeout(typeNext, 180);
      }
    }, 55);

    return () => {
      cancelled = true;
      window.clearInterval(eraseTimer);
      window.clearInterval(typeTimer);
      window.clearTimeout(pauseTimer);
    };
  }, [accentWord, motionAllowed]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let alive = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let engine: Engine | null = null;
    let runner: Runner | null = null;
    let walls: MatterBody[] = [];
    const stickers = stickersRef.current;

    const resize = () => {
      if (!engine) return;
      width = container.clientWidth;
      height = container.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (walls.length) Composite.remove(engine.world, walls);
      walls = [
        Bodies.rectangle(width / 2, -30, width + 120, 60, { isStatic: true }),
        Bodies.rectangle(width / 2, height + 30, width + 120, 60, { isStatic: true }),
        Bodies.rectangle(-30, height / 2, 60, height + 120, { isStatic: true }),
        Bodies.rectangle(width + 30, height / 2, 60, height + 120, { isStatic: true }),
      ];
      Composite.add(engine.world, walls);
    };

    const addSticker = (text: string, x: number, y: number, color: string, emoji = false, drop = true) => {
      const size = emoji ? { width: 54, height: 54 } : measureSticker(ctx, text);
      const body = Bodies.rectangle(x, y, size.width, size.height, {
        restitution: 0.18,
        friction: 0.7,
        frictionAir: 0.025,
        density: 0.0015,
        angle: (Math.random() - 0.5) * 0.45,
        render: { visible: false },
      });
      const sticker = { body, text, color, width: size.width, height: size.height, emoji };
      (body as MatterBody & { plugin: { sticker?: Sticker } }).plugin = { sticker };
      stickers.push(sticker);
      Composite.add(engine!.world, body);
      if (drop) {
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 1.2, y: 0 });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);
      }
    };

    engine = Engine.create({ gravity: { x: 0, y: 1, scale: GRAVITY } });
    engine.timing.timeScale = motionAllowed ? 0.75 : 0;
    resize();
    QUOTES[locale].forEach((quote, index) => addSticker(quote, width * (0.08 + (index % 6) * 0.17), 95 + Math.floor(index / 6) * 76, COLORS[index % COLORS.length], false, false));
    EMOJIS.forEach((emoji, index) => addSticker(emoji, width * (0.06 + (index % 9) * 0.11), 145 + Math.floor(index / 9) * 82, COLORS[(index + 3) % COLORS.length], true, false));

    if (motionAllowed) {
      runner = Runner.create();
      Runner.run(runner, engine);
      const mouse = Mouse.create(canvas);
      const constraint = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.1, render: { visible: false } } });
      Composite.add(engine.world, constraint);
    }

    const draw = () => {
      if (!alive) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      stickers.forEach(({ body, text, color, width: stickerWidth, height: stickerHeight, emoji }) => {
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        ctx.fillStyle = color;
        roundedRect(ctx, -stickerWidth / 2, -stickerHeight / 2, stickerWidth, stickerHeight, emoji ? 18 : 14);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,.2)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#000";
        ctx.font = emoji ? "32px 'Host Grotesk', sans-serif" : FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 0, emoji ? 1 : 0);
        ctx.restore();
      });
      frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize);
    const handleStickerAdd = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      if (!value || !engine || !width || !height) return;
      addSticker(value, width / 2, -30, COLORS[Math.floor(Math.random() * COLORS.length)]);
      if (stickers.length > MAX_STICKERS) {
        const oldest = stickers.shift();
        if (oldest) Composite.remove(engine.world, oldest.body);
      }
    };
    container.addEventListener("sticker:add", handleStickerAdd);
    observer.observe(container);
    frame = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener("sticker:add", handleStickerAdd);
      if (runner) Runner.stop(runner);
      if (engine) {
        Composite.clear(engine.world, false, true);
        Engine.clear(engine);
      }
      stickers.splice(0, stickers.length);
    };
  }, [locale, motionAllowed]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = inputRef.current;
    const value = input?.value.trim();
    if (!value || value.length > 52) return;
    const container = containerRef.current;
    if (!input || !container) return;
    input.value = "";
    container.dispatchEvent(new CustomEvent("sticker:add", { detail: value }));
  };

  return (
    <section ref={containerRef} className="relative min-h-[calc(100svh-4.25rem)] overflow-hidden text-white" style={{ isolation: "isolate", background: "#0e0b16", marginTop: "-112px" }}>
      <style>{`
        @keyframes sticker-bg-cycle { 0%, 16% { opacity: 1; } 20%, 96% { opacity: 0; } 100% { opacity: 1; } }
        .sticker-bg-cycle { animation: sticker-bg-cycle 25s ease-in-out infinite; }
      `}</style>
      {BACKGROUND_IMAGES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-0 h-full w-full object-cover ${motionAllowed ? "sticker-bg-cycle" : ""}`}
          style={{
            opacity: motionAllowed ? undefined : index === 0 ? 1 : 0,
            mixBlendMode: "normal",
            animationDelay: motionAllowed ? `-${index * 5}s` : undefined,
          }}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-ink/25" />
      <DotGrid className="z-[2] opacity-80" spacing={22} radius={170} baseAlpha={0.18} peakAlpha={0.9} />
      <canvas ref={canvasRef} className="pointer-events-auto absolute inset-0 z-[3] h-full w-full" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(circle_at_50%_38%,rgba(122,6,211,.18),transparent_56%)]" />
      <div className="pointer-events-none relative z-10 flex min-h-[calc(100svh-4.25rem)] flex-col items-center justify-center px-6 pb-24 text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-yellow">NØRR3 / Media in motion</p>
        <h1 aria-label={`${locale === "fi" ? "Uusi tapa" : "A New Way to"} ${accentWord}`} className="max-w-4xl text-[clamp(2.8rem,8vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.04em]">
          {locale === "fi" ? "Uusi tapa" : "A New Way to"}{" "}
          <span className="inline-grid justify-items-start align-baseline text-yellow">
            {accentWords.map((word) => (
              <span key={`ghost-${word}`} className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
                _{word}
              </span>
            ))}
            <span className="col-start-1 row-start-1 whitespace-nowrap">
              <span className={motionAllowed && displayedAccent !== accentWord ? "caret-blink" : "inline-block"}>_</span>
              <span>{motionAllowed ? displayedAccent : accentWord}</span>
            </span>
          </span>
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">
          {locale === "fi" ? "Heitä ajatuksesi seinälle. Suunnittelemme, testaamme ja kasvatamme yhdessä." : "Put an idea on the wall. We plan, test and grow it together."}
        </p>
        <form onSubmit={onSubmit} className="pointer-events-auto mt-7 flex w-full max-w-md items-center gap-2 rounded-full border border-white/35 bg-black/25 p-1.5 backdrop-blur-sm">
          <input ref={inputRef} maxLength={52} placeholder={locale === "fi" ? "Kirjoita ajatus..." : "Write an idea..."} className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/50" aria-label={locale === "fi" ? "Kirjoita ajatus" : "Write an idea"} />
          <button type="submit" className="rounded-full bg-yellow px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-ink transition-transform hover:-translate-y-0.5">{locale === "fi" ? "Lisää" : "Add"}</button>
        </form>
      </div>
    </section>
  );
}
