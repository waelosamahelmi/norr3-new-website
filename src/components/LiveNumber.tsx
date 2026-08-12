"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/config";

export function LiveNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "en",
  className = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  locale?: Locale;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const prefersReduced = useReducedMotion();
  const from = useRef(value);

  useEffect(() => {
    if (prefersReduced) return;
    const controls = animate(from.current, value, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
      onComplete: () => {
        from.current = value;
      },
    });
    return () => controls.stop();
  }, [value, prefersReduced]);

  const shown = prefersReduced ? value : display;
  const formatted = shown.toLocaleString(locale === "fi" ? "fi-FI" : "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
