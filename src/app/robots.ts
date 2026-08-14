import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://norr3.fi/sitemap.xml",
    host: "https://norr3.fi",
  };
}