import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fetchLiked, forwardLike, likesConfigured } from "@/lib/social";

/**
 * Public likes.
 *
 * Nobody logs in to like a post, so a visitor is an anonymous random id in an
 * httpOnly cookie (the CMS only ever stores a sha256 of it). The CMS endpoint is
 * server-to-server and needs the shared secret, which never leaves this server.
 *
 * Abuse control is deliberately light — a per-IP window in memory — because a
 * like is cheap and anonymous by design; it only has to stop a script from
 * hammering the CMS.
 */

const COOKIE = "norr3_visitor";
const YEAR = 60 * 60 * 24 * 365;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;

const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // Keep the map from growing without bound on a long-lived process.
  if (hits.size > 5000) {
    for (const [key, value] of hits) if (value.reset < now) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

const validVisitor = (value: string | undefined): value is string => Boolean(value && /^[a-f0-9-]{32,64}$/i.test(value));

export async function POST(req: NextRequest) {
  if (!likesConfigured()) {
    return NextResponse.json({ error: "Likes are not configured." }, { status: 503 });
  }

  // Same-site only: a like button on someone else's page shouldn't work.
  const origin = req.headers.get("origin");
  const hosts = [req.headers.get("x-forwarded-host"), req.headers.get("host")].filter(Boolean);
  if (origin && hosts.length > 0) {
    try {
      if (!hosts.includes(new URL(origin).host)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  const body = (await req.json().catch(() => ({}))) as { postId?: unknown; liked?: unknown };
  const postId = Number(body.postId);
  if (!Number.isInteger(postId) || postId <= 0 || typeof body.liked !== "boolean") {
    return NextResponse.json({ error: "Expected { postId: number, liked: boolean }." }, { status: 400 });
  }

  const existing = req.cookies.get(COOKIE)?.value;
  const visitor = validVisitor(existing) ? existing : crypto.randomUUID();

  const result = await forwardLike(postId, visitor, body.liked);
  const res = result
    ? NextResponse.json(result, { headers: { "Cache-Control": "no-store" } })
    : NextResponse.json({ error: "Could not save the like." }, { status: 502, headers: { "Cache-Control": "no-store" } });

  if (visitor !== existing) {
    res.cookies.set({
      name: COOKIE,
      value: visitor,
      httpOnly: true,
      sameSite: "lax",
      secure: req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https",
      path: "/",
      maxAge: YEAR,
    });
  }
  return res;
}

export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0)
    .slice(0, 100);
  const visitor = req.cookies.get(COOKIE)?.value;
  // A browser without the cookie has never liked anything — no CMS round trip.
  if (ids.length === 0 || !validVisitor(visitor) || !likesConfigured()) {
    return NextResponse.json({ liked: [] }, { headers: { "Cache-Control": "private, no-store" } });
  }
  const liked = await fetchLiked(visitor, ids);
  return NextResponse.json(
    { liked: liked.filter((id) => ids.includes(id)) },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
