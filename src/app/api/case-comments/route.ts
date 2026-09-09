import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Comment proxy for password-protected case previews.
 *
 *   GET  /api/case-comments?slug=<slug>
 *   POST /api/case-comments  { slug, author, body, x, y }
 *
 * Forwards to the CMS with the httpOnly preview cookie's password, so the
 * client can pin notes to the draft without ever seeing the password.
 */
async function passwordFor(slug: string): Promise<string> {
  const store = await cookies();
  return store.get(`norr3-draft-${slug.replace(/[^a-z0-9-]/gi, "")}`)?.value ?? "";
}

const cmsBase = () => (process.env.NORR3_CMS_URL ?? "http://127.0.0.1:3848").replace(/\/+$/, "");

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const password = await passwordFor(slug);
  if (!password) return NextResponse.json({ comments: [] });
  try {
    const res = await fetch(
      `${cmsBase()}/api/public/case-comments?slug=${encodeURIComponent(slug)}&password=${encodeURIComponent(password)}`,
      { cache: "no-store", signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return NextResponse.json({ comments: [] });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const slug = String(body?.slug ?? "").trim();
  if (!slug || !body) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const password = await passwordFor(slug);
  if (!password) return NextResponse.json({ error: "No preview session" }, { status: 401 });

  try {
    const res = await fetch(`${cmsBase()}/api/public/case-comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, slug, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "CMS unreachable" }, { status: 502 });
  }
}
