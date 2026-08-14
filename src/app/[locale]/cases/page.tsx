import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { CountUpStat } from "@/components/CountUpStat";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { CaseCard } from "@/components/cards/CaseCard";
import { CaseFeature } from "@/components/cards/CaseFeature";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";
import { cases, getCase } from "@/content/cases";
import { insights } from "@/content/insights";

/** Editorial widths for the hero collage — varied, so the strip reads as a
 *  magazine contact sheet rather than a uniform row of thumbnails. */
const TILE_WIDTHS = ["w-40 sm:w-56", "w-32 sm:w-44", "w-36 sm:w-52", "w-32 sm:w-44"];

export async function generateMetadata({ params }: PageProps<"/[locale]/cases">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.seo.cases.title,
    description: dict.seo.cases.description,
    alternates: { canonical: `/${locale}/cases`, languages: { "fi-FI": "/fi/cases", "en-US": "/en/cases" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/cases`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: dict.seo.cases.title,
      description: dict.seo.cases.description,
      images: [{ url: "/images/cases/flow-festival.webp", width: 1600, height: 1066, alt: "NØRR3 case work" }],
    },
    twitter: { card: "summary_large_image" as const, title: dict.seo.cases.title, description: dict.seo.cases.description, images: ["/images/cases/flow-festival.webp"] },
  };
}

export default async function CasesPage({ params }: PageProps<"/[locale]/cases">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const c = dict.cases;

  const featured = getCase("flow-festival")!;
  const rest = cases.filter((x) => x.slug !== featured.slug);

  // The purple stat tile in the collage is sourced from a real case metric
  // (Terveystalo's rank in brand metrics) instead of a decorative number, and
  // reads it off `cases.ts` so it can never drift from the case page itself.
  const statCase = getCase("terveystalo")!;

  return (
    <>
      {/*
        Section rhythm shared with Home / Services / Engine: a run of
        base-background sections opens with `pt-24 lg:pt-32` and every member
        closes with `pb-24 lg:pb-32`; full-width bands reset the run.
      */}

      {/* Hero */}
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{c.pill}</HeroPill>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-5xl text-[8vw] font-medium leading-[1.02] tracking-tight text-ink lg:text-[5.5rem] dark:text-white">
            {c.heroHeadline}
          </h1>
        </Reveal>
        {/* Photo collage strip — real case photography, one tile per case, with
            the client named on the tile so the strip is legible, not abstract. */}
        <div className="mt-10 flex items-end gap-3 overflow-hidden lg:mt-12">
          {cases.map((study, i) => (
            <Reveal key={study.slug} delay={0.15 + i * 0.08} className={`relative shrink-0 ${TILE_WIDTHS[i % TILE_WIDTHS.length]}`}>
              <img
                src={study.image}
                alt={`${study.client} — ${study.tagline[locale]}`}
                width={1600}
                height={1066}
                className="h-40 w-full object-cover sm:h-56"
                // The first tile is in the hero viewport — it should not wait
                // for the lazy pass like the ones scrolling in behind it.
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
              />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-[11px] font-medium uppercase tracking-[0.1em] text-white"
              >
                {study.client}
              </span>
            </Reveal>
          ))}
          {/* Purple stat tile — the brand's solid-colour tile among the photos */}
          <Reveal delay={0.15 + cases.length * 0.08} className="relative hidden shrink-0 w-36 sm:block sm:w-52">
            <div className="flex h-40 w-full flex-col items-center justify-center gap-1 bg-purple px-4 text-center text-white sm:h-56">
              <span className="text-4xl font-medium tabular-nums tracking-tight sm:text-5xl">
                <CountUpStat
                  value={statCase.kpi.value}
                  decimals={statCase.kpi.decimals ?? 0}
                  prefix={statCase.kpi.prefix}
                  suffix={statCase.kpi.suffix}
                  locale={locale}
                />
              </span>
              <span className="text-[11px] leading-snug text-white/80">
                {statCase.client} — {statCase.kpi.label[locale]}
              </span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.25} className="mt-10 flex flex-col items-start gap-6 pb-24 lg:pb-32">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {c.heroBody}
          </p>
          <PillButton href={`/${locale}/contact`}>{dict.common.contactUs}</PillButton>
        </Reveal>
      </Container>

      <LogoStrip />

      {/* Cases — one promoted feature, then the rest as an even photo grid.
          The old layout put a single orphan card in a three-column row below
          the asymmetric block; a feature + full row reads as an edited index. */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader heading={c.heading} body={c.body} />
          <div className="mt-14 lg:mt-16">
            <CaseFeature
              study={featured}
              locale={locale}
              eyebrow={c.featuredLabel}
              ctaLabel={dict.common.readCase}
            />
          </div>
          <StaggerGrid className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            {rest.map((study) => (
              <CaseCard key={study.slug} study={study} locale={locale} readMoreLabel={dict.common.readCase} />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={c.banner.heading}
        body={c.banner.body}
        cta={dict.common.contactUs}
        tone="yellow"
      />

      {/* Related posts */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={dict.services.relatedPosts}
            body={dict.home.blog.body}
            cta={dict.common.allInsights}
            ctaHref={`/${locale}/insights`}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {insights.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} readMoreLabel={dict.common.readMore} />
            ))}
          </StaggerGrid>
        </Container>
      </section>
    </>
  );
}
