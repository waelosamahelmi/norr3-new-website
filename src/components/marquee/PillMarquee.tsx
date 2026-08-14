import { Icon } from "@/components/Icon";

type PillItem = { id: string; icon: string; label: string };

/**
 * The colorful scrolling chip row from the Figma heroes and photo overlays:
 * labeled pills in rotating brand colors, separated by circular icon/arrow chips.
 */
const PILL_TONES = [
  "bg-violet text-white",
  "bg-yellow text-ink",
  "bg-purple text-white",
  "bg-white text-ink ring-1 ring-black/10",
  "bg-light-purple text-ink",
];

const CHIP_TONES = [
  "bg-pastel-purple text-ink",
  "bg-white text-ink ring-1 ring-black/10",
  "bg-purple text-white",
  // The black chip is the one tone that disappears against the dark base, so
  // it takes the same black-pill → purple treatment as the buttons.
  "bg-ink text-white dark:bg-purple",
];

export function PillMarquee({
  items,
  className = "",
  duration = "35s",
}: {
  items: PillItem[];
  className?: string;
  duration?: string;
}) {
  const row = (
    <div className="flex shrink-0 items-center gap-3 pr-3">
      {items.map((item, i) => (
        <span key={item.id} className="flex items-center gap-3">
          <span
            className={`flex items-center whitespace-nowrap rounded-full px-6 py-3 text-base font-medium ${PILL_TONES[i % PILL_TONES.length]}`}
          >
            {item.label}
          </span>
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${CHIP_TONES[i % CHIP_TONES.length]}`}
          >
            <Icon name={i % 2 === 0 ? item.icon : "arrow_forward"} className="text-[20px]" />
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee-paused overflow-hidden ${className}`}
      style={{ ["--marquee-duration" as string]: duration }}
    >
      <div className="marquee-track items-center">
        {row}
        {row}
      </div>
    </div>
  );
}
