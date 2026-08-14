"use client";

import { motion } from "framer-motion";

/**
 * The numeric-triad line — NØRR3's signature copy pattern (PROMPT §2.2): three
 * short clauses, escalating, the sharpest last ("One platform. 200+ channels.
 * Zero wasted clicks.").
 *
 * PROMPT §4 asks for the copy's own rhythm to be *felt*: each clause gets its
 * own beat, and the punchline lands one step larger in the accent colour rather
 * than fading in alongside its setup. framer-motion is wrapped in
 * `MotionConfig reducedMotion="user"` at the layout, so reduced-motion visitors
 * get the finished line with no movement.
 */
export function TriadLine({
  clauses,
  tone = "dark",
  className = "",
}: {
  clauses: readonly string[];
  /** "dark" = on the light/base surface, "light" = on ink/violet bands. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const setup = tone === "light" ? "text-white/70" : "text-ink/60 dark:text-white/60";
  const punch = tone === "light" ? "text-yellow" : "text-purple dark:text-light-purple";

  return (
    <p className={`flex flex-col font-medium leading-[1.15] tracking-tight ${className}`}>
      {clauses.map((clause, i) => {
        const isPunch = i === clauses.length - 1;
        return (
          <motion.span
            key={clause}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className={isPunch ? punch : setup}
          >
            {clause}
          </motion.span>
        );
      })}
    </p>
  );
}
