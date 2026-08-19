"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type PanInfo } from "framer-motion";
import type { Locale } from "@/i18n/config";

interface StackCard {
  id: number;
  title: string;
  body: string;
  image: string;
  orientation: "portrait" | "landscape";
}

type Slot = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  zIndex: number;
};

const STACK_CARDS: Record<Locale, StackCard[]> = {
  en: [
    { id: 0, title: "Insight & Strategy", body: "Business-driven strategy for audience, competitor and media needs.", image: "/images/brand/services-planning.webp", orientation: "portrait" },
    { id: 1, title: "Data & Analytics", body: "We turn available data into a sharper media strategy.", image: "/images/brand/hero-data.webp", orientation: "landscape" },
    { id: 2, title: "Paid Media", body: "Experienced operators optimizing results across every channel.", image: "/images/brand/hero-human.webp", orientation: "portrait" },
    { id: 3, title: "Measurement", body: "Research and measurement that validates plans and results.", image: "/images/brand/data-desk.webp", orientation: "landscape" },
    { id: 4, title: "Performance Marketing", body: "Reach the right audience and turn attention into results.", image: "/images/brand/team-energy.webp", orientation: "portrait" },
  ],
  fi: [
    { id: 0, title: "Insight & strategia", body: "Liiketoimintalähtöistä strategiatyötä kohderyhmille, kilpailijoille ja mediaan.", image: "/images/brand/services-planning.webp", orientation: "portrait" },
    { id: 1, title: "Data & analytiikka", body: "Rakennamme mediastrategian saatavilla olevan datan pohjalta.", image: "/images/brand/hero-data.webp", orientation: "landscape" },
    { id: 2, title: "Maksettu media", body: "Kokenut tiimi operoi ja optimoi tuloksia kaikissa kanavissa.", image: "/images/brand/hero-human.webp", orientation: "portrait" },
    { id: 3, title: "Mittaaminen", body: "Tutkimus ja mittaaminen todentavat suunnitelmat ja tulokset.", image: "/images/brand/data-desk.webp", orientation: "landscape" },
    { id: 4, title: "Tuloksellinen markkinointi", body: "Tavoitamme oikean yleisön ja muutamme huomion tuloksiksi.", image: "/images/brand/team-energy.webp", orientation: "portrait" },
  ],
};

const SLOTS_DESKTOP: Slot[] = [
  { x: 0, y: 0, rotate: 1.5, scale: 1, zIndex: 50 },
  { x: 116, y: -28, rotate: 11, scale: 0.9, zIndex: 40 },
  { x: -108, y: -10, rotate: -13, scale: 0.89, zIndex: 30 },
  { x: 66, y: 62, rotate: 8, scale: 0.86, zIndex: 20 },
  { x: -78, y: 54, rotate: -9, scale: 0.84, zIndex: 10 },
];

const SLOTS_MOBILE: Slot[] = [
  { x: 0, y: 0, rotate: 1, scale: 1, zIndex: 50 },
  { x: 62, y: -14, rotate: 6, scale: 0.9, zIndex: 40 },
  { x: -58, y: 18, rotate: -7, scale: 0.89, zIndex: 30 },
  { x: 40, y: 32, rotate: 4, scale: 0.86, zIndex: 20 },
  { x: -38, y: 26, rotate: -4.5, scale: 0.84, zIndex: 10 },
];

const SPRING = { type: "spring" as const, stiffness: 280, damping: 26 };
const RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow";

export function HeroCardStack({
  locale,
  cards: override,
}: {
  locale: Locale;
  /**
   * Cards from the CMS, index-aligned with the shipped set. Each field falls
   * back individually, so an entry that only changes the image keeps its copy.
   */
  cards?: { title?: string; body?: string; image?: string; orientation?: string }[];
}) {
  const shipped = STACK_CARDS[locale];
  const cards: StackCard[] = shipped.map((card, index) => {
    const patch = override?.[index];
    if (!patch) return card;
    return {
      ...card,
      title: patch.title?.trim() || card.title,
      body: patch.body?.trim() || card.body,
      image: patch.image || card.image,
      orientation: patch.orientation === "landscape" || patch.orientation === "portrait" ? patch.orientation : card.orientation,
    };
  });
  const [order, setOrder] = useState(cards.map((card) => card.id));
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragDelta = useRef(0);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const stackY = useTransform(scrollY, [0, 900], [0, -140]);
  const staticY = useMotionValue(0);
  const parallaxY = reduceMotion ? staticY : stackY;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const apply = () => setIsMobile(!media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const focusCard = useCallback((cardId: number) => {
    setOrder((current) => {
      const index = current.indexOf(cardId);
      return index <= 0 ? current : [cardId, ...current.slice(0, index), ...current.slice(index + 1)];
    });
  }, []);

  const step = useCallback((direction: 1 | -1) => {
    setOrder((current) => direction === 1
      ? [...current.slice(1), current[0]]
      : [current[current.length - 1], ...current.slice(0, current.length - 1)]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      if (!containerRef.current?.contains(document.activeElement)) return;
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  const handleDragEnd = useCallback((_event: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -350) step(1);
    else if (info.offset.x > 50 || info.velocity.x > 350) step(-1);
  }, [step]);

  const slots = isMobile ? SLOTS_MOBILE : SLOTS_DESKTOP;
  const frontCardId = order[0];
  const frontCard = cards.find((card) => card.id === frontCardId);

  return (
    <motion.div
      ref={containerRef}
      className="group pointer-events-auto absolute bottom-[-230px] right-4 z-[6] w-[min(400px,58vw)] sm:right-8 sm:w-[min(500px,40vw)]"
      style={{ y: parallaxY }}
    >
      <div className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-32">
        <div
          role="group"
          aria-label={locale === "fi" ? "Palvelukortit" : "Service cards"}
          className="relative flex h-[300px] w-full items-center justify-center sm:h-[360px]"
          style={{ perspective: "1200px" }}
        >
        {cards.map((card) => {
          const slotIndex = order.indexOf(card.id);
          const slot = slots[slotIndex];
          const isFocus = slotIndex === 0;
          const imageRatio = card.orientation === "landscape" ? "aspect-[16/10]" : "aspect-[4/5]";

          return (
            <motion.div
              key={card.id}
              tabIndex={0}
              role={isFocus ? undefined : "button"}
              aria-label={isFocus ? `${card.title}, current` : `${locale === "fi" ? "Näytä" : "Show"} ${card.title}`}
              onClick={isFocus ? undefined : () => focusCard(card.id)}
              onKeyDown={isFocus ? undefined : (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  focusCard(card.id);
                }
              }}
              onPointerDown={() => { dragDelta.current = 0; }}
              onDrag={(_, info) => { dragDelta.current = info.offset.x; }}
              onDragEnd={handleDragEnd}
              drag={isFocus ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.65}
              className={`absolute w-[180px] rounded-[14px] outline-none sm:w-[230px] ${isFocus ? "" : RING}`}
              style={{ cursor: isFocus ? "grab" : "pointer", zIndex: slot.zIndex }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6, y: 40 }}
              animate={{ x: slot.x, y: slot.y, rotate: slot.rotate, scale: slot.scale, opacity: 1 }}
              transition={SPRING}
              whileTap={isFocus ? { cursor: "grabbing" } : undefined}
            >
              <motion.div
                className="relative overflow-hidden rounded-[14px] bg-white p-2 ring-1 ring-black/10"
                style={{ boxShadow: isFocus ? "0 20px 40px rgba(0,0,0,.34)" : "0 10px 24px rgba(0,0,0,.24)" }}
                animate={reduceMotion ? undefined : { y: isFocus ? [0, -5, 0] : [0, -3, 0] }}
                transition={reduceMotion ? { duration: 0 } : { duration: 6 + card.id * 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative mb-2 px-1 pt-1">
                  <p className="pr-2 text-left text-[12px] font-medium leading-tight text-ink sm:text-[14px]">{card.title}</p>
                  {isFocus && <span aria-hidden className="absolute right-1 top-1 text-[13px] text-purple">↗</span>}
                </div>
                <div className={`relative w-full overflow-hidden rounded-[9px] ${imageRatio}`}>
                  <img src={card.image} alt="" loading={isFocus ? "eager" : "lazy"} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
        </div>
        <p className="mt-1 text-right text-[10px] uppercase tracking-[0.13em] text-white/65">{frontCard?.body}</p>
        <div className="mt-2 flex justify-end gap-1" aria-hidden>
          {cards.map((card) => <span key={card.id} className={`h-1 rounded-full transition-all ${card.id === frontCardId ? "w-5 bg-yellow" : "w-1 bg-white/45"}`} />)}
        </div>
      </div>
    </motion.div>
  );
}
