"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Icon } from "@/components/Icon";
import { LiveNumber } from "@/components/LiveNumber";
import { channels } from "@/content/channels";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/content/dictionary";

const DEFAULT_ACTIVE = ["social", "streaming", "display", "pdooh"];
const MIN_SHARE = 4;

function evenSplit(ids: string[]): Record<string, number> {
  const share = 100 / ids.length;
  return Object.fromEntries(ids.map((id) => [id, share]));
}

export function MediaMixSimulator({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Dictionary["engine"]["simulator"];
}) {
  const [budget, setBudget] = useState(50000);
  const [activeIds, setActiveIds] = useState<string[]>(DEFAULT_ACTIVE);
  const [allocations, setAllocations] = useState<Record<string, number>>(
    evenSplit(DEFAULT_ACTIVE)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const activeChannels = useMemo(
    () => channels.filter((c) => activeIds.includes(c.id)),
    [activeIds]
  );

  function toggleChannel(id: string) {
    setActiveIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      if (next.length === 0) return prev;
      setAllocations(evenSplit(next));
      return next;
    });
  }

  function handleDividerDrag(index: number, deltaX: number) {
    const width = containerRef.current?.offsetWidth ?? 1;
    const deltaPercent = (deltaX / width) * 100;
    setAllocations((prev) => {
      const a = { ...prev };
      const idA = activeChannels[index].id;
      const idB = activeChannels[index + 1].id;
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

  const boundaries = useMemo(() => {
    const cumulative: number[] = [];
    let running = 0;
    for (let i = 0; i < activeChannels.length - 1; i++) {
      running += allocations[activeChannels[i].id] ?? 0;
      cumulative.push(running);
    }
    return cumulative;
  }, [activeChannels, allocations]);

  const { totalReach, weightedCpm, pieData } = useMemo(() => {
    const data = activeChannels.map((c) => {
      const spend = budget * ((allocations[c.id] ?? 0) / 100);
      const channelImpressions = (spend / c.cpm) * 1000;
      return { name: c[locale], value: Math.round(channelImpressions), color: c.color };
    });
    const impressions = data.reduce((sum, d) => sum + d.value, 0);
    return {
      totalReach: impressions,
      weightedCpm: impressions > 0 ? (budget / impressions) * 1000 : 0,
      pieData: data,
    };
  }, [activeChannels, allocations, budget, locale]);

  return (
    <div className="rounded-[25px] bg-black p-6 text-white sm:p-10">
      {/* Budget control */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="budget" className="text-sm text-white/60">
          {labels.budgetLabel}
        </label>
        <LiveNumber
          value={budget}
          locale={locale}
          prefix="€"
          className="text-2xl font-medium"
        />
      </div>
      <input
        id="budget"
        type="range"
        min={5000}
        max={300000}
        step={1000}
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        className="mt-4 w-full accent-purple"
      />

      {/* Channel toggles */}
      <div className="mt-8 flex flex-wrap gap-2">
        {channels.map((c) => {
          const isActive = activeIds.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleChannel(c.id)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
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

      {/* Drag-to-resize allocation bar */}
      <div className="mt-8">
        <p className="mb-2 text-xs text-white/50">{labels.channelsLabel}</p>
        <div
          ref={containerRef}
          className="relative h-16 w-full overflow-hidden rounded-2xl select-none"
        >
          <div className="flex h-full w-full">
            {activeChannels.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-center text-xs font-semibold text-white transition-[width] duration-150"
                style={{ width: `${allocations[c.id]}%`, backgroundColor: c.color }}
              >
                {Math.round(allocations[c.id])}%
              </div>
            ))}
          </div>

          {/* Divider handles, overlaid above the segments so they're never covered by a sibling */}
          {boundaries.map((leftPercent, i) => (
            <motion.div
              key={i}
              onPan={(_, info) => handleDividerDrag(i, info.delta.x)}
              whileDrag={{ scaleY: 1.05 }}
              whileTap={{ scaleY: 1.05 }}
              style={{ left: `${leftPercent}%` }}
              className="absolute top-0 z-20 -ml-2.5 h-full w-5 cursor-col-resize touch-none"
            >
              <span className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live output */}
      <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-white/50">{labels.reachLabel}</p>
            <p className="mt-1 text-3xl font-medium sm:text-4xl">
              <LiveNumber value={totalReach} locale={locale} decimals={0} />
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50">{labels.cpmLabel}</p>
            <p className="mt-1 text-3xl font-medium sm:text-4xl">
              <LiveNumber value={weightedCpm} locale={locale} decimals={2} prefix="€" />
            </p>
          </div>
        </div>
        <div className="h-40 w-40 justify-self-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                isAnimationActive
                animationDuration={400}
              >
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#000", border: "none", borderRadius: 8, fontSize: 12 }}
                formatter={(value, name) => [Math.round(Number(value)).toLocaleString(), String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-8 text-xs text-white/40">{labels.note}</p>
    </div>
  );
}
