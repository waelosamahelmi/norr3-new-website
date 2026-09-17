import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CMS-managed redirects. The CMS exposes them in its public bundle; the
 * middleware reads them with a short in-memory TTL so a redirect added in the
 * CMS takes effect without a website rebuild.
 */
type SiteBundle = {
  at: number;
  redirects: Map<string, { to: string; status: number }>;
  pageStatus: Record<string, string>;
};

let siteCache: SiteBundle | null = null;
const SITE_CACHE_TTL = 60_000;

/**
 * One cached fetch of the CMS public bundle gives us both the redirect map and
 * the publish status of every page, so a page unpublished in the CMS takes
 * effect without a website rebuild.
 */
async function siteBundle(): Promise<SiteBundle> {
  if (siteCache && Date.now() - siteCache.at < SITE_CACHE_TTL) return siteCache;
  const redirects = new Map<string, { to: string; status: number }>();
  let pageStatus: Record<string, string> = {};
  try {
    const res = await fetch("http://127.0.0.1:3848/api/public/site", {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        redirects?: { from: string; to: string; status: number }[];
        pageStatus?: Record<string, string>;
      };
      for (const r of data.redirects ?? []) {
        if (r.from && r.to) redirects.set(r.from, { to: r.to, status: Number(r.status) || 301 });
      }
      pageStatus = data.pageStatus ?? {};
    }
  } catch {
    /* CMS unreachable — keep the previous bundle if we have one. */
    if (siteCache) return siteCache;
  }
  siteCache = { at: Date.now(), redirects, pageStatus };
  return siteCache;
}

/** Public path → CMS page slug (their names differ for a few core routes). */
const PAGE_SLUG_ALIASES: Record<string, string> = {
  caset: "cases",
  cases: "cases",
  tiimi: "team",
  team: "team",
  meista: "about",
  about: "about",
  "toihin-meille": "careers",
  careers: "careers",
  tietosuojaseloste: "privacy",
  privacy: "privacy",
  kayttoehdot: "terms",
  terms: "terms",
};

function pageSlugForPath(pathname: string): string | null {
  const path = pathname.replace(/^\/en(?=\/|$)/, "").replace(/^\/+|\/+$/g, "");
  if (!path) return "home";
  // Member profiles, the social feed and the CMS preview are not coded pages.
  if (path.startsWith("feed/") || path.startsWith("tiimi/") || path.startsWith("cms-preview")) return null;
  return PAGE_SLUG_ALIASES[path] ?? path;
}

/** Draft previews (CMS session or per-item preview cookies) bypass the gate. */
function isPreviewRequest(request: NextRequest): boolean {
  const { searchParams } = request.nextUrl;
  if (searchParams.has("preview") || searchParams.has("password")) return true;
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name === "norr3-cms-session" || cookie.name.startsWith("norr3-draft-")) return true;
  }
  return false;
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
  const bundle = await siteBundle();
  const match = bundle.redirects.get(pathname);
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

  // CMS publish control: a page switched to draft in the CMS 404s on the live
  // site even though its route is code-rendered. Previews bypass the gate.
  const slug = pageSlugForPath(pathname);
  if (slug && bundle.pageStatus[slug] && bundle.pageStatus[slug] !== "published" && !isPreviewRequest(request)) {
    const isEn = pathname === "/en" || pathname.startsWith("/en/");
    const url = request.nextUrl.clone();
    url.pathname = isEn ? "/en/__unpublished" : "/fi/__unpublished";
    const headers = new Headers(request.headers);
    headers.set("x-norr3-locale", isEn ? "en" : "fi");
    return NextResponse.rewrite(url, { request: { headers } });
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
