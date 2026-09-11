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
   * `statusCode: 301` rather than `permanent: true`: the latter answers 308,
   * and the launch checklist (and some older crawlers and link checkers)
   * expect a classic 301 for moved WordPress URLs. Each rule points straight
   * at the final URL — no rule may land on another redirect.
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
      { source: "/cases/:slug", destination: "/:slug", statusCode: 301 },
      { source: "/insights/:slug", destination: "/:slug", statusCode: 301 },
      { source: "/en/cases/:slug", destination: "/en/:slug", statusCode: 301 },
      { source: "/en/insights/:slug", destination: "/en/:slug", statusCode: 301 },

      // ── Geir's URL structure: old /palvelut/* tree → new root slugs ──────
      { source: "/palvelut/insight-strategia", destination: "/insight-strategia", statusCode: 301 },
      { source: "/palvelut/data", destination: "/data-ja-mittaus", statusCode: 301 },
      { source: "/palvelut/data/mediapanostusdata", destination: "/markkinointistrategia", statusCode: 301 },
      { source: "/palvelut/data/norr3-media-insights", destination: "/mediasuunnittelu/norr3-media-insights", statusCode: 301 },
      { source: "/palvelut/mediat", destination: "/mediastrategia", statusCode: 301 },
      { source: "/palvelut/mediat/dynaaminen-mainonta", destination: "/dynaaminen-mainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit", destination: "/mediasuunnittelu", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/sem", destination: "/hakukonemainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/online-video", destination: "/display-ja-videomainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/radio", destination: "/mediasuunnittelu/radio", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/televisio", destination: "/mediasuunnittelu/televisio", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/elokuvamainonta-eli-cinema", destination: "/mediasuunnittelu/elokuvamainonta-eli-cinema", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/printti-eli-lehtimainonta", destination: "/mediasuunnittelu/printti-eli-lehtimainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/ulkomainonta", destination: "/ulkomainonta", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/sosiaalinen-media", destination: "/somemarkkinointi", statusCode: 301 },
      { source: "/palvelut/mediat/mediat-ja-mediamixit/display", destination: "/display-ja-videomainonta", statusCode: 301 },
      { source: "/palvelut/mediat/kampanjat-ja-jatkuva-mainonta", destination: "/mediasuunnittelu/kampanjat-ja-jatkuva-mainonta", statusCode: 301 },
      { source: "/palvelut/mittaaminen", destination: "/data-ja-mittaus", statusCode: 301 },
      { source: "/palvelut/mittaaminen/norr3-brand-performance", destination: "/tutkimukset", statusCode: 301 },
      { source: "/palvelut/mittaaminen/norr3-campaign-performance", destination: "/tutkimukset", statusCode: 301 },
      { source: "/palvelut/mittaaminen/norr3-pre-campaign-performance", destination: "/tutkimukset", statusCode: 301 },
      { source: "/palvelut/mittaaminen/norr3-express-pre-campaign-performance", destination: "/tutkimukset", statusCode: 301 },
      { source: "/palvelut/mittaaminen/dashboardit", destination: "/data-ja-mittaus/dashboardit", statusCode: 301 },
      { source: "/palvelut/mittaaminen/romi-ja-roas-laskenta", destination: "/data-ja-mittaus/datan-mallintaminen", statusCode: 301 },
      { source: "/palvelut/performance-markkinointi", destination: "/performance-markkinointi", statusCode: 301 },
      { source: "/palvelut/luovat", destination: "/mediasuunnittelu/luovat", statusCode: 301 },
      { source: "/palvelut", destination: "/services", statusCode: 301 },
      { source: "/en/palvelut/:path*", destination: "/en/services", statusCode: 301 },

      // ── Route renames: English → Finnish URLs ─────────────────────────────
      { source: "/about", destination: "/meista", statusCode: 301 },
      { source: "/privacy", destination: "/tietosuojaseloste", statusCode: 301 },
      { source: "/terms", destination: "/kayttoehdot", statusCode: 301 },
      { source: "/team", destination: "/tiimi", statusCode: 301 },
      { source: "/careers", destination: "/toihin-meille", statusCode: 301 },

      // ── Old service prefix → the root slug (services now live at /<slug>) ──
      { source: "/palvelut/:slug", destination: "/:slug", statusCode: 301 },
      { source: "/en/palvelut/:slug", destination: "/en/:slug", statusCode: 301 },

      // ── Old Finnish pages ───────────────────────────────────────────────────
      { source: "/cases", destination: "/caset", statusCode: 301 },
      { source: "/tarinat", destination: "/insights", statusCode: 301 },
      { source: "/norr3-marketing-engine", destination: "/engine", statusCode: 301 },
      { source: "/privacy-policy", destination: "/tietosuojaseloste", statusCode: 301 },
      { source: "/sample-page", destination: "/", statusCode: 301 },

      // ── Old English pages ───────────────────────────────────────────────────
      { source: "/en/home", destination: "/en", statusCode: 301 },
      { source: "/en/norr3", destination: "/en", statusCode: 301 },
      // The old Media Insights landing page — superseded by the services
      // page's Media Insights section.
      { source: "/media-insights", destination: "/services", statusCode: 301 },
      { source: "/en/media-insights", destination: "/en/services", statusCode: 301 },

      // ── Slugs that changed between the old site and this one ────────────────
      // (cases and posts whose slug matches resolve directly at the root.)
      { source: "/terveystalo", destination: "/suun-terveystalo", statusCode: 301 },
      { source: "/flow-festivaali", destination: "/flow-festival", statusCode: 301 },
      { source: "/voittava-mediamixia-vuodelle-2024", destination: "/voittava-mediamix-2024", statusCode: 301 },
      { source: "/trekronormedia_norr3", destination: "/tre-kronor-media", statusCode: 301 },
      { source: "/norr3-on-vuoden-toimisto-2023", destination: "/norr3-vuoden-toimisto-2023", statusCode: 301 },
      // Grandone's content is no longer reachable on the old site; land on the cases index.
      { source: "/grandone", destination: "/caset", statusCode: 301 },
    ];
  },
};

export default nextConfig;
