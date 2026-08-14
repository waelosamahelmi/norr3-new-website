const LOGO_SRC = "/logo-animated.svg";

/**
 * The NØRR3 wordmark. The numeral "3" is a self-animating SVG (SMIL) that
 * morphs into a triangle on a loop — the animation runs inside the <img>, so
 * it stays out of every page's HTML payload and is cached as one static asset.
 *
 * `variant="light"` inverts the purple mark to white for dark backgrounds.
 */
export function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <img
      src={LOGO_SRC}
      alt="NØRR3"
      className={`h-6 w-auto select-none ${variant === "light" ? "brightness-0 invert" : ""} ${className}`}
      draggable={false}
    />
  );
}
