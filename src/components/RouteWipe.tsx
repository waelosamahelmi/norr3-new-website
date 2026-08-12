"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function RouteWipe() {
  const pathname = usePathname();

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
