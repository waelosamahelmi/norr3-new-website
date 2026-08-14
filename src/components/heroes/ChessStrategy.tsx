"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMotionAllowed } from "./useMotionAllowed";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Square size in viewBox units — taken from the user's draft SVG (44.03px). */
const SQUARE = 44;
/** Square height is thinner than width so the board reads as a slim strip. */
const SQ_H = 24;
const SQUARES = 8;
/** Board left edge; the rank sits at the bottom of the viewBox. */
const BOARD_X = 10;
const BOARD_Y = 80;

/** One hop's travel time. */
const HOP_MS = 750;
/** Rest on each square between hops. */
const HOLD_MS = 850;
/** Longer rest on the last square before the fade-reset. */
const END_HOLD_MS = 1500;
/** Fade out/in time for the reset back to the first square. */
const FADE_MS = 450;

/**
 * The minimal queen, recreated from the user's draft (crown balls, three-point
 * crown, collar, skirt, plinth), centred over the first square. The plinth
 * bottom sits exactly on BOARD_Y so the piece stands on the rank.
 * All y-coords are offset by (BOARD_Y + SQ_H - 58) so the piece shifts down
 * to match the thinner, lower board.
 */
const Q_Y = 22; // BOARD_Y - original plinth bottom (80 - 58)

function Queen() {
  return (
    <>
      <circle cx={19} cy={5.6 + Q_Y} r={2.6} />
      <circle cx={32} cy={2.6 + Q_Y} r={2.6} />
      <circle cx={45} cy={5.6 + Q_Y} r={2.6} />
      <path d={`M23,${22 + Q_Y} L19,${9 + Q_Y} L27,${15.5 + Q_Y} L32,${4.5 + Q_Y} L37,${15.5 + Q_Y} L45,${9 + Q_Y} L41,${22 + Q_Y} Z`} />
      <rect x={22.5} y={22 + Q_Y} width={19} height={5} />
      <path d={`M25.5,${27 + Q_Y} H38.5 L47,${48 + Q_Y} H17 Z`} />
      <rect x={14} y={48 + Q_Y} width={36} height={10} />
    </>
  );
}

/** The rank: eight squares, alternating filled / empty, all in currentColor. */
function Rank() {
  return (
    <>
      {Array.from({ length: SQUARES }, (_, i) =>
        i % 2 === 0 ? (
          <rect
            key={i}
            x={BOARD_X + i * SQUARE}
            y={BOARD_Y}
            width={SQUARE}
            height={SQ_H}
            fill="currentColor"
          />
        ) : (
          <rect
            key={i}
            x={BOARD_X + i * SQUARE}
            y={BOARD_Y}
            width={SQUARE}
            height={SQ_H}
            fill="none"
          />
        ),
      )}
    </>
  );
}

const SVG_CLASS = "h-auto w-full max-w-[280px] lg:max-w-[380px]";
/** Queen colour — brand purple, lifting to light-purple on the dark base. */
const QUEEN_CLASS = "text-purple dark:text-light-purple";

/**
 * Services hero graphic: a single chess rank with a queen that hops square to
 * square, left to right — strategy as thinking several moves ahead. At the last
 * square she fades out and reappears on the first. The squares ride
 * currentColor (ink → white in dark); the queen takes the brand purple.
 *
 * Decorative only (the headline text carries the meaning), so the SVG is
 * aria-hidden by the SplitHeadline slot and inert here. Reduced-motion users —
 * and everyone before hydration — get the static rank with the queen at rest
 * on the first square.
 */
export function ChessStrategy() {
  const motionAllowed = useMotionAllowed();
  const [square, setSquare] = useState(0);
  /** True while the queen fades out on the last square, before the reset. */
  const [hidden, setHidden] = useState(false);
  /** True for one beat after the reset so the jump back to x=0 is instant. */
  const [teleported, setTeleported] = useState(false);

  // A single timer chain: hop → hold → … → end hold → fade → teleport → repeat.
  useEffect(() => {
    if (!motionAllowed) return;
    let t: number;
    if (hidden) {
      t = window.setTimeout(() => {
        setTeleported(true);
        setSquare(0);
        setHidden(false);
      }, FADE_MS + 150);
    } else if (teleported) {
      t = window.setTimeout(() => setTeleported(false), 80);
    } else if (square < SQUARES - 1) {
      t = window.setTimeout(() => setSquare((s) => s + 1), HOP_MS + HOLD_MS);
    } else {
      t = window.setTimeout(() => setHidden(true), END_HOLD_MS);
    }
    return () => window.clearTimeout(t);
  }, [motionAllowed, square, hidden, teleported]);

  if (!motionAllowed) {
    return (
      <svg viewBox="0 0 372 104" className={SVG_CLASS} aria-hidden focusable="false">
        <Rank />
        <g className={QUEEN_CLASS} fill="currentColor">
          <Queen />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 372 104" className={SVG_CLASS} aria-hidden focusable="false">
      <Rank />
      {/* Horizontal travel is a tween on the group; the vertical arc is a CSS
          keyframe (globals.css `queen-hop`) re-triggered by remounting the
          inner group on each square, so the two compose into a hop. */}
      <motion.g
        className={QUEEN_CLASS}
        fill="currentColor"
        initial={false}
        animate={{ x: square * SQUARE, opacity: hidden ? 0 : 1 }}
        transition={{
          x: teleported ? { duration: 0 } : { duration: HOP_MS / 1000, ease: EASE },
          opacity: { duration: FADE_MS / 1000, ease: "easeOut" },
        }}
      >
        <g
          key={square}
          style={square > 0 ? { animation: `queen-hop ${HOP_MS}ms ease-in-out` } : undefined}
        >
          <Queen />
        </g>
      </motion.g>
    </svg>
  );
}
