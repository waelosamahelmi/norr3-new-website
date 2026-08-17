import type { MetadataRoute } from "next";

const BASE = "https://norr3.fi";
const LOCALES = ["fi", "en"] as const;

// Static top-level routes (dynamic [slug] routes are appended below)
const ROUTES = ["", "services", "engine", "cases", "about", "careers", "team", "insights", "contact", "privacy", "terms"];

// Case + insight slugs — kept in sync with src/content/{cases,insights}.ts
const CASE_SLUGS = ["flow-festival", "oomi", "suun-terveystalo", "kokkola", "st1", "kiinteistomaailma"];
const INSIGHT_SLUGS = ["voittava-mediamix-2026", "data-jahta-mittaa", "some-uutiset-2026", "dooh-toimii"];

function buildEntries() {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const route of ROUTES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}${route ? `/${route}` : ""}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l === "fi" ? "fi-FI" : "en-US", `${BASE}/${l}${route ? `/${route}` : ""}`])
          ),
        },
      });
    }
  }

  // Case detail pages
  for (const slug of CASE_SLUGS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/cases/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l === "fi" ? "fi-FI" : "en-US", `${BASE}/${l}/cases/${slug}`])
          ),
        },
      });
    }
  }

  // Insight article pages
  for (const slug of INSIGHT_SLUGS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/insights/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l === "fi" ? "fi-FI" : "en-US", `${BASE}/${l}/insights/${slug}`])
          ),
        },
      });
    }
  }

  return entries;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return buildEntries();
}