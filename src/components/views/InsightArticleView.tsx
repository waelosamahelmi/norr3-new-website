import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/content/dictionary";
import type { CmsPost } from "@/lib/cms";
import { getPosts } from "@/lib/cms";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { ShareRow } from "@/components/ShareRow";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";

/**
 * The insight-article page body. Lives at the domain root (`/isojen-ruutujen-
 * trendit`) — the catch-all route resolves single-segment slugs against the
 * posts collection and renders this view, so a post's URL is as short as it
 * can be (matching the old WordPress site's structure).
 */
export async function InsightArticleView({
  post,
  locale,
  dict,
}: {
  post: CmsPost;
  locale: Locale;
  dict: Dictionary;
}) {
  const content = post[locale];
  const others = (await getPosts()).filter((entry) => entry.slug !== post.slug).slice(0, 3);
  const minutes = post.readingMinutes;
  const url = `https://norr3.fi${linkTo(locale, `/${post.slug}`)}`;

  return (
    <>
      {/* Article structured data — the post's own facts (title, date, author,
          image), nothing invented. Home page already carries the Organization
          graph; this marks the article up for rich results. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: content.title,
            description: content.excerpt,
            inLanguage: locale === "fi" ? "fi-FI" : "en-US",
            ...(post.isoDate ? { datePublished: post.isoDate } : {}),
            image: `https://norr3.fi${ogImage(post.image ?? "/images/brand/space-arch.webp")}`,
            author: { "@type": "Organization", name: post.author || "NØRR3" },
            publisher: {
              "@type": "Organization",
              name: "NØRR3",
              logo: { "@type": "ImageObject", url: "https://norr3.fi/images/brand/og-image.jpg" },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          }),
        }}
      />

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
