import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PixelArt } from "@/components/PixelArt";
import { HoverLift } from "@/components/HoverLift";

/**
 * Service card per Figma: centered yellow icon tile, yellow index number,
 * title, copy, outlined READ MORE. The highlighted variant is purple with the
 * pixel-dissolve diagonal.
 *
 * The whole card is a real link to the services page (previously the READ
 * MORE pill was decorative-only with no href — a dead-end CTA) and lifts on
 * hover via GSAP (HoverLift) so it reads as interactive before the click.
 */
export function ServiceCard({
  number,
  icon,
  title,
  body,
  readMoreLabel,
  highlighted = false,
  href,
}: {
  number: string;
  icon: string;
  title: string;
  body: string;
  readMoreLabel: string;
  highlighted?: boolean;
  href: string;
}) {
  return (
    <HoverLift className="h-full">
      <Link
        href={href}
        className={`group relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-[5px] px-8 pb-9 pt-24 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple ${
          highlighted ? "bg-purple text-white" : "bg-pastel-purple/60 text-ink"
        }`}
      >
        {highlighted && (
          <PixelArt color="#000000" className="pointer-events-none absolute -left-4 -top-4 w-2/3 opacity-90" />
        )}
        <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-[5px] bg-yellow text-ink">
          <Icon name={icon} style={{ fontSize: "32px" }} />
        </div>
        <span className="relative text-2xl font-medium text-yellow [text-shadow:0_0_1px_rgba(0,0,0,0.15)]">
          {number}
        </span>
        <h3 className="relative text-lg font-medium">{title}</h3>
        <p className={`relative text-sm leading-relaxed ${highlighted ? "text-white/80" : "text-ink/60"}`}>
          {body}
        </p>
        <span
          className={`relative mt-auto inline-flex items-center rounded-full border px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
            highlighted
              ? "border-white/50 text-white group-hover:bg-white group-hover:text-ink"
              : "border-ink/40 text-ink group-hover:bg-ink group-hover:text-white"
          }`}
        >
          {readMoreLabel}
        </span>
      </Link>
    </HoverLift>
  );
}
