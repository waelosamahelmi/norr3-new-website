import { clients } from "@/content/services";

/** Grayscale client "logo" strip — slow marquee, matching the design's ● Logo row. */
export function LogoStrip() {
  const row = (
    <div className="flex shrink-0 items-center">
      {clients.map((name) => (
        <span
          key={name}
          className="mx-7 flex items-center gap-2 whitespace-nowrap text-sm font-medium text-ink/60"
        >
          <span className="h-2 w-2 rounded-full bg-ink/70" />
          {name}
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-black/5 py-5" style={{ ["--marquee-duration" as string]: "55s" }}>
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}
