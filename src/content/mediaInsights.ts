import type { CmsMediaInsight, SiteContent } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * Reading helpers for the CMS-managed Media Insights boxes ("huomiopallo").
 *
 * The CMS publishes only enabled rows, already ordered by url → priority →
 * position, so all that is left here is matching a box to the page being
 * rendered and picking the right locale (English falls back to Finnish, which
 * is how the workbook ships).
 */

/** Strip the /fi or /en prefix and any trailing slash so a box's url matches
 *  the locale-relative path a page is rendered at. "/" stays "/". */
export function normalizeInsightPath(path: string): string {
  let p = (path || "/").trim();
  p = p.replace(/^\/(?:fi|en)(?=\/|$)/, "");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

/** Every enabled insight box suggested for `path`, in publish order. */
export function mediaInsightsFor(content: SiteContent, path: string): CmsMediaInsight[] {
  const target = normalizeInsightPath(path);
  return (content.mediaInsights ?? [])
    .filter((insight) => normalizeInsightPath(insight.url) === target)
    .sort((a, b) => a.priority - b.priority);
}

/** Locale-aware box text, falling back to Finnish. */
export function insightText(insight: CmsMediaInsight, locale: Locale): string {
  const value = locale === "en" ? insight.text?.en : insight.text?.fi;
  return (value || insight.text?.fi || "").trim();
}

/** Locale-aware source line, falling back to Finnish. */
export function insightSource(insight: CmsMediaInsight, locale: Locale): string {
  const value = locale === "en" ? insight.source?.en : insight.source?.fi;
  return (value || insight.source?.fi || "").trim();
}