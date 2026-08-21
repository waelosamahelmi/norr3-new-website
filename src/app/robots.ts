import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Tool surfaces, not content: the JSON APIs and the CMS draft preview
      // (which is also noindexed in its own metadata).
      disallow: ["/api/", "/cms-preview/"],
    },
    sitemap: "https://norr3.fi/sitemap.xml",
  };
}
