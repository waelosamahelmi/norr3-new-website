"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { PixelArt } from "@/components/PixelArt";
import { HoverLift } from "@/components/HoverLift";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Service card per Figma: centered yellow icon tile, yellow index number,
 * title, copy. No CTA inside — the card is a plain expander: pressing it (or
 * hitting Enter/Space) reveals the sub-service list, each with its own one-line
 * description; pressing again (or Escape) collapses it. The small +/− is the
 * only control, and a card with no sub-services stays static.
 *
 * The purple "highlighted" treatment — solid purple, white text, the
 * pixel-dissolve diagonal — is purely a hover state: whichever card the
 * visitor's pointer is actually over gets it, via `group-hover`.
 */
export function ServiceCard({
  number,
  icon,
  title,
  body,
  items,
  outcomes,
  whatYouGetLabel,
}: {
  number: string;
  icon: string;
  title: string;
  body: string;
  /** Sub-services: { label, desc? } pairs localized by the caller. */
  items?: { label: string; desc?: string }[];
  /** "What you get" checklist that closes the expansion. */
  outcomes?: string[];
  whatYouGetLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const hasItems = Boolean(items && items.length > 0);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!hasItems) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((v) => !v);
    } else if (event.key === "Escape" && open) {
      setOpen(false);
    }
  };

  const className = `group relative flex h-full w-full cursor-pointer flex-col items-center gap-4 overflow-hidden rounded-card bg-pastel-purple/60 px-card-pad pb-card-pad pt-20 text-center text-ink transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:bg-white/[0.04] dark:text-white dark:ring-1 dark:ring-white-10 hover:bg-purple hover:text-white dark:hover:bg-purple dark:hover:text-white dark:hover:ring-0 dark:ring-white/10 ${
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

      {hasItems && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative w-full overflow-hidden"
            >
              {/* The expansion: each sub-service with its own description,
                  then a "what you get" checklist. Left-aligned on purpose —
                  the card's centered summary stays centered; the detail is
                  prose, and prose reads ragged-centered badly. */}
              <div className="mt-2 w-full space-y-5 rounded-[16px] bg-black/20 p-5 text-left">
                <ul className="space-y-4">
                  {items!.map((item) => (
                    <li key={item.label}>
                      <p className="flex items-center gap-2 text-sm font-medium text-white">
                        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-yellow" aria-hidden />
                        {item.label}
                      </p>
                      {item.desc && (
                        <p className="mt-1 pl-3.5 text-[13px] leading-relaxed text-white/70">{item.desc}</p>
                      )}
                    </li>
                  ))}
                </ul>

                {outcomes && outcomes.length > 0 && (
                  <div className="border-t border-white/25 pt-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-yellow">
                      {whatYouGetLabel}
                    </p>
                    <ul className="mt-2.5 space-y-1.5">
                      {outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-2 text-[13px] leading-snug text-white/85">
                          <Icon name="check" className="mt-[2px] shrink-0 text-[15px] text-yellow" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {hasItems && (
        <span
          aria-hidden
          className="relative mt-auto inline-flex items-center justify-center rounded-full border border-ink/40 p-2 text-ink transition-colors duration-300 group-hover:border-white/50 group-hover:bg-white group-hover:text-ink dark:border-white/40 dark:text-white dark:group-hover:border-white/50 dark:group-hover:bg-white dark:group-hover:text-ink mt-4"
        >
          {open ? <Icon name="remove" style={{ fontSize: "16px" }} /> : <Icon name="add" style={{ fontSize: "16px" }} />}
        </span>
      )}
    </>
  );

  return (
    <HoverLift className="h-full">
      <button
        type="button"
        aria-expanded={hasItems ? open : undefined}
        onClick={hasItems ? () => setOpen((v) => !v) : undefined}
        onKeyDown={handleKeyDown}
        className={`${className} ${hasItems ? "" : "cursor-default hover:bg-pastel-purple/60 hover:text-ink dark:hover:bg-white/[0.04] dark:hover:text-white"}`}
      >
        {shell}
      </button>
    </HoverLift>
  );
}
