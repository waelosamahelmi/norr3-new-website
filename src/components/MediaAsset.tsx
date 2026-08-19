/**
 * An image slot that will also take a video.
 *
 * Anywhere the CMS stores "a piece of imagery" — a hero card, a section slot, a
 * case photo — the value is just a path, and it may now point at an MP4 as
 * easily as a WebP. Rather than teaching every component to branch, they render
 * this and it decides.
 *
 * Video is treated as decoration, not as content: silent, looping, no controls.
 * That is what makes autoplay permissible in the first place, and it is why
 * there is no play button — a loop nobody asked to start is not something a
 * viewer should have to stop.
 */

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov"]);

/** True when a stored media path points at a video rather than an image. */
export function isVideo(src: string | null | undefined): boolean {
  const extension = String(src ?? "")
    .split(/[?#]/)[0]
    .split(".")
    .pop()
    ?.toLowerCase();
  return extension ? VIDEO_EXTENSIONS.has(extension) : false;
}

const MIME: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

function mimeFor(src: string): string | undefined {
  const extension = src.split(/[?#]/)[0].split(".").pop()?.toLowerCase() ?? "";
  return MIME[extension];
}

export function MediaAsset({
  src,
  alt = "",
  className = "",
  /** Passed to `<img loading>`. Ignored for video, which uses `preload` instead. */
  loading = "lazy",
  /** A still shown while a video's first frame is still arriving. */
  poster,
  draggable = false,
  style,
  /**
   * Intrinsic size, to reserve layout space before the file arrives. Applied to
   * video as well: the attributes mean the same thing on both elements, and a
   * slot that stops reserving space the moment it holds a video would reintroduce
   * the layout shift the numbers were added to prevent.
   */
  width,
  height,
  /** Image-only; a video decodes on its own schedule. */
  decoding,
  ref,
}: {
  src: string;
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy";
  poster?: string;
  draggable?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  decoding?: "async" | "sync" | "auto";
  /** For callers that animate the element directly, such as ParallaxImage. */
  ref?: React.Ref<HTMLElement>;
}) {
  if (!isVideo(src)) {
    return (
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        src={src}
        alt={alt}
        loading={loading}
        draggable={draggable}
        className={className}
        style={style}
        width={width}
        height={height}
        decoding={decoding}
      />
    );
  }

  return (
    <video
      ref={ref as React.Ref<HTMLVideoElement>}
      className={className}
      style={style}
      width={width}
      height={height}
      /**
       * These four attributes are one unit, and iOS is the reason.
       *
       * Safari refuses to autoplay anything with an audio track unless it is
       * muted, and on iPhone a video without `playsInline` is taken over by the
       * fullscreen player the moment it starts — so a background loop becomes a
       * fullscreen takeover. `muted` and `playsInline` are therefore not
       * preferences here; without either one this does not work on a phone.
       *
       * React needs `muted` set as a property rather than an attribute for it to
       * stick before the first play attempt, which `muted` as a JSX prop does.
       */
      autoPlay
      muted
      loop
      playsInline
      /**
       * `metadata` rather than `auto`: the container header is enough to start,
       * and a page of card-stack videos should not pull every full file on load.
       */
      preload="metadata"
      poster={poster}
      // Nothing here is a video the viewer chose to watch, so keep it out of the
      // way of AirPlay and the OS media controls.
      disableRemotePlayback
      aria-hidden={alt === "" ? true : undefined}
      aria-label={alt || undefined}
    >
      <source src={src} type={mimeFor(src)} />
    </video>
  );
}
