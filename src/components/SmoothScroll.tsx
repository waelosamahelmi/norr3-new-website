"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    // Lenis caches the scroll limit at init, but the page keeps growing after
    // that (lazy images decode, whileInView sections expand) — without a
    // re-measure it clamps the wheel to the stale height and scrolling "stops"
    // partway down. Observing <body> catches both image reflow and reveal
    // expansion; the rAF debounce coalesces observer bursts to one resize.
    let resizeFrame = 0;
    const scheduleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => lenis.resize());
    };
    const observer = new ResizeObserver(scheduleResize);
    observer.observe(document.body);
    window.addEventListener("load", scheduleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", scheduleResize);
      cancelAnimationFrame(resizeFrame);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
