"use client";

import { motion } from "framer-motion";
import { CountUpStat } from "./CountUpStat";
import type { Locale } from "@/i18n/config";

const kpis = [
  { label: "Active Campaigns", value: 24, decimals: 0, suffix: "", delta: "+3", color: "text-accent-green" },
  { label: "Total Impressions", value: 2.4, decimals: 1, suffix: "M", delta: "+18%", color: "text-accent-blue" },
  { label: "Avg. CTR", value: 14.2, decimals: 1, suffix: "%", delta: "+2.1", color: "text-accent-pink" },
  { label: "Conversions", value: 847, decimals: 0, suffix: "", delta: "+64", color: "text-accent-orange" },
  { label: "Media Spend", value: 12.4, decimals: 1, suffix: "K€", delta: "+9%", color: "text-yellow" },
];

const campaigns = [
  { name: "Helsinki Keskusta — Premium", tags: ["Meta", "Display", "DOOH"], pct: 96.2 },
  { name: "Espoo Tapiola — New Apartments", tags: ["Meta", "Display"], pct: 78.8 },
  { name: "Vantaa Tikkurila — Open House", tags: ["Meta", "DOOH"], pct: 72.4 },
  { name: "Kallio District — Urban Living", tags: ["Display", "DOOH"], pct: 58.1 },
];

const bars = [42, 68, 50, 82, 58, 96, 74];

/** The product screenshot from the design: a dark Campaign Dashboard inside browser chrome. */
export function DashboardMock({ locale }: { locale: Locale }) {
  return (
    <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-red/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-green/80" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.08] px-3 py-1 text-[10px] text-white/50">
          norr3.fi/marketing-engine/dashboard
        </span>
      </div>

      <div className="p-4 text-white sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Campaign Dashboard</p>
            <p className="text-[10px] text-white/40">Real-time performance · Last updated 2 min ago</p>
          </div>
          <span className="rounded-full bg-purple px-3 py-1 text-[10px] font-medium">+ New Campaign</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg bg-white/[0.06] p-2.5">
              <p className="truncate text-[9px] text-white/50">{k.label}</p>
              <p className={`text-base font-medium sm:text-lg ${k.color}`}>
                <CountUpStat value={k.value} decimals={k.decimals} suffix={k.suffix} locale={locale} />
              </p>
              <p className="text-[9px] text-accent-green">{k.delta}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-white/[0.06] p-3">
            <p className="mb-2 text-[10px] font-medium text-white/70">Active Campaigns</p>
            <div className="space-y-2">
              {campaigns.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[10px] text-white/80">{c.name}</p>
                    <span className="text-[10px] text-white/50">{c.pct}%</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.pct}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-purple"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-lg bg-white/[0.06] p-3">
              <p className="mb-2 text-[10px] font-medium text-white/70">CTR Trend (7d)</p>
              <div className="flex h-16 items-end gap-1.5">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 rounded-t-sm bg-purple"
                  />
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-purple/25 p-3 ring-1 ring-purple/50">
              <p className="text-[10px] font-medium text-white/90">✦ AI Insights</p>
              <p className="mt-1 text-[10px] leading-relaxed text-white/60">
                Espoo campaign +23% above avg — consider increasing weekly budget. DOOH inventory peaks at 16:00.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
