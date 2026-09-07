import { NextRequest, NextResponse } from "next/server";
import { submitToCms } from "@/lib/cms";

/**
 * Password check for the draft case preview.
 *   POST /case-preview/<slug>  (form POST with password + slug fields)
 * Forwards to the CMS's password-protected /api/public/case endpoint:
 * valid password → the CMS returns the case, this route sets a short-lived
 * httpOnly cookie and redirects back to the clean preview URL.
 */
const COOKIE_BASE = "norr3-draft-";

export async function POST(req: NextRequest) {
  const form = (await req.formData().catch(() => null)) as FormData | null;
  if (!form) return NextResponse.json({ error: "Malformed" }, { status: 400 });

  const slug = String(form.get("slug") ?? "").trim();
  const password = String(form.get("password") ?? "").trim();
  if (!slug || !password) {
    return NextResponse.redirect(new URL(`/case-preview/${slug}?pw=wrong`, req.url), 302);
  }

  const cmsBase = (process.env.NORR3_CMS_URL ?? "http://127.0.0.1:3848").replace(/\/+$/, "");
  try {
    const res = await fetch(
      `${cmsBase}/api/public/case?slug=${encodeURIComponent(slug)}&password=${encodeURIComponent(password)}`,
      { cache: "no-store", signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) {
      return NextResponse.redirect(new URL(`/case-preview/${slug}?pw=wrong`, req.url), 302);
    }
  } catch {
    return NextResponse.redirect(new URL(`/case-preview/${slug}?pw=wrong`, req.url), 302);
  }

  const res = NextResponse.redirect(new URL(`/case-preview/${slug}`, req.url), 303);
  res.cookies.set(COOKIE_BASE + slug.replace(/[^a-z0-9-]/gi, ""), password, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 30 * 60,
    path: "/",
  });
  return res;
}