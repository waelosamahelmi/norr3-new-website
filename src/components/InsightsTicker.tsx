"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { CmsMediaInsight } from "@/lib/cms";
import type { Locale } from "@/i18n/config";
import { insightText } from "@/content/mediaInsights";

/**
 * A slim, always-visible strip pinned to the bottom of the viewport that lets
 * the page's Media Insights figures slide past (a marquee), replacing the old
 * in-page insight card sections. It reads the current path so each page shows
 * its own insights; pages with none fall back to the home set so the strip is
 * never empty.
 */

function normalize(path: string): string {
  let p = (path || "/").trim();
  p = p.replace(/^\/(?:fi|en)(?=\/|$)/, "");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

function nbspNumbers(value: string): string {
  return value.replace(/(\d) (?=\d)/g, "$1\u00A0");
}

export function InsightsTicker({
  insights,
  locale,
}: {
  insights: CmsMediaInsight[];
  locale: Locale;
}) {
  const pathname = usePathname();
  const here = normalize(pathname);

  const forPage = insights.filter((i) => normalize(i.url) === here);
  const fallback = insights.filter((i) => normalize(i.url) === "/");
  const items = (forPage.length ? forPage : fallback).slice(0, 6);
  if (!items.length) return null;

  const row = (
    <div className="flex shrink-0 items-center">
      <span className="flex items-center gap-2 whitespace-nowrap px-5 py-3">
        <Icon name="insights" className="text-[16px] text-[#F6FF4F]" />
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
          Media Insights
        </span>
      </span>
      {items.map((insight) => (
        <span key={insight.id} className="flex items-center gap-2.5 whitespace-nowrap px-5 py-3">
          <span className="text-sm font-medium tabular-nums tracking-tight text-[#F6FF4F]">
            {nbspNumbers((insight.bigNumber || "").trim())}
          </span>
          <span className="text-sm text-white/80">{nbspNumbers(insightText(insight, locale))}</span>
          <span aria-hidden className="ml-3 h-4 w-px bg-white/20" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[65] overflow-hidden border-t border-white/10 bg-ink"
      style={{ ["--marquee-duration" as string]: "45s" }}
      aria-label="Media Insights"
    >
      <div className="marquee-track items-center">
        {row}
        {row}
      </div>
    </div>
  );
}