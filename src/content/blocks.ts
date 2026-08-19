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

/** A container block's nested slots. */
export function slots(value: unknown): Block[][] {
  if (!Array.isArray(value)) return [];
  return value.map((slot) => (Array.isArray(slot) ? (slot as Block[]) : []));
}
