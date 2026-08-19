import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/content/dictionary";
import { getSiteContent } from "@/lib/cms";

/**
 * Copy for one locale.
 *
 * Previously this returned the bundled dictionary directly. It now resolves the
 * CMS-managed copy, with the bundled dictionary merged underneath so a value an
 * editor has not filled in still renders — see `src/lib/cms.ts`. The signature
 * is async because of that fetch; every caller is already a server component.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (await getSiteContent()).dictionaries[locale];
}

export { getSiteContent };
