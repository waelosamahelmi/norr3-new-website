"use client";

import { motion } from "framer-motion";
import { PixelArt } from "./PixelArt";

const drop = (delay: number) => ({
  initial: { opacity: 0, y: 36, rotate: -1.5 },
  animate: { opacity: 1, y: 0, rotate: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

/**
 * The home hero's numbered 01/02/03 layered collage: yellow pixel block +
 * lavender panel, a photo card, and a dark photo card with a purple
 * pixel-dissolve poster on top.
 */
export function HeroCollage() {
  return (
    <div className="relative mx-auto h-[300px] w-full max-w-xl select-none sm:h-[360px]">
      {/* 01 — lavender panel with yellow pixel block */}
      <motion.div {...drop(0.5)} className="absolute left-0 top-[24%] h-[62%] w-[38%] bg-pastel-purple/80">
        <PixelArt color="var(--color-yellow)" className="absolute -top-6 left-6 w-3/4" steps={5} />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium text-violet">01</span>
      </motion.div>

      {/* 02 — photo card */}
      <motion.div {...drop(0.65)} className="absolute left-[26%] top-[10%] h-[82%] w-[38%] overflow-hidden shadow-xl">
        <img
          src="/images/office/office-03.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-2 right-3 text-xs font-medium text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">
          02
        </span>
      </motion.div>

      {/* 03 — dark studio photo with purple pixel poster */}
      <motion.div {...drop(0.8)} className="absolute right-0 top-0 h-full w-[42%] overflow-hidden bg-ink shadow-2xl">
        <img
          src="/images/office/office-08.jpg"
          alt=""
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
      </motion.div>
    </div>
  );
}
