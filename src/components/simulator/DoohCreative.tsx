"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The DOOH creative, rebuilt in HTML from the campaign master
 * (`/uploads/dooh-mt05gvan.mp4`).
 *
 * The master's design system, applied at any aspect ratio: black ground, one
 * full-bleed background image (dimmed — type legibility beats photography),
 * the white NØRR3 wordmark top-left, a big centered headline that cycles
 * between the campaign line and the house pillars, a sharp-cornered chip
 * marquee and the tagline. The Display format carries the CTA, because a
 * banner is the one format that asks for a click.
 *
 * Sizing: the whole card is an inline-size container and every internal
 * measurement is `cqw`, so the same design scales from a 120px preview tile
 * to the real 1080×1080 master without a media query. Reduced-motion users
 * get the fully composed static frame.
 */

const HEADLINE_SLOTS = [
  ["Making Media", "a Growth Engine"],
  ["Technology.", "Talent. Attitude."],
] as const;

// The ad's chip sequence: icon blocks and label blocks, sharp corners, ~4px
// gaps, scrolling right-to-left. Mirrors the marquee in the video.
const CHIPS: { label?: string; icon?: string; bg: string; fg: string }[] = [
  { icon: "share", bg: "bg-accent-orange", fg: "text-ink" },
  { label: "Social Media", bg: "bg-accent-red", fg: "text-white" },
  { icon: "arrow_forward", bg: "bg-offwhite", fg: "text-purple" },
  { icon: "search", bg: "bg-violet", fg: "text-white" },
  { label: "Display", bg: "bg-light-purple", fg: "text-purple" },
  { label: "Radio", bg: "bg-lime", fg: "text-violet" },
  { icon: "mood", bg: "bg-accent-orange", fg: "text-ink" },
  { label: "Streaming", bg: "bg-accent-pink", fg: "text-white" },
];

export function DoohCreative({
  aspect = "16 / 9",
  headline = 0,
  background = "/images/brand/space-arch.webp",
  showCta = false,
  className = "",
}: {
  /** CSS aspect-ratio for the creative's frame. */
  aspect?: string;
  /** Which headline slot to hold (0 = campaign line, 1 = pillars). Cycles when omitted. */
  headline?: number;
  /** Full-bleed background image, dimmed for type legibility. */
  background?: string;
  /** Show the yellow norr3.fi CTA chip under the headline (Display). */
  showCta?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [slot, setSlot] = useState(headline);
  const [decoded, setDecoded] = useState(Boolean(reduced));

  // Pixel-glitch decode, like the master: the background resolves in ~2.4s.
  useEffect(() => {
    if (reduced || decoded) return;
    const t = window.setTimeout(() => setDecoded(true), 2400);
    return () => window.clearTimeout(t);
  }, [reduced, decoded]);

  // Headline cycling, like the master (~5.5s per slot).
  useEffect(() => {
    if (reduced) return;
    const iv = window.setInterval(() => setSlot((s) => (s + 1) % HEADLINE_SLOTS.length), 5500);
    return () => window.clearInterval(iv);
  }, [reduced]);

  const lines = HEADLINE_SLOTS[slot] ?? HEADLINE_SLOTS[0];

  return (
    <div
      // The container: everything inside is sized in cqw against this width.
      className={`relative isolate flex w-full flex-col overflow-hidden bg-black text-white ${className}`}
      style={{ aspectRatio: aspect, containerType: "inline-size" }}
    >
      {/* 1. Background — one full-bleed image for every format, heavily dimmed
          so the type owns the frame (the master's black ground with footage
          ghosting under it). The glitch layer decodes away to reveal it. */}
      <div aria-hidden className="absolute inset-0 z-0">
        <img
          src={background}
          alt=""
          className={`h-full w-full object-cover object-[50%_35%] transition-opacity duration-1000 ${decoded ? "opacity-60" : "opacity-20"}`}
        />
        {/* Vignette keeps the headline side readable regardless of the photo. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15" />
        <div
          className={`absolute inset-0 grid grid-cols-8 gap-[4%] transition-opacity duration-700 ${decoded ? "opacity-0" : "opacity-70"}`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className={i % 3 === 0 ? "bg-purple" : i % 3 === 1 ? "bg-violet" : "bg-white/10"}
              style={{ gridRow: (i % 6) + 1, opacity: 0.35 + (i % 4) * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* 2. Wordmark — top-left, ~32% of the card width */}
      <img
        src="/logo-wordmark.svg"
        alt=""
        className="absolute left-[5.5%] top-[4%] z-20 w-[32%] brightness-0 invert"
      />

      {/* 3. The open middle — the headline (and the Display CTA) centred in
          the empty space, exactly between the wordmark above and the marquee
          below. This is the elastic zone: it absorbs every aspect ratio. */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-[3.5cqw] px-[6%] py-[10%] text-center">
        <p className="text-[8.5cqw] font-medium leading-[1.04] tracking-[-0.02em] text-white [text-shadow:0_0_40px_rgba(0,0,0,0.6)]">
          {lines[0]}
          <br />
          {lines[1]}
        </p>
        {showCta && (
          <span className="relative mt-[1cqw] bg-yellow px-[4cqw] py-[2.2cqw] text-[3.8cqw] font-semibold uppercase tracking-[0.08em] text-ink">
            norr3.fi
          </span>
        )}
      </div>

      {/* 4. Chip marquee — sharp-cornered blocks scrolling right-to-left,
          the same unit the master loops. */}
      <div className="relative z-20 h-[7cqw] overflow-hidden">
        <div className={`flex h-full w-max items-center gap-[0.6cqw] ${reduced ? "" : "dooh-marquee"}`}>
          {[...CHIPS, ...CHIPS].map((chip, i) => (
            <span
              key={i}
              className={`flex h-full shrink-0 items-center justify-center px-[2cqw] text-[3cqw] font-medium leading-none ${chip.bg} ${chip.fg}`}
            >
              {chip.label ?? (
                <span className="material-symbols-outlined text-[4.5cqw] leading-none">{chip.icon}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 5. Tagline */}
      <p className="relative z-20 px-[5.5%] pb-[4.5%] pt-[2.5%] text-[3.4cqw] leading-snug text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.8)]">
        With us, marketing hits home and sinks in.
      </p>
    </div>
  );
}
