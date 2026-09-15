"use client";

import { useCallback, useState } from "react";
import { Icon } from "@/components/Icon";
import { SocialIcon } from "./SocialIcon";
import { useModalDialog } from "./useModalDialog";
import { fill, mediaSrc, type Media } from "@/lib/socialFormat";

type Labels = {
  openImage: string;
  imageCount: string;
  moreImages: string;
  close: string;
  previous: string;
  next: string;
};

const cellButton =
  "group/cell relative block h-full w-full overflow-hidden bg-grey focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple dark:bg-white/[0.06] dark:focus-visible:outline-light-purple";

/**
 * A post's photos and videos, laid out like a feed does it: one item full
 * width, two side by side, three as one large plus two stacked, four or more as
 * a 2×2 with "+N" on the last tile. Images open a lightbox; videos play inline
 * with native controls and load nothing until pressed (`preload="none"`).
 */
export function MediaGrid({ media, alt, labels }: { media: Media[]; alt: string; labels: Labels }) {
  const items = media.filter((m) => mediaSrc(m.path));
  const images = items.filter((m) => m.type === "image");
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  if (items.length === 0) return null;

  const shown = items.slice(0, 4);
  const extra = items.length - shown.length;
  const altFor = (m: Media, i: number) =>
    m.alt?.trim() || (items.length > 1 ? `${alt} — ${fill(labels.imageCount, { i: i + 1, n: items.length })}` : alt);

  const cell = (m: Media, i: number, single: boolean) => {
    if (m.type === "video") {
      return (
        <video
          key={`${m.path}-${i}`}
          src={mediaSrc(m.path)}
          poster={mediaSrc(m.poster) || undefined}
          controls
          playsInline
          preload="none"
          aria-label={m.alt || alt}
          width={m.width}
          height={m.height}
          className={`h-full w-full bg-black ${single ? "object-contain" : "object-cover"}`}
        />
      );
    }
    const index = images.indexOf(m);
    const isLast = i === shown.length - 1 && extra > 0;
    return (
      <button
        key={`${m.path}-${i}`}
        type="button"
        onClick={() => setOpen(index)}
        aria-label={fill(labels.openImage, { i: index + 1, n: images.length })}
        className={cellButton}
      >
        <img
          src={mediaSrc(m.path)}
          alt={altFor(m, i)}
          width={m.width}
          height={m.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cell:scale-[1.02]"
        />
        {isLast && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-3xl font-medium text-white">
            {fill(labels.moreImages, { n: extra })}
          </span>
        )}
      </button>
    );
  };

  let grid: React.ReactNode;
  if (shown.length === 1) {
    const m = shown[0];
    // Keep the author's framing, within sane bounds (4:5 portrait to 2:1 wide).
    const ratio = m.width && m.height ? Math.min(2, Math.max(0.8, m.width / m.height)) : m.type === "video" ? 16 / 9 : 4 / 3;
    grid = (
      <div className="max-h-[640px] w-full" style={{ aspectRatio: String(ratio) }}>
        {cell(m, 0, true)}
      </div>
    );
  } else if (shown.length === 2) {
    grid = <div className="grid aspect-[2/1] grid-cols-2 gap-0.5">{shown.map((m, i) => cell(m, i, false))}</div>;
  } else if (shown.length === 3) {
    grid = (
      <div className="grid aspect-[3/2] grid-cols-[2fr_1fr] grid-rows-2 gap-0.5">
        <div className="row-span-2">{cell(shown[0], 0, false)}</div>
        {cell(shown[1], 1, false)}
        {cell(shown[2], 2, false)}
      </div>
    );
  } else {
    grid = <div className="grid aspect-square grid-cols-2 grid-rows-2 gap-0.5 sm:aspect-[4/3]">{shown.map((m, i) => cell(m, i, false))}</div>;
  }

  return (
    <>
      {grid}
      {open !== null && images.length > 0 && (
        <Lightbox images={images} start={open} alt={alt} labels={labels} onClose={close} />
      )}
    </>
  );
}

function Lightbox({
  images,
  start,
  alt,
  labels,
  onClose,
}: {
  images: Media[];
  start: number;
  alt: string;
  labels: Labels;
  onClose: () => void;
}) {
  const ref = useModalDialog(onClose);
  const [index, setIndex] = useState(start);
  const count = images.length;
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);
  const image = images[index];

  return (
    <dialog
      ref={ref}
      data-lenis-prevent
      aria-label={fill(labels.imageCount, { i: index + 1, n: count })}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-black/90"
    >
      <div className="flex h-full w-full flex-col" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <p aria-live="polite" className="text-[13px] font-medium tabular-nums text-white/70">
            {count > 1 ? fill(labels.imageCount, { i: index + 1, n: count }) : ""}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            autoFocus
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-purple"
          >
            <Icon name="close" style={{ fontSize: "22px" }} />
          </button>
        </div>
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-20"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <img
            key={image.path}
            src={mediaSrc(image.path)}
            alt={image.alt?.trim() || alt}
            className="max-h-full max-w-full rounded-card object-contain"
          />
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.previous}
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-purple sm:left-5"
              >
                <SocialIcon name="chevronLeft" size={22} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-light-purple sm:right-5"
              >
                <SocialIcon name="chevronRight" size={22} />
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
