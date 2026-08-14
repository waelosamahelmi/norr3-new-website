"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The Figma hero device: left words and a right "_Accent" word spread to the
 * page edges, all black, with room for a collage or pill row in/below the gap.
 * The underscore blinks like a caret before the accent word settles.
 */
export function SplitHeadline({
  left,
  accent,
  className = "",
  children,
}: {
  left: string;
  accent: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={className}>
      <h1 className="flex flex-wrap items-baseline justify-between gap-x-8 font-medium leading-[1.05] tracking-tight text-ink dark:text-white">
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {left}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          <span aria-hidden className="caret-blink">
            _
          </span>
          {accent}
        </motion.span>
      </h1>
      {children}
    </div>
  );
}
