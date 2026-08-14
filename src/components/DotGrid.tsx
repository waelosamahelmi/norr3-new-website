"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; b: number };

/**
 * Decorative canvas dot grid that reacts to the pointer: dots within RADIUS
 * brighten and grow with an eased falloff, then settle back once the pointer
 * leaves. Fixed NØRR3 purple — it reads as texture, not as content, so it is
 * pointer-events-none and never intercepts clicks on whatever sits above it.
 *
 * Under prefers-reduced-motion it paints the resting grid and stops there.
 */
export function DotGrid({
  spacing = 22,
  radius = 150,
  baseAlpha = 0.13,
  peakAlpha = 0.92,
  dotRgb = "122,6,211",
  className = "",
}: {
  spacing?: number;
  radius?: number;
  baseAlpha?: number;
  peakAlpha?: number;
  dotRgb?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    // Pointer in canvas-local CSS pixels; null means "settle back to rest".
    let pointer: { x: number; y: number } | null = null;

    const drawDot = (d: Dot) => {
      const alpha = baseAlpha + (peakAlpha - baseAlpha) * d.b;
      const size = 1 + d.b * 1.6;
      ctx.fillStyle = `rgba(${dotRgb},${alpha})`;
      ctx.fillRect(d.x - size / 2, d.y - size / 2, size, size);
    };

    /** Resize the backing store to the parent box and rebuild the grid. */
    const measure = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) {
        dots = [];
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Centre the lattice so the margins match on both edges.
      const cols = Math.max(1, Math.floor(width / spacing));
      const rows = Math.max(1, Math.floor(height / spacing));
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: offsetX + c * spacing, y: offsetY + r * spacing, b: 0 });
        }
      }
    };

    const drawResting = () => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) drawDot(d);
    };

    if (reduced) {
      measure();
      drawResting();
      // Still re-measure on resize — a static repaint, not motion.
      const ro = new ResizeObserver(() => {
        measure();
        drawResting();
      });
      ro.observe(parent);
      return () => ro.disconnect();
    }

    let raf = 0;
    const r2 = radius * radius;

    const frame = () => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        let tgt = 0;
        if (pointer) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          tgt = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2) / radius, 1.5) : 0;
        }
        // Brighten faster than we fade, so the cursor feels responsive.
        d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b);
        if (d.b < 0.001) d.b = 0;
        drawDot(d);
      }
      raf = requestAnimationFrame(frame);
    };

    const track = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onMouseMove = (e: MouseEvent) => track(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) track(t.clientX, t.clientY);
    };
    const clearPointer = () => {
      pointer = null;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", clearPointer);
    window.addEventListener("touchend", clearPointer);
    window.addEventListener("touchcancel", clearPointer);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", clearPointer);
      window.removeEventListener("touchend", clearPointer);
      window.removeEventListener("touchcancel", clearPointer);
    };
  }, [spacing, radius, baseAlpha, peakAlpha, dotRgb]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
