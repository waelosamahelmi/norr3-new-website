import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CMS-managed redirects. The CMS exposes them in its public bundle; the
 * middleware reads them with a short in-memory TTL so a redirect added in the
 * CMS takes effect without a website rebuild.
 */
let redirectsCache: { at: number; map: Map<string, { to: string; status: number }> } | null = null;
const REDIRECTS_TTL = 60_000;

async function redirectsMap(): Promise<Map<string, { to: string; status: number }>> {
  if (redirectsCache && Date.now() - redirectsCache.at < REDIRECTS_TTL) return redirectsCache.map;
  const map = new Map<string, { to: string; status: number }>();
  try {
    const res = await fetch("http://127.0.0.1:3848/api/public/site", {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = (await res.json()) as { redirects?: { from: string; to: string; status: number }[] };
      for (const r of data.redirects ?? []) {
        if (r.from && r.to) map.set(r.from, { to: r.to, status: Number(r.status) || 301 });
      }
    }
  } catch {
    /* CMS unreachable — fall back to the cached map or no redirects. */
  }
  redirectsCache = { at: Date.now(), map };
  return map;
}

/**
 * Finnish lives at the domain root; English under `/en`.
 *
 *  - CMS-managed redirects are applied first, before any locale rewrite.
 *  - `/en/*` passes straight through (the `[locale]` segment sees `en`).
 *  - every other path is Finnish: rewritten internally to `/fi/*` so the
 *    existing `[locale]` routes keep working while the public URL stays at the
 *    root (`norr3.fi/palvelut`-style URLs).
 *  - legacy `/fi/*` URLs (the previous scheme) 301 to their root equivalents.
 *
 * Both branches tag the request with `x-norr3-locale` so server components
 * that sit outside the `[locale]` segment (the 404 page) know the language.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CMS-managed redirects first.
  const redirects = await redirectsMap();
  const match = redirects.get(pathname);
  if (match) {
    const url = request.nextUrl.clone();
    url.pathname = match.to;
    return NextResponse.redirect(url, match.status as 301 | 302 | 307 | 308);
  }

  // Legacy Finnish prefix → root, permanently.
  if (pathname === "/fi" || pathname.startsWith("/fi/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fi(?=\/|$)/, "") || "/";
    return NextResponse.redirect(url, 301);
  }

  // English already carries its prefix — but the English URLs keep their
  // English names while the route folders are Finnish, so alias them invisibly.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const EN_ALIASES: Record<string, string> = {
      "/en/about": "/en/meista",
      "/en/team": "/en/tiimi",
      "/en/careers": "/en/toihin-meille",
      "/en/privacy": "/en/tietosuojaseloste",
      "/en/terms": "/en/kayttoehdot",
      "/en/cases": "/en/caset",
    };
    const aliased = EN_ALIASES[pathname.replace(/\/$/, "")];
    if (aliased) {
      const url = request.nextUrl.clone();
      url.pathname = aliased;
      const headers = new Headers(request.headers);
      headers.set("x-norr3-locale", "en");
      return NextResponse.rewrite(url, { request: { headers } });
    }
    const headers = new Headers(request.headers);
    headers.set("x-norr3-locale", "en");
    return NextResponse.next({ request: { headers } });
  }

  // Everything else is Finnish — serve the internal /fi route.
  const url = request.nextUrl.clone();
  url.pathname = `/fi${pathname}`;
  const headers = new Headers(request.headers);
  headers.set("x-norr3-locale", "fi");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Skip Next internals, API routes, CMS uploads, the human-readable sitemap
  // page, and any static file (paths containing a dot, e.g. robots.txt,
  // sitemap.xml, .webp, favicon.ico).
  matcher: ["/((?!api|_next|uploads|sitemap|.*\\..*).*)"],
};
