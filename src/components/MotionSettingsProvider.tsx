"use client";

import { createContext, useContext } from "react";
import { MOTION_DEFAULTS, type MotionSettings } from "@/lib/cms";

/**
 * Carries the CMS's animation settings to the components that animate.
 *
 * Colour and spacing travel as CSS custom properties, but the site's reveals are
 * framer-motion driven — distances and durations are JavaScript numbers, so they
 * come through context instead. Marquee speeds are the exception: those are CSS
 * animations, so they arrive as custom properties like the rest of the theme.
 *
 * `prefers-reduced-motion` is deliberately *not* part of this. MotionConfig sets
 * `reducedMotion="user"` and stays that way — honouring the OS setting is not an
 * editorial decision.
 */
const MotionContext = createContext<MotionSettings>(MOTION_DEFAULTS);

export function MotionSettingsProvider({
  value,
  children,
}: {
  value: MotionSettings;
  children: React.ReactNode;
}) {
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotionSettings(): MotionSettings {
  return useContext(MotionContext);
}

/**
 * Reveal props for the current settings. With animation switched off the
 * component renders its final state directly rather than animating to it.
 */
export function useRevealProps(overrides?: { distance?: number; duration?: number; delay?: number }) {
  const { enabled, reveal } = useMotionSettings();
  const distance = overrides?.distance ?? reveal.distance;
  const duration = overrides?.duration ?? reveal.duration;

  if (!enabled) {
    return { initial: undefined, whileInView: undefined, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } };
  }
  return {
    initial: { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: `-${reveal.margin}px` },
    transition: { duration, delay: overrides?.delay ?? 0, ease: [0.16, 1, 0.3, 1] as const },
  };
}
