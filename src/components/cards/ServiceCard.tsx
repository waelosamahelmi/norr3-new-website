import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PixelArt } from "@/components/PixelArt";
import { HoverLift } from "@/components/HoverLift";

/**
 * Service card per Figma: centered yellow icon tile, yellow index number,
 * title, copy, outlined READ MORE.
 *
 * The purple "highlighted" treatment — solid purple, white text, the
 * pixel-dissolve diagonal — used to be pinned to one fixed card by a CMS
 * flag, so the same card was always purple whether or not anyone was looking
 * at it. It is now purely a hover state: whichever card the visitor's
 * pointer is actually over gets it, via `group-hover`, and it lets go the
 * moment they move on. Nothing needs to pick a card for this any more.
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
  items,
  readMoreLabel,
  href,
}: {
  number: string;
  icon: string;
  title: string;
  body: string;
  /** Named services under this category — rendered as chips. Omitted on the
   *  home page, where the grid is a summary rather than a full service list. */
  items?: string[];
  readMoreLabel: string;
  href: string;
}) {
  return (
    <HoverLift className="h-full">
      <Link
        href={href}
        className="group relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-card bg-pastel-purple/60 px-card-pad pb-card-pad pt-20 text-center text-ink transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:bg-white/[0.04] dark:text-white dark:ring-1 dark:ring-white/10 hover:bg-purple hover:text-white dark:hover:bg-purple dark:hover:text-white dark:hover:ring-0"
      >
        <PixelArt className="pointer-events-none absolute -left-4 -top-4 w-2/3 opacity-0 transition-opacity duration-300 group-hover:opacity-90" />
        {/* 100×100 tile, 5px radius, yellow ground + black icon — the marketing
            service card treatment from BRAND_GUIDELINES §5. Unaffected by hover:
            it was never part of the purple/pastel distinction. */}
        <div className="relative flex h-[100px] w-[100px] items-center justify-center rounded-[5px] bg-yellow text-ink">
          <Icon name={icon} style={{ fontSize: "40px" }} />
        </div>
        {/* Yellow only on hover, matching the purple ground it now appears on;
            purple the rest of the time, against the pastel ground. */}
        <span className="relative text-2xl font-medium text-purple transition-colors duration-300 group-hover:text-yellow dark:text-light-purple dark:group-hover:text-yellow">
          {number}
        </span>
        <h3 className="relative text-xl font-medium leading-snug">{title}</h3>
        <p className="relative text-sm leading-relaxed text-ink/65 transition-colors duration-300 group-hover:text-white/85 dark:text-white/65">
          {body}
        </p>
        {items && items.length > 0 && (
          <ul className="relative flex flex-wrap justify-center gap-2">
            {items.map((item) => (
              <li
                key={item}
                className="rounded-full bg-white/70 px-3 py-1 text-[11px] leading-snug text-ink/75 transition-colors duration-300 group-hover:bg-white/15 group-hover:text-white/90 dark:bg-white/10 dark:text-white/75"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
        <span className="relative mt-auto inline-flex items-center rounded-full border border-ink/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-300 group-hover:border-white/50 group-hover:bg-white group-hover:text-ink dark:border-white/40 dark:text-white dark:group-hover:border-white/50 dark:group-hover:bg-white dark:group-hover:text-ink">
          {readMoreLabel}
        </span>
      </Link>
    </HoverLift>
  );
}
