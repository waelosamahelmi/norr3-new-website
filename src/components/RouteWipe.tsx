"use client";

import { useMotionSettings } from "./MotionSettingsProvider";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function RouteWipe() {
  const pathname = usePathname();
  const { enabled, routeWipe } = useMotionSettings();

  // Switched off in the CMS, the wipe is simply not mounted — leaving a
  // zero-duration overlay in the tree would still cover the page for a frame.
  if (!enabled || !routeWipe) return null;

  return (
    <motion.div
      key={pathname}
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "top" }}
      className="pointer-events-none fixed inset-0 z-[100] bg-violet"
    />
  );
}
