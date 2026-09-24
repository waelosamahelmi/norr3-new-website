import { headers } from "next/headers";
import { isProductionHost } from "@/lib/host";
import { normalizeInsightPath } from "@/content/mediaInsights";
import type { CmsMediaInsight, CmsRailItem } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * The right rail on the service pages: feature flag + card selection.
 *
 * Server-side only — this module reads `next/headers` and must never be
 * imported from a client component.
 */

/**
 * Whether the right rail renders.
 *
 * `RIGHT_RAIL_ENABLED` is the production kill-switch: flip it in `.env.local`
 * and restart — no deploy needed. `?rail=1` is a staging-only preview (ignored
 * on norr3.fi) so reviewers can see the rail before the flag is switched on.
 *
 * Reads `headers()`, which makes every route calling it render dynamically —
 * deliberate: the flag must take effect without a rebuild, and stale
 * prerendered HTML must never pin the rail on or off.
 */
export async function railEnabled(railParam?: string | null): Promise<boolean> {
  // Read the host unconditionally so the dynamic render can't be skipped.
  const host = (await headers()).get("host");
  const flag = (process.env.RIGHT_RAIL_ENABLED ?? "").trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  return railParam === "1" && !isProductionHost(host);
}

/** One rail card: either a Media Insights box or a CMS-composed rail item. */
export type RailCard =
  | { kind: "insight"; insight: CmsMediaInsight }
  | { kind: "item"; item: CmsRailItem };

const GROUP_A_TYPES = new Set(["decision_card", "process"]);
const GROUP_B_TYPES = new Set(["campaign_lesson", "key_number", "table", "good_to_know"]);

/**
 * Whether an item's media box shows in `locale`.
 *
 * The box needs its visibility flag and a non-empty image; on top of that the
 * locale gate never falls back to Finnish — when the FI topic/caption is
 * filled in but the active locale's is empty, the box is hidden in that
 * locale rather than showing a half-translated label. (`toRailItem` already
 * normalises an absent `mediaBoxVisible` — absent + image = visible, the
 * shape the seeded rows shipped in — so `?? true` here only covers
 * hand-built items that skipped parsing.)
 *
 * Exported because the renderer (`RailCards.tsx` → `ItemCard`) must agree
 * with this filter down to the last condition.
 */
export function mediaBoxShows(item: CmsRailItem, locale: Locale): boolean {
  if (!(item.mediaBoxVisible ?? true)) return false;
  if (!(item.image ?? "").trim()) return false;
  const fiTopic = (item.mediaTopic?.fi ?? "").trim();
  if (fiTopic && !(item.mediaTopic?.[locale] ?? "").trim()) return false;
  const fiCaption = (item.mediaCaption?.fi ?? "").trim();
  if (fiCaption && !(item.mediaCaption?.[locale] ?? "").trim()) return false;
  return true;
}

/**
 * Whether an item's text box shows in `locale`: the flag on (absent → on)
 * AND something to say — title, body or a non-empty list in that locale, so
 * Finnish copy never leaks onto the EN page (or vice versa).
 */
export function textBoxShows(item: CmsRailItem, locale: Locale): boolean {
  if (!(item.textBoxVisible ?? true)) return false;
  const title = (item.title?.[locale] ?? "").trim();
  const body = (item.body?.[locale] ?? "").trim();
  const list = (item.items?.[locale] ?? []).some((entry) => entry?.trim());
  return Boolean(title) || Boolean(body) || list;
}

/**
 * Pick the (at most three) cards the right rail shows on `path`.
 *
 * Pure — all data comes in through `opts`. Order: decision/process items
 * first, then up to two rail-placed Media Insights, then the lighter item
 * types; the whole rail is capped at three cards.
 */
export function buildRail(opts: {
  path: string;
  locale: Locale;
  insights: CmsMediaInsight[];
  items: CmsRailItem[];
}): RailCard[] {
  const target = normalizeInsightPath(opts.path);
  const locale = opts.locale;

  // Insights: rail-placed rows for this page, ordered by priority. The bundle
  // is already ordered url → priority → position → id, and Array#sort is
  // stable, so sorting on priority alone keeps the CMS order within a level.
  const insightCards: RailCard[] = (opts.insights ?? [])
    .filter((insight) => insight.placement === "rail" || insight.placement === "both")
    .filter((insight) => normalizeInsightPath(insight.url) === target)
    .sort((a, b) => a.priority - b.priority)
    // Locale gate — on EN, never fall back to Finnish: a row without English
    // text or source is hidden rather than half-translated.
    .filter((insight) =>
      locale === "en"
        ? Boolean(insight.text?.en?.trim()) && Boolean(insight.source?.en?.trim())
        : Boolean(insight.text?.fi?.trim())
    )
    .slice(0, 2)
    .map((insight) => ({ kind: "insight" as const, insight }));

  // Items: rows for this page with at least one box to show in the active
  // locale — the media box (visible + image + locale-complete topic/caption)
  // or the text box (visible + title/body/list in that locale). An item whose
  // boxes are both hidden here is dropped before ordering, so the renderer
  // never receives an empty card.
  const visibleItems = (opts.items ?? [])
    .filter((item) => normalizeInsightPath(item.url) === target)
    .filter((item) => mediaBoxShows(item, locale) || textBoxShows(item, locale));

  const byPositionThenId = (a: CmsRailItem, b: CmsRailItem) => a.position - b.position || a.id - b.id;
  const groupA = visibleItems.filter((item) => GROUP_A_TYPES.has(item.type)).sort(byPositionThenId);
  const groupB = visibleItems.filter((item) => GROUP_B_TYPES.has(item.type)).sort(byPositionThenId);

  return [
    ...groupA.map((item) => ({ kind: "item" as const, item })),
    ...insightCards,
    ...groupB.map((item) => ({ kind: "item" as const, item })),
  ].slice(0, 3);
}
