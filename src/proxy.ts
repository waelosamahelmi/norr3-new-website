import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Finnish lives at the domain root; English under `/en`.
 *
 *  - `/en/*` passes straight through (the `[locale]` segment sees `en`).
 *  - every other path is Finnish: rewritten internally to `/fi/*` so the
 *    existing `[locale]` routes keep working while the public URL stays at the
 *    root (`norr3.fi/palvelut`-style URLs).
 *  - legacy `/fi/*` URLs (the previous scheme) 301 to their root equivalents.
 *
 * Both branches tag the request with `x-norr3-locale` so server components
 * that sit outside the `[locale]` segment (the 404 page) know the language.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy Finnish prefix → root, permanently.
  if (pathname === "/fi" || pathname.startsWith("/fi/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fi(?=\/|$)/, "") || "/";
    return NextResponse.redirect(url, 301);
  }

  // English already carries its prefix.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
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
  // Skip Next internals, API routes, CMS uploads and any static file (paths
  // containing a dot, e.g. robots.txt, sitemap.xml, .webp, favicon.ico).
  matcher: ["/((?!api|_next|uploads|.*\\..*).*)"],
};
