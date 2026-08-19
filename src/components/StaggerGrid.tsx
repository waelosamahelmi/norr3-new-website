"use client";

import { Children } from "react";
import { motion } from "framer-motion";
import { useMotionSettings } from "./MotionSettingsProvider";

/**
 * Grid whose children fade up one after another. The distance, duration and the
 * gap between children come from the CMS's animation settings; `stagger` stays
 * a per-use override.
 */
export function StaggerGrid({
  children,
  className = "",
  stagger,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const { enabled, reveal } = useMotionSettings();

  if (!enabled) return <div className={className}>{children}</div>;

  const item = {
    hidden: { opacity: 0, y: reveal.distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reveal.duration, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: `-${reveal.margin}px` }}
      transition={{ staggerChildren: stagger ?? reveal.stagger }}
      className={className}
    >
      {Children.map(children, (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
