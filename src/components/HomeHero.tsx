"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "./Icon";
import { PixelArt } from "./PixelArt";

/** ms per character for the "A New Way to" typewriter intro. */
const TYPE_SPEED = 70;
/** ms between each card "popping" in after the left word finishes typing. */
const POP_STAGGER = 220;
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

/**
 * The three cards as the site shipped them. The CMS overrides the word, the
 * image and its alt text per card; the icon tile and pixel accent stay here
 * because they are brand decisions, not content.
 */
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
    src: "/images/brand/hero-human.webp",
    icon: "draw",
    tile: "bg-yellow text-ink",
    pixel: "var(--color-purple)",
  },
  {
    word: "Grow",
    number: "03",
    src: "/images/brand/hero-data.webp",
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
  cards,
  rotateEvery,
}: {
  left: string;
  accent: string;
  alts: [string, string, string];
  /**
   * Cards from the CMS. Each entry overrides the word, image and alt of the
   * card at the same index; anything missing keeps the built-in value, so the
   * hero renders the shipped design when the CMS has nothing to say.
   */
  cards?: { word?: string; src?: string; alt?: string; number?: string; icon?: string }[];
  rotateEvery?: number;
}) {
  const motion = useMotionAllowed();
  const parallax = useParallaxAllowed();

  const deck: HeroCard[] = CARDS.map((card, index) => {
    const override = cards?.[index];
    return {
      ...card,
      word: override?.word?.trim() || card.word,
      src: override?.src || card.src,
      number: override?.number?.trim() || card.number,
      icon: override?.icon?.trim() || card.icon,
    };
  });
  const altText = (index: number) => cards?.[index]?.alt?.trim() || alts[index];
  const rotateMs = rotateEvery && rotateEvery > 0 ? rotateEvery : ROTATE_EVERY;

  /** Slot assignment as card indices: [back, mid, front]. */
  const [order, setOrder] = useState<number[]>(INITIAL_ORDER);
  /** Characters of the left word revealed so far (only used while animating). */
  const [typed, setTyped] = useState(0);
  /** How many cards have "popped" in (0..3). All three = intro done. */
  const [popped, setPopped] = useState(0);
  const displayedAccentRef = useRef(accent);
  const [displayedAccent, setDisplayedAccent] = useState(accent);

  const pointer = useRef({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement | null>(null);

  const typing = motion && typed < left.length;
  /** True while the cards are still popping in (after typing, before rotation). */
  const popping = motion && !typing && popped < deck.length;

  // Type the left word out, once, on the first render that allows motion.
  useEffect(() => {
    if (!motion) return;
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= left.length) window.clearInterval(tick);
    }, TYPE_SPEED);
    return () => window.clearInterval(tick);
  }, [motion, left]);

  // "Pop pop pop" — once the left word is typed, reveal the three cards one by
  // one (back → mid → front), then hand off to the rotation + accent word.
  useEffect(() => {
    if (!motion || typing || popped >= deck.length) return;
    const t = window.setTimeout(() => setPopped((n) => n + 1), POP_STAGGER);
    return () => window.clearTimeout(t);
  }, [motion, typing, popped, deck.length]);

  // The rotating stack — starts once all three cards have popped in.
  useEffect(() => {
    if (!motion || typing || popping) return;
    const rot = window.setInterval(() => {
      // front → back, back → mid, mid → front
      setOrder(([back, mid, front]) => [front, back, mid]);
    }, rotateMs);
    return () => window.clearInterval(rot);
  }, [motion, typing, popping, rotateMs]);

  // Pointer parallax: every card drifts by its slot depth, the front one most.
  useEffect(() => {
    if (!parallax) return;
    const stageCards = stageRef.current?.querySelectorAll<HTMLElement>("[data-depth]");
    if (!stageCards?.length) return;
    let raf = 0;
    let cx = 0;
    let cy = 0;
    const loop = () => {
      cx += (pointer.current.x - cx) * 0.07;
      cy += (pointer.current.y - cy) * 0.07;
      stageCards.forEach((el) => {
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
  const slotOf = deck.map((_, card) => order.indexOf(card));
  // The accent word holds off until the cards finish popping in; then it tracks
  // whichever card holds the front slot.
  const accentWord = typing || popping || !motion ? accent : deck[order[2]].word;
  /** Accent word is hidden during typing and the pop-in sequence. */
  const accentHidden = typing || popping;

  useEffect(() => {
    if (!motion) return;
    let cancelled = false;
    let eraseTimer = 0;
    let typeTimer = 0;
    let pauseTimer = 0;
    let current = displayedAccentRef.current;

    const typeNext = () => {
      let position = 0;
      typeTimer = window.setInterval(() => {
        if (cancelled) return;
        position += 1;
        current = accentWord.slice(0, position);
        displayedAccentRef.current = current;
        setDisplayedAccent(current);
        if (position >= accentWord.length) window.clearInterval(typeTimer);
      }, TYPE_SPEED);
    };

    eraseTimer = window.setInterval(() => {
      if (cancelled) return;
      current = current.slice(0, -1);
      displayedAccentRef.current = current;
      setDisplayedAccent(current);
      if (!current) {
        window.clearInterval(eraseTimer);
        pauseTimer = window.setTimeout(typeNext, 180);
      }
    }, TYPE_SPEED);

    return () => {
      cancelled = true;
      window.clearInterval(eraseTimer);
      window.clearInterval(typeTimer);
      window.clearTimeout(pauseTimer);
    };
  }, [accentWord, motion]);

  return (
    <h1
      aria-label={`${left} ${accent}`}
      className="relative flex w-full flex-wrap items-center justify-center gap-x-1 gap-y-1 font-medium leading-none tracking-tight text-ink lg:flex-nowrap lg:justify-start lg:gap-2 dark:text-white"
      onPointerMove={parallax ? handlePointerMove : undefined}
      onPointerLeave={parallax ? handlePointerLeave : undefined}
    >
      {/* Left word — types itself in, with the blinking caret trailing it.
          When not typing the caret collapses to zero width so it doesn't add a
          phantom gap before the accent word on mobile. */}
      <span aria-hidden className="relative z-10 block whitespace-nowrap text-[7.5vw] lg:text-[6.5vw]">
        {motion ? left.slice(0, typed) : left}
        <span className={typing ? "caret-blink" : "inline-block w-0 overflow-hidden opacity-0"}>_</span>
      </span>

      {/* The rotating portrait stack. Sits behind the text (z-0, its own
          stacking context as a flex item) — the enlarged 9:16 cards spill
          past the stage box on the sides once popped and offset, and without
          this the card's explicit z-index (1–3 below) would otherwise let it
          paint over the neighbouring words, which have none. */}
      <span aria-hidden className="relative z-0 order-3 mt-10 block w-full lg:order-none lg:mt-0 lg:w-auto lg:min-w-0 lg:shrink-0">
        <div
          ref={stageRef}
          className="relative mx-auto h-[460px] max-h-[56svh] w-[min(320px,84vw)] select-none [--card:210px] [--spread:0.72] sm:h-[700px] sm:max-h-[62svh] sm:w-full sm:max-w-lg sm:[--card:340px] sm:[--spread:0.85] lg:mx-4 lg:h-[560px] lg:max-h-[62svh] lg:w-[420px] lg:[--card:360px] lg:[--spread:1]"
        >
          {deck.map((card, index) => {
            const slotIndex = slotOf[index];
            const slot = SLOTS[slotIndex];
            // During the intro, a card is hidden until its turn in the pop
            // sequence (back → mid → front). After the intro `popped` is 3, so
            // every card is shown and this is always true.
            const isPopped = !motion || popped > slotIndex;
            return (
              <div
                key={card.word}
                data-depth={slot.depth}
                className="absolute inset-0"
                style={{
                  transform: `translate(calc(${slot.x} * var(--spread, 1)), ${slot.y}) translate(var(--px, 0px), var(--py, 0px))`,
                  transition: motion ? `transform .8s ${EASE}` : undefined,
                  zIndex: slot.z,
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 aspect-[9/16] overflow-hidden rounded-md shadow-[0_14px_34px_rgba(0,0,0,0.22)]"
                  style={{
                    // Card width as a share of the stage (percentage-based) so
                    // it scales cleanly at every breakpoint; front card = 76%.
                    width: `calc(${slot.scale} * 76%)`,
                    opacity: isPopped ? slot.opacity : 0,
                    // Pop-in: scale from 0 to 1 (springy) as each card appears.
                    transform: `translate(-50%, -50%) scale(${isPopped ? 1 : 0})`,
                    outline: "2.5px solid transparent",
                    outlineColor: slot.front ? "var(--color-purple)" : "transparent",
                    transition: motion
                      ? `width .8s ${EASE}, opacity .45s ${EASE}, transform .5s cubic-bezier(.34,1.56,.64,1), outline-color .4s`
                      : undefined,
                  }}
                >
                  <img
                    src={card.src}
                    alt={altText(index)}
                    loading={index === 1 ? "eager" : "lazy"}
                    fetchPriority={index === 1 ? "high" : undefined}
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

      {/* Accent word — appears only after the cards finish popping in, then
          cycles in sync with whichever card holds the front slot. An inline-grid
          stacks invisible ghosts of every candidate word so the box always
          reserves the widest word's width — the collage never reflows as the
          word swaps — and left-aligns the visible word so it sits attached to
          the collage rather than pushed to the far right. */}
      <span
        aria-hidden
        className="relative z-10 block whitespace-nowrap text-[7.5vw] transition-opacity duration-[400ms] lg:text-[6.5vw]"
        style={{ opacity: accentHidden ? 0 : 1 }}
      >
        <span className="inline-grid justify-items-start">
          {[accent, ...deck.map((card) => card.word)].map((word, index) => (
            <span key={`ghost-${index}`} className="invisible col-start-1 row-start-1 hidden lg:block" aria-hidden>
              <span className="text-ink dark:text-white">_</span>
              {word}
            </span>
          ))}
          <span className="col-start-1 row-start-1">
            <span className={motion && displayedAccent !== accentWord ? "caret-blink text-ink dark:text-white" : "text-ink dark:text-white"}>_</span>
            <span>{motion ? displayedAccent : accentWord}
            </span>
          </span>
        </span>
      </span>
    </h1>
  );
}
