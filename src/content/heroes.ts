import type { CmsHero, HeroImage } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * Reading helpers for CMS-configured heroes.
 *
 * Every hero component keeps the content it shipped with as its default, so a
 * missing row, an empty field or an unreachable CMS all resolve to the design
 * rather than to a hole. That is why each accessor takes a fallback.
 */

export function heroFor(heroes: CmsHero[], variant: string): CmsHero | undefined {
  return heroes.find((hero) => hero.variant === variant);
}

export function heroText(
  value: Record<Locale, string> | undefined,
  locale: Locale,
  fallback: string
): string {
  const text = value?.[locale]?.trim();
  return text || fallback;
}

export function heroWords(
  hero: CmsHero | undefined,
  locale: Locale,
  fallback: string[]
): string[] {
  const words = hero?.words?.[locale]?.filter((word) => word.trim().length > 0);
  return words && words.length > 0 ? words : fallback;
}

/** Image sources in order, falling back when the hero has none configured. */
export function heroImages(hero: CmsHero | undefined, fallback: HeroImage[]): HeroImage[] {
  const images = hero?.images?.filter((image) => typeof image?.src === "string" && image.src);
  return images && images.length > 0 ? images : fallback;
}

export function heroAlt(image: HeroImage | undefined, locale: Locale, fallback = ""): string {
  const alt = (locale === "fi" ? image?.alt_fi : image?.alt_en)?.trim();
  return alt || fallback;
}

/** A numeric knob from `config`, clamped so a bad value cannot break a timer. */
export function heroNumber(
  hero: CmsHero | undefined,
  key: string,
  fallback: number,
  min = 0,
  max = Number.MAX_SAFE_INTEGER
): number {
  const raw = hero?.config?.[key];
  const value = Number(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function heroList<T>(hero: CmsHero | undefined, key: string, fallback: T[]): T[] {
  const raw = hero?.config?.[key];
  return Array.isArray(raw) && raw.length > 0 ? (raw as T[]) : fallback;
}

export function heroLocalised(
  hero: CmsHero | undefined,
  key: string,
  locale: Locale,
  fallback: string
): string {
  const raw = hero?.config?.[key] as Record<string, string> | undefined;
  const value = raw?.[locale]?.trim();
  return value || fallback;
}

/**
 * Pick which hero to draw.
 *
 * Only enabled rows with a weight above zero take part, and the draw is
 * weighted — two heroes at 1 and 3 appear roughly a quarter and three quarters
 * of the time. With nothing eligible the caller keeps its own default, so
 * switching every hero off cannot leave the page blank.
 */
export function pickHero(heroes: CmsHero[], roll: number): CmsHero | null {
  const eligible = heroes.filter((hero) => hero.enabled && hero.weight > 0);
  if (eligible.length === 0) return null;
  const total = eligible.reduce((sum, hero) => sum + hero.weight, 0);
  let cursor = roll * total;
  for (const hero of eligible) {
    cursor -= hero.weight;
    if (cursor < 0) return hero;
  }
  return eligible[eligible.length - 1];
}
