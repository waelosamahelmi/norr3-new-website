import type { SVGProps } from "react";

/**
 * Inline icons for the social UI.
 *
 * The site's Material Symbols font is a static, subset instance (no FILL axis,
 * only the icons scripts/subset-icons.py found at the time), so a filled heart
 * or a play glyph can't be relied on from it. These few are drawn inline
 * instead — stroke-based to sit beside the outlined symbols.
 */
const PATHS = {
  heart: "M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.5 0 5.7 3.5 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z",
  comment: "M4 5.5h16v10.5H9.5L5 19.5V16H4z",
  repost: "M7 7h10.5l-2.5-2.5M17 17H6.5L9 19.5M17.5 7v5M6.5 17v-5",
  share: "M14 4.5 21 11l-7 6.5V13.8c-5 0-8.2 1.4-10.5 5.2.8-5.3 3.8-9.2 10.5-10V4.5Z",
  pin: "M9 3.5h6l-1 5.5 3.5 3.5v1.5h-5V20l-.5 1-.5-1v-6H6.5v-1.5L10 9z",
  play: "M8 5.5v13l10.5-6.5z",
  pause: "M8 5h3v14H8zM13 5h3v14h-3z",
  chevronLeft: "M14.5 5.5 8 12l6.5 6.5",
  chevronRight: "M9.5 5.5 16 12l-6.5 6.5",
  volume: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11",
  mute: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5",
  link: "M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2",
} as const;

export type SocialIconName = keyof typeof PATHS;

export function SocialIcon({
  name,
  filled = false,
  size = 20,
  className = "",
  ...rest
}: { name: SocialIconName; filled?: boolean; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  const solid = filled || name === "play" || name === "pause";
  return (
    <svg
      aria-hidden
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={solid ? 0 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
