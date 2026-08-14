"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";

/**
 * Standard hover-lift micro-interaction (GSAP quickTo), per the UX Pro Max
 * motion guidelines: transform + boxShadow only (compositor-friendly), reverses
 * cleanly on mouseleave, respects prefers-reduced-motion, and uses quickTo so
 * grids with many cards don't recreate a tween per hover event.
 *
 * Zero layout impact by construction: the wrapper is promoted at rest
 * (will-change + transform-gpu) so the first hover doesn't cause a
 * layer-promotion jump, `isolate` keeps the scaled card's stacking local so it
 * can't interleave with siblings, and the shadow is pure box-shadow rounded to
 * the card radius — nothing here resizes, pads, or margins on hover.
 */
export function HoverLift({
  children,
  className = "",
  lift = 4,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const yTo = gsap.quickTo(el, "y", { duration: 0.25, ease: "power2.out" });
    const scaleTo = gsap.quickTo(el, "scale", { duration: 0.25, ease: "power2.out" });

    const enter = () => {
      yTo(-lift);
      scaleTo(scale);
      gsap.to(el, { boxShadow: "0 16px 32px rgba(0,0,0,0.14)", duration: 0.25, ease: "power2.out" });
    };
    const leave = () => {
      yTo(0);
      scaleTo(1);
      gsap.to(el, { boxShadow: "0 0px 0px rgba(0,0,0,0)", duration: 0.25, ease: "power2.out" });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [lift, scale]);

  return (
    <div
      ref={ref}
      className={`isolate rounded-card transform-gpu will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
