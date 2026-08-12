import { CountUpStat } from "./CountUpStat";
import { Reveal } from "./Reveal";
import type { Locale } from "@/i18n/config";

export type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  grouping?: boolean;
};

/**
 * "NORR3 In Numbers" — huge figures over hairline top borders with small
 * captions, in a 2-column grid. Numbers count up on scroll into view.
 */
export function StatGrid({
  stats,
  locale,
  label,
  columns = 2,
  size = "large",
}: {
  stats: Stat[];
  locale: Locale;
  label?: string;
  columns?: 2 | 3;
  size?: "large" | "medium";
}) {
  return (
    <div>
      {label && <p className="mb-4 text-xs font-medium text-ink/60">{label}</p>}
      <div className={`grid gap-x-14 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.06} className="border-t border-black/20 pb-8 pt-3">
            <p
              className={`font-medium tracking-tight text-ink ${
                size === "large" ? "text-6xl lg:text-8xl" : "text-4xl lg:text-6xl"
              }`}
              style={{ letterSpacing: "-0.04em" }}
            >
              <CountUpStat
                value={s.value}
                decimals={s.decimals ?? 0}
                prefix={s.prefix}
                suffix={s.suffix}
                locale={locale}
                grouping={s.grouping}
              />
            </p>
            <p className="mt-2 text-xs text-ink/60">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
