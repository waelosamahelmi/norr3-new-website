import fs from "node:fs";
import path from "node:path";

/**
 * Social scrapers (LinkedIn, iMessage, Slack) don't reliably render WebP, so
 * every image used in openGraph / twitter metadata gets a JPG twin under
 * `/images/og/` with the same sub-path — see `public/images/og/` for the
 * generated set. Paths that are already JPGs (the default OG image), already
 * point at `/images/og/`, or live outside `/images/` (CMS uploads) pass
 * through unchanged.
 */
export function ogImage(src: string): string {
  if (src.startsWith("/uploads/") && src.endsWith(".webp")) return uploadTwin(src);
  if (!src.startsWith("/images/") || src.startsWith("/images/og/")) return src;
  return src.replace(/^\/images\//, "/images/og/").replace(/\.webp$/, ".jpg");
}

const PUBLIC_DIR = path.join(process.cwd(), "public");

/**
 * Oversized CMS uploads were re-encoded to WebP next to their originals, which
 * were kept. For sharing, hand scrapers that original JPG/PNG when it exists.
 */
function uploadTwin(src: string): string {
  const base = src.replace(/\.webp$/, "");
  for (const ext of [".jpg", ".jpeg", ".png"]) {
    try {
      if (fs.existsSync(path.join(PUBLIC_DIR, base + ext))) return base + ext;
    } catch {
      /* fall through to the WebP */
    }
  }
  return src;
}
