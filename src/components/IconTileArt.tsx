"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The brand "tile" motif from the Figma card design: a lavender ground with a
 * thin purple inner frame, a lime pixel stack running off the upper-left,
 * muted ghost cards trailing to the lower-right, and a yellow main card with
 * the chosen Material icon centred on it.
 *
 * Fully responsive: every position/size is a percentage of the reference
 * 223×379 tile, so it fills whatever hero card it lands in with no white
 * overflow. The stack slides in staggered and the icon scales up on mount;
 * reduced-motion renders the finished state statically.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* Reference tile is 223w × 379h. Percentages below are of that. */
const W = (px: number) => `${(px / 223) * 100}%`;
const H = (px: number) => `${(px / 379) * 100}%`;

const STACK = [
  { left: -69, top: 2 },
  { left: -49, top: 22 },
  { left: -29, top: 42 },
  { left: -9, top: 62 },
  { left: 11, top: 82 },
  { left: 31, top: 102 },
];

const GHOSTS = [
  { left: 120, top: 202, bg: "#d9cedc" },
  { left: 140, top: 222, bg: "#d7d2cb" },
  { left: 160, top: 242, bg: "#d6d7b5" },
  { left: 180, top: 262, bg: "#d4dc9b" },
  { left: 200, top: 282, bg: "#d4e17f" },
  { left: 220, top: 302, bg: "#d2e664" },
];

export function IconTileArt({
  icon = "monitoring",
  className = "",
}: {
  /** Material icon name from the CMS hero config. */
  icon?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className={`relative h-full w-full overflow-hidden rounded-[4px] bg-[#dacbe5] ${className}`}
    >
      {/* Lime stack — runs off the upper-left edge */}
      <div aria-hidden className="absolute inset-0">
        {STACK.map((pos, i) => (
          <motion.span
            key={`s${i}`}
            className="absolute rounded-[5px] bg-[#d2f000]"
            style={{ left: W(pos.left), top: H(pos.top), width: W(123), height: H(123) }}
            initial={reduce ? false : { x: "-18%", y: "-18%", opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: EASE }}
          />
        ))}
      </div>

      {/* Ghosts — muted continuation trailing to the lower-right */}
      <div aria-hidden className="absolute inset-0">
        {GHOSTS.map((pos, i) => (
          <motion.span
            key={`g${i}`}
            className="absolute rounded-[5px]"
            style={{
              left: W(pos.left),
              top: H(pos.top),
              width: W(123),
              height: H(123),
              background: pos.bg,
            }}
            initial={reduce ? false : { x: "18%", y: "18%", opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
          />
        ))}
      </div>

      {/* Main yellow card with the icon centred — scales up on mount */}
      <motion.div
        className="absolute z-10 flex items-center justify-center rounded-[5px] bg-[#eeff00]"
        style={{ left: W(51), top: H(122), width: W(123), height: H(123) }}
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
      >
        <motion.span
          aria-hidden
          className="material-symbols-outlined select-none leading-none text-[#6100ad]"
          style={{ fontSize: "clamp(28px, 22%, 56px)" }}
          initial={reduce ? false : { scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
        >
          {icon}
        </motion.span>
      </motion.div>
    </div>
  );
}
