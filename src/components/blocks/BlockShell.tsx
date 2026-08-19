"use client";

import { MotionSettingsProvider, useMotionSettings } from "@/components/MotionSettingsProvider";
import { DEFAULT_STYLE, type BlockStyle } from "@/content/blocks";
import { scopeCss } from "./scopeCss";
import type { MotionSettings } from "@/lib/cms";

/**
 * Wraps one block with the style choices made in the CMS: its background band,
 * a corner-radius override for everything inside it, and its own scroll
 * animation.
 *
 * Vertical rhythm, width and alignment stay inside each block's own markup —
 * they differ per block (a hero opens with top padding only, an image sits
 * tighter than a section) and `pad()` in the renderer resolves them against the
 * block's natural spacing. What lives here is everything that is genuinely
 * uniform, so a new block type inherits it for free.
 */

/**
 * Section surfaces. The pastel tints swap to the house elevated dark surface,
 * because the components inside carry their own `dark:text-white` variants and
 * white text on a lavender band is unreadable. `yellow` deliberately stays pale
 * in both themes — that is the house treatment for it — and forces ink text.
 */
export const BLOCK_TONE: Record<string, string> = {
  none: "",
  lavender: "bg-pastel-purple/60 dark:bg-white/[0.05]",
  pastel: "bg-light-purple/60 dark:bg-white/[0.04]",
  grey: "bg-grey dark:bg-white/[0.04]",
  violet: "bg-violet text-white",
  ink: "bg-ink text-white",
  yellow: "bg-yellow text-ink",
};

/** Tones whose text must stay ink because the surface stays pale in dark mode. */
export const TONE_IS_PALE = new Set(["yellow"]);
/** Tones that are dark in both themes, so their text is white. */
export const TONE_IS_DARK = new Set(["violet", "ink"]);

export const BLOCK_SPACING: Record<string, string> = {
  none: "",
  tight: "py-8 lg:py-10",
  loose: "py-24 lg:py-32",
};

/**
 * Resolve a block's vertical rhythm. `normal` means "whatever this block was
 * designed to use", which is why the natural value is passed in rather than
 * looked up — a hero's rhythm is not a section's.
 */
export function pad(style: BlockStyle, natural: string): string {
  if (style.spacing === "normal") return natural;
  return BLOCK_SPACING[style.spacing] ?? natural;
}

/** Width and alignment, applied to the inner column of a block. */
export function frame(style: BlockStyle): string {
  const width =
    style.width === "prose" ? "mx-auto max-w-2xl" : style.width === "wide" ? "mx-auto max-w-4xl" : "";
  const align = style.align === "center" ? "text-center" : "";
  return [width, align].filter(Boolean).join(" ");
}

function scopedMotion(base: MotionSettings, style: BlockStyle): MotionSettings | null {
  switch (style.animation) {
    case "none":
      return { ...base, enabled: false };
    case "fade":
      return { ...base, reveal: { ...base.reveal, distance: 0 } };
    case "rise":
      return { ...base, reveal: { ...base.reveal, distance: Math.max(base.reveal.distance, 24) } };
    case "far":
      return { ...base, reveal: { ...base.reveal, distance: Math.max(base.reveal.distance, 72) } };
    default:
      return null; // inherit the site setting
  }
}

export function StyleScope({
  style,
  blockId,
  children,
}: {
  style?: Partial<BlockStyle>;
  /** Used to scope the block's custom CSS to its own wrapper. */
  blockId?: string;
  children: React.ReactNode;
}) {
  const resolved: BlockStyle = { ...DEFAULT_STYLE, ...(style ?? {}) };
  const motion = useMotionSettings();
  const override = scopedMotion(motion, resolved);

  const tone = BLOCK_TONE[resolved.tone] ?? "";
  // Set as the card token on this subtree so every card, image and panel the
  // block renders picks it up — including ones nested in a columns block.
  const vars = resolved.radius ? ({ "--radius-card": resolved.radius } as React.CSSProperties) : undefined;

  const custom = resolved.css.trim();
  const scopeClass = blockId ? `cms-block-${blockId}` : "";
  const extra = resolved.className.trim();

  // Nothing to do: render the block untouched rather than adding a wrapper that
  // would change the document for no reason.
  if (!tone && !vars && !override && !custom && !extra) return <>{children}</>;

  const className = [tone, extra, custom ? scopeClass : ""].filter(Boolean).join(" ");

  const section = (
    <section className={className || undefined} style={vars}>
      {/* Scoped so a block's own CSS cannot reach the rest of the page. */}
      {custom && scopeClass && (
        <style dangerouslySetInnerHTML={{ __html: scopeCss(custom, `.${scopeClass}`) }} />
      )}
      {children}
    </section>
  );

  if (!override) return section;
  return <MotionSettingsProvider value={override}>{section}</MotionSettingsProvider>;
}
