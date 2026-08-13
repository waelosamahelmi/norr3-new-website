"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { PixelArt } from "./PixelArt";

const drop = (delay: number) => ({
  initial: { opacity: 0, y: 36, rotate: -1.5 },
  animate: { opacity: 1, y: 0, rotate: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

/** Max pointer-parallax travel, in px, at depth 1. */
const SHIFT = 10;
/** Max pointer-driven tilt, in deg, at depth 1. */
const TILT = 1.5;
const SPRING = { stiffness: 150, damping: 20, mass: 0.3 } as const;

/**
 * Inner wrapper carrying the pointer parallax so the outer `drop()` entrance
 * (opacity/y/rotate) keeps its own transform untouched.
 */
function Parallax({
  px,
  py,
  depth,
  children,
}: {
  px: MotionValue<number> | null;
  py: MotionValue<number> | null;
  depth: number;
  children: React.ReactNode;
}) {
  // Hooks must run unconditionally; when parallax is off we pass a static
  // motion value and simply never render the animated wrapper.
  const idle = useMotionValue(0);
  const x = useTransform(px ?? idle, (v) => v * SHIFT * depth);
  const y = useTransform(py ?? idle, (v) => v * SHIFT * depth);
  const rotate = useTransform(px ?? idle, (v) => v * TILT * depth);

  if (!px || !py) return <div className="h-full w-full">{children}</div>;

  return (
    <motion.div className="h-full w-full" style={{ x, y, rotate }}>
      {children}
    </motion.div>
  );
}

/**
 * The home hero's numbered 01/02/03 layered collage: yellow pixel block +
 * lavender panel, a photo card, and a dark photo card with a purple
 * pixel-dissolve poster on top. Cards drift at different depths under the
 * pointer for a subtle sense of layering — disabled for reduced-motion users
 * and on coarse pointers, where the cards render statically.
 */
export function HeroCollage({ humanAlt, dataAlt }: { humanAlt: string; dataAlt: string }) {
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setInteractive(!reduced && !coarse);
  }, []);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, SPRING);
  const springY = useSpring(pointerY, SPRING);

  const px = interactive ? springX : null;
  const py = interactive ? springY : null;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      className="relative mx-auto h-[300px] w-full max-w-xl select-none sm:h-[360px]"
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
    >
      {/* 01 — lavender panel with yellow pixel block */}
      <motion.div {...drop(0.5)} className="absolute left-0 top-[24%] h-[62%] w-[38%]">
        <Parallax px={px} py={py} depth={0.4}>
          <div className="relative h-full w-full bg-pastel-purple/80">
            <PixelArt color="var(--color-yellow)" className="absolute -top-6 left-6 w-3/4" steps={5} />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium text-violet">01</span>
          </div>
        </Parallax>
      </motion.div>

      {/* 02 — photo card */}
      <motion.div {...drop(0.65)} className="absolute left-[26%] top-[10%] h-[82%] w-[38%]">
        <Parallax px={px} py={py} depth={0.8}>
          <div className="relative h-full w-full overflow-hidden shadow-xl">
            <img
              src="/images/brand/hero-human.webp"
              alt={humanAlt}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-2 right-3 text-xs font-medium text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">
              02
            </span>
          </div>
        </Parallax>
      </motion.div>

      {/* 03 — dark studio photo with purple pixel poster */}
      <motion.div {...drop(0.8)} className="absolute right-0 top-0 h-full w-[42%]">
        <Parallax px={px} py={py} depth={1.2}>
          <div className="relative h-full w-full overflow-hidden bg-ink shadow-2xl">
            <img
              src="/images/brand/hero-data.webp"
              alt={dataAlt}
              loading="eager"
              className="h-full w-full object-cover opacity-70"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-[12%] flex h-[55%] w-[62%] -translate-x-1/2 items-center justify-center bg-purple"
            >
              <PixelArt color="#000000" className="absolute -bottom-4 -left-4 w-2/3 rotate-180" steps={5} />
              <span className="material-symbols-outlined relative text-4xl text-white">sentiment_satisfied</span>
            </motion.div>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-white/90">03</span>
          </div>
        </Parallax>
      </motion.div>
    </div>
  );
}
