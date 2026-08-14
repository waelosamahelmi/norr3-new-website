"use client";

import { motion } from "framer-motion";
import type { Easing } from "framer-motion";
import { useMotionAllowed } from "./useMotionAllowed";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** One animation cycle, in seconds: draw-in, then a long visible hold. */
const CYCLE_S = 4.6;
/** Blank beat between cycles before the platform redraws. */
const PAUSE_S = 0.4;

/** The shared platform: a base line the three arrows launch from. */
const BASE = "M8,128 H60";

/**
 * The three staircase arrows, recreated from the user's draft (stroked
 * centerlines instead of the draft's filled rectangles, so stroke draw-on
 * works). All share the base and the first riser, then fan apart: steep to the
 * top, mid up-right, and one running flat to the far right. `start`/`end` are
 * fractions of CYCLE_S — staggered launches (~120ms apart), heads landing last.
 */
const ARROWS = [
  {
    d: "M60,128 L84,104 H108 L155,42",
    head: "M168,24 L165,49 L144,34 Z",
    start: 0.11,
    end: 0.284,
  },
  {
    d: "M60,128 L84,104 H140 L241,47",
    head: "M260,36 L247,58 L234.5,35.5 Z",
    start: 0.136,
    end: 0.31,
  },
  {
    d: "M60,128 L84,104 H314",
    head: "M336,104 L314,117 L314,91 Z",
    start: 0.162,
    end: 0.336,
  },
];

const SVG_CLASS = "h-auto w-full max-w-[230px] lg:max-w-[300px]";

const loop = (times: number[], ease: Easing | Easing[]) => ({
  duration: CYCLE_S,
  times,
  ease,
  repeat: Infinity,
  repeatDelay: PAUSE_S,
});

/**
 * Engine hero graphic: one platform line that draws in, then splits into three
 * arrows shooting up-right in quick succession — one platform delivering
 * everywhere. Everything rides currentColor so it flips white on the dark base.
 *
 * Decorative only (aria-hidden via the SplitHeadline slot). Reduced-motion
 * users — and everyone before hydration — get the fully drawn static graphic.
 */
export function ArrowsDeliver() {
  const motionAllowed = useMotionAllowed();

  if (!motionAllowed) {
    return (
      <svg viewBox="0 0 344 140" className={SVG_CLASS} aria-hidden focusable="false">
        <g stroke="currentColor" strokeWidth={10} fill="none">
          <path d={BASE} />
          {ARROWS.map((a) => (
            <path key={a.d} d={a.d} />
          ))}
        </g>
        {ARROWS.map((a) => (
          <path key={a.head} d={a.head} fill="currentColor" />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 344 140" className={SVG_CLASS} aria-hidden focusable="false">
      {/* Every child shares CYCLE_S + PAUSE_S, so the timeline stays in sync:
          base draws, arrows launch staggered, heads land, long hold, fade out. */}
      <motion.g
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={loop([0, 0.87, 1], ["linear", "easeIn"])}
      >
        <g stroke="currentColor" strokeWidth={10} fill="none">
          <motion.path
            d={BASE}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={loop([0, 0.11, 1], [EASE, "linear"])}
          />
          {ARROWS.map((a) => (
            <motion.path
              key={a.d}
              d={a.d}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0, 1, 1] }}
              transition={loop([0, a.start, a.end, 1], ["linear", EASE, "linear"])}
            />
          ))}
        </g>
        {ARROWS.map((a) => (
          <motion.path
            key={a.head}
            d={a.head}
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1] }}
            transition={loop([0, a.end, a.end + 0.045, 1], "linear")}
          />
        ))}
      </motion.g>
    </svg>
  );
}
