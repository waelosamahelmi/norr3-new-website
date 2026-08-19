/**
 * Block document types.
 *
 * A CMS page is an ordered list of blocks; each has a `type` the renderer knows
 * and a bag of `props` shaped by that type. The authoritative registry (labels,
 * fields, defaults, validation) lives in the CMS at `lib/blocks.ts` — this file
 * is the read side of the same contract, kept to types so the website never has
 * to know about editing concerns.
 *
 * Anything the renderer does not recognise is skipped rather than thrown on, so
 * a CMS deployed ahead of the website degrades to missing sections instead of a
 * broken page.
 */

export const BLOCK_SCHEMA_VERSION = 1;

export type I18nValue = { fi: string; en: string };

export type Block = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  hidden?: boolean;
};

/** Read a localised prop, falling back to the other locale before giving up. */
export function text(value: unknown, locale: "fi" | "en"): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  const pair = value as Partial<I18nValue>;
  return (pair[locale] ?? "").trim() || (pair.fi ?? "").trim() || (pair.en ?? "").trim() || "";
}

export function bool(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

export function num(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value !== "" ? value : fallback;
}

export function rows(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

/**
 * The style controls every block carries. Mirrors `STYLE_FIELDS` in the CMS;
 * defaults mean "inherit the design system", so an untouched block renders
 * exactly as the brand intends.
 */
export type BlockStyle = {
  tone: string;
  spacing: string;
  width: string;
  align: string;
  radius: string;
  animation: string;
  animationDelay: number;
  /** Extra classes on the block wrapper. */
  className: string;
  /** Custom CSS, scoped to the block by the renderer. */
  css: string;
};

export const DEFAULT_STYLE: BlockStyle = {
  tone: "none",
  spacing: "normal",
  width: "container",
  align: "left",
  radius: "",
  animation: "inherit",
  animationDelay: 0,
  className: "",
  css: "",
};

/**
 * Read a block's style, tolerating documents written before it was nested and
 * clamping anything unexpected back to the default.
 */
export function styleOf(props: Record<string, unknown>): BlockStyle {
  const nested = (props.style ?? {}) as Record<string, unknown>;
  const pick = (key: keyof BlockStyle) => (nested[key] !== undefined ? nested[key] : props[key]);
  const text = (key: keyof BlockStyle, allowed: string[]) => {
    const raw = pick(key);
    const value = raw === "start" ? "left" : String(raw ?? "");
    return allowed.includes(value) ? value : (DEFAULT_STYLE[key] as string);
  };
  const delay = Number(pick("animationDelay"));
  return {
    tone: text("tone", ["none", "lavender", "pastel", "grey", "violet", "ink", "yellow"]),
    spacing: text("spacing", ["none", "tight", "normal", "loose"]),
    width: text("width", ["container", "wide", "prose", "full"]),
    align: text("align", ["left", "center"]),
    // A length, or empty for "brand default". Anything else is ignored.
    radius: /^(\d+(\.\d+)?(px|rem|em|%)|9999px)$/.test(String(pick("radius") ?? "")) ? String(pick("radius")) : "",
    animation: text("animation", ["inherit", "none", "fade", "rise", "far"]),
    animationDelay: Number.isFinite(delay) ? Math.min(3, Math.max(0, delay)) : 0,
    // Both are validated on write in the CMS; re-clamped here because this is
    // the boundary the browser actually receives them through.
    className: typeof pick("className") === "string" ? String(pick("className")).slice(0, 500) : "",
    css: typeof pick("css") === "string" ? String(pick("css")).slice(0, 8000) : "",
  };
}

/** A container block's nested slots. */
export function slots(value: unknown): Block[][] {
  if (!Array.isArray(value)) return [];
  return value.map((slot) => (Array.isArray(slot) ? (slot as Block[]) : []));
}
