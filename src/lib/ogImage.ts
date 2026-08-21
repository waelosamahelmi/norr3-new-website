/**
 * Social scrapers (LinkedIn, iMessage, Slack) don't reliably render WebP, so
 * every image used in openGraph / twitter metadata gets a JPG twin under
 * `/images/og/` with the same sub-path — see `public/images/og/` for the
 * generated set. Paths that are already JPGs (the default OG image), already
 * point at `/images/og/`, or live outside `/images/` (CMS uploads) pass
 * through unchanged.
 */
export function ogImage(src: string): string {
  if (!src.startsWith("/images/") || src.startsWith("/images/og/")) return src;
  return src.replace(/^\/images\//, "/images/og/").replace(/\.webp$/, ".jpg");
}
