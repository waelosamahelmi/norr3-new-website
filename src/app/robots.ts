import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isProductionHost } from "@/lib/host";

/**
 * Production host only. Anything else — the raw VPS IP, a staging subdomain, a
 * preview URL — must never be indexed, or Google picks up a duplicate of the
 * site before the DNS cutover and we ship a half-indexed launch.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get("host");

  if (!isProductionHost(host)) {
    // Staging / preview / raw IP: block everything and do not advertise the
    // production sitemap from a non-production host.
    return { rules: { userAgent: "*", disallow: "/" } };
  }

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
