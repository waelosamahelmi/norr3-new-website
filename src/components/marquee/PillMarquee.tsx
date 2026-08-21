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

// Black & white pill/chip tones — used when the marquee sits on top of a photo
// (PhotoInterstitial) so the widgets read as a monochrome overlay instead of
// competing with the image's colour.
const MONO_PILL_TONES = [
  "bg-ink text-white",
  "bg-white text-ink ring-1 ring-black/10",
  "bg-ink text-white",
  "bg-white text-ink ring-1 ring-black/10",
  "bg-ink text-white",
];

const MONO_CHIP_TONES = [
  "bg-white text-ink ring-1 ring-black/10",
  "bg-ink text-white",
  "bg-white text-ink ring-1 ring-black/10",
  "bg-ink text-white",
];

export function PillMarquee({
  items,
  className = "",
  duration = "var(--marquee-pills, 35s)",
  monochrome = false,
}: {
  items: PillItem[];
  className?: string;
  /** Any CSS time. Defaults to the speed configured in the CMS theme. */
  duration?: string;
  /** Render the pills and chips in black & white (used over photos). */
  monochrome?: boolean;
}) {
  const pillTones = monochrome ? MONO_PILL_TONES : PILL_TONES;
  const chipTones = monochrome ? MONO_CHIP_TONES : CHIP_TONES;
  const row = (
    <div className="flex shrink-0 items-center gap-3 pr-3">
      {items.map((item, i) => (
        <span key={item.id} className="flex items-center gap-3">
          <span
            className={`flex items-center whitespace-nowrap rounded-full px-6 py-3 text-base font-medium ${pillTones[i % pillTones.length]}`}
          >
            {item.label}
          </span>
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${chipTones[i % chipTones.length]}`}
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
