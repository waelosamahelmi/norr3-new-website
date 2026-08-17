import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "@/components/Container";
import { DotGrid } from "@/components/DotGrid";
import { HomeHero } from "@/components/HomeHero";
import { HeroRandomizer } from "@/components/heroes/HeroRandomizer";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { HighlightsBand } from "@/components/marquee/HighlightsBand";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { PhotoLinkCard } from "@/components/cards/PhotoLinkCard";
import { PhotoInterstitial } from "@/components/PhotoInterstitial";
import { ContactBanner } from "@/components/ContactBanner";
import { DashboardMock } from "@/components/DashboardMock";
import { StatGrid } from "@/components/StatGrid";
import { TeamMarquee } from "@/components/TeamMarquee";
import { serviceCards, valuePills } from "@/content/services";
import { cases } from "@/content/cases";
import { insights } from "@/content/insights";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // Alt text for the hero's three rotating cards: 01 Plan / 02 Execute / 03 Grow.
  const heroAlts: [string, string, string] =
    locale === "fi"
      ? [
          "NØRR3:n asiantuntijat suunnittelevat kampanjaa yhdessä",
          "NØRR3:n tiimi toteuttaa mainontaa Helsingin studiolla",
          "NØRR3:n tiimi juhlii kasvua kädet ilmassa studiolla",
        ]
      : [
          "NØRR3 specialists planning a campaign together",
          "NØRR3 creative execution in the Helsinki studio",
          "The NØRR3 team celebrating growth with arms raised",
        ];

  const featuredCases = [
    cases.find((c) => c.slug === "flow-festival")!,
    cases.find((c) => c.slug === "kokkola")!,
    cases.find((c) => c.slug === "st1")!,
  ];

  const inNumbers = [
    { value: 360, suffix: "°", label: locale === "fi" ? "Strategisesti aktiivinen insight- ja mediatoimisto" : "A strategically active insight and media agency" },
    { value: 2019, grouping: false, label: locale === "fi" ? "Perustettu" : "Founded" },
    { value: 14, label: locale === "fi" ? "Vakituista omaa työntekijää, kaikki kokeneita ja lähes kaikki partnereita" : "Permanent employees — all experienced, nearly all partners" },
    { value: 88, label: "NPS (05/2024)" },
    { value: 800, suffix: "+", label: locale === "fi" ? "Ammattilaista tukena ympäri maailmaa" : "Professionals supporting us worldwide" },
    { value: 11, suffix: " M€", label: locale === "fi" ? "Liikevaihtomme 2024" : "Our revenue 2024" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://norr3.fi/#organization",
        name: "NØRR3",
        alternateName: "NORR3 Oy",
        url: "https://norr3.fi",
        logo: "https://norr3.fi/wp-content/uploads/2025/02/Logo-01.png",
        description: dict.meta.description,
        foundingDate: "2019",
        email: "info@norr3.fi",
        telephone: "+358 46 8100 118",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Pursimiehenkatu 26 C",
          postalCode: "00150",
          addressLocality: "Helsinki",
          addressCountry: "FI",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://norr3.fi/#website",
        url: "https://norr3.fi",
        name: "NØRR3",
        description: dict.meta.description,
        publisher: { "@id": "https://norr3.fi/#organization" },
        inLanguage: ["fi", "en"],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — randomizes between the original HomeHero and the CityHero
          (dark Helsinki cityscape parallax) on each page load. The CityHero
          forces the nav into dark-mode styling via data-city-hero-active. */}
      <HeroRandomizer
        locale={locale}
        left={dict.home.heroLeft}
        accent={dict.home.heroAccent}
        alts={heroAlts}
        heroBody={dict.home.heroBody}
        contactLabel={dict.common.contactUs}
        contactHref={`/${locale}/contact`}
        logoStrip={<LogoStrip />}
      />

      {/*
        Section rhythm on this page: a run of base-background sections opens with
        `pt-24 lg:pt-32` and every member closes with `pb-24 lg:pb-32`, so the gap
        between two of them is exactly one unit. Full-width bands (Highlights,
        Engine, ContactBanner) bring their own padding and reset the run.
      */}

      {/* Services */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={dict.home.services.heading}
            body={dict.home.services.body}
            cta={dict.common.allServices}
            ctaHref={`/${locale}/services`}
          />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <ServiceCard
                key={card.number}
                number={card.number}
                icon={card.icon}
                title={card[locale].title}
                body={card[locale].body}
                readMoreLabel={dict.common.readMore}
                highlighted={card.highlighted}
                href={`/${locale}/services`}
              />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* Values photo with pill overlay */}
      <Container className="pb-24 lg:pb-32">
        <PhotoInterstitial
          image="/images/brand/space-lounge.webp"
          alt={
            locale === "fi"
              ? "NØRR3:n studiolounge Helsingissä — avoin, valoisa ja rento"
              : "The NØRR3 studio lounge in Helsinki — open, bright and relaxed"
          }
          caption={dict.home.valuesCaption}
          pills={valuePills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }))}
        />
      </Container>

      {/* Cases */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader
            heading={dict.home.cases.heading}
            body={dict.home.cases.body}
            cta={dict.common.allCases}
            ctaHref={`/${locale}/cases`}
          />
          <div className="mt-14 grid gap-x-6 gap-y-12 lg:mt-16 lg:grid-cols-2">
            <CaseCard study={featuredCases[0]} locale={locale} ctaLabel={dict.common.readCase} large />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
              {featuredCases.slice(1).map((c) => (
                <CaseCard key={c.slug} study={c} locale={locale} ctaLabel={dict.common.readCase} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <HighlightsBand label={dict.common.highlights} />

      <LogoStrip />

      {/* Marketing Engine */}
      <section className="bg-pastel-purple/40 py-24 lg:py-32 dark:bg-white/[0.04]">
        <Container>
          <SectionHeader
            heading={dict.home.engine.heading}
            body={dict.home.engine.body}
            cta={dict.common.accessDemo}
            ctaHref={`/${locale}/engine`}
          />
          <div className="mt-14 grid items-stretch gap-card-gap lg:mt-16 lg:grid-cols-2">
            <Reveal delay={0.05} className="flex flex-col">
              <div className="overflow-hidden rounded-card">
                <img
                  src="/images/brand/engine-team.webp"
                  width={1500}
                  height={1000}
                  alt={
                    locale === "fi"
                      ? "NØRR3:n asiantuntijat työskentelevät yhdessä läppärin ääressä"
                      : "NØRR3 specialists collaborating around a laptop"
                  }
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-white/70">{dict.home.engine.photoCaption}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <DashboardMock locale={locale} labels={dict.engine.dashboard} />
            </Reveal>
          </div>
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={dict.banner.heading}
        body={dict.banner.body}
        cta={dict.common.contactUs}
        tone="yellow"
      />

      {/* About Us — the three blocks are now the same PhotoLinkCard the Cases
          grid above uses, so both grids share one photo/title/pill rhythm and
          the whole card (not just a small pill) is the click target. */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={dict.home.about.heading}
            body={dict.home.about.body}
            cta={dict.common.allAboutUs}
            ctaHref={`/${locale}/team`}
          />
          <div className="mt-14 grid gap-x-6 gap-y-12 lg:mt-16 lg:grid-cols-2">
            <PhotoLinkCard
              href={`/${locale}/team`}
              image="/images/brand/team-energy.webp"
              alt={
                locale === "fi"
                  ? "NØRR3:n tiimi juhlii kädet ilmassa studion NORR3-kirjainten alla"
                  : "The NØRR3 team celebrating with arms raised under the studio's NORR3 letters"
              }
              title={dict.home.about.joinTitle}
              body={dict.home.about.joinBody}
              ctaLabel={dict.common.openJobs}
              large
            />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
              <PhotoLinkCard
                href={`/${locale}/team`}
                image="/images/brand/team-couch.webp"
                alt={
                  locale === "fi"
                    ? "NØRR3:n tiimi nauramassa yhdessä studion sohvalla"
                    : "The NØRR3 team laughing together on the studio sofa"
                }
                title={dict.home.about.teamTitle}
                body={dict.home.about.teamBody}
                ctaLabel={dict.common.readMore}
              />
              <PhotoLinkCard
                href={`/${locale}/team`}
                image="/images/brand/award.webp"
                alt={
                  locale === "fi"
                    ? "NØRR3:n tiimi alan palkinnon kanssa studion loungessa"
                    : "The NØRR3 team with an industry award in the studio lounge"
                }
                title={dict.home.about.agencyTitle}
                body={dict.home.about.agencyBody}
                ctaLabel={dict.common.readMore}
              />
            </div>
          </div>

          <div className="mt-24 lg:mt-28">
            <Reveal className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-4 text-center">
              {/* Sub-section head: brand h3 (40px / 125% / -1.5%), one step below
                  the SectionHeader h2 above it. */}
              <h3 className="text-3xl font-medium leading-[1.25] tracking-[-0.015em] text-ink lg:text-h3 dark:text-white">
                {dict.home.people.heading}
              </h3>
              <p className="text-[15px] leading-relaxed text-ink/70 dark:text-white/70">{dict.home.people.body}</p>
            </Reveal>
            <TeamMarquee locale={locale} />
            <div className="mt-8 flex justify-center">
              <PillButton href={`/${locale}/team`} variant="secondary">{dict.common.meetTeam}</PillButton>
            </div>
          </div>

          <div className="mt-24 lg:mt-28">
            <StatGrid stats={inNumbers} locale={locale} label={dict.common.inNumbers} />
          </div>
        </Container>
      </section>

      {/* Blog */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader
            heading={dict.home.blog.heading}
            body={dict.home.blog.body}
            cta={dict.common.allInsights}
            ctaHref={`/${locale}/insights`}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {insights.map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
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
