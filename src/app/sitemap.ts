import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/cms";

const BASE = "https://norr3.fi";
const LOCALES = ["fi", "en"] as const;

/** Routes this repo renders with its own React components. */
const CODED_ROUTES = [
  "",
  "services",
  "engine",
  "cases",
  "about",
  "careers",
  "team",
  "insights",
  "contact",
  "brief",
  "privacy",
  "terms",
];

/**
 * The sitemap is derived from the CMS rather than hand-listed.
 *
 * The slug lists here used to be maintained by hand and had already drifted —
 * three of the four article URLs pointed at posts that no longer existed, and
 * newly published ones were missing. Reading the live content means publishing a
 * case, a post or a block page puts it in the sitemap with no second edit.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const now = new Date();

  const entry = (
    path: string,
    options: { lastModified?: Date; changeFrequency?: "weekly" | "monthly"; priority?: number } = {}
  ) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}${path ? `/${path}` : ""}`,
      lastModified: options.lastModified ?? now,
      changeFrequency: options.changeFrequency ?? ("monthly" as const),
      priority: options.priority ?? 0.8,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l === "fi" ? "fi-FI" : "en-US", `${BASE}/${l}${path ? `/${path}` : ""}`])
        ),
      },
    }));

  return [
    ...CODED_ROUTES.flatMap((route) =>
      entry(route, {
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      })
    ),
    ...content.cases.flatMap((study) => entry(`cases/${study.slug}`, { priority: 0.6 })),
    ...content.posts.flatMap((post) =>
      entry(`insights/${post.slug}`, {
        priority: 0.5,
        lastModified: post.isoDate ? new Date(post.isoDate) : now,
      })
    ),
    // Pages composed in the CMS page editor.
    ...content.pages.flatMap((page) =>
      entry(page.slug, {
        priority: 0.6,
        lastModified: page.updatedAt ? new Date(page.updatedAt.replace(" ", "T")) : now,
      })
    ),
  ];
}
