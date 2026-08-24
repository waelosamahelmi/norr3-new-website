"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { PixelArt } from "@/components/PixelArt";
import { HoverLift } from "@/components/HoverLift";

/**
 * Service card per Figma: centered yellow icon tile, yellow index number,
 * title, copy, outlined READ MORE.
 *
 * The purple "highlighted" treatment — solid purple, white text, the
 * pixel-dissolve diagonal — is purely a hover state: whichever card the
 * visitor's pointer is actually over gets it, via `group-hover`, and it lets
 * go the moment they move on.
 *
 * On the services page the card is also expandable: pressing it opens the
 * sub-service list inline (height + fade animated with framer-motion), which
 * pushes the rest of the grid down smoothly — the card grows inside its grid
 * cell rather than popping a modal over it. Pressing again (or focusing out,
 * via Escape) collapses it. The whole card remains a link to the services
 * page only when collapsed; expanded, the click target is the toggle.
 */
export function ServiceCard({
  number,
  icon,
  title,
  body,
  items,
  readMoreLabel,
  href,
  expandable = false,
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
  /** Services page: press to reveal the sub-services inline. */
  expandable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasItems = Boolean(items && items.length > 0);
  // A card without sub-services has nothing to expand — it stays a plain link.
  const interactive = expandable && hasItems;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((v) => !v);
    } else if (event.key === "Escape" && open) {
      setOpen(false);
    }
  };

  // The card itself: a link when it is a plain summary card, a button when it
  // expands (a button that navigates is a lie; a link that toggles is too).
  const className = `group relative flex h-full w-full flex-col items-center gap-4 overflow-hidden rounded-card bg-pastel-purple/60 px-card-pad pb-card-pad pt-20 text-center text-ink transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:bg-white/[0.04] dark:text-white dark:ring-1 dark:ring-white/10 hover:bg-purple hover:text-white dark:hover:bg-purple dark:hover:text-white dark:hover:ring-0 ${
    open ? "bg-purple text-white dark:bg-purple dark:text-white dark:ring-0" : ""
  }`;

  const shell = (
    <>
      <PixelArt className="pointer-events-none absolute -left-4 -top-4 w-2/3 opacity-0 transition-opacity duration-300 group-hover:opacity-90" />
      {/* 100×100 tile, 5px radius, yellow ground + black icon — the marketing
          service card treatment from BRAND_GUIDELINES §5. Unaffected by hover:
          it was never part of the purple/pastel distinction. */}
      <div className="relative flex h-[100px] w-[100px] items-center justify-center rounded-[5px] bg-yellow text-ink">
        <Icon name={icon} style={{ fontSize: "40px" }} />
      </div>
      {/* Yellow when open or hovered, matching the purple ground it sits on;
          purple the rest of the time, against the pastel ground. */}
      <span className="relative text-2xl font-medium text-purple transition-colors duration-300 group-hover:text-yellow dark:text-light-purple dark:group-hover:text-yellow">
        {number}
      </span>
      <h3 className="relative text-xl font-medium leading-snug">{title}</h3>
      <p className="relative text-sm leading-relaxed text-ink/65 transition-colors duration-300 group-hover:text-white/85 dark:text-white/65">
        {body}
      </p>

      {items && items.length > 0 && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              key="items"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-wrap justify-center gap-2 overflow-hidden"
            >
              {items.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-white/15 px-3 py-1 text-[11px] leading-snug text-white/90"
                >
                  {item}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}

      {interactive ? (
        <span
          className="relative mt-auto inline-flex items-center gap-1.5 rounded-full border border-ink/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-300 group-hover:border-white/50 group-hover:bg-white group-hover:text-ink dark:border-white/40 dark:text-white dark:group-hover:border-white/50 dark:group-hover:bg-white dark:group-hover:text-ink"
        >
          <span className="sr-only">{open ? "" : readMoreLabel} </span>
          {open ? <Icon name="remove" style={{ fontSize: "16px" }} /> : <Icon name="add" style={{ fontSize: "16px" }} />}
        </span>
      ) : (
        <span className="relative mt-auto inline-flex items-center rounded-full border border-ink/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-300 group-hover:border-white/50 group-hover:bg-white group-hover:text-ink dark:border-white/40 dark:text-white dark:group-hover:border-white/50 dark:group-hover:bg-white dark:group-hover:text-ink">
          {readMoreLabel}
        </span>
      )}
    </>
  );

  if (!interactive) {
    return (
      <HoverLift className="h-full">
        <Link href={href} className={className}>
          {shell}
        </Link>
      </HoverLift>
    );
  }

  return (
    <HoverLift className="h-full">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        className={className}
      >
        {shell}
      </button>
    </HoverLift>
  );
}
