"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

/**
 * The three principles laid out as a triangle — the shape of the NØRR3 mark.
 *
 * On large screens the triangle itself is the centrepiece: the first card
 * rests on its apex, the other two hang from the two base corners, a yellow
 * pin marks each vertex, and the statement of what the three add up to sits
 * inside, at the centroid. The outline draws itself as the section scrolls
 * into view. Below `lg` the geometry would not fit, so the cards stack and the
 * statement follows.
 *
 * Alignment is by construction rather than by measurement: the triangle box is
 * 40% of the row and centred, so its base corners fall at 30% and 70%; the two
 * bottom cards are centred in the halves of an 80%-wide row, which puts their
 * centres at exactly the same 30% and 70%.
 */

export type Principle = { icon: string; title: string; body: string };

const VERTICES = [
  { x: 50, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
] as const;
const VIEW = { once: true, margin: "-80px" } as const;

/**
 * The outline is drawn in pixel space (the viewBox tracks the box's real
 * size) rather than in a stretched 100×100 box: a non-uniformly scaled path
 * with `non-scaling-stroke` makes the browser miscount the path length, and
 * the draw-on animation then stops short of the last corner.
 */
function useBoxSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, size };
}

export function PrinciplesTriangle({ items, statement }: { items: Principle[]; statement: string }) {
  const [apex, left, right] = items;
  const { ref, size } = useBoxSize();
  const path = size.w ? `M ${size.w / 2} 0 L ${size.w} ${size.h} L 0 ${size.h} Z` : "";

  return (
    <div>
      {/* ---------------------------------------------------- lg+: triangle */}
      <div className="hidden lg:block">
        {apex && (
          <div className="flex justify-center">
            <PrincipleCard principle={apex} index={0} className="w-[360px]" />
          </div>
        )}

        <div ref={ref} className="relative mx-auto h-[320px] w-[40%] xl:h-[360px]">
          {path && (
            <svg
              aria-hidden
              viewBox={`0 0 ${size.w} ${size.h}`}
              width={size.w}
              height={size.h}
              className="absolute inset-0 overflow-visible"
            >
              <motion.path
                d={path}
                className="fill-purple/[0.04] dark:fill-purple/[0.12]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={VIEW}
                transition={{ duration: 0.9, delay: 0.6 }}
              />
              <motion.path
                d={path}
                fill="none"
                strokeWidth={1.5}
                strokeLinejoin="round"
                className="stroke-purple dark:stroke-light-purple"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={VIEW}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          )}

          {/* Vertex pins — HTML rather than SVG circles, which the stretched
              viewBox would squash into ellipses. */}
          {VERTICES.map((v, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute z-10 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow ring-[1.5px] ring-purple dark:ring-light-purple"
              style={{ left: `${v.x}%`, top: `${v.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={VIEW}
              transition={{ duration: 0.35, delay: 0.45 + i * 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}

          {/* The centroid — what the three add up to. */}
          <Reveal
            delay={0.5}
            className="absolute left-1/2 top-[64%] w-[54%] -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <p className="text-[15px] font-medium leading-snug tracking-tight text-ink/80 xl:text-[16px] dark:text-white/85">
              {statement}
            </p>
          </Reveal>
        </div>

        <div className="mx-auto grid w-[80%] grid-cols-2">
          {left && (
            <div className="flex justify-center">
              <PrincipleCard principle={left} index={1} className="w-[360px]" />
            </div>
          )}
          {right && (
            <div className="flex justify-center">
              <PrincipleCard principle={right} index={2} className="w-[360px]" />
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------- <lg: stacked */}
      <div className="grid gap-card-gap sm:grid-cols-3 lg:hidden">
        {items.map((p, i) => (
          <PrincipleCard key={p.title} principle={p} index={i} />
        ))}
        <Reveal delay={0.3} className="sm:col-span-3">
          <p className="mx-auto max-w-xl text-center text-[17px] font-medium leading-snug tracking-tight text-ink/80 dark:text-white/85">
            {statement}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function PrincipleCard({ principle, index, className = "" }: { principle: Principle; index: number; className?: string }) {
  return (
    <Reveal delay={index * 0.12} className={className}>
      <div className="flex h-full flex-col gap-6 rounded-card bg-white p-card-pad ring-1 ring-black/[0.06] dark:bg-[#141118] dark:ring-white/10">
        <div className="flex items-center justify-between">
          {/* Violet tile + white icon — the brand icon-tile treatment,
              identical in both themes. */}
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-violet text-white">
            <Icon name={principle.icon} style={{ fontSize: "28px" }} />
          </div>
          <span className="text-[12px] font-medium tabular-nums tracking-[0.14em] text-purple dark:text-light-purple">
            0{index + 1}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-ink dark:text-white">{principle.title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-ink/65 dark:text-white/65">{principle.body}</p>
        </div>
      </div>
    </Reveal>
  );
}
