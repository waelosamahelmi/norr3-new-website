import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";
import { insights } from "@/content/insights";

export async function generateMetadata({ params }: PageProps<"/[locale]/insights">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.seo.insights.title,
    description: dict.seo.insights.description,
    alternates: {
      canonical: `/${locale}/insights`,
      languages: { "fi-FI": "/fi/insights", "en-US": "/en/insights" },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/insights`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: dict.seo.insights.title,
      description: dict.seo.insights.description,
      images: [
        { url: "/images/brand/space-arch.webp", width: 1600, height: 1066, alt: "NØRR3 insights" },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: dict.seo.insights.title,
      description: dict.seo.insights.description,
      images: ["/images/brand/space-arch.webp"],
    },
  };
}

export default async function InsightsPage({ params }: PageProps<"/[locale]/insights">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const featured = insights[0];
  const fc = featured[locale];
  const words = fc.body.join(" ").split(/\s+/).filter(Boolean).length;
  const featuredMinutes = Math.max(1, Math.round(words / 200));

  return (
    <>
      <Container className="pb-12 pt-10 lg:pt-16">
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
      </Container>

      <Container className="pb-16">
        <Reveal>
          <Link
            href={`/${locale}/insights/${featured.slug}`}
            className="group grid gap-8 lg:grid-cols-2 lg:items-center"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-[25px]">
              {featured.image ? (
                <img
                  src={featured.image}
                  alt={fc.title}
                  width={1600}
                  height={1066}
                  fetchPriority="high"
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-pastel-purple/70">
                  <span className="select-none text-8xl font-medium text-white/80">{featured.ghost}</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-yellow px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink">
                  {dict.insights.featuredLabel}
                </span>
                <span className="text-xs text-ink/50">
                  {featured.date} · {featuredMinutes} {dict.insights.minRead}
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-medium leading-tight tracking-tight text-ink lg:text-5xl">
                {fc.title}
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/70">{fc.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink transition-transform group-hover:translate-x-0.5">
                {dict.common.readMore} <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      </Container>

      <Container className="pb-20">
        <StaggerGrid className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {insights.slice(1).map((post) => (
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
