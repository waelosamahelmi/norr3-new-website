"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate, useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/config";

export function CountUpStat({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "en",
  className = "",
  grouping = true,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  locale?: Locale;
  className?: string;
  grouping?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Trigger on the vertical inset only. A symmetric margin also clips the
  // left/right viewport edges, so on phones a number sitting in the left ~80px
  // of the screen (card badges, first grid column) never intersects and stays
  // at 0 forever. Horizontal clipping is never wanted here.
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || prefersReduced) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, prefersReduced]);

  const shown = prefersReduced ? (inView ? value : 0) : display;
  const formatted = shown.toLocaleString(locale === "fi" ? "fi-FI" : "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouping,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
