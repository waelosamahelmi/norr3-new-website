import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { ShareRow } from "@/components/ShareRow";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";
import { getPost, getPosts } from "@/lib/cms";
import { linkTo } from "@/lib/links";

/**
 * Pre-render the posts the CMS has published at build time. New posts written
 * after a deploy are still served — the route falls through to on-demand
 * rendering and the CMS's publish hook drops the cached copy.
 */
export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/insights/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPost(slug);
  if (!post) return {};

  const content = post[locale];
  const image = post.image ?? "/images/brand/space-arch.webp";

  return {
    title: post.seo[locale].title || `${content.title} — NØRR3`,
    description: post.seo[locale].description || content.excerpt,
    alternates: {
      canonical: linkTo(locale, `/insights/${slug}`),
      languages: {
        "fi-FI": `/insights/${slug}`,
        "en-US": `/en/insights/${slug}`,
      },
    },
    openGraph: {
      type: "article" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, `/insights/${slug}`)}`,
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

export default async function InsightArticlePage({
  params,
}: PageProps<"/[locale]/insights/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const post = await getPost(slug);
  if (!post) notFound();

  const content = post[locale];
  const others = (await getPosts()).filter((entry) => entry.slug !== slug).slice(0, 3);
  const minutes = post.readingMinutes;
  const url = `https://norr3.fi${linkTo(locale, `/insights/${slug}`)}`;

  return (
    <>
      {/* Title block: back-link, pill, headline, hairline meta row. */}
      <Container className="pb-10 pt-12 lg:pt-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Link
            href={linkTo(locale, "/insights")}
            className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-ink/50 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple dark:text-white/50 dark:hover:text-white dark:focus-visible:outline-light-purple"
          >
            <span aria-hidden>←</span> {dict.common.allInsights}
          </Link>
          <div className="mt-6 flex justify-center">
            <HeroPill>{dict.insights.pill}</HeroPill>
          </div>
          <h1 className="mt-6 text-3xl font-medium leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-5xl dark:text-white">
            {content.title}
          </h1>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
            {post.date} · {minutes} {dict.insights.minRead}
          </p>
        </Reveal>
      </Container>

      {/* Wide photo hero — LCP element, so it loads eagerly. Ghost posts get the
          same lavender tile treatment as their BlogCard. */}
      <section>
        <Container>
          <Reveal className="mx-auto max-w-4xl">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-card">
              {post.image ? (
                <img
                  src={post.image}
                  alt={content.title}
                  width={1600}
                  height={900}
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-pastel-purple/70 dark:bg-white/[0.06]">
                  <span className="select-none text-8xl font-medium text-white/80 lg:text-9xl">
                    {post.ghost}
                  </span>
                </div>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Prose column: first paragraph reads as a lead, the rest as body copy.
          The article closes on a share row and a way back to the index, so a
          finished read has somewhere to go besides the nav. */}
      <Container className="pb-24 pt-14 lg:pb-32 lg:pt-16">
        <article className="mx-auto max-w-2xl">
          <Reveal>
            {/* Authored in the CMS and sanitised there against a narrow tag
                allowlist; `.article-prose` carries the typography the hand-built
                paragraph list used to apply inline. */}
            <div
              className="article-prose"
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          </Reveal>

          <Reveal delay={0.05} className="mt-12 flex flex-col items-start gap-6 border-t border-black/10 pt-8 dark:border-white/10">
            <ShareRow
              url={url}
              label={dict.insights.share}
              linkedinLabel={dict.insights.shareLinkedin}
              copyLabel={dict.insights.copyLink}
              copiedLabel={dict.insights.linkCopied}
            />
            <PillButton href={linkTo(locale, "/insights")} variant="secondary">
              {dict.common.allInsights}
            </PillButton>
          </Reveal>
        </article>
      </Container>

      <section className="border-t border-black/5 pb-24 pt-24 lg:pb-32 lg:pt-32 dark:border-white/10">
        <Container>
          <SectionHeader
            heading={dict.services.relatedPosts}
            body={dict.home.blog.body}
            cta={dict.common.allInsights}
            ctaHref={linkTo(locale, "/insights")}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-3 lg:mt-16">
            {others.map((p) => (
              <BlogCard
                key={p.slug}
                post={p}
                locale={locale}
                readMoreLabel={dict.common.readMore}
                minReadLabel={dict.insights.minRead}
              />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={dict.banner.heading}
        body={dict.banner.body}
        cta={dict.common.contactUs}
        tone="lavender"
      />
    </>
  );
}
