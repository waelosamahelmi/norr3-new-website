import fs from "fs";
import path from "path";
import type { NextRequest } from "next/server";

/**
 * Serves files uploaded through the CMS.
 *
 * `next start` builds its list of `public/` assets at build time, so a file the
 * CMS writes afterwards 404s until the next deploy — which would make the media
 * library useless for anything published between deploys. This reads
 * `public/uploads` from disk per request instead.
 *
 * Files that *were* present at build time are still served by Next's own static
 * handler; routing only reaches this handler for the ones that were not.
 */

const UPLOADS_ROOT = path.resolve(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  avif: "image/avif",
  gif: "image/gif",
};

export async function GET(_req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;

  // Resolve, then confirm the result is still inside the uploads directory —
  // `..` segments and encoded separators cannot escape it.
  const candidate = path.resolve(UPLOADS_ROOT, ...segments);
  if (candidate !== UPLOADS_ROOT && !candidate.startsWith(UPLOADS_ROOT + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  let stat: fs.Stats;
  try {
    stat = fs.statSync(candidate);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!stat.isFile()) return new Response("Not found", { status: 404 });

  const extension = candidate.split(".").pop()?.toLowerCase() ?? "";
  const type = MIME[extension];
  // Only image types the CMS accepts are served, so this cannot become a way to
  // hand out arbitrary files that happen to land in the folder.
  if (!type) return new Response("Not found", { status: 404 });

  return new Response(fs.readFileSync(candidate), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(stat.size),
      // Uploads are content-addressed by a timestamp suffix, so a long cache is
      // safe — replacing an image produces a new filename.
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${stat.size}-${Math.floor(stat.mtimeMs)}"`,
    },
  });
}
