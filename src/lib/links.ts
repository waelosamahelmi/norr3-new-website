import type { Locale } from "@/i18n/config";

/**
 * Public URL helpers.
 *
 * The site serves Finnish at the domain root (no `/fi` prefix) and English
 * under `/en`, so every route sits as close to the domain as possible while the
 * two locales still resolve to distinct URLs for hreflang. Internally the app
 * keeps routing through the existing `[locale]` segment (`fi`/`en`); middleware
 * rewrites root-level requests to `/fi` transparently.
 */

/** A locale-relative path (leading slash optional) as its public URL. */
export function linkTo(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean === "/" ? "/en" : `/en${clean}`;
  return clean === "/" ? "/" : clean;
}

/** The same page in the other locale, given the current browser pathname. */
export function otherLocaleHref(pathname: string, current: Locale): string {
  const other: Locale = current === "fi" ? "en" : "fi";
  const stripped = pathname.replace(/^\/(?:en|fi)(?=\/|$)/, "");
  return linkTo(other, stripped || "/");
}
