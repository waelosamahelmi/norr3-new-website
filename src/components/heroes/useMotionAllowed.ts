"use client";

import { useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const list = window.matchMedia(REDUCED);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

const snapshot = () => !window.matchMedia(REDUCED).matches;
/** Server (and pre-hydration) answer: no motion, so the resting state renders. */
const staticSnapshot = () => false;

/** False on the server and until hydration, then false for reduced-motion users. */
export function useMotionAllowed() {
  return useSyncExternalStore(subscribe, snapshot, staticSnapshot);
}
