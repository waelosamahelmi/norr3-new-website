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
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
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
  // Only the types the CMS accepts are served, so this cannot become a way to
  // hand out arbitrary files that happen to land in the folder.
  if (!type) return new Response("Not found", { status: 404 });

  const headers: Record<string, string> = {
    "Content-Type": type,
    // An SVG opened directly in a tab is a document, and a document on this
    // origin can script it. Uploads only come from CMS users, but a logo is
    // exactly the kind of file someone is asked to supply from outside, so
    // the sandbox is worth the two headers: nothing may load, and the
    // declared type may not be second-guessed.
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    "X-Content-Type-Options": "nosniff",
    // Uploads are content-addressed by a timestamp suffix, so a long cache is
    // safe — replacing an image produces a new filename.
    "Cache-Control": "public, max-age=31536000, immutable",
    ETag: `"${stat.size}-${Math.floor(stat.mtimeMs)}"`,
    // Advertised for everything, honoured below. Safari will not play a video
    // whose source answers a ranged request with the whole file — it reads the
    // container header first and treats a 200-with-everything as unseekable. On
    // iOS that is a black rectangle instead of a video, so ranges are required
    // here, not an optimisation.
    "Accept-Ranges": "bytes",
  };

  const rangeMatch = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
  if (rangeMatch) {
    const [, rawStart, rawEnd] = rangeMatch;
    // An open start ("bytes=-500") means the last N bytes.
    let start = rawStart === "" ? stat.size - Number(rawEnd) : Number(rawStart);
    let end = rawStart === "" || rawEnd === "" ? stat.size - 1 : Number(rawEnd);
    start = Math.max(0, start);
    end = Math.min(stat.size - 1, end);

    if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${stat.size}`, "Accept-Ranges": "bytes" },
      });
    }

    const fd = fs.openSync(candidate, "r");
    try {
      const length = end - start + 1;
      const buffer = Buffer.alloc(length);
      fs.readSync(fd, buffer, 0, length, start);
      return new Response(buffer, {
        status: 206,
        headers: {
          ...headers,
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Content-Length": String(length),
        },
      });
    } finally {
      fs.closeSync(fd);
    }
  }

  return new Response(fs.readFileSync(candidate), {
    headers: {
      ...headers,
      "Content-Length": String(stat.size),
    },
  });
}
