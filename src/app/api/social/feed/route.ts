import { NextRequest, NextResponse } from "next/server";
import { getSocialFeed } from "@/lib/social";

/**
 * "Load more" for the public feed: a thin proxy of the CMS feed's `before`
 * cursor. The CMS fetch sits in the data cache (60 s, dropped on `cms:social`),
 * so paging costs the CMS nothing extra, and browsers/CDNs may hold a page for
 * a short while too.
 */
export async function GET(req: NextRequest) {
  const before = Number(req.nextUrl.searchParams.get("before"));
  const limit = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 20));
  if (!Number.isInteger(before) || before <= 0) {
    return NextResponse.json({ error: "`before` must be a post id." }, { status: 400 });
  }
  const page = await getSocialFeed({ limit, before });
  return NextResponse.json(page, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" },
  });
}
