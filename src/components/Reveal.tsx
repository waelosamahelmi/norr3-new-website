"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useRevealProps } from "./MotionSettingsProvider";

/**
 * Scroll-reveal wrapper. Distance, duration, stagger and trigger margin come
 * from the CMS's animation settings; `y` and `delay` remain per-use overrides
 * for the places that deliberately differ.
 */
export function Reveal({
  children,
  delay = 0,
  y,
  className = "",
  as = "div",
  id,
}: {
  children: ReactNode;
  delay?: number;
  /** Overrides the configured reveal distance for this one element. */
  y?: number;
  className?: string;
  as?: "div" | "li";
  /** Forwarded so anchor links (sub-menus, hero text-links) can target a section. */
  id?: string;
}) {
  const Tag = as === "li" ? motion.li : motion.div;
  const props = useRevealProps({ distance: y, delay });
  return (
    <Tag id={id} {...props} className={className}>
      {children}
    </Tag>
  );
}
