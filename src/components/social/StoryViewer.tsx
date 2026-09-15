"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Avatar } from "./Avatar";
import { RelativeTime } from "./RelativeTime";
import { SocialIcon } from "./SocialIcon";
import { useModalDialog } from "./useModalDialog";
import { profileHref, type SocialDict } from "./PostCard";
import { fill, loc, mediaSrc, safeHttpUrl, type StoryGroup } from "@/lib/socialFormat";
import type { Locale } from "@/i18n/config";

const IMAGE_MS = 5000;
const TAP_MS = 250;
const SWIPE_CLOSE_PX = 90;

const roundButton =
  "flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-light-purple";

/**
 * Fullscreen story viewer.
 *
 * - One progress bar per story in the member's set; images run ~5 s, videos
 *   for their own duration, then it moves on — through the rest of this
 *   member's stories and on to the next member's.
 * - Tap the left third to go back, anywhere else to go forward; press and hold
 *   to pause; swipe down to close on touch. Keyboard: ← / →, Space pauses,
 *   Esc closes (the native dialog's cancel).
 * - Progress is painted by writing a transform straight onto the bar from a
 *   rAF loop: no React re-render per frame, and no DOM mutations for the
 *   visual editor's MutationObserver to chase.
 */
export function StoryViewer({
  groups,
  startGroup = 0,
  startIndex = 0,
  locale,
  t,
  onClose,
  onSeen,
  highlightMode = false,
}: {
  groups: StoryGroup[];
  startGroup?: number;
  startIndex?: number;
  locale: Locale;
  t: SocialDict;
  onClose: () => void;
  onSeen?: (id: number) => void;
  /** Highlights show their title instead of the time since posting. */
  highlightMode?: boolean;
}) {
  const dialogRef = useModalDialog(onClose);
  const [pos, setPos] = useState({ g: startGroup, i: startIndex });
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [muted, setMuted] = useState(false);

  const group = groups[pos.g];
  const story = group?.stories[pos.i];

  const barRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const elapsed = useRef(0);
  const ready = useRef(false);
  const stopped = useRef(false);
  const pointer = useRef<{ x: number; y: number; at: number; touch: boolean } | null>(null);

  const next = useCallback(() => {
    setPos(({ g, i }) => {
      if (i < (groups[g]?.stories.length ?? 0) - 1) return { g, i: i + 1 };
      if (g < groups.length - 1) return { g: g + 1, i: 0 };
      // Past the last story: close on the next tick, outside the state update.
      window.setTimeout(onClose, 0);
      return { g, i };
    });
  }, [groups, onClose]);

  const prev = useCallback(() => {
    setPos(({ g, i }) => {
      if (i > 0) return { g, i: i - 1 };
      if (g > 0) return { g: g - 1, i: Math.max(0, (groups[g - 1]?.stories.length ?? 1) - 1) };
      elapsed.current = 0;
      if (videoRef.current) videoRef.current.currentTime = 0;
      return { g, i };
    });
  }, [groups]);

  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  useEffect(() => {
    stopped.current = paused || holding;
    const video = videoRef.current;
    if (!video) return;
    if (stopped.current) video.pause();
    else if (ready.current) video.play().catch(() => undefined);
  }, [paused, holding]);

  // A new story: reset the clock, mark it seen, warm up the next image.
  useEffect(() => {
    if (!story) return;
    elapsed.current = 0;
    ready.current = story.mediaType === "video";
    onSeen?.(story.id);

    const upcoming = group.stories[pos.i + 1] ?? groups[pos.g + 1]?.stories[0];
    if (upcoming?.mediaType === "image") {
      const img = new Image();
      img.src = mediaSrc(upcoming.path);
    }

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      let progress = 0;
      if (story.mediaType === "video") {
        const video = videoRef.current;
        progress = video && video.duration ? video.currentTime / video.duration : 0;
      } else {
        if (ready.current && !stopped.current) elapsed.current += dt;
        progress = elapsed.current / IMAGE_MS;
        if (progress >= 1) {
          nextRef.current();
          return;
        }
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, progress)})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the story itself
  }, [story?.id, pos.g, pos.i]);

  // Videos: start as soon as they can, with sound if the browser allows it.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || story?.mediaType !== "video") return;
    video.muted = muted;
    if (stopped.current) return;
    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      video.play().catch(() => undefined);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the story changes
  }, [story?.id]);

  if (!group || !story) return null;

  const link = safeHttpUrl(story.linkUrl);
  const name = group.member.name;
  const count = group.stories.length;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    pointer.current = { x: e.clientX, y: e.clientY, at: performance.now(), touch: e.pointerType === "touch" };
    setHolding(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    if (!start?.touch || !frameRef.current) return;
    const dy = Math.max(0, e.clientY - start.y);
    frameRef.current.style.transform = dy ? `translateY(${dy}px)` : "";
    frameRef.current.style.opacity = dy ? String(Math.max(0.4, 1 - dy / 400)) : "";
  };
  const endPointer = (e: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = pointer.current;
    pointer.current = null;
    setHolding(false);
    if (frameRef.current) {
      frameRef.current.style.transform = "";
      frameRef.current.style.opacity = "";
    }
    if (!start || cancelled) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (start.touch && dy > SWIPE_CLOSE_PX) {
      onClose();
      return;
    }
    if (performance.now() - start.at < TAP_MS && Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      const rect = e.currentTarget.getBoundingClientRect();
      if (e.clientX - rect.left < rect.width / 3) prev();
      else next();
    }
  };

  const src = mediaSrc(story.path);
  const poster = mediaSrc(story.poster);

  return (
    <dialog
      ref={dialogRef}
      data-lenis-prevent
      aria-label={fill(t.viewStories, { name })}
      onKeyDownCapture={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          next();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prev();
        } else if (e.key === " " && !(e.target instanceof HTMLAnchorElement)) {
          e.preventDefault();
          setPaused((v) => !v);
        }
      }}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 text-white backdrop:bg-black/95"
    >
      <div className="flex h-full w-full items-center justify-center sm:gap-4">
        <button type="button" onClick={prev} aria-label={t.previous} className={`${roundButton} hidden bg-white/10 sm:flex`}>
          <SocialIcon name="chevronLeft" size={22} />
        </button>

        <div
          ref={frameRef}
          className="relative h-full w-full overflow-hidden bg-black sm:aspect-[9/16] sm:h-[min(calc(100dvh-2rem),880px)] sm:w-auto sm:rounded-[10px]"
        >
          {/* Media, with a blurred copy filling the letterbox */}
          {poster || story.mediaType === "image" ? (
            <img aria-hidden src={story.mediaType === "image" ? src : poster} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
          ) : null}
          {story.mediaType === "video" ? (
            <video
              key={story.id}
              ref={videoRef}
              src={src}
              poster={poster || undefined}
              playsInline
              muted={muted}
              preload="auto"
              onEnded={next}
              onError={next}
              aria-label={story.caption || fill(t.storyCount, { i: pos.i + 1, n: count })}
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <img
              key={story.id}
              src={src}
              alt={story.caption || fill(t.storyCount, { i: pos.i + 1, n: count })}
              onLoad={() => (ready.current = true)}
              onError={() => (ready.current = true)}
              ref={(el) => {
                if (el?.complete) ready.current = true;
              }}
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}

          {/* Tap / hold / swipe surface */}
          <div
            aria-hidden
            className="absolute inset-0 touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endPointer(e)}
            onPointerCancel={(e) => endPointer(e, true)}
            onContextMenu={(e) => e.preventDefault()}
          />

          {/* Header */}
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent px-3 pb-8 pt-3">
            <div className="flex gap-1" aria-hidden>
              {group.stories.map((s, index) => (
                <span key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                  {index < pos.i ? (
                    <span className="block h-full w-full bg-white" />
                  ) : index === pos.i ? (
                    <span ref={barRef} className="social-story-bar block h-full w-full bg-white" style={{ transform: "scaleX(0)" }} />
                  ) : null}
                </span>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              {fill(t.storyCount, { i: pos.i + 1, n: count })}
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <Link
                href={profileHref(locale, group.member.slug)}
                onClick={onClose}
                className="pointer-events-auto flex min-w-0 items-center gap-2.5 rounded-full pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-purple"
              >
                <Avatar name={name} photo={group.member.photo} size={34} />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-medium leading-tight">{name}</span>
                  <span className="block truncate text-[12px] leading-tight text-white/70">
                    {highlightMode ? story.highlightTitle || loc(group.member.headline, locale) : <RelativeTime iso={story.createdAt} locale={locale} justNow={t.justNow} />}
                  </span>
                </span>
              </Link>
              <div className="pointer-events-auto ml-auto flex items-center">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setPaused((v) => !v)}
                  aria-label={paused ? t.resume : t.pause}
                  aria-pressed={paused}
                  className={roundButton}
                >
                  <SocialIcon name={paused ? "play" : "pause"} size={18} />
                </button>
                {story.mediaType === "video" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMuted((m) => !m);
                      if (videoRef.current) videoRef.current.muted = !muted;
                    }}
                    aria-label={muted ? t.unmute : t.mute}
                    className={roundButton}
                  >
                    <SocialIcon name={muted ? "mute" : "volume"} size={20} />
                  </button>
                )}
                <button type="button" onClick={onClose} aria-label={t.close} className={roundButton}>
                  <Icon name="close" style={{ fontSize: "24px" }} />
                </button>
              </div>
            </div>
          </div>

          {/* Caption + link */}
          {(story.caption || link) && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-6 pt-16 text-center">
              {story.caption && <p className="whitespace-pre-line text-[15px] leading-relaxed text-white">{story.caption}</p>}
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:bg-light-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-purple"
                >
                  {t.openLink}
                  <Icon name="arrow_outward" style={{ fontSize: "16px" }} />
                </a>
              )}
            </div>
          )}
        </div>

        <button type="button" onClick={next} aria-label={t.next} className={`${roundButton} hidden bg-white/10 sm:flex`}>
          <SocialIcon name="chevronRight" size={22} />
        </button>
      </div>
    </dialog>
  );
}
