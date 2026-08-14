"use client";

import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
 * NØRR3 wordmark, inline. Geometry from .specs/Logo-01.svg (viewBox 0 0 1080
 * 224.16). Everything except the numeral "3" is static; the "3" is rebuilt from
 * the form study in .specs/three-to-triangle-reference.html so it can morph
 * into an outlined triangle (Δ) and back.
 *
 * The study lives in its own coordinate space (viewBox -45 -45 240 287). The
 * wordmark's "3" is exactly the study's "3" translated by (925.59, 15.48), so
 * the whole morph runs in study-local coordinates inside a translated <g>.
 * SVG getPointAtLength() reports path-local coordinates (pre parent transform),
 * so the engine is a straight port — no rescaling of the math.
 * ------------------------------------------------------------------------- */

const THREE_DX = 925.59;
const THREE_DY = 15.48;

/** Wordmark minus the "3": N, Ø (both halves), R, R. */
const NORR = [
  { t: "path", d: "M317.34,57.25c-24.59,7.85-30.99,31.73-31.34,55.64-.23,15.81,3.19,33.58,14.88,45.38l-48.67,40.71-14.8-18.18,20.96-18.34c-2.7-6.14-4.31-12.41-5.57-19.19-2.35-14.88-3.2-29.61-2.53-44.69.78-11.62,3.04-22.52,7.61-33.13,12.16-28.26,37.93-43.63,68.26-45.92,13.43-1.01,26.52-.12,39.75,2.22,9.31,1.84,17.95,4.5,26.34,8.75,4.84,2.62,9.22,5.52,13.09,9.51l18.34-15.44,16.26,17.85-50.15,41.99c-7.95-21.17-28.27-30.34-50.24-30.21-7.68-.06-14.95.76-22.19,3.07Z" },
  { t: "path", d: "M320.4,201.56c-10.48-1.47-23.97-4.85-32.75-11.92l26.91-22.76c11.41,3.41,22.82,5.45,34.59,4.98,10.7-.43,20.15-4.17,27.88-11.53,10.32-9.49,16.14-22.4,17.66-36.42.54-7.57.26-14.7-.9-22.39l34.36-28.07c5.21,20.84,6.23,42.38,3.03,63.71-1.28,8.54-3.29,16.32-6.67,24.13-11.16,25.71-33.83,38-61.13,41.09-14.41,1.63-28.63,1.2-42.99-.82Z" },
  { t: "path", d: "M856.56,163.53l.05,37.6h-72.81s0-70.64,0-70.64c10.46-2.92,19.96-7.8,27.86-15.16,9.78-9.13,15.18-21.62,14.82-35-.41-6.82-3.6-12.5-9.18-16.25-9.54-5.99-22.23-6.61-33.5-5.4V22.72s20.16.09,20.16.09c9.9.05,19.17,3.18,27.87,7.56,19.15,10.49,27,27.55,28.01,48.99.79,16.65-4.35,32.41-14.66,45.48-14.95,18.97-38.33,31.72-60.88,38.7h72.24Z" },
  { t: "path", d: "M641.03,163.53l.05,37.6h-72.93s0-70.63,0-70.63c9.93-2.76,18.85-7.23,26.49-13.9,10.23-8.89,16.21-21.27,16.24-34.83.08-7.95-3.76-14.64-10.55-18.54-9.51-5.15-21.02-5.69-32.17-4.59V22.73s20.87.13,20.87.13c10.33.06,19.96,3.56,28.86,8.45,17.61,10.43,25.02,26.56,26.29,46.65,1.01,15.99-3.25,31.34-12.68,44.29-14.62,20.42-39.27,33.92-62.65,41.29h72.19Z" },
  { t: "poly", d: "128.97 201.17 65.95 102.61 66.02 39.69 131.37 143.37 131.43 22.73 165.48 22.72 165.48 201.11 128.97 201.17" },
  { t: "poly", d: "48.53 201.09 12.19 201.16 12.19 22.72 48.53 22.72 48.53 201.09" },
  { t: "poly", d: "553.03 201.09 516.81 201.16 516.81 22.72 553.03 22.72 553.03 201.09" },
  { t: "poly", d: "766.88 201.08 730.55 201.16 730.55 22.72 766.88 22.72 766.88 201.08" },
] as const;

/* --- the "3", cut into its three natural strokes (study-local coords) ------
 * The bar carries a thin sliver past the cut line so the pieces overlap
 * seamlessly. Composited at rest these three are pixel-identical to the
 * wordmark's own "3" paths. */
const SRC_BAR = "11.03,39.68 11.04,7.24 138.58,7.24 138.58,35.59 134.56,39.00 88.46,41.74 90.9,39.72";
const SRC_DIAG = "138.58,35.59 71.5,92.5 50.23,73.37 90.9,39.72";
const SRC_HOOK =
  "M7.82,127.48l37.95-.03c-.18,5.65.18,10.98,1.77,16.12,1.98,6.23,6.59,10.53,12.96,11.98,4.33.86,8.66,1.01,13.15.81,12.77-.58,24.13-1.6,28.34-14.82,2.75-7.66,1.36-15.53-3.35-22.18-4.28-6.29-9.87-11.03-16.76-15.49l24.11-20.5c24.04,10.99,36.58,33.15,36.28,59.33-.65,11.32-4.67,21.65-12.62,29.75-14.67,14.95-37.41,18.38-57.88,16.77l-16.72-1.32c-7.58-.6-14.55-3.12-21.3-6.56-10.9-5.49-18.85-14.57-22.93-26.07-3.1-8.8-3.99-17.74-3.01-27.78Z";

/* --- morph target: a stroke-only triangle whose wall thickness is the "3"'s
 * top bar. Pure math, so it is computed once at module scope and rendered as
 * plain `d` attributes — identical on the server and the client. */
type Pt = [number, number];

const CX = 74.86;
const CY = 105;
const SIDE = 170;
const T = 32.44; // thickness of the "3"'s top bar (39.68 - 7.24)
const H = (SIDE * Math.sqrt(3)) / 2;
const A: Pt = [CX, CY - (H * 2) / 3]; // apex
const B: Pt = [CX + SIDE / 2, CY + H / 3]; // bottom right
const C: Pt = [CX - SIDE / 2, CY + H / 3]; // bottom left
const INSET = (H / 3 - T) / (H / 3); // inner triangle = outer scaled by the wall
const inner = (P: Pt): Pt => [CX + (P[0] - CX) * INSET, CY + (P[1] - CY) * INSET];
const Ai = inner(A);
const Bi = inner(B);
const Ci = inner(C);
const lp = (P: Pt, Q: Pt, u: number): Pt => [P[0] + (Q[0] - P[0]) * u, P[1] + (Q[1] - P[1]) * u];
const poly = (pts: Pt[]) => "M" + pts.map((p) => p[0].toFixed(2) + "," + p[1].toFixed(2)).join("L") + "Z";

// Three mitered sides; base and right carry small wedges past the corner
// miters so adjacent pieces overlap instead of leaving seams.
const OV = 0.05;
const TGT_BOTTOM = poly([C, B, lp(B, A, OV), lp(Bi, Ai, OV), Bi, Ci, lp(Ci, Ai, OV), lp(C, A, OV)]);
const TGT_LEFT = poly([A, C, Ci, Ai]);
const TGT_RIGHT = poly([lp(A, C, OV), A, B, Bi, Ai, lp(Ai, Ci, OV)]);

/* --- engine ------------------------------------------------------------- */

const N = 240; // samples per piece outline
const WIN = 1; // all pieces travel together over the full morph
const TRAILS = 4;

const easeC = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

function sample(el: SVGGeometryElement): Pt[] {
  const L = el.getTotalLength();
  const pts: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const p = el.getPointAtLength((L * i) / N);
    pts.push([p.x, p.y]);
  }
  return pts;
}

function signedArea(pts: Pt[]) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

function centroid(pts: Pt[]): Pt {
  let x = 0;
  let y = 0;
  for (const p of pts) {
    x += p[0];
    y += p[1];
  }
  return [x / pts.length, y / pts.length];
}

/** Cyclic shift of the target that minimizes total travel. */
function align(from: Pt[], to: Pt[]): Pt[] {
  let best = 0;
  let bestD = Infinity;
  for (let s = 0; s < N; s += 2) {
    let d = 0;
    for (let i = 0; i < N; i += 4) {
      const p = from[i];
      const q = to[(i + s) % N];
      const dx = p[0] - q[0];
      const dy = p[1] - q[1];
      d += dx * dx + dy * dy;
    }
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return from.map((_, i) => to[(i + best) % N]);
}

type Piece = {
  el: SVGPathElement;
  delay: number;
  lift: number;
  from: Pt[];
  to: Pt[];
  cs: Pt;
  ct: Pt;
  theta: number;
  local: Pt[];
  nx: number;
  ny: number;
  bendMode: boolean;
  bendPts: (kap: number) => Pt[];
  kappa0: number;
  phi0: number;
  tOff: Pt;
  res: Pt[];
};

type Spec = { src: SVGGeometryElement; tgt: SVGGeometryElement; el: SVGPathElement; lift: number };

/**
 * Each stroke of the 3 becomes one side of the triangle: bar → base (drops in),
 * diagonal → left side (slides over), hook → right side (unbends and swings).
 */
function buildPieces(specs: Spec[]): Piece[] {
  const pieces = specs.map((s) => {
    const from = sample(s.src);
    let to = sample(s.tgt);
    if (signedArea(from) * signedArea(to) < 0) to.reverse();
    to = align(from, to);
    const cs = centroid(from);
    const ct = centroid(to);
    // best-fit rigid rotation (2D Kabsch) from source to target
    let cr = 0;
    let dt = 0;
    for (let i = 0; i < N; i++) {
      const sx = from[i][0] - cs[0];
      const sy = from[i][1] - cs[1];
      const qx = to[i][0] - ct[0];
      const qy = to[i][1] - ct[1];
      cr += sx * qy - sy * qx;
      dt += sx * qx + sy * qy;
    }
    const theta = Math.atan2(cr, dt);
    // target shape in the piece's own rotated frame, so the residual morph
    // (e.g. the hook straightening) stays separate from the spin
    const c = Math.cos(-theta);
    const sn = Math.sin(-theta);
    const local: Pt[] = to.map((q) => {
      const x = q[0] - ct[0];
      const y = q[1] - ct[1];
      return [c * x - sn * y, sn * x + c * y];
    });
    // perpendicular of the travel direction, for a swinging arc
    const dx = ct[0] - cs[0];
    const dy = ct[1] - cs[1];
    const len = Math.hypot(dx, dy) || 1;
    const p: Piece = {
      el: s.el,
      delay: 0,
      lift: s.lift,
      from,
      to,
      cs,
      ct,
      theta,
      local,
      nx: -dy / len,
      ny: dx / len,
      bendMode: false,
      bendPts: () => [],
      kappa0: 0,
      phi0: 0,
      tOff: [0, 0],
      res: [],
    };
    return p;
  });

  /* The hook unbends like a rod instead of blending point-to-point. Express the
   * straight target bar in spine coordinates (s = along the bar, w = across
   * it), define a constant-curvature bend of that bar, fit the curvature + pose
   * that best matches the real hook, then animate curvature → 0. Length and
   * thickness stay true, so it visibly unrolls. */
  const p = pieces[2];
  const from = p.from;
  const to = p.to;
  const Ct = centroid(to);
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const q of to) {
    const x = q[0] - Ct[0];
    const y = q[1] - Ct[1];
    sxx += x * x;
    syy += y * y;
    sxy += x * y;
  }
  const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy); // spine direction
  const e1: Pt = [Math.cos(ang), Math.sin(ang)];
  const e2: Pt = [-e1[1], e1[0]];
  const sw: Pt[] = to.map((q) => {
    const x = q[0] - Ct[0];
    const y = q[1] - Ct[1];
    return [x * e1[0] + y * e1[1], x * e2[0] + y * e2[1]];
  });
  p.bendPts = (kap: number) =>
    sw.map(([s, w]) => {
      let bx: number;
      let by: number;
      if (Math.abs(kap) < 1e-6) {
        bx = s;
        by = w;
      } else {
        const R = 1 / kap;
        const a = s * kap;
        const rho = R - w;
        bx = rho * Math.sin(a);
        by = R - rho * Math.cos(a);
      }
      return [Ct[0] + e1[0] * bx + e2[0] * by, Ct[1] + e1[1] * bx + e2[1] * by] as Pt;
    });

  const Gf = centroid(from);
  let best: { k: number; phi: number; Gb: Pt; err: number } | null = null;
  for (let k = -0.045; k <= 0.045; k += 0.0005) {
    const b = p.bendPts(k);
    const Gb = centroid(b);
    let cr = 0;
    let dt = 0;
    for (let i = 0; i < N; i++) {
      const bx = b[i][0] - Gb[0];
      const by = b[i][1] - Gb[1];
      const fx = from[i][0] - Gf[0];
      const fy = from[i][1] - Gf[1];
      cr += bx * fy - by * fx;
      dt += bx * fx + by * fy;
    }
    const phi = Math.atan2(cr, dt);
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    let err = 0;
    for (let i = 0; i < N; i++) {
      const bx = b[i][0] - Gb[0];
      const by = b[i][1] - Gb[1];
      const dx = c * bx - s * by + Gf[0] - from[i][0];
      const dy = s * bx + c * by + Gf[1] - from[i][1];
      err += dx * dx + dy * dy;
    }
    if (!best || err < best.err) best = { k, phi, Gb, err };
  }
  const fit = best!;
  p.kappa0 = fit.k;
  p.phi0 = fit.phi;
  p.tOff = [Gf[0] - fit.Gb[0], Gf[1] - fit.Gb[1]];
  const b0 = p.bendPts(fit.k);
  const c0 = Math.cos(fit.phi);
  const s0 = Math.sin(fit.phi);
  p.res = from.map((f, i) => {
    const bx = b0[i][0] - fit.Gb[0];
    const by = b0[i][1] - fit.Gb[1];
    return [f[0] - (c0 * bx - s0 * by + Gf[0]), f[1] - (s0 * bx + c0 * by + Gf[1])] as Pt;
  });
  p.bendMode = true;

  return pieces;
}

function bendedPath(p: Piece, m: number) {
  const u = easeC(clamp01((m - p.delay) / WIN));
  const b = p.bendPts(p.kappa0 * (1 - u));
  let gx = 0;
  let gy = 0;
  for (const q of b) {
    gx += q[0];
    gy += q[1];
  }
  gx /= N;
  gy /= N;
  const phi = p.phi0 * (1 - u);
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const swing = Math.sin(Math.PI * u) * p.lift;
  const ox = gx + p.tOff[0] * (1 - u) + p.nx * swing;
  const oy = gy + p.tOff[1] * (1 - u) + p.ny * swing;
  const fade = 1 - u;
  let d = "";
  for (let i = 0; i < N; i++) {
    const bx = b[i][0] - gx;
    const by = b[i][1] - gy;
    const x = c * bx - s * by + ox + p.res[i][0] * fade;
    const y = s * bx + c * by + oy + p.res[i][1] * fade;
    d += (i ? "L" : "M") + x.toFixed(2) + "," + y.toFixed(2);
  }
  return d + "Z";
}

function piecePath(p: Piece, m: number) {
  const u = easeC(clamp01((m - p.delay) / WIN));
  const rot = p.theta * u;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const swing = Math.sin(Math.PI * u) * p.lift;
  const cx = p.cs[0] + (p.ct[0] - p.cs[0]) * u + p.nx * swing;
  const cy = p.cs[1] + (p.ct[1] - p.cs[1]) * u + p.ny * swing;
  let d = "";
  for (let i = 0; i < N; i++) {
    const fx = p.from[i][0] - p.cs[0];
    const fy = p.from[i][1] - p.cs[1];
    const lx = fx + (p.local[i][0] - fx) * u;
    const ly = fy + (p.local[i][1] - fy) * u;
    const x = c * lx - s * ly + cx;
    const y = s * lx + c * ly + cy;
    d += (i ? "L" : "M") + x.toFixed(2) + "," + y.toFixed(2);
  }
  return d + "Z";
}

/* --- timelines ---------------------------------------------------------- */

type Phase = { dur: number; hold?: number; from?: number; to?: number };

/** The study's continuous cycle: hold 3 · build Δ · hold Δ · dismantle. */
const LOOP_PH: Phase[] = [
  { hold: 0, dur: 1300 },
  { from: 0, to: 1, dur: 1800 },
  { hold: 1, dur: 1300 },
  { from: 1, to: 0, dur: 1800 },
];
/** One hover round trip — snappier than the loop, and it always lands back on 3. */
const TRIP_PH: Phase[] = [
  { from: 0, to: 1, dur: 820 },
  { hold: 1, dur: 300 },
  { from: 1, to: 0, dur: 820 },
];
const duration = (ph: Phase[]) => ph.reduce((s, p) => s + p.dur, 0);
const LOOP_MS = duration(LOOP_PH);
const TRIP_MS = duration(TRIP_PH);

function valueAt(ph: Phase[], ms: number) {
  let t = ms;
  for (const p of ph) {
    if (t < p.dur) {
      if (p.hold !== undefined) return p.hold;
      return p.from! + (p.to! - p.from!) * (t / p.dur);
    }
    t -= p.dur;
  }
  return 0;
}

/* --- component ---------------------------------------------------------- */

export type LogoAnimate = "hover" | "loop" | "off";

export function Logo({
  variant = "dark",
  className = "",
  animate = "loop",
}: {
  variant?: "dark" | "light";
  className?: string;
  /** `hover` = one 3→Δ→3 round trip on hover/focus, `loop` = the study's continuous cycle. */
  animate?: LogoAnimate;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const restRef = useRef<SVGGElement>(null);
  const glyphRef = useRef<SVGGElement>(null);
  const trailsRef = useRef<SVGGElement>(null);
  const srcBar = useRef<SVGPolygonElement>(null);
  const srcDiag = useRef<SVGPolygonElement>(null);
  const srcHook = useRef<SVGPathElement>(null);
  const tgtBottom = useRef<SVGPathElement>(null);
  const tgtLeft = useRef<SVGPathElement>(null);
  const tgtRight = useRef<SVGPathElement>(null);
  const mBar = useRef<SVGPathElement>(null);
  const mDiag = useRef<SVGPathElement>(null);
  const mHook = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (animate === "off") return;
    const svg = svgRef.current;
    if (!svg) return;
    const rest = restRef.current!;
    const glyph = glyphRef.current!;
    const trailsG = trailsRef.current!;
    // Never animate for reduced-motion users — the resting "3" already renders.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const specs: Spec[] = [
      { src: srcBar.current!, tgt: tgtBottom.current!, el: mBar.current!, lift: 30 },
      { src: srcDiag.current!, tgt: tgtLeft.current!, el: mDiag.current!, lift: -16 },
      { src: srcHook.current!, tgt: tgtRight.current!, el: mHook.current!, lift: 26 },
    ];

    let pieces: Piece[] | null = null;
    const trailEls: SVGPathElement[] = [];
    const trailBuf: string[] = [];
    let lastTrailAt = 0;
    let raf = 0;
    let intro = 0;
    let lastFrame: number | null = null;
    let clock = 0;
    let running = false;

    /** Sampling + Kabsch + bend fit: a few ms, so it is deferred to first use. */
    function ready() {
      if (pieces) return pieces;
      pieces = buildPieces(specs);
      for (let i = 0; i < TRAILS; i++) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
        el.setAttribute("opacity", (0.9 - i * 0.22).toFixed(2));
        el.style.display = "none";
        trailsG.appendChild(el);
        trailEls.push(el);
      }
      return pieces;
    }

    /** Render one frame at morph value m (0 = "3", 1 = triangle). */
    function render(m: number, nowMs: number) {
      let combined = "";
      for (const p of pieces!) {
        const d = p.bendMode ? bendedPath(p, m) : piecePath(p, m);
        p.el.setAttribute("d", d);
        combined += d;
      }
      const moving = m > 0.001 && m < 0.999;
      if (moving && nowMs - lastTrailAt > 55) {
        trailBuf.unshift(combined);
        if (trailBuf.length > TRAILS) trailBuf.pop();
        lastTrailAt = nowMs;
      }
      if (!moving && trailBuf.length) trailBuf.length = 0;
      trailEls.forEach((el, i) => {
        const d = trailBuf[i + 1];
        if (d && moving) {
          el.setAttribute("d", d);
          el.style.display = "";
        } else {
          el.style.display = "none";
        }
      });
    }

    /** Swap the resting numeral for the animated composite (and back). */
    function setLive(live: boolean) {
      rest.style.visibility = live ? "hidden" : "";
      glyph.style.visibility = live ? "" : "hidden";
      if (!live) {
        trailBuf.length = 0;
        for (const el of trailEls) el.style.display = "none";
      }
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = null;
      setLive(false);
    }

    function frame(now: number) {
      if (lastFrame === null) lastFrame = now;
      const dt = Math.min(now - lastFrame, 50);
      lastFrame = now;
      clock += dt;
      if (animate === "loop") {
        render(valueAt(LOOP_PH, clock % LOOP_MS), now);
      } else if (clock >= TRIP_MS) {
        render(0, now); // land exactly on the numeral before handing back over
        stop();
        return;
      } else {
        render(valueAt(TRIP_PH, clock), now);
      }
      raf = requestAnimationFrame(frame);
    }

    /** Start a run; hover re-triggers are ignored until the round trip lands. */
    function play() {
      if (running) return;
      ready();
      running = true;
      clock = 0;
      lastFrame = null;
      setLive(true);
      render(0, 0);
      raf = requestAnimationFrame(frame);
    }

    if (animate === "loop") {
      play();
      return () => {
        stop();
        trailsG.replaceChildren();
      };
    }

    // Hover/focus lives on the nearest interactive ancestor (the header link),
    // so the whole hit area and keyboard focus both drive the morph.
    const host: Element = svg.closest("a,button") ?? svg;
    host.addEventListener("pointerenter", play);
    host.addEventListener("focusin", play);
    // One subtle intro round trip on mount so the morph is discoverable.
    intro = window.setTimeout(play, 900);

    return () => {
      window.clearTimeout(intro);
      host.removeEventListener("pointerenter", play);
      host.removeEventListener("focusin", play);
      stop();
      trailsG.replaceChildren();
    };
  }, [animate]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1080 224.16"
      role="img"
      aria-label="NØRR3"
      // The Δ is wider than the 3 (its bottom-right corner reaches x ≈ 1085).
      style={{ overflow: "visible" }}
      className={`h-6 w-auto select-none ${variant === "light" ? "text-white" : "text-purple"} ${className}`}
    >
      {NORR.map((p) =>
        p.t === "path" ? (
          <path key={p.d} d={p.d} fill="currentColor" />
        ) : (
          <polygon key={p.d} points={p.d} fill="currentColor" />
        ),
      )}

      <g transform={`translate(${THREE_DX},${THREE_DY})`}>
        {/* The "3" at rest — this is the SSR / no-JS / reduced-motion render,
            and it doubles as the geometry the morph engine samples. */}
        <g ref={restRef}>
          <polygon ref={srcBar} points={SRC_BAR} fill="currentColor" />
          <polygon ref={srcDiag} points={SRC_DIAG} fill="currentColor" />
          <path ref={srcHook} d={SRC_HOOK} fill="currentColor" />
        </g>

        {/* Morph targets: never shown, only sampled. */}
        <g visibility="hidden" aria-hidden="true">
          <path ref={tgtBottom} d={TGT_BOTTOM} />
          <path ref={tgtLeft} d={TGT_LEFT} />
          <path ref={tgtRight} d={TGT_RIGHT} />
        </g>

        {/* Motion echoes. */}
        <g
          ref={trailsRef}
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          opacity={0.16}
        />

        {/* The animated composite, live only while morphing. */}
        <g ref={glyphRef} aria-hidden="true" visibility="hidden">
          <path ref={mBar} fill="currentColor" />
          <path ref={mDiag} fill="currentColor" />
          <path ref={mHook} fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}
