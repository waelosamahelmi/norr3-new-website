"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { LeadContactCard } from "./cards/LeadContactCard";
import type { TeamMember } from "@/content/team";
import type { Locale } from "@/i18n/config";

/**
 * One-row lead-contact slider for the Contact page.
 *
 * The five routing contacts used to be a 1/2/3/5 grid; they now live on a
 * single horizontal rail so the section keeps one visual height and the next
 * card always peeks in. Native scroll-snap carries touch and trackpad, the
 * arrow buttons carry pointer users, and both stay in sync through the rail's
 * own scroll position — no carousel library, no transforms fighting the
 * snap engine.
 */
export function TeamSlider({
  members,
  locale,
  emailLabel,
  linkedinLabel,
  ariaLabel,
}: {
  members: TeamMember[];
  locale: Locale;
  emailLabel: string;
  linkedinLabel: string;
  ariaLabel: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);
  /** Mouse-drag state. Touch and trackpad scroll natively, so the manual drag
   *  is mouse-only; `moved` lets us swallow the click that a drag would
   *  otherwise fire on whatever link it happened to end on. */
  const dragRef = useRef({ startX: 0, startScroll: 0, moved: false, active: false });

  const syncEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 2);
    setAtEnd(rail.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    syncEdges();
    rail.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      rail.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  /** One full card per click, gap included, so cards never land half-cut. */
  const step = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-slide]");
    const gap = 26; // --spacing-card-gap
    const distance = (card?.offsetWidth ?? rail.clientWidth) + gap;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * distance, behavior: reduced ? "auto" : "smooth" });
  };

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = {
      startX: event.clientX,
      startScroll: rail.scrollLeft,
      moved: false,
      active: true,
    };
    setDragging(true);
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active) return;
    // A pointerup outside the rail never reaches us; treat a released button
    // as the end of the gesture instead of leaving the drag armed.
    if (event.buttons === 0) {
      drag.active = false;
      setDragging(false);
      return;
    }
    const delta = event.clientX - drag.startX;
    // Capture only once this is clearly a drag. Capturing on pointerdown
    // retargets the click to the rail, so the mailto/tel/LinkedIn links inside
    // the cards would never open — a plain click must stay a plain click.
    if (!drag.moved) {
      if (Math.abs(delta) <= 4) return;
      drag.moved = true;
      rail.setPointerCapture(event.pointerId);
    }
    rail.scrollLeft = drag.startScroll - delta;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active) return;
    drag.active = false;
    setDragging(false);
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
  };

  const swallowDragClick = (event: React.MouseEvent) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  };

  const labels =
    locale === "fi" ? { prev: "Edellinen", next: "Seuraava" } : { prev: "Previous", next: "Next" };

  const arrowClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple disabled:pointer-events-none disabled:opacity-25 dark:border-white/20 dark:text-white dark:hover:border-purple dark:hover:bg-purple";

  return (
    <div>
      <div
        ref={railRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={swallowDragClick}
        onDragStart={(event) => event.preventDefault()}
        className={`-my-3 mt-11 flex gap-card-gap overflow-x-auto py-3 [scrollbar-width:none] lg:mt-13 [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing snap-none select-none" : "cursor-grab snap-x snap-mandatory"
        }`}
      >
        {members.map((member) => (
          <div
            key={member.id}
            data-slide
            className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[22.5%]"
          >
            <LeadContactCard
              member={member}
              locale={locale}
              emailLabel={emailLabel}
              linkedinLabel={linkedinLabel}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label={labels.prev}
          className={arrowClass}
        >
          <Icon name="chevron_left" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label={labels.next}
          className={arrowClass}
        >
          <Icon name="chevron_right" />
        </button>
      </div>
    </div>
  );
}
