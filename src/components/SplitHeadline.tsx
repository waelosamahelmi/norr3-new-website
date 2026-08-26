"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The Figma hero device: left words and a right "_Accent" word spread to the
 * page edges, all black, with room for a collage or pill row in/below the gap.
 * The underscore blinks like a caret before the accent word settles.
 *
 * `accents` turns the accent word into a cycle: it rotates through the list
 * (Services hero walks "Our services include" through the service spectrum).
 * SSR, no-JS and reduced-motion all render the first word, so the resting
 * headline is always the full static sentence; the h1's aria-label carries
 * that resting sentence for assistive tech while the animated spans are
 * aria-hidden.
 *
 * `middle` is the decorative graphic slot in the gap between the words —
 * mirroring how the home hero fills its middle with the rotating photo stack.
 * On lg+ it flexes between the words (shrinking before it would ever wrap);
 * below lg it drops under the headline as its own centred row, like home.
 */
export function SplitHeadline({
  left,
  accent,
  accents,
  middle,
  stack = false,
  className = "",
  children,
}: {
  left: string;
  accent: string;
  /** Cycle the accent word through these; falls back to the static `accent`. */
  accents?: string[];
  middle?: ReactNode;
  /** Force the accent word onto its own line below `left`. */
  stack?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const cycling = !!accents && accents.length > 1;
  // Joined key so a fresh array identity per render cannot reset the timer.
  const accentKey = accents ? accents.join("\u0001") : "";
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!cycling) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const list = accentKey.split("\u0001");
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % list.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [cycling, accentKey]);

  const shownAccent = cycling && accents ? accents[idx % accents.length] ?? accent : accent;

  return (
    <div className={className}>
      <h1
        aria-label={`${left} ${accents?.[0] ?? accent}`}
        className="flex flex-wrap items-baseline justify-between gap-x-8 font-medium leading-[1.05] tracking-tight text-ink dark:text-white"
      >
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {left}
        </motion.span>
        {middle && (
          <span
            aria-hidden
            className="order-3 mt-8 flex w-full justify-center lg:order-none lg:mt-0 lg:min-w-0 lg:flex-1"
          >
            {middle}
          </span>
        )}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={stack ? "block basis-full" : "block"}
        >
          <motion.span
            key={shownAccent}
            initial={cycling ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={cycling ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] } : undefined}
            className="inline-block"
          >
            <span aria-hidden className="caret-blink">
              _
            </span>
            {shownAccent}
          </motion.span>
        </motion.span>
      </h1>
      {children}
    </div>
  );
}
