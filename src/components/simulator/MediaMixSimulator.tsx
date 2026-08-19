"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Icon } from "@/components/Icon";
import { LiveNumber } from "@/components/LiveNumber";
import { channels as bundledChannels, type Channel } from "@/content/channels";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/content/dictionary";

const DEFAULT_ACTIVE = ["social", "streaming", "display", "pdooh"];
const MIN_SHARE = 4;
const DEFAULT_BUDGET = 50000;
/** One arrow-key press moves this many percentage points across a divider. */
const KEY_STEP = 2;

/** Creative formats the Engine auto-generates from one master design. */
const CREATIVE_FORMATS = [
  { id: "meta-square", label: "Meta 1:1", dimensions: "1080×1080", ratio: "1 / 1", previewWidth: "60px", icon: "grid_view" },
  { id: "meta-story", label: "Meta Story", dimensions: "1080×1920", ratio: "9 / 16", previewWidth: "34px", icon: "mobile_friendly" },
  { id: "display", label: "Display", dimensions: "300×250", ratio: "6 / 5", previewWidth: "60px", icon: "monitor" },
  { id: "pdooh", label: "DOOH", dimensions: "1920×1080", ratio: "16 / 9", previewWidth: "80px", icon: "tv" },
] as const;

function evenSplit(ids: string[]): Record<string, number> {
  const share = 100 / ids.length;
  return Object.fromEntries(ids.map((id) => [id, share]));
}

/**
 * The site's signature interaction (PROMPT §4): the visitor does, in miniature,
 * what the Engine does — set a budget, pick channels, drag the split, watch
 * reach and CPM re-solve live.
 *
 * The split bar is operable by pointer *and* keyboard: each divider is a real
 * `role="slider"` with arrow-key control, so the one moment on the site that
 * proves the Technology pillar isn't mouse-only. Every figure is duplicated as
 * text in the spend legend, which is why the donut itself is `aria-hidden`.
 */
export function MediaMixSimulator({
  locale,
  labels,
  channels = bundledChannels,
}: {
  locale: Locale;
  labels: Dictionary["engine"]["simulator"];
  /** Channel list and CPM baselines from the CMS; bundled data is the fallback. */
  channels?: Channel[];
}) {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [activeIds, setActiveIds] = useState<string[]>(DEFAULT_ACTIVE);
  const [allocations, setAllocations] = useState<Record<string, number>>(
    evenSplit(DEFAULT_ACTIVE)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const activeChannels = useMemo(
    () => channels.filter((c) => activeIds.includes(c.id)),
    [activeIds]
  );

  const nf = (value: number, decimals = 0) =>
    value.toLocaleString(locale === "fi" ? "fi-FI" : "en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  function toggleChannel(id: string) {
    setActiveIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      // Never leave the mix empty — the last active channel stays on.
      if (next.length === 0) return prev;
      setAllocations(evenSplit(next));
      return next;
    });
  }

  function reset() {
    setBudget(DEFAULT_BUDGET);
    setActiveIds(DEFAULT_ACTIVE);
    setAllocations(evenSplit(DEFAULT_ACTIVE));
  }

  /** Move `deltaPercent` of budget across the divider between index and index+1. */
  function shiftShare(index: number, deltaPercent: number) {
    setAllocations((prev) => {
      const a = { ...prev };
      const idA = activeChannels[index]?.id;
      const idB = activeChannels[index + 1]?.id;
      if (!idA || !idB) return prev;
      let newA = a[idA] + deltaPercent;
      let newB = a[idB] - deltaPercent;
      if (newA < MIN_SHARE) {
        newB -= MIN_SHARE - newA;
        newA = MIN_SHARE;
      }
      if (newB < MIN_SHARE) {
        newA -= MIN_SHARE - newB;
        newB = MIN_SHARE;
      }
      a[idA] = newA;
      a[idB] = newB;
      return a;
    });
  }

  function handleDividerDrag(index: number, deltaX: number) {
    const width = containerRef.current?.offsetWidth ?? 1;
    shiftShare(index, (deltaX / width) * 100);
  }

  function handleDividerKey(index: number, e: React.KeyboardEvent) {
    const step =
      e.key === "ArrowLeft" || e.key === "ArrowDown"
        ? -KEY_STEP
        : e.key === "ArrowRight" || e.key === "ArrowUp"
          ? KEY_STEP
          : 0;
    if (step === 0) return;
    e.preventDefault();
    shiftShare(index, step);
  }

  const boundaries = useMemo(() => {
    const cumulative: number[] = [];
    let running = 0;
    for (let i = 0; i < activeChannels.length - 1; i++) {
      running += allocations[activeChannels[i].id] ?? 0;
      cumulative.push(running);
    }
    return cumulative;
  }, [activeChannels, allocations]);

  // One derived dataset feeds both the donut and the spend legend, so the two
  // can never disagree.
  const { totalReach, weightedCpm, data } = useMemo(() => {
    const data = activeChannels.map((c) => {
      const share = allocations[c.id] ?? 0;
      const spend = budget * (share / 100);
      const channelImpressions = (spend / c.cpm) * 1000;
      return {
        id: c.id,
        name: c[locale],
        share,
        spend,
        value: Math.round(channelImpressions),
        color: c.color,
      };
    });
    const impressions = data.reduce((sum, d) => sum + d.value, 0);
    return {
      totalReach: impressions,
      weightedCpm: impressions > 0 ? (budget / impressions) * 1000 : 0,
      data,
    };
  }, [activeChannels, allocations, budget, locale]);

  const eyebrow = "text-[11px] font-medium uppercase tracking-[0.14em] text-white/50";
  // Channels whose brand accent is light enough that a white % label fails
  // contrast on the allocation bar — those segments take ink instead.
  const lightSegments = new Set(["display", "pdooh", "audio"]);
  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-purple";

  return (
    <div className="rounded-card bg-ink p-6 text-white ring-1 ring-white/10 sm:p-10">
      {/* Budget control */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <label htmlFor="budget" className={eyebrow}>
            {labels.budgetLabel}
          </label>
          <p className="mt-1.5 text-3xl font-medium tabular-nums tracking-tight sm:text-4xl">
            <LiveNumber value={budget} locale={locale} prefix="€" />
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className={`inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-white/70 transition-colors hover:border-white hover:text-white ${focusRing}`}
        >
          <Icon name="restart_alt" className="text-[16px]" />
          {labels.resetLabel}
        </button>
      </div>
      <input
        id="budget"
        type="range"
        min={5000}
        max={300000}
        step={1000}
        value={budget}
        aria-valuetext={`${nf(budget)} €`}
        onChange={(e) => setBudget(Number(e.target.value))}
        className={`mt-5 w-full accent-light-purple ${focusRing}`}
      />
      <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-white/40">
        <span>€{nf(5000)}</span>
        <span>€{nf(300000)}</span>
      </div>

      {/* Channel toggles */}
      <div className="mt-9">
        <p className={eyebrow}>{labels.channelsLabel}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {channels.map((c) => {
            const isActive = activeIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleChannel(c.id)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${focusRing} ${
                  isActive
                    ? "border-white bg-white text-ink"
                    : "border-white/20 text-white/60 hover:border-white/50 hover:text-white"
                }`}
              >
                <Icon name={c.icon} className="text-[16px]" />
                {c[locale]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag-to-resize allocation bar */}
      <div className="mt-9">
        <p className={eyebrow}>{labels.splitLabel}</p>
        <div
          ref={containerRef}
          className="relative mt-3 h-16 w-full select-none overflow-hidden rounded-2xl"
        >
          <div className="flex h-full w-full">
            {activeChannels.map((c) => (
              <div
                key={c.id}
                className={`flex items-center justify-center text-xs font-semibold tabular-nums transition-[width] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  lightSegments.has(c.id) ? "text-ink" : "text-white"
                }`}
                style={{ width: `${allocations[c.id]}%`, backgroundColor: c.color }}
              >
                {Math.round(allocations[c.id])} %
              </div>
            ))}
          </div>

          {/* Divider handles, overlaid above the segments so they're never covered
              by a sibling. Each is a real slider: draggable and arrow-key operable. */}
          {boundaries.map((leftPercent, i) => (
            <motion.div
              key={activeChannels[i].id}
              role="slider"
              tabIndex={0}
              aria-label={`${activeChannels[i][locale]} / ${activeChannels[i + 1][locale]} — ${labels.dividerLabel}`}
              // The boundary must leave MIN_SHARE for every channel on each
              // side, so its real range depends on its position in the bar.
              aria-valuemin={(i + 1) * MIN_SHARE}
              aria-valuemax={100 - (activeChannels.length - i - 1) * MIN_SHARE}
              aria-valuenow={Math.round(leftPercent)}
              aria-valuetext={`${Math.round(allocations[activeChannels[i].id])} % / ${Math.round(allocations[activeChannels[i + 1].id])} %`}
              onPan={(_, info) => handleDividerDrag(i, info.delta.x)}
              onKeyDown={(e) => handleDividerKey(i, e)}
              whileDrag={{ scaleY: 1.05 }}
              whileTap={{ scaleY: 1.05 }}
              style={{ left: `${leftPercent}%` }}
              className={`absolute top-0 z-20 -ml-2.5 h-full w-5 cursor-col-resize touch-none rounded-full ${focusRing}`}
            >
              <span className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live output */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className={eyebrow}>{labels.reachLabel}</p>
              <p className="mt-1.5 text-3xl font-medium tabular-nums tracking-tight sm:text-5xl">
                <LiveNumber value={totalReach} locale={locale} decimals={0} />
              </p>
            </div>
            <div>
              <p className={eyebrow}>{labels.cpmLabel}</p>
              <p className="mt-1.5 text-3xl font-medium tabular-nums tracking-tight sm:text-5xl">
                <LiveNumber value={weightedCpm} locale={locale} decimals={2} prefix="€" />
              </p>
            </div>
          </div>

          {/* Spend legend — also the text equivalent of the donut */}
          <div>
            <p className={eyebrow}>{labels.spendLabel}</p>
            <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {data.map((d) => (
                <li key={d.id} className="flex items-center gap-2.5 border-t border-white/10 pt-2">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-xs text-white/70">{d.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-white/50">
                    {Math.round(d.share)} %
                  </span>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-white">
                    €{nf(d.spend)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The donut repeats the legend visually, so it stays out of the a11y tree. */}
        <div aria-hidden className="h-44 w-44 justify-self-center lg:h-52 lg:w-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="100%"
                paddingAngle={2}
                isAnimationActive={!prefersReduced}
                animationDuration={400}
              >
                {data.map((d) => (
                  <Cell key={d.id} fill={d.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-ink)",
                  border: "1px solid rgb(255 255 255 / 0.15)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                itemStyle={{ color: "var(--color-white)" }}
                formatter={(value, name) => [nf(Number(value)), String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Creative automation — Engine auto-generates creatives in multiple sizes */}
      <div className="mt-10 border-t border-white/10 pt-8">
        <div className="flex items-center gap-2">
          <Icon name="auto_awesome" className="text-[18px] text-yellow" />
          <p className={eyebrow}>{labels.creativesLabel}</p>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
          {labels.creativesBody}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CREATIVE_FORMATS.map((fmt) => (
            <div
              key={fmt.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/25"
            >
              <div
                className="mx-auto mb-3 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple/30 to-violet/20"
                style={{ aspectRatio: fmt.ratio, width: fmt.previewWidth }}
              >
                <span className="material-symbols-outlined text-[20px] text-white/40">
                  {fmt.icon}
                </span>
              </div>
              <p className="text-center text-xs font-medium text-white/80">{fmt.label}</p>
              <p className="mt-0.5 text-center text-[10px] tabular-nums text-white/40">
                {fmt.dimensions}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-white/40">{labels.note}</p>
    </div>
  );
}
