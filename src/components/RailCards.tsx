import { Icon } from "@/components/Icon";
import { MediaAsset } from "@/components/MediaAsset";
import { Reveal } from "@/components/Reveal";
import { insightSource, insightText } from "@/content/mediaInsights";
import { mediaBoxShows, textBoxShows, type RailCard } from "@/lib/rail";
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

/**
 * A CMS-composed rail item: up to two independent boxes — the media box (grey
 * shell) on top, the text box (light-purple shell) below — with space-y-4
 * between them when both show. buildRail already dropped items whose boxes
 * are all hidden in the active locale, and the per-box gating is imported
 * from there (`mediaBoxShows` / `textBoxShows`) so filter and render can't
 * disagree. One box = one bare shell, exactly as before the two-box split.
 */
function ItemCard({ item, locale }: { item: CmsRailItem; locale: Locale }) {
  const mediaBox = mediaBoxShows(item, locale) ? <MediaBox item={item} locale={locale} /> : null;
  const textBox = textBoxShows(item, locale) ? <TextBox item={item} locale={locale} /> : null;
  if (mediaBox && textBox) {
    return (
      <div className="space-y-4">
        {mediaBox}
        {textBox}
      </div>
    );
  }
  return mediaBox ?? textBox;
}

/** The media box: topic label, the image (picture treatment or graph-on-white), caption. */
function MediaBox({ item, locale }: { item: CmsRailItem; locale: Locale }) {
  const image = (item.image ?? "").trim();
  const topic = (item.mediaTopic?.[locale] ?? "").trim();
  const caption = (item.mediaCaption?.[locale] ?? "").trim();
  const title = (item.title?.[locale] ?? "").trim();
  // Alt chain: the stored per-locale alt wins, then the box's own copy.
  const alt = (item.imageAlt?.[locale] ?? "").trim() || caption || topic || title || "";
  return (
    <div className={`${SHELL_CLASS} bg-grey`}>
      {topic && <p className="mb-2.5 text-[12px] font-medium text-ink/70 dark:text-white/70">{topic}</p>}
      <MediaAsset
        src={image}
        alt={alt}
        width={800}
        height={500}
        loading="lazy"
        className={`${
          item.mediaKind === "graph"
            ? "w-full rounded-[14px] bg-white p-3 object-contain"
            : "aspect-[16/10] w-full rounded-[14px] object-cover"
        } ${topic ? "mt-2.5" : ""}`}
      />
      {caption && <p className={`mt-2.5 ${SOURCE_CLASS}`}>{caption}</p>}
    </div>
  );
}

/** The text box: icon + title, body paragraphs, list (process = steps), source. */
function TextBox({ item, locale }: { item: CmsRailItem; locale: Locale }) {
  const title = (item.title?.[locale] ?? "").trim();
  const body = (item.body?.[locale] ?? "").trim();
  const list = (item.items?.[locale] ?? []).map((entry) => (entry ?? "").trim()).filter(Boolean);
  const source = (item.source?.[locale] ?? "").trim();
  const paragraphs = body ? body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean) : [];
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
