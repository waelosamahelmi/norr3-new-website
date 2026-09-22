import { NextRequest, NextResponse } from "next/server";

/**
 * Password check for the draft case preview.
 *   POST /case-preview/<slug>  (form POST with password + slug fields)
 * Forwards to the CMS's password-protected /api/public/case endpoint:
 * valid password → the CMS returns the case, this route sets a short-lived
 * httpOnly cookie and redirects back to the clean preview URL.
 */
const COOKIE_BASE = "norr3-draft-";

/**
 * Relative-Location redirect. An absolute URL built from `req.url` would
 * carry the server's internal host (localhost:3848 behind the proxy) and
 * strand the client on an unreachable address; a relative Location is
 * resolved by the browser against the URL it actually used.
 */
function redirectTo(path: string, status: 302 | 303): NextResponse {
  const res = new NextResponse(null, { status });
  res.headers.set("Location", path);
  return res;
}

export async function POST(req: NextRequest) {
  const form = (await req.formData().catch(() => null)) as FormData | null;
  if (!form) return NextResponse.json({ error: "Malformed" }, { status: 400 });

  const slug = String(form.get("slug") ?? "").trim();
  const password = String(form.get("password") ?? "").trim();
  // The form carries its locale so the unlock redirect lands back on the
  // localized preview URL the client came from, never on a bare path.
  const locale = form.get("locale") === "en" ? "en" : "fi";
  const back = `/${locale}/case-preview/${slug}`;
  if (!slug || !password) {
    return redirectTo(`${back}?pw=wrong`, 302);
  }

  const cmsBase = (process.env.NORR3_CMS_URL ?? "http://127.0.0.1:3848").replace(/\/+$/, "");
  try {
    const res = await fetch(
      `${cmsBase}/api/public/case?slug=${encodeURIComponent(slug)}&password=${encodeURIComponent(password)}`,
      { cache: "no-store", signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) {
      // A case that is already live is public: the CMS answers "Case is already
      // public" and no password can unlock it. Send the visitor to the real page
      // instead of claiming the password was wrong.
      const detail = (await res.json().catch(() => null)) as { error?: string } | null;
      if (res.status === 400 && /already public/i.test(detail?.error ?? "")) {
        return redirectTo(locale === "en" ? `/en/${slug}` : `/${slug}`, 303);
      }
      return redirectTo(`${back}?pw=wrong`, 302);
    }
  } catch {
    return redirectTo(`${back}?pw=wrong`, 302);
  }

  const res = redirectTo(back, 303);
  res.cookies.set(COOKIE_BASE + slug.replace(/[^a-z0-9-]/gi, ""), password, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 30 * 60,
    path: "/",
  });
  return res;
}