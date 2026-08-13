import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";
import { insights, getInsight } from "@/content/insights";

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/insights/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getInsight(slug);
  if (!post) return {};

  const content = post[locale];
  const image = post.image ?? "/images/brand/space-arch.webp";

  return {
    title: `${content.title} — NØRR3`,
    description: content.excerpt,
    alternates: {
      canonical: `/${locale}/insights/${slug}`,
      languages: {
        "fi-FI": `/fi/insights/${slug}`,
        "en-US": `/en/insights/${slug}`,
      },
    },
    openGraph: {
      type: "article" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/insights/${slug}`,
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
  const dict = getDictionary(locale);
  const post = getInsight(slug);
  if (!post) notFound();

  const content = post[locale];
  const others = insights.filter((i) => i.slug !== slug).slice(0, 3);

  // ≈200 wpm — the same rough figure the blog index quotes.
  const words = content.body.join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  return (
    <>
      {/* Title block: back-link, pill, headline, hairline meta row. */}
      <Container className="pb-10 pt-10 lg:pt-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Link
            href={`/${locale}/insights`}
            className="text-xs font-medium text-ink/50 transition-colors hover:text-ink"
          >
            ← {dict.insights.heading}
          </Link>
          <div className="mt-6 flex justify-center">
            <HeroPill>{dict.insights.pill}</HeroPill>
          </div>
          <h1 className="mt-5 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink/50">
            {post.date} · {minutes} {dict.insights.minRead}
          </p>
        </Reveal>
      </Container>

      {/* Wide photo hero — LCP element, so it loads eagerly. Ghost posts get the
          same lavender tile treatment as their BlogCard. */}
      <section>
        <Container>
          <Reveal className="mx-auto max-w-4xl">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-[25px]">
              {post.image ? (
                <img
                  src={post.image}
                  alt=""
                  width={1600}
                  height={900}
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-pastel-purple/70">
                  <span className="select-none text-8xl font-medium text-white/80 lg:text-9xl">
                    {post.ghost}
                  </span>
                </div>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Prose column: first paragraph reads as a lead, the rest as body copy. */}
      <Container className="py-14">
        <Reveal className="mx-auto max-w-2xl">
          {content.body.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-xl font-medium leading-relaxed tracking-tight text-ink"
                  : "mt-6 text-[17px] leading-[1.75] text-ink/80"
              }
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </Container>

      <section className="border-t border-black/5 py-16">
        <Container>
          <h2 className="text-center text-2xl font-medium text-ink">{dict.services.relatedPosts}</h2>
          <StaggerGrid className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-3">
            {others.map((p) => (
              <BlogCard key={p.slug} post={p} locale={locale} readMoreLabel={dict.common.readMore} />
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
