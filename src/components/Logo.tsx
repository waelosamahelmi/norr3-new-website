const WORDMARK_SRC = "/logo-animated.svg";

/**
 * The purple inside the logo artwork, which is *not* the same as the brand's
 * `--color-purple` token (#7a06d3): the supplied logo files are #7016cb. The
 * mark is drawn in the artwork's purple rather than the token's so that the two
 * halves of the lockup agree — a triangle in #7a06d3 beside a wordmark in
 * #7016cb reads as a mistake at any size.
 *
 * Deliberately not wired to the theme token, for the same reason: recolouring
 * the UI should not recolour the logo.
 *
 * Written as classes rather than an inline style because an inline `color` wins
 * against `dark:text-white`, which would leave a purple mark on the dark
 * background. Tailwind picks the literal up by scanning this file.
 */
const MARK_COLOR = "text-[#7016cb] dark:text-white";

/**
 * The NØRR3 logo, in the three forms a brand actually needs.
 *
 * - `lockup` (default) — the mark and the wordmark side by side. What the nav
 *   and any other "this is the site" position should use.
 * - `mark` — the triangle on its own, for tight spaces: an app icon, an avatar,
 *   a favicon, a loading state.
 * - `wordmark` — the letters on their own, for places already surrounded by
 *   brand, like the giant footer signature.
 *
 * The wordmark stays an `<img>` because it is a self-animating SMIL SVG — the
 * numeral 3 morphs into the mark on a loop, and running that inside an `<img>`
 * keeps 170KB of keyframes out of every page's HTML and cached as one asset.
 *
 * The mark is inlined instead, for the opposite reason: it is one path, so
 * inlining costs nothing and buys `currentColor`. That matters because the
 * wordmark can only be recoloured by `brightness-0 invert` filter tricks, while
 * the mark simply inherits whatever colour it is placed in.
 */

/** Geometry documented in `public/logo-mark.svg`. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 206 178.4"
      className={className}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path fillRule="evenodd" d="M103 0 206 178.4H0Zm0 64.4-47.23 81.8h94.46Z" />
    </svg>
  );
}

export type LogoArtwork = {
  /** CMS-uploaded mark. Empty means the built-in inline triangle. */
  mark?: string;
  /** CMS-uploaded wordmark. Empty means the built-in animated SVG. */
  wordmark?: string;
};

export function Logo({
  variant = "lockup",
  className = "",
  artwork,
}: {
  variant?: "lockup" | "mark" | "wordmark";
  /**
   * Applied to the wordmark image, so existing callers that pass filter classes
   * such as `dark:brightness-0 dark:invert` keep working. The built-in mark
   * recolours through `currentColor` and needs none of that — but an uploaded
   * mark is an opaque file, so it gets the same filter treatment as the
   * wordmark, since that is the only way to make arbitrary artwork work on a
   * dark background.
   */
  className?: string;
  /** Replacement artwork from the CMS. Either field may be empty. */
  artwork?: LogoArtwork;
}) {
  const customMark = artwork?.mark?.trim() || "";
  const customWordmark = artwork?.wordmark?.trim() || "";

  const mark = (height: string) =>
    customMark ? (
      <img
        src={customMark}
        alt=""
        className={`${height} w-auto shrink-0 select-none ${className}`}
        draggable={false}
      />
    ) : (
      <LogoMark className={`${height} w-auto shrink-0 ${MARK_COLOR}`} />
    );

  if (variant === "mark") {
    // Alone, the mark is the only thing naming the site, so it carries the label
    // that the lockup puts on the wordmark instead.
    return (
      <span className="inline-flex" role="img" aria-label="NØRR3">
        {mark("h-6")}
      </span>
    );
  }

  const wordmark = (
    <img
      src={customWordmark || WORDMARK_SRC}
      alt="NØRR3"
      className={`h-6 w-auto select-none ${className}`}
      draggable={false}
    />
  );

  if (variant === "wordmark") return wordmark;

  return (
    // The mark is set slightly shorter than the wordmark: matched on height it
    // reads as larger, because a triangle carries more ink than open letterforms.
    <span className="flex items-center gap-2.5">
      {mark("h-[19px]")}
      {wordmark}
    </span>
  );
}
