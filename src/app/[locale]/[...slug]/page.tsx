import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getCase, getCmsPage, getPost, getSiteContent } from "@/lib/cms";
import { buildBlockContext } from "@/components/blocks/context";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { CaseDetailView } from "@/components/views/CaseDetailView";
import { InsightArticleView } from "@/components/views/InsightArticleView";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

/**
 * Serves everything that lives at a short, root-level slug:
 *
 *  1. hand-built routes (/services, /cases, /insights …) — Next matches static
 *     segments before a catch-all, so those always win;
 *  2. case studies — `/kiinteistomaailma`, `/st1` — the same URLs the old
 *     WordPress site used, so their accumulated SEO carries over unchanged;
 *  3. insight posts — `/isojen-ruutujen-trendit`;
 *  4. pages composed in the CMS page editor — any slug an editor publishes.
 *
 * The section URLs (`/cases/st1`, `/insights/…`) 301 to these root slugs, so
 * there is exactly one canonical URL per piece of content.
 */
type Params = { params: Promise<{ locale: string; slug: string[] }> };

/** Pre-render the content we know at build time; anything else renders on demand. */
export async function generateStaticParams() {
  const content = await getSiteContent();
  return [
    ...content.cases.map((study) => ({ slug: [study.slug] })),
    ...content.posts.map((post) => ({ slug: [post.slug] })),
  ];
}

export async function generateMetadata({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const path = slug.join("/");

  // Case study at the root slug.
  const study = slug.length === 1 ? await getCase(slug[0]) : undefined;
  if (study) {
    const title = locale === "fi" ? `${study.client} — NØRR3-case` : `${study.client} — NØRR3 case`;
    const description = study.tagline[locale];
    return {
      title,
      description,
      alternates: {
        canonical: linkTo(locale, `/${slug[0]}`),
        languages: { "fi-FI": `/${slug[0]}`, "en-US": `/en/${slug[0]}` },
      },
      openGraph: {
        type: "article" as const,
        siteName: "NØRR3",
        url: `https://norr3.fi${linkTo(locale, `/${slug[0]}`)}`,
        locale: locale === "fi" ? "fi_FI" : "en_US",
        title,
        description,
        images: [{ url: ogImage(study.image), width: 1600, height: 1066, alt: `${study.client} — ${study.tagline[locale]}` }],
      },
      twitter: { card: "summary_large_image" as const, title, description, images: [ogImage(study.image)] },
    };
  }

  // Insight post at the root slug.
  const post = slug.length === 1 ? await getPost(slug[0]) : undefined;
  if (post) {
    const content = post[locale];
    const image = ogImage(post.image ?? "/images/brand/space-arch.webp");
    return {
      title: post.seo[locale].title || `${content.title} — NØRR3`,
      description: post.seo[locale].description || content.excerpt,
      alternates: {
        canonical: linkTo(locale, `/${slug[0]}`),
        languages: { "fi-FI": `/${slug[0]}`, "en-US": `/en/${slug[0]}` },
      },
      openGraph: {
        type: "article" as const,
        siteName: "NØRR3",
        url: `https://norr3.fi${linkTo(locale, `/${slug[0]}`)}`,
        locale: locale === "fi" ? "fi_FI" : "en_US",
        title: content.title,
        description: content.excerpt,
        images: [{ url: image, width: 1600, height: 1066, alt: content.title }],
      },
      twitter: {
        card: "summary_large_image" as const,
        title: content.title,
        description: content.excerpt,
        images: [image],
      },
    };
  }

  // A page composed in the CMS page editor.
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

export default async function RootSlugPage({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  // Case study at the root slug.
  if (slug.length === 1) {
    const study = await getCase(slug[0]);
    if (study) {
      const dict = (await getSiteContent()).dictionaries[locale];
      return <CaseDetailView study={study} locale={locale} dict={dict} />;
    }

    const post = await getPost(slug[0]);
    if (post) {
      const dict = (await getSiteContent()).dictionaries[locale];
      return <InsightArticleView post={post} locale={locale} dict={dict} />;
    }
  }

  // A page composed in the CMS page editor.
  const page = await getCmsPage(slug.join("/"));
  // 'coded' pages are owned by a real route in this repo; if one reaches here
  // the route is missing, and a 404 is more honest than an empty shell.
  if (!page || page.kind !== "blocks" || page.blocks.length === 0) notFound();

  const content = await getSiteContent();
  const context = buildBlockContext(content, locale);

  return <BlockRenderer blocks={page.blocks} context={context} />;
}
