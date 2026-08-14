"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "./Icon";
import { PixelArt } from "./PixelArt";

/** ms per character for the "A New Way to" typewriter intro. */
const TYPE_SPEED = 70;
/** ms between stack rotations (front → back, back → mid, mid → front). */
const ROTATE_EVERY = 2400;
/** Max pointer-parallax travel, in px, at depth 1. */
const SHIFT = 22;
/** Easing shared by the stack transitions and the accent-word swap. */
const EASE = "cubic-bezier(.16,1,.3,1)";

const REDUCED = "(prefers-reduced-motion: reduce)";
const COARSE = "(pointer: coarse)";

function subscribeMedia(onChange: () => void) {
  const lists = [window.matchMedia(REDUCED), window.matchMedia(COARSE)];
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

const motionSnapshot = () => !window.matchMedia(REDUCED).matches;
const parallaxSnapshot = () =>
  !window.matchMedia(REDUCED).matches && !window.matchMedia(COARSE).matches;
/** Server (and pre-hydration) answer: no motion, so the resting state renders. */
const staticSnapshot = () => false;

/** False on the server and until hydration, then false for reduced-motion users. */
function useMotionAllowed() {
  return useSyncExternalStore(subscribeMedia, motionSnapshot, staticSnapshot);
}

/** As above, and additionally off on coarse pointers (touch). */
function useParallaxAllowed() {
  return useSyncExternalStore(subscribeMedia, parallaxSnapshot, staticSnapshot);
}

/**
 * The three stack slots, back → front. `x` is a share of the stage width so the
 * geometry holds at every breakpoint (the values match the 576px reference:
 * -150px, -40px, +96px); `y` stays in px. `depth` scales the pointer parallax.
 */
const SLOTS = [
  { x: "-30%", y: "40px", scale: 0.66, opacity: 0.9, z: 1, depth: 0.3, front: false },
  { x: "-14%", y: "10px", scale: 0.82, opacity: 0.97, z: 2, depth: 0.6, front: false },
  { x: "2%", y: "-22px", scale: 1, opacity: 1, z: 3, depth: 1, front: true },
] as const;

type HeroCard = {
  /** The accent word this card drives while it holds the front slot. */
  word: string;
  number: string;
  src: string;
  icon: string;
  /** Icon-tile colours — brand tokens only. */
  tile: string;
  /** PixelArt accent colour, as a brand token. */
  pixel: string;
};

const CARDS: HeroCard[] = [
  {
    word: "Plan",
    number: "01",
    src: "/images/brand/services-planning.webp",
    icon: "strategy",
    tile: "bg-violet text-white",
    pixel: "var(--color-yellow)",
  },
  {
    word: "Act",
    number: "02",
    src: "/images/brand/engine-workflow.webp",
    icon: "draw",
    tile: "bg-yellow text-ink",
    pixel: "var(--color-purple)",
  },
  {
    word: "Grow",
    number: "03",
    src: "/images/brand/team-energy.webp",
    icon: "trending_up",
    tile: "bg-violet text-white",
    pixel: "var(--color-yellow)",
  },
];

/** Initial slot assignment: [back, mid, front] — Plan back, Execute mid, Grow front. */
const INITIAL_ORDER = [0, 1, 2];

/**
 * The home hero: "A New Way to" types itself in, a stack of three portrait cards
 * rotates through the back/mid/front slots every 2.4s, and the accent word swaps
 * in sync with whichever card holds the front slot.
 *
 * The h1 carries the whole sentence via `aria-label`, so assistive tech and
 * crawlers always get "A New Way to Grow" no matter where the animation sits.
 * Reduced-motion users — and anyone before hydration — get the resting state:
 * the full left word, cards in their default slots, the default accent word.
 */
export function HomeHero({
  left,
  accent,
  alts,
}: {
  left: string;
  accent: string;
  alts: [string, string, string];
}) {
  const motion = useMotionAllowed();
  const parallax = useParallaxAllowed();

  /** Slot assignment as card indices: [back, mid, front]. */
  const [order, setOrder] = useState<number[]>(INITIAL_ORDER);
  /** Characters of the left word revealed so far (only used while animating). */
  const [typed, setTyped] = useState(0);

  const introRan = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement | null>(null);

  const typing = motion && typed < left.length;

  // Type the left word out, once, on the first render that allows motion.
  useEffect(() => {
    if (!motion || introRan.current) return;
    introRan.current = true;
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= left.length) window.clearInterval(tick);
    }, TYPE_SPEED);
    return () => window.clearInterval(tick);
  }, [motion, left]);

  // The rotating stack — starts once the left word has finished typing.
  useEffect(() => {
    if (!motion || typing) return;
    const rot = window.setInterval(() => {
      // front → back, back → mid, mid → front
      setOrder(([back, mid, front]) => [front, back, mid]);
    }, ROTATE_EVERY);
    return () => window.clearInterval(rot);
  }, [motion, typing]);

  // Pointer parallax: every card drifts by its slot depth, the front one most.
  useEffect(() => {
    if (!parallax) return;
    const cards = stageRef.current?.querySelectorAll<HTMLElement>("[data-depth]");
    if (!cards?.length) return;
    let raf = 0;
    let cx = 0;
    let cy = 0;
    const loop = () => {
      cx += (pointer.current.x - cx) * 0.07;
      cy += (pointer.current.y - cy) * 0.07;
      cards.forEach((el) => {
        const depth = Number(el.dataset.depth) || 0;
        el.style.setProperty("--px", `${(cx * SHIFT * depth).toFixed(1)}px`);
        el.style.setProperty("--py", `${(cy * SHIFT * depth).toFixed(1)}px`);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [parallax]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return;
    pointer.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };
  };

  const handlePointerLeave = () => {
    pointer.current = { x: 0, y: 0 };
  };

  /** Which slot each card currently sits in. */
  const slotOf = CARDS.map((_, card) => order.indexOf(card));
  // Until the intro finishes, the resting accent word stands in.
  const accentWord = typing || !motion ? accent : CARDS[order[2]].word;

  return (
    <h1
      aria-label={`${left} ${accent}`}
      className="flex w-full flex-wrap items-center justify-center gap-2 font-medium leading-none tracking-tight text-ink lg:flex-nowrap lg:justify-start lg:gap-2"
      onPointerMove={parallax ? handlePointerMove : undefined}
      onPointerLeave={parallax ? handlePointerLeave : undefined}
    >
      {/* Left word — types itself in, with the blinking caret trailing it. */}
      <span aria-hidden className="block whitespace-nowrap text-[10vw] lg:text-[6.5vw]">
        {motion ? left.slice(0, typed) : left}
        <span className={typing ? "caret-blink" : "opacity-0"}>_</span>
      </span>

      {/* The rotating portrait stack. */}
      <span aria-hidden className="order-3 block w-full lg:order-none lg:w-auto lg:min-w-0 lg:shrink-0">
        <div
          ref={stageRef}
          className="relative mx-auto h-[420px] w-full max-w-lg select-none [--card:300px] sm:h-[500px] sm:[--card:360px] lg:mx-0 lg:w-[360px]"
        >
          {CARDS.map((card, index) => {
            const slot = SLOTS[slotOf[index]];
            return (
              <div
                key={card.word}
                data-depth={slot.depth}
                className="absolute inset-0"
                style={{
                  transform: `translate(${slot.x}, ${slot.y}) translate(var(--px, 0px), var(--py, 0px))`,
                  transition: motion ? `transform .8s ${EASE}` : undefined,
                  zIndex: slot.z,
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 aspect-[3/4] overflow-hidden rounded-md shadow-[0_14px_34px_rgba(0,0,0,0.22)]"
                  style={{
                    // Card width as a share of the stage (percentage-based) so
                    // it scales cleanly at every breakpoint; front card = 72%.
                    width: `calc(${slot.scale} * 72%)`,
                    opacity: slot.opacity,
                    transform: "translate(-50%, -50%)",
                    outline: "2.5px solid transparent",
                    outlineColor: slot.front ? "var(--color-purple)" : "transparent",
                    transition: motion
                      ? `width .8s ${EASE}, opacity .8s, outline-color .4s`
                      : undefined,
                  }}
                >
                  <img
                    src={card.src}
                    alt={alts[index]}
                    loading={index === 2 ? "eager" : "lazy"}
                    fetchPriority={index === 2 ? "high" : undefined}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-b from-violet/15 to-ink/50" />
                  <PixelArt
                    color={card.pixel}
                    steps={4}
                    className="absolute -top-[8%] right-[-6%] z-[2] w-2/5 opacity-90"
                  />
                  <span
                    className={`absolute left-2 top-2 z-[3] flex size-7 items-center justify-center rounded-[5px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] sm:size-9 lg:size-11 ${card.tile}`}
                  >
                    <Icon name={card.icon} className="text-[17px] sm:text-xl lg:text-[26px]" />
                  </span>
                  <span className="absolute bottom-1.5 left-2 z-[3] text-[11px] font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                    {card.number} · {card.word}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </span>

      {/* Accent word — cycles in sync with whichever card holds the front slot.
          An inline-grid stacks invisible ghosts of every candidate word so the
          box always reserves the widest word's width ("Execute") — the collage
          never reflows as the word swaps — and left-aligns the visible word so
          it sits attached to the collage rather than pushed to the far right. */}
      <span
        aria-hidden
        className="block whitespace-nowrap text-[10vw] transition-opacity duration-[400ms] lg:text-[6.5vw]"
        style={{ opacity: typing ? 0 : 1 }}
      >
        <span className="inline-grid justify-items-start">
          {[accent, ...CARDS.map((card) => card.word)].map((word) => (
            <span key={`ghost-${word}`} className="invisible col-start-1 row-start-1" aria-hidden>
              <span className="text-purple">_</span>
              {word}
            </span>
          ))}
          <span className="col-start-1 row-start-1">
            <span className="text-purple">_</span>
            <span key={accentWord} className={motion && !typing ? "accent-swap inline-block" : undefined}>
              {accentWord}
            </span>
          </span>
        </span>
      </span>
    </h1>
  );
}
