import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { revalidateTag } from "next/cache";
import { CMS_TAGS } from "@/lib/cms";

const SECRET = process.env.NORR3_CMS_REVALIDATE_SECRET ?? "";
const KNOWN = new Set<string>(Object.values(CMS_TAGS));

/**
 * Publish hook. The CMS calls this after a save or publish so the change appears
 * without waiting out the time-based window.
 *
 * Only tags this site actually uses are accepted, and the request must carry the
 * shared secret — otherwise anyone who found the endpoint could force the site
 * to re-render its whole content tree on demand.
 */
export async function POST(req: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { error: "NORR3_CMS_REVALIDATE_SECRET is not set on the website." },
      { status: 503 }
    );
  }
  const provided = req.headers.get("x-norr3-secret") ?? "";
  if (!timingSafeEqual(provided, SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { tags?: unknown };
  const requested = Array.isArray(body.tags) ? body.tags.map(String) : [CMS_TAGS.all];
  const tags = requested.filter((tag) => KNOWN.has(tag));
  if (tags.length === 0) tags.push(CMS_TAGS.all);

  // Expire immediately rather than "max" (stale-while-revalidate): with "max"
  // the first visit after a CMS save still got the old page and only a second
  // refresh showed the edit. An editor who presses Save and opens the page
  // expects to see it, so the next request does a blocking re-render instead.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ ok: true, revalidated: tags });
}

function timingSafeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}
