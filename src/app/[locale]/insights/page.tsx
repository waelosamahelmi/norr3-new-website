import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";
import { insights } from "@/content/insights";

export default async function InsightsPage({ params }: PageProps<"/[locale]/insights">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Container className="pb-20 pt-10 lg:pt-16">
        <Reveal>
          <HeroPill>{dict.insights.pill}</HeroPill>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-5 text-[10vw] font-medium leading-none tracking-tight text-ink lg:text-[6.5rem]">
            {dict.insights.heading}
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/80">{dict.insights.body}</p>
        </Reveal>

        <StaggerGrid className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} readMoreLabel={dict.common.readMore} />
          ))}
        </StaggerGrid>
      </Container>

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
