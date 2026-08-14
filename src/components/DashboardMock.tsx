"use client";

import { motion } from "framer-motion";
import { CountUpStat } from "./CountUpStat";
import { Icon } from "./Icon";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/content/dictionary";

type Labels = Dictionary["engine"]["dashboard"];

/**
 * The product screenshot from the design: the dark Campaign Dashboard inside
 * browser chrome, matching the real product's KPI-card language
 * (BRAND_GUIDELINES §8) so the site and the product read as one brand.
 *
 * Every string is localized — a Finnish visitor used to get an all-English
 * product view, which undercut the "this is our own platform" claim.
 *
 * Figures and labels are sample data, so the whole frame is exposed to
 * assistive tech as a single labelled image (same treatment as AudienceChart):
 * one honest description beats a screen reader reading out a fake dataset.
 */
export function DashboardMock({ locale, labels }: { locale: Locale; labels: Labels }) {
  // Deltas are numbers, not strings, so the decimal separator follows the
  // locale (fi: "+2,1" / en: "+2.1") like every other figure on the site.
  const nf = (value: number, decimals = 0) =>
    value.toLocaleString(locale === "fi" ? "fi-FI" : "en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const kpis = [
    { label: labels.kpi.campaigns, value: 24, decimals: 0, suffix: "", delta: nf(3), color: "text-accent-green" },
    { label: labels.kpi.impressions, value: 2.4, decimals: 1, suffix: " M", delta: `${nf(18)} %`, color: "text-accent-blue" },
    { label: labels.kpi.ctr, value: 14.2, decimals: 1, suffix: " %", delta: nf(2.1, 1), color: "text-accent-pink" },
    { label: labels.kpi.conversions, value: 847, decimals: 0, suffix: "", delta: nf(64), color: "text-accent-orange" },
    { label: labels.kpi.spend, value: 12.4, decimals: 1, suffix: " k€", delta: `${nf(9)} %`, color: "text-yellow" },
  ];

  // Shares and channel tags are mock data; the campaign names are localized.
  // The mock drives the row count, so a shorter label list degrades to an
  // unnamed row rather than crashing the page.
  const campaigns = [
    { tags: ["Meta", "Display", "PDOOH"], pct: 96.2 },
    { tags: ["Meta", "Display"], pct: 78.8 },
    { tags: ["Meta", "PDOOH"], pct: 72.4 },
    { tags: ["Display", "PDOOH"], pct: 58.1 },
  ].map((row, i) => ({ ...row, name: labels.campaigns[i] ?? "" }));

  const bars = [42, 68, 50, 82, 58, 96, 74];

  return (
    <figure
      role="img"
      aria-label={labels.alt}
      className="overflow-hidden rounded-card bg-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-red/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-green/80" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.08] px-3 py-1 text-[10px] text-white/50">
          norr3.fi/marketing-engine/dashboard
        </span>
      </div>

      <div className="p-4 text-white sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium sm:text-base">{labels.title}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
              {labels.subtitle}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-purple px-3 py-1.5 text-[10px] font-medium">
            {labels.newCampaign}
          </span>
        </div>

        {/* KPI row — the dark KPI-card language from the product */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg bg-white/[0.06] p-3 ring-1 ring-white/[0.06]">
              <p className="truncate text-[9px] uppercase tracking-[0.08em] text-white/45">{k.label}</p>
              <p className={`mt-1 text-lg font-medium tabular-nums sm:text-xl ${k.color}`}>
                <CountUpStat value={k.value} decimals={k.decimals} suffix={k.suffix} locale={locale} />
              </p>
              <p className="mt-0.5 flex items-center gap-0.5 text-[9px] tabular-nums text-accent-green">
                <Icon name="trending_up" className="text-[11px]" />+{k.delta}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-white/[0.06] p-3.5 ring-1 ring-white/[0.06]">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.08em] text-white/60">
              {labels.campaignsTitle}
            </p>
            <div className="space-y-3">
              {campaigns.map((c, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[11px] text-white/85">{c.name}</p>
                    <span className="shrink-0 text-[10px] tabular-nums text-white/50">
                      {c.pct.toLocaleString(locale === "fi" ? "fi-FI" : "en-US", {
                        minimumFractionDigits: 1,
                      })}
                      &nbsp;%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.pct}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-purple"
                    />
                  </div>
                  {/* Channel tags — the "one buy, every channel" claim, visible */}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/[0.07] px-1.5 py-0.5 text-[8px] uppercase tracking-[0.08em] text-white/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-lg bg-white/[0.06] p-3.5 ring-1 ring-white/[0.06]">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.08em] text-white/60">
                {labels.trendTitle}
              </p>
              <div className="flex h-20 items-end gap-1.5 border-b border-white/10 pb-px">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    // Latest day highlighted — the eye lands on "now", not on the tallest bar.
                    className={`flex-1 rounded-t-sm ${i === bars.length - 1 ? "bg-yellow" : "bg-purple"}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 rounded-lg bg-purple/25 p-3.5 ring-1 ring-purple/50">
              <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-white/90">
                <Icon name="auto_awesome" className="text-[14px]" />
                {labels.aiTitle}
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/65">{labels.aiBody}</p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
