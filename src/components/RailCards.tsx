import { Icon } from "@/components/Icon";
import { MediaAsset } from "@/components/MediaAsset";
import { Reveal } from "@/components/Reveal";
import { insightSource, insightText } from "@/content/mediaInsights";
import type { RailCard } from "@/lib/rail";
import type { CmsRailItem } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * The right-hand rail on the service pages: up to three small support cards
 * (CMS rail items + rail-placed Media Insights), stacked above the
 * "what you get" checklist. Server component — the selection happens in
 * `src/lib/rail.ts`; this only renders it.
 */

const ITEM_ICONS: Record<CmsRailItem["type"], string> = {
  decision_card: "strategy",
  process: "task_alt",
  key_number: "query_stats",
  campaign_lesson: "lightbulb",
  table: "insights",
  good_to_know: "info",
};

const BODY_CLASS = "text-[13px] leading-relaxed text-ink/70 dark:text-white/70";
const SOURCE_CLASS = "text-[12px] leading-relaxed text-ink/60 dark:text-white/60";
const LIST_ITEM_CLASS = "flex items-start gap-2.5 text-[13px] leading-relaxed text-ink/75 dark:text-white/75";
const CHIP_CLASS = "flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-violet text-white";
const SHELL_CLASS = "rounded-[20px] p-5 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10";

export function RailCards({ cards, locale }: { cards: RailCard[]; locale: Locale }) {
  if (cards.length === 0) return null;
  return (
    <aside aria-label={locale === "fi" ? "Tukevat nostot" : "Supporting highlights"} className="space-y-4">
      {cards.map((card, i) => (
        <Reveal key={card.kind === "insight" ? `insight-${card.insight.id}` : `item-${card.item.id}`} delay={i * 0.05}>
          {card.kind === "insight" ? <InsightCard card={card} locale={locale} /> : <ItemCard item={card.item} locale={locale} />}
        </Reveal>
      ))}
    </aside>
  );
}

/** A Media Insights box: big number first, then the text, then the source. */
function InsightCard({ card, locale }: { card: Extract<RailCard, { kind: "insight" }>; locale: Locale }) {
  const { insight } = card;
  const bigNumber = (insight.bigNumber || "").trim();
  // buildRail's locale gate guarantees the EN text/source exist on `en`.
  const text = insightText(insight, locale);
  const source = insightSource(insight, locale);
  return (
    <div className={`${SHELL_CLASS} bg-grey`}>
      <span className={CHIP_CLASS} aria-hidden>
        <Icon name="insights" className="text-[16px]" />
      </span>
      {bigNumber && (
        <p className="mt-3 text-3xl font-medium tabular-nums tracking-tight text-purple dark:text-light-purple">
          {bigNumber}
        </p>
      )}
      {text && <p className="mt-1.5 text-[13px] leading-relaxed text-ink/80 dark:text-white/80">{text}</p>}
      {source && <p className={`mt-2.5 ${SOURCE_CLASS}`}>{source}</p>}
    </div>
  );
}

/** A CMS-composed rail item: icon + title, optional picture, body paragraphs, list, source. */
function ItemCard({ item, locale }: { item: CmsRailItem; locale: Locale }) {
  const title = (item.title?.[locale] ?? "").trim();
  const body = (item.body?.[locale] ?? "").trim();
  const list = (item.items?.[locale] ?? []).map((entry) => (entry ?? "").trim()).filter(Boolean);
  const source = (item.source?.[locale] ?? "").trim();
  const paragraphs = body ? body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean) : [];
  // "Text-box + picture" card: the CMS media path (MediaAsset decides image vs
  // video, as with every CMS-stored media path). Empty or absent renders the
  // text-only card exactly as before — zero layout change.
  const image = (item.image ?? "").trim();
  const imageAlt =
    (item.imageAlt?.[locale] ?? "").trim() || (item.imageAlt?.fi ?? "").trim() || title || "";
  return (
    <div className={`${SHELL_CLASS} bg-light-purple`}>
      {title && (
        <div className="flex items-start gap-3">
          <span className={CHIP_CLASS} aria-hidden>
            <Icon name={ITEM_ICONS[item.type] ?? "info"} className="text-[16px]" />
          </span>
          <h3 className="text-[15px] font-medium text-ink dark:text-white">{title}</h3>
        </div>
      )}
      {image && (
        <MediaAsset
          src={image}
          alt={imageAlt}
          width={800}
          height={500}
          loading="lazy"
          className={`aspect-[16/10] w-full rounded-[14px] object-cover ${title ? "mt-3" : ""}`}
        />
      )}
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={`${BODY_CLASS} ${i === 0 ? "mt-2.5" : "mt-2"}`}>
          {paragraph}
        </p>
      ))}
      {list.length > 0 &&
        (item.type === "process" ? (
          <ol className="mt-3 space-y-2.5">
            {list.map((entry, i) => (
              <li key={i} className={LIST_ITEM_CLASS}>
                <span className="mt-[2px] shrink-0 text-[11px] font-medium tabular-nums text-purple dark:text-light-purple">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {entry}
              </li>
            ))}
          </ol>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {list.map((entry, i) => (
              <li key={i} className={LIST_ITEM_CLASS}>
                <Icon name="check" className="mt-[2px] shrink-0 text-[16px] text-purple dark:text-light-purple" />
                {entry}
              </li>
            ))}
          </ul>
        ))}
      {source && <p className={`mt-2.5 ${SOURCE_CLASS}`}>{source}</p>}
    </div>
  );
}
