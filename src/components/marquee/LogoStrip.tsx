import { clients as bundledClients } from "@/content/services";

/** Grayscale client "logo" strip — slow marquee, matching the design's ● Logo row. */
export function LogoStrip({ clients = bundledClients }: { clients?: string[] }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {clients.map((name) => (
        <span
          key={name}
          className="mx-7 flex items-center gap-2 whitespace-nowrap text-sm font-medium text-ink/60 dark:text-white/60"
        >
          <span className="h-2 w-2 rounded-full bg-ink/70 dark:bg-white/70" />
          {name}
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-black/5 py-5 dark:border-white/10" style={{ ["--marquee-duration" as string]: "var(--marquee-logos, 55s)" }}>
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
