import type { SiteContent } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * Named section images on the pages this repo renders itself.
 *
 * Those pages used to inline their photography and alt text, so swapping a photo
 * meant a commit. A slot is looked up by key and every field falls back
 * individually: an unfilled alt keeps whatever the page passed (often a
 * dictionary value), and an empty slot keeps the bundled path. That way seeding
 * the slots changed nothing, and clearing one in the CMS restores the design
 * rather than blanking the section.
 */

export type ResolvedSlot = { src: string; alt: string; caption: string };

export function imageSlot(
  content: Pick<SiteContent, "imageSlots">,
  key: string,
  locale: Locale,
  fallback: { src: string; alt?: string; caption?: string }
): ResolvedSlot {
  const slot = content.imageSlots?.[key];
  return {
    src: slot?.src?.trim() || fallback.src,
    alt: slot?.alt?.[locale]?.trim() || fallback.alt || "",
    caption: slot?.caption?.[locale]?.trim() || fallback.caption || "",
  };
}
