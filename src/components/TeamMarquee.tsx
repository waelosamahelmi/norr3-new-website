"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { team } from "@/content/team";
import type { Locale } from "@/i18n/config";

/**
 * The Team hero strip: an always-sliding band of member photos interleaved
 * with brand-colored icon chips and a mini dashboard tile. Hovering (or
 * focusing) pauses the slide and expands the hovered member's card to reveal
 * name + role — per the requested interaction.
 */

type StripItem =
  | { kind: "member"; memberIndex: number }
  | { kind: "chip"; icon: string; tone: string }
  | { kind: "dashboard" };

const CHIP_TONES = [
  "bg-yellow text-ink",
  "bg-pastel-purple text-violet",
  "bg-purple text-white",
  "bg-light-purple text-ink",
];

const CHIP_ICONS = ["trending_up", "interests", "monitoring", "bolt"];

function buildStrip(): StripItem[] {
  const items: StripItem[] = [];
  team.forEach((_, i) => {
    items.push({ kind: "member", memberIndex: i });
    if (i === 3) {
      items.push({ kind: "dashboard" });
    } else if (i % 2 === 1) {
      items.push({
        kind: "chip",
        icon: CHIP_ICONS[(i >> 1) % CHIP_ICONS.length],
        tone: CHIP_TONES[(i >> 1) % CHIP_TONES.length],
      });
    }
  });
  return items;
}

const STRIP = buildStrip();

function MiniDashboard() {
  return (
    <div className="flex h-full w-56 shrink-0 flex-col gap-2 self-center rounded-2xl bg-black p-4 text-white">
      <p className="text-[10px] font-medium">Campaign Dashboard</p>
      <p className="text-[8px] text-white/50">Real-time performance</p>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        <div className="rounded-lg bg-white/[0.07] p-2">
          <p className="text-[8px] text-white/50">Active</p>
          <p className="text-sm font-medium text-accent-green">24</p>
        </div>
        <div className="rounded-lg bg-white/[0.07] p-2">
          <p className="text-[8px] text-white/50">Impressions</p>
          <p className="text-sm font-medium text-accent-blue">2.4M</p>
        </div>
      </div>
      <div className="mt-auto flex items-end gap-1">
        {[40, 70, 50, 90, 65].map((h, i) => (
          <div key={i} className="w-full rounded-t-sm bg-purple" style={{ height: `${h * 0.4}px` }} />
        ))}
      </div>
    </div>
  );
}

export function TeamMarquee({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<number | null>(null);

  const renderStrip = (copy: number) => (
    <div className="flex shrink-0 items-stretch gap-4 pr-4" aria-hidden={copy > 0}>
      {STRIP.map((item, i) => {
        if (item.kind === "chip") {
          return (
            <span
              key={`${copy}-${i}`}
              className={`flex h-16 w-16 shrink-0 items-center justify-center self-center rounded-full ${item.tone}`}
            >
              <Icon name={item.icon} className="text-[24px]" />
            </span>
          );
        }
        if (item.kind === "dashboard") {
          return <MiniDashboard key={`${copy}-${i}`} />;
        }
        const member = team[item.memberIndex];
        const isActive = active === item.memberIndex;
        const tall = item.memberIndex % 3 === 0;
        return (
          <button
            key={`${copy}-${i}`}
            type="button"
            onMouseEnter={() => setActive(item.memberIndex)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(item.memberIndex)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(isActive ? null : item.memberIndex)}
            aria-label={member.role ? `${member.name} — ${member.role[locale]}` : member.name}
            className={`group/card relative shrink-0 cursor-pointer overflow-hidden rounded-lg transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              tall ? "self-stretch" : "self-center"
            } ${isActive ? "w-64" : "w-32 sm:w-36"} ${tall ? "h-full" : "h-40 sm:h-48"}`}
          >
            <img
              src={member.photo}
              alt=""
              className={`h-full w-full object-cover transition-all duration-500 ${
                isActive ? "scale-105 grayscale-0" : "grayscale-[0.2]"
              }`}
              draggable={false}
            />
            <span
              className={`absolute inset-x-0 bottom-0 flex flex-col items-start gap-0.5 bg-gradient-to-t from-black/80 to-transparent p-3 text-left transition-opacity duration-300 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-sm font-medium text-white">{member.name}</span>
              {member.role && (
                <span className="text-[11px] text-white/80">{member.role[locale]}</span>
              )}
            </span>
            {/* Affordance: a subtle plus chip so users know cards respond */}
            <span
              className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-ink transition-opacity duration-300 ${
                isActive ? "opacity-0" : "opacity-0 group-hover/card:opacity-100"
              }`}
            >
              <Icon name="add" className="text-[16px]" />
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      className="marquee-paused h-56 overflow-hidden sm:h-64"
      style={{ ["--marquee-duration" as string]: "50s" }}
    >
      <div className="marquee-track h-full items-stretch">
        {renderStrip(0)}
        {renderStrip(1)}
      </div>
    </div>
  );
}
