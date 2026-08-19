import { getSiteContent } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * SEO for the routes this repo renders itself.
 *
 * The CMS Pages screen lets an editor set a title, description and social image
 * for each of these, so they have to be read here — otherwise the screen offers
 * a field that does nothing. Each falls back to the value the page already used
 * (its dictionary `seo` entry and its own image), so an untouched row changes
 * nothing.
 */
export async function pageSeo(
  slug: string,
  locale: Locale,
  fallback: { title: string; description: string; image: string }
): Promise<{ title: string; description: string; image: string }> {
  const { pageSeo: rows } = await getSiteContent();
  const row = rows?.[slug];
  return {
    title: row?.title?.[locale]?.trim() || fallback.title,
    description: row?.description?.[locale]?.trim() || fallback.description,
    image: row?.ogImage?.trim() || fallback.image,
  };
}
