import { Icon } from "@/components/Icon";
import { clients as bundledClients } from "@/content/services";

const PILL_TONES = [
  "bg-white text-ink",
  "bg-purple text-white",
  "bg-light-purple text-ink",
];

const CHIP_ICONS = ["interests", "trending_up", "monitoring", "bar_chart"];

/** The "Highlights" band: client pills scrolling over a soft violet surface. */
export function HighlightsBand({
  label,
  clients = bundledClients,
}: {
  label: string;
  clients?: string[];
}) {
  const row = (
    <div className="flex shrink-0 items-center gap-4 pr-4">
      {clients.map((name, i) => (
        <span key={name} className="flex items-center gap-4">
          <span
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-base font-medium ${PILL_TONES[i % PILL_TONES.length]}`}
          >
            {name}
            <span aria-hidden>→</span>
          </span>
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${i % 3 === 1 ? "bg-purple text-white" : "bg-white text-ink"}`}
          >
            <Icon name={CHIP_ICONS[i % CHIP_ICONS.length]} className="text-[20px]" />
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="bg-violet py-12 dark:bg-white/[0.04] dark:border-y dark:border-white/10">
      {/* Same uppercase eyebrow treatment as the StatGrid label, so every
          small section label on the site reads as one system. */}
      <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.14em] text-white/60">
        {label}
      </p>
      <div className="marquee-paused overflow-hidden" style={{ ["--marquee-duration" as string]: "var(--marquee-pills, 45s)" }}>
        <div className="marquee-track items-center">
          {row}
          {row}
        </div>
      </div>
    </section>
  );
}
