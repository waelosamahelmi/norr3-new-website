import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "@/components/Container";
import { HeroCollage } from "@/components/HeroCollage";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { HighlightsBand } from "@/components/marquee/HighlightsBand";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { PhotoInterstitial } from "@/components/PhotoInterstitial";
import { ContactBanner } from "@/components/ContactBanner";
import { DashboardMock } from "@/components/DashboardMock";
import { StatGrid } from "@/components/StatGrid";
import { serviceCards, valuePills } from "@/content/services";
import { cases } from "@/content/cases";
import { insights } from "@/content/insights";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

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

  return (
    <>
      {/* Hero — "A New Way to [collage] _Grow" on one visual line, like the design */}
      <Container className="pb-14 pt-10 lg:pt-16">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <h1 className="flex w-full flex-wrap items-center justify-between gap-6 font-medium leading-none tracking-tight text-ink lg:flex-nowrap">
            <span className="block whitespace-nowrap text-[10vw] lg:text-[6.5vw]">{dict.home.heroLeft}</span>
            <span className="order-3 block w-full lg:order-none lg:w-auto lg:min-w-0 lg:flex-1">
              <HeroCollage />
            </span>
            <span className="block whitespace-nowrap text-[10vw] lg:text-[6.5vw]">
              <span aria-hidden className="caret-blink">_</span>
              {dict.home.heroAccent}
            </span>
          </h1>
        </div>
        <Reveal delay={0.3} className="mt-10 flex flex-col items-start gap-6">
          <p className="max-w-xs text-sm leading-relaxed text-ink/80">{dict.home.heroBody}</p>
          <PillButton href={`/${locale}/contact`}>{dict.common.contactUs}</PillButton>
        </Reveal>
      </Container>

      <LogoStrip />

      {/* Services */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeader
            heading={dict.home.services.heading}
            body={dict.home.services.body}
            cta={dict.common.allServices}
            ctaHref={`/${locale}/services`}
          />
          <StaggerGrid className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <ServiceCard
                key={card.number}
                number={card.number}
                icon={card.icon}
                title={card[locale].title}
                body={card[locale].body}
                readMoreLabel={dict.common.readMore}
                highlighted={card.highlighted}
              />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* Values photo with pill overlay */}
      <Container className="pb-20">
        <PhotoInterstitial
          image="/images/office/office-07.jpg"
          caption={dict.home.valuesCaption}
          pills={valuePills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }))}
        />
      </Container>

      {/* Cases */}
      <section className="pb-16">
        <Container>
          <SectionHeader
            heading={dict.home.cases.heading}
            body={dict.home.cases.body}
            cta={dict.common.allCases}
            ctaHref={`/${locale}/cases`}
          />
          <div className="mt-14 grid gap-x-6 gap-y-12 lg:grid-cols-2">
            <CaseCard study={featuredCases[0]} locale={locale} readMoreLabel={dict.common.readMore} large />
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
              {featuredCases.slice(1).map((c) => (
                <CaseCard key={c.slug} study={c} locale={locale} readMoreLabel={dict.common.readMore} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <HighlightsBand label={dict.common.highlights} />

      <LogoStrip />

      {/* Marketing Engine */}
      <section className="bg-pastel-purple/40 py-20 lg:py-24">
        <Container>
          <SectionHeader
            heading={dict.home.engine.heading}
            body={dict.home.engine.body}
            cta={dict.common.accessDemo}
            ctaHref={`/${locale}/engine`}
          />
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
            <DashboardMock locale={locale} />
          </Reveal>
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={dict.banner.heading}
        body={dict.banner.body}
        cta={dict.common.contactUs}
        tone="yellow"
      />

      {/* About Us */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeader
            heading={dict.home.about.heading}
            body={dict.home.about.body}
            cta={dict.common.allAboutUs}
            ctaHref={`/${locale}/team`}
          />
          <div className="mt-14 grid gap-x-6 gap-y-12 lg:grid-cols-2">
            <div className="flex flex-col">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/office/office-02.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-4 text-xl font-medium text-ink">{dict.home.about.joinTitle}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{dict.home.about.joinBody}</p>
              <PillButton href={`/${locale}/team`} variant="secondary" className="mt-4 w-fit">
                {dict.common.openJobs}
              </PillButton>
            </div>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
              <div className="flex flex-col">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/office/office-05.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 text-base font-medium text-ink">{dict.home.about.teamTitle}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{dict.home.about.teamBody}</p>
                <PillButton href={`/${locale}/team`} variant="secondary" className="mt-4 w-fit">
                  {dict.common.readMore}
                </PillButton>
              </div>
              <div className="flex flex-col">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/office/office-06.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 text-base font-medium text-ink">{dict.home.about.agencyTitle}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{dict.home.about.agencyBody}</p>
                <PillButton href={`/${locale}/team`} variant="secondary" className="mt-4 w-fit">
                  {dict.common.readMore}
                </PillButton>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <StatGrid stats={inNumbers} locale={locale} label={dict.common.inNumbers} />
          </div>
        </Container>
      </section>

      {/* Blog */}
      <section className="pb-20">
        <Container>
          <SectionHeader
            heading={dict.home.blog.heading}
            body={dict.home.blog.body}
            cta={dict.common.allInsights}
            ctaHref={`/${locale}/insights`}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {insights.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} readMoreLabel={dict.common.readMore} />
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
