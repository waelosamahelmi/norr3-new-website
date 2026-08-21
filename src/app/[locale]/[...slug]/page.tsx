import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getCmsPage, getSiteContent } from "@/lib/cms";
import { buildBlockContext } from "@/components/blocks/context";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { linkTo } from "@/lib/links";

/**
 * Serves pages composed in the CMS page editor.
 *
 * Next matches static segments before a catch-all, so every hand-built route
 * (/services, /cases, /insights/[slug] …) keeps winning and this only picks up
 * slugs the website has no code for. That is what lets an editor publish a new
 * page without a deploy, while the crafted pages stay crafted.
 */
type Params = { params: Promise<{ locale: string; slug: string[] }> };

export async function generateMetadata({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const path = slug.join("/");
  const page = await getCmsPage(path);
  if (!page) return {};

  const seo = page.seo[locale];
  const title = seo.title || `${page.title[locale] || page.title.fi} — NØRR3`;
  const description = seo.description || undefined;
  const image = page.ogImage || "/images/brand/og-image.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: linkTo(locale, `/${path}`),
      languages: { "fi-FI": `/${path}`, "en-US": `/en/${path}` },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, `/${path}`)}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: page.title[locale] || "NØRR3" }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image],
    },
  };
}

export default async function CmsBlockPage({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const page = await getCmsPage(slug.join("/"));
  // 'coded' pages are owned by a real route in this repo; if one reaches here
  // the route is missing, and a 404 is more honest than an empty shell.
  if (!page || page.kind !== "blocks" || page.blocks.length === 0) notFound();

  const content = await getSiteContent();
  const context = buildBlockContext(content, locale);

  return <BlockRenderer blocks={page.blocks} context={context} />;
}
