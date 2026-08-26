import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/cms";
import { linkTo } from "@/lib/links";

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

  // `lastModified` is only emitted when a real date is known (a post's publish
  // date, a CMS page's update time). Stamping every build with "now" teaches
  // crawlers to ignore the field entirely.
  const entry = (
    path: string,
    options: { lastModified?: Date; changeFrequency?: "weekly" | "monthly"; priority?: number } = {}
  ) =>
    LOCALES.map((locale) => ({
      url: `${BASE}${linkTo(locale, path || "")}`,
      ...(options.lastModified ? { lastModified: options.lastModified } : {}),
      changeFrequency: options.changeFrequency ?? ("monthly" as const),
      priority: options.priority ?? 0.8,
      alternates: {
        languages: {
          "fi-FI": `${BASE}${linkTo("fi", path || "")}`,
          "en-US": `${BASE}${linkTo("en", path || "")}`,
        },
      },
    }));

  return [
    ...CODED_ROUTES.filter((route) => {
      const robots = content.pageSeo[route === "" ? "home" : route]?.robots ?? "index, follow";
      return !robots.includes("noindex");
    }).flatMap((route) =>
      entry(route, {
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      })
    ),
    ...content.cases.flatMap((study) => entry(study.slug, { priority: 0.6 })),
    ...content.posts.flatMap((post) =>
      entry(post.slug, {
        priority: 0.5,
        lastModified: post.isoDate ? new Date(post.isoDate) : undefined,
      })
    ),
    // Pages composed in the CMS page editor. `status` is "published" for
    // public pages; anything else (drafts, retired pages like the old
    // media-insights landing) stays out of the sitemap.
    ...content.pages
      .filter((page) => page.slug !== "media-insights")
      .flatMap((page) =>
        entry(page.slug, {
          priority: 0.6,
          lastModified: page.updatedAt ? new Date(page.updatedAt.replace(" ", "T")) : undefined,
        })
      ),
  ];
}
