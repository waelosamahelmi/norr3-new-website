import { HoverLift } from "./HoverLift";
import { Reveal } from "./Reveal";
import { Icon } from "./Icon";
import type { CmsMediaInsight } from "@/lib/cms";
import type { Locale } from "@/i18n/config";
import { insightText, insightSource } from "@/content/mediaInsights";

/**
 * The Media Insights "huomiopallo" boxes — small data snippets from the NØRR3
 * Media Insights / Norstat study, placed on the pages they were suggested for.
 * The CMS decides which boxes are live (per page) and their order; this just
 * renders what it is given.
 *
 * Each box: the big figure lifted out of the study, the published sentence, and
 * the source line underneath. The number scales down as the figure string gets
 * longer ("93 %" vs "67 % / 63 % / 31 %") so it never overflows the card.
 */

function numberSize(big: string): string {
  const len = big.length;
  if (len <= 6) return "text-5xl lg:text-6xl";
  if (len <= 11) return "text-4xl lg:text-5xl";
  if (len <= 17) return "text-3xl lg:text-4xl";
  // Compound figures ("67 % / 65 % / 56 %") get a deliberately smaller,
  // three-part treatment so they wrap at the separators instead of shrinking
  // against the card edges and breaking the row's number hierarchy.
  return "text-2xl lg:text-3xl";
}

/** Join digit groups with a non-breaking space so Finnish thousands separators
 *  ("18 000", "n = 2 022") never orphan the trailing digits onto their own line. */
function nbspNumbers(value: string): string {
  return value.replace(/(\d) (?=\d)/g, "$1\u00A0");
}

function gridFor(count: number): string {
  if (count === 1) return "grid mx-auto max-w-2xl";
  if (count === 2) return "grid gap-5 sm:grid-cols-2";
  if (count === 3) return "grid gap-5 md:grid-cols-3";
  return "grid gap-5 sm:grid-cols-2";
}

export function InsightBoxes({
  insights,
  locale,
  heading,
  className = "",
}: {
  insights: CmsMediaInsight[];
  locale: Locale;
  /** Optional small eyebrow above the boxes, e.g. "Media Insights". */
  heading?: string;
  className?: string;
}) {
  if (!insights.length) return null;

  return (
    <div className={className}>
      {heading && (
        <div className="mb-6 flex items-center gap-2 text-purple dark:text-light-purple">
          <Icon name="insights" style={{ fontSize: "18px" }} />
          <span className="text-xs font-medium uppercase tracking-[0.14em]">{heading}</span>
        </div>
      )}
      <div className={gridFor(insights.length)}>
        {insights.map((insight, i) => {
          const big = nbspNumbers((insight.bigNumber || "").trim());
          const text = nbspNumbers(insightText(insight, locale));
          const source = nbspNumbers(insightSource(insight, locale));
          return (
            <Reveal key={insight.id} delay={i * 0.06} className="h-full">
              <HoverLift className="h-full" lift={3} scale={1.015}>
                <div className="flex h-full flex-col rounded-card bg-grey/70 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
                  {big && (
                    <div
                      className={`font-medium leading-[1.05] tabular-nums text-purple dark:text-light-purple ${numberSize(big)}`}
                      style={{ letterSpacing: "-0.04em" }}
                    >
                      {big}
                    </div>
                  )}
                  <p className="mt-4 text-sm leading-relaxed text-ink/80 dark:text-white/80">{text}</p>
                  {source && (
                    <p className="mt-auto pt-5 text-[11px] leading-snug text-ink/45 dark:text-white/45">
                      {source}
                    </p>
                  )}
                </div>
              </HoverLift>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}