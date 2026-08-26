import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The dev server is reached over the VPS's public IP, not localhost. Next
   * blocks cross-origin requests to dev-only assets by default, which silently
   * 403s the JS chunks — the page still renders server-side but never hydrates,
   * so every scroll-reveal stays at opacity 0 and the site looks blank.
   * Production (`next start`) is unaffected; this only widens development.
   */
  allowedDevOrigins: ["127.0.0.1", "localhost", "194.31.55.65", "norr3.fi", "*.norr3.fi"],

  /**
   * Permanent redirects — one canonical URL per piece of content.
   *
   * Case studies and insight posts live at the domain root (`/st1`,
   * `/isojen-ruutujen-trendit`), which is the same shape the old WordPress
   * site used. That means most old URLs resolve directly with no redirect at
   * all; only the ones whose slug changed, the section-prefixed variants, and
   * the collapsed service hierarchy need an entry here.
   */
  async redirects() {
    return [
      // ── Section-prefixed detail URLs → the root slug ────────────────────────
      { source: "/cases/:slug", destination: "/:slug", permanent: true },
      { source: "/insights/:slug", destination: "/:slug", permanent: true },
      { source: "/en/cases/:slug", destination: "/en/:slug", permanent: true },
      { source: "/en/insights/:slug", destination: "/en/:slug", permanent: true },

      // ── Old service prefix → the root slug (services now live at /<slug>) ──
      { source: "/palvelut/:slug", destination: "/:slug", permanent: true },
      { source: "/en/palvelut/:slug", destination: "/en/:slug", permanent: true },

      // ── Old Finnish pages ───────────────────────────────────────────────────
      { source: "/caset", destination: "/cases", permanent: true },
      { source: "/meista", destination: "/about", permanent: true },
      { source: "/tarinat", destination: "/insights", permanent: true },
      { source: "/norr3-marketing-engine", destination: "/engine", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/tietosuojaseloste", destination: "/privacy", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },

      // ── Old English pages ───────────────────────────────────────────────────
      { source: "/en/home", destination: "/en", permanent: true },
      { source: "/en/norr3", destination: "/en", permanent: true },
      // The old Media Insights landing page — superseded by the services
      // page's Media Insights section.
      { source: "/media-insights", destination: "/services", permanent: true },
      { source: "/en/media-insights", destination: "/en/services", permanent: true },

      // ── Slugs that changed between the old site and this one ────────────────
      // (cases and posts whose slug matches resolve directly at the root.)
      { source: "/terveystalo", destination: "/suun-terveystalo", permanent: true },
      { source: "/flow-festivaali", destination: "/flow-festival", permanent: true },
      { source: "/voittava-mediamixia-vuodelle-2024", destination: "/voittava-mediamix-2026", permanent: true },
      { source: "/trekronormedia_norr3", destination: "/tre-kronor-media", permanent: true },
      { source: "/norr3-on-vuoden-toimisto-2023", destination: "/norr3-vuoden-toimisto-2023", permanent: true },
      // Grandone's content is no longer reachable on the old site; land on the cases index.
      { source: "/grandone", destination: "/cases", permanent: true },
    ];
  },
};

export default nextConfig;
