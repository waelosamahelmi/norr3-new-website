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
   * Permanent redirects from the previous WordPress site's URLs to their new
   * equivalents, so none of the old pages' accumulated SEO equity is lost when
   * the domain flips to this build. Finnish content now lives at the root
   * (no `/fi`); English lives under `/en`.
   *
   * The old service hierarchy (`/palvelut/mediat/mediat-ja-mediamixit/…`) was
   * collapsed into the single services page, so every one of those deep URLs
   * resolves there. The old case and story posts map to the corresponding case
   * or insight under their new slugs.
   */
  async redirects() {
    return [
      // ── Old service sub-pages → the single services page ────────────────────
      { source: "/palvelut/:path*", destination: "/services", permanent: true },

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
      { source: "/en/media-insights", destination: "/en/services", permanent: true },

      // ── Case studies (old Finnish slugs at root → /cases/<slug>) ────────────
      { source: "/terveystalo", destination: "/cases/suun-terveystalo", permanent: true },
      { source: "/flow-festivaali", destination: "/cases/flow-festival", permanent: true },
      { source: "/frantsila", destination: "/cases/frantsila", permanent: true },
      { source: "/sambla-group", destination: "/cases/sambla-group", permanent: true },
      { source: "/kokkola", destination: "/cases/kokkola", permanent: true },
      { source: "/st1", destination: "/cases/st1", permanent: true },
      { source: "/kiinteistomaailma", destination: "/cases/kiinteistomaailma", permanent: true },
      { source: "/esperi", destination: "/cases/esperi", permanent: true },
      // Grandone's content is no longer reachable on the old site; land on the cases index.
      { source: "/grandone", destination: "/cases", permanent: true },

      // ── Insights (old story slugs → /insights/<slug>) ───────────────────────
      { source: "/voittava-mediamixia-vuodelle-2024", destination: "/insights/voittava-mediamix-2026", permanent: true },
      { source: "/isojen-ruutujen-trendit", destination: "/insights/isojen-ruutujen-trendit", permanent: true },
      { source: "/trekronormedia_norr3", destination: "/insights/tre-kronor-media", permanent: true },
      { source: "/nelja-pohjoismaata-yhdistavat-voimansa-uudessa-mediatoimistoverkostossa", destination: "/insights/nelja-pohjoismaata-yhdistavat-voimansa-uudessa-mediatoimistoverkostossa", permanent: true },
      { source: "/norr3-on-vuoden-toimisto-2023", destination: "/insights/norr3-vuoden-toimisto-2023", permanent: true },
      { source: "/norr3-ja-kiinteistomaailma-yhteistyossa-marketing-engine-mullistaa-paikallismarkkinoinnin", destination: "/insights/norr3-ja-kiinteistomaailma-yhteistyossa-marketing-engine-mullistaa-paikallismarkkinoinnin", permanent: true },
      { source: "/ai-and-the-creative-future", destination: "/insights/ai-and-the-creative-future", permanent: true },
    ];
  },
};

export default nextConfig;
