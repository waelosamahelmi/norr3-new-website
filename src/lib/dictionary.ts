import { dictionaries } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
