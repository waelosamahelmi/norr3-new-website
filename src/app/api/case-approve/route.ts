import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Client approval proxy for draft cases.
 *
 *   POST /api/case-approve  { slug }
 *
 * The password never reaches the browser JS: it lives in the httpOnly
 * cookie set by /api/case-preview, and this route forwards it to the CMS,
 * which flips the case to visible = 1. Approved ⇒ live, no second step.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { slug?: string } | null;
  const slug = String(body?.slug ?? "").trim();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const store = await cookies();
  const password = store.get(`norr3-draft-${slug.replace(/[^a-z0-9-]/gi, "")}`)?.value ?? "";
  if (!password) return NextResponse.json({ error: "No preview session" }, { status: 401 });

  const cmsBase = (process.env.NORR3_CMS_URL ?? "http://127.0.0.1:3848").replace(/\/+$/, "");
  try {
    const res = await fetch(`${cmsBase}/api/public/case-approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "CMS unreachable" }, { status: 502 });
  }
}
