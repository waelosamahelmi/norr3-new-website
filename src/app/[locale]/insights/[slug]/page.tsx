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

  return (
    <>
      <Container className="pb-16 pt-10 lg:pt-16">
        <Reveal className="mx-auto max-w-2xl">
          <Link
            href={`/${locale}/insights`}
            className="text-xs font-medium text-ink/50 hover:text-ink"
          >
            ← {dict.insights.heading}
          </Link>
          <div className="mt-6">
            <HeroPill>{dict.insights.pill}</HeroPill>
          </div>
          <p className="mt-5 text-xs text-ink/50">{post.date}</p>
          <h1 className="mt-2 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
            {content.title}
          </h1>
          <p className="mt-4 text-base text-ink/70">{content.excerpt}</p>
        </Reveal>

        {post.image && (
          <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
            <img src={post.image} alt="" className="w-full object-cover" />
          </Reveal>
        )}

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-2xl space-y-5 text-[15px] leading-relaxed text-ink/80">
          {content.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
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
