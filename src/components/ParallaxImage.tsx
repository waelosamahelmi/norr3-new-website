"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Subtle background-layer parallax (GSAP ScrollTrigger, scrub-driven).
 * Applied to decorative photography only — never text/interactive controls,
 * per the UX Pro Max motion guidance. Small yPercent delta so it reads as
 * depth, not distraction; no-ops entirely under prefers-reduced-motion.
 */
export function ParallaxImage({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.to(img, {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={wrapRef} className={`h-full w-full overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className="h-[120%] w-full scale-110 object-cover"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
