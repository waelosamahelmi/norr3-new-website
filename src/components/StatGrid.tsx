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
      {label && (
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
          {label}
        </p>
      )}
      <div className={`grid gap-x-14 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.06} className="border-t border-black/20 pb-8 pt-3 dark:border-white/20">
            {/* tabular-nums keeps the figure from reflowing while it counts up.
                Sizes/tracking follow the brand type scale (stat 110px / -6%). */}
            <p
              className={`font-medium leading-[1.15] tabular-nums text-ink dark:text-white ${
                size === "large" ? "text-6xl lg:text-stat" : "text-4xl lg:text-6xl"
              }`}
              style={{ letterSpacing: "-0.06em" }}
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
            <p className="mt-3 max-w-[36ch] text-[13px] leading-relaxed text-ink/65 dark:text-white/65">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
