"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { CountUpStat } from "@/components/CountUpStat";
import type { Locale } from "@/i18n/config";

/**
 * The five Engine apps as an interactive showcase: an app rail on the left,
 * a live "product window" on the right that swaps to a working mini-demo of
 * the selected app. Auto-advances every 7s; pauses while hovered/focused.
 * The window is dark per the brand's product-UI reference (§8).
 */

type AppKey = "kampanjat" | "dashboard" | "luova" | "insights" | "integrations";

type AppDef = {
  key: AppKey;
  icon: string;
  fi: { title: string; body: string };
  en: { title: string; body: string };
};

const APPS: AppDef[] = [
  {
    key: "kampanjat",
    icon: "campaign",
    fi: { title: "Kampanjat", body: "Suunnittele, osta ja operoi kaikki kanavat yhdestä paikasta — briiffistä toteutukseen." },
    en: { title: "Campaigns", body: "Plan, buy and operate every channel from one place — from brief to execution." },
  },
  {
    key: "dashboard",
    icon: "space_dashboard",
    fi: { title: "Dashboard", body: "Reaaliaikainen raportointi ja mittaus. Tulokset näkyvät, ei väitetä." },
    en: { title: "Dashboard", body: "Real-time reporting and measurement. Results shown, not claimed." },
  },
  {
    key: "luova",
    icon: "auto_awesome",
    fi: { title: "Luova automaatio", body: "Tuhansia aineistoversioita yhdestä masterista — DCO ja syötepohjainen luova." },
    en: { title: "Creative automation", body: "Thousands of creative versions from one master — DCO and feed-driven creative." },
  },
  {
    key: "insights",
    icon: "insights",
    fi: { title: "Media Insights", body: "Yleisö- ja mediankäyttödata suunnittelun pohjaksi — päätökset datalla, ei mutulla." },
    en: { title: "Media Insights", body: "Audience and media-usage data as the planning foundation — data over guesswork." },
  },
  {
    key: "integrations",
    icon: "hub",
    fi: { title: "Integraatiot", body: "Data layer yhdistää tuote-, varasto- ja CRM-datan kampanjoihisi." },
    en: { title: "Integrations", body: "A data layer connecting product, inventory and CRM data to your campaigns." },
  },
];

const D = {
  fi: {
    newCampaign: "+ Uusi kampanja",
    active: "Aktiiviset kampanjat",
    updated: "Päivitetty 2 min sitten",
    variants: "versiota generoitu",
    formats: ["Meta 1:1", "Story 9:16", "Display", "DOOH"],
    audienceLabel: "Kanavien tavoittavuus omalle yleisölle",
    average: "keskiarvo",
    you: "sinun yleisösi",
    flows: "Data virtaa kampanjoihin",
    sources: ["Tuotesyöte", "CRM", "Varasto", "Meta", "BidTheatre"],
    kpis: [
      { label: "Kampanjat", value: 12, suffix: "" },
      { label: "Mainosnäytöt", value: 2.4, suffix: " M", decimals: 1 },
      { label: "CTR", value: 14.2, suffix: " %", decimals: 1 },
      { label: "Konversiot", value: 847, suffix: "" },
    ],
    campaigns: [
      { name: "Helsinki — Premium", pct: 78, channels: ["TV", "DOOH", "Meta"] },
      { name: "Espoo — Uudiskohteet", pct: 52, channels: ["Meta", "Display"] },
      { name: "Vantaa — Avajaistapahtuma", pct: 91, channels: ["DOOH", "Radio", "Story"] },
    ],
    channels: [
      { name: "Instagram", reach: 84 },
      { name: "YouTube", reach: 71 },
      { name: "Spotify", reach: 46 },
      { name: "DOOH", reach: 38 },
      { name: "Haku", reach: 64 },
    ],
  },
  en: {
    newCampaign: "+ New campaign",
    active: "Active campaigns",
    updated: "Updated 2 min ago",
    variants: "versions generated",
    formats: ["Meta 1:1", "Story 9:16", "Display", "DOOH"],
    audienceLabel: "Channel reach for your audience",
    average: "average",
    you: "your audience",
    flows: "Data flows into your campaigns",
    sources: ["Product feed", "CRM", "Inventory", "Meta", "BidTheatre"],
    kpis: [
      { label: "Campaigns", value: 12, suffix: "" },
      { label: "Impressions", value: 2.4, suffix: " M", decimals: 1 },
      { label: "CTR", value: 14.2, suffix: " %", decimals: 1 },
      { label: "Conversions", value: 847, suffix: "" },
    ],
    campaigns: [
      { name: "Helsinki — Premium", pct: 78, channels: ["TV", "DOOH", "Meta"] },
      { name: "Espoo — New homes", pct: 52, channels: ["Meta", "Display"] },
      { name: "Vantaa — Open house", pct: 91, channels: ["DOOH", "Radio", "Story"] },
    ],
    channels: [
      { name: "Instagram", reach: 84 },
      { name: "YouTube", reach: 71 },
      { name: "Spotify", reach: 46 },
      { name: "DOOH", reach: 38 },
      { name: "Search", reach: 64 },
    ],
  },
};

export function EngineAppsShowcase({ locale }: { locale: Locale }) {
  const t = D[locale];
  const [active, setActive] = useState<AppKey>("kampanjat");
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const activeIndex = useMemo(() => APPS.findIndex((a) => a.key === active), [active]);

  // Auto-advance, pausing on hover/focus.
  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => {
      setActive(APPS[(APPS.findIndex((a) => a.key === active) + 1) % APPS.length].key);
    }, 7000);
    return () => window.clearInterval(id);
  }, [active, paused, reduce]);

  const select = (key: AppKey) => {
    setActive(key);
    setPaused(true);
  };

  return (
    <div
      className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* App rail */}
      <div role="tablist" aria-label="Engine apps" className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-3 lg:overflow-visible">
        {APPS.map((app, i) => {
          const on = app.key === active;
          return (
            <button
              key={app.key}
              role="tab"
              aria-selected={on}
              onClick={() => select(app.key)}
              className={`group relative flex min-w-[220px] shrink-0 items-center gap-4 rounded-card p-4 text-left transition-colors lg:min-w-0 lg:w-full ${
                on
                  ? "bg-purple text-white dark:bg-purple"
                  : "bg-pastel-purple/50 text-ink hover:bg-pastel-purple dark:bg-white/[0.04] dark:text-white dark:ring-1 dark:ring-white/10 dark:hover:bg-white/[0.08]"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] transition-colors ${
                  on ? "bg-yellow text-ink" : "bg-violet text-white"
                }`}
              >
                <Icon name={app.icon} style={{ fontSize: "26px" }} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium">{app[locale].title}</span>
                <span className={`mt-0.5 block truncate text-[12px] ${on ? "text-white/70" : "text-ink/55 dark:text-white/55"}`}>
                  {app[locale].body.split("—")[0]}
                </span>
              </span>
              {/* progress bar while this app is showing (auto-cycle cue) */}
              {on && !reduce && !paused && (
                <motion.span
                  key={active}
                  className="absolute bottom-0 left-0 h-1 rounded-t-sm bg-yellow"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 7, ease: "linear" }}
                />
              )}
              <span aria-hidden className={`ml-auto hidden text-[10px] font-medium tabular-nums lg:block ${on ? "text-white/60" : "text-ink/30 dark:text-white/30"}`}>
                0{i + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live product window */}
      <div className="relative min-h-[420px] overflow-hidden rounded-card bg-ink text-white ring-1 ring-white/10 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.6)]">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-red/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-green/80" />
          <span className="ml-3 flex items-center gap-1.5 truncate text-[11px] text-white/45">
            <Icon name={APPS[activeIndex].icon} className="text-[13px] text-purple" />
            norr3.fi/engine / {APPS[activeIndex][locale].title.toLowerCase()}
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-white/40">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-green" />
            </span>
            live
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-8"
          >
            {active === "kampanjat" && <KampanjatDemo locale={locale} />}
            {active === "dashboard" && <DashboardDemo locale={locale} />}
            {active === "luova" && <LuovaDemo locale={locale} />}
            {active === "insights" && <InsightsDemo locale={locale} />}
            {active === "integrations" && <IntegrationsDemo locale={locale} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── demo 1: Kampanjat — animated campaign rows with channel chips ─────── */

function KampanjatDemo({ locale }: { locale: Locale }) {
  const t = D[locale];
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{t.active}</p>
      <div className="mt-4 space-y-5">
        {t.campaigns.map((c, i) => (
          <div key={c.name}>
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-[14px] text-white/85">{c.name}</p>
              <span className="shrink-0 text-[12px] font-medium tabular-nums text-white/50">{c.pct}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.pct}%` }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full ${i === 0 ? "bg-purple" : i === 1 ? "bg-yellow" : "bg-accent-blue"}`}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.channels.map((ch) => (
                <span key={ch} className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-white/50">
                  {ch}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-purple px-4 py-2 text-[11px] font-medium">
        <Icon name="add" style={{ fontSize: "15px" }} />
        {t.newCampaign}
      </span>
    </div>
  );
}

/* ─── demo 2: Dashboard — KPI counters + trend bars ─────────────────────── */

function DashboardDemo({ locale }: { locale: Locale }) {
  const t = D[locale];
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
        {t.updated}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {t.kpis.map((k) => (
          <div key={k.label} className="rounded-[14px] bg-white/[0.06] p-3.5 ring-1 ring-white/[0.06]">
            <p className="truncate text-[9px] uppercase tracking-[0.08em] text-white/45">{k.label}</p>
            <p className="mt-1 text-2xl font-medium tabular-nums text-purple dark:text-purple">
              <CountUpStat value={k.value} decimals={k.decimals ?? 0} suffix={k.suffix} locale={locale} />
            </p>
          </div>
        ))}
      </div>
      {/* trend bars */}
      <div className="mt-5 rounded-[14px] bg-white/[0.06] p-4 ring-1 ring-white/[0.06]">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.08em] text-white/40">CTR</p>
        <div className="flex h-24 items-end gap-1.5">
          {[30, 55, 40, 62, 48, 71, 58, 80, 66, 88].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`flex-1 rounded-t-sm ${i === 9 ? "bg-yellow" : i >= 7 ? "bg-light-purple" : "bg-purple"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── demo 3: Luova automaatio — format-morphing creative + counter ──────── */

const MORPH = [
  { w: "w-[180px]", h: "h-[180px]", label: "Meta 1:1 · 1080×1080" },
  { w: "w-[128px]", h: "h-[228px]", label: "Story 9:16 · 1080×1920" },
  { w: "w-[300px]", h: "h-[92px]", label: "Display · 300×250" },
  { w: "w-[300px]", h: "h-[168px]", label: "DOOH · 1920×1080" },
];

function LuovaDemo({ locale }: { locale: Locale }) {
  const t = D[locale];
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % MORPH.length), 2200);
    return () => window.clearInterval(id);
  }, [reduce]);

  const shape = MORPH[i];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 py-6 sm:flex-row sm:items-center sm:gap-10">
      {/* The morphing creative */}
      <div className="flex h-[260px] flex-1 items-center justify-center">
        <motion.div
          animate={{ width: undefined, height: undefined }}
          className={`relative overflow-hidden rounded-[10px] bg-gradient-to-br from-violet to-purple p-4 ring-1 ring-white/20 transition-[width,height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${shape.w} ${shape.h} max-w-full`}
        >
          <div className="flex h-full w-full flex-col justify-between">
            <span className="w-fit rounded bg-white/20 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-white/80">
              {shape.label.split("·")[0]}
            </span>
            <span className="text-[13px] font-medium leading-tight text-white">
              {locale === "fi" ? "Kesäkampanja" : "Summer campaign"} −20%
            </span>
          </div>
          <span aria-hidden className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-yellow/90" />
        </motion.div>
      </div>
      {/* Variant counter + format list */}
      <div className="flex-1 text-center sm:text-left">
        <p className="text-4xl font-medium tabular-nums text-purple dark:text-purple">
          <CountUpStat value={2340} locale={locale} />
        </p>
        <p className="mt-1 text-[13px] text-white/50">{t.variants}</p>
        <ul className="mt-4 space-y-1.5">
          {MORPH.map((m, x) => (
            <li
              key={m.label}
              className={`flex items-center gap-2 text-[12px] transition-colors ${x === i ? "text-white" : "text-white/40"}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${x === i ? "bg-yellow" : "bg-white/25"}`} />
              {m.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── demo 4: Media Insights — animated reach bars, audience vs average ──── */

function InsightsDemo({ locale }: { locale: Locale }) {
  const t = D[locale];
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{t.audienceLabel}</p>
      <div className="mt-5 space-y-4">
        {t.channels.map((c, i) => {
          const avg = Math.max(18, Math.round(c.reach * 0.62));
          return (
            <div key={c.name}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-white/80">{c.name}</span>
                <span className="tabular-nums text-white/45">{c.reach}%</span>
              </div>
              <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${avg}%` }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-white/25"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.reach}%` }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-y-0 left-0 rounded-full bg-purple"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/45">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple" /> {t.you}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white/25" /> {t.average}
        </span>
      </div>
    </div>
  );
}

/* ─── demo 5: Integraatiot — animated data-flow node diagram ────────────── */

function IntegrationsDemo({ locale }: { locale: Locale }) {
  const t = D[locale];
  const reduce = useReducedMotion();
  return (
    <div className="flex min-h-[300px] flex-col">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{t.flows}</p>
      <div className="relative mt-6 flex-1">
        {/* sources column — each row flows down into the Engine sink */}
        <div className="flex flex-col gap-3">
          {t.sources.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-violet text-white">
                <Icon name={["inventory_2", "group", "warehouse", "share", "hub"][i] ?? "hub"} style={{ fontSize: "17px" }} />
              </span>
              <span className="flex-1 truncate text-[13px] text-white/75">{s}</span>
              {/* animated flow line ending in an arrow that points toward the Engine box below */}
              <span className="relative hidden h-px w-24 bg-white/15 sm:block">
                <motion.span
                  className="absolute inset-y-0 left-0 h-px w-4 bg-purple"
                  animate={reduce ? undefined : { x: ["-1rem", "6rem"] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.35, ease: "linear" }}
                />
                <span aria-hidden className="absolute -right-1 top-1/2 -translate-y-[3px] text-[9px] text-purple">▶</span>
              </span>
              <span className="hidden w-14 text-right text-[10px] uppercase tracking-wider text-white/35 sm:block">
                <motion.span
                  className="inline-block"
                  animate={reduce ? undefined : { y: [0, 2, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                >
                  ↓
                </motion.span>{" "}API
              </span>
            </div>
          ))}
        </div>
        {/* Engine sink */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center gap-3 rounded-[14px] bg-purple/25 p-4 ring-1 ring-purple/50"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-purple text-white">
            <Icon name="bolt" style={{ fontSize: "22px" }} />
          </span>
          <div>
            <p className="text-[14px] font-medium text-white">NØRR3 Marketing Engine</p>
            <p className="text-[11px] text-white/55">{t.sources.length} {locale === "fi" ? "lähdettä · reaaliaikainen data" : "sources · real-time data"}</p>
          </div>
          <span aria-hidden className="ml-auto text-[20px] text-yellow">
            <motion.span
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              ↻
            </motion.span>
          </span>
        </motion.div>
      </div>
    </div>
  );
}
