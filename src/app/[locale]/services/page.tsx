import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo } from "@/lib/pageSeo";
import { getSiteContent } from "@/lib/cms";
import { imageSlot } from "@/content/imageSlots";
import { audienceChannels, dataset } from "@/content/datasets";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { PillMarquee } from "@/components/marquee/PillMarquee";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { HighlightsBand } from "@/components/marquee/HighlightsBand";
import { BenefitCard } from "@/components/cards/BenefitCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { PhotoInterstitial } from "@/components/PhotoInterstitial";
import { ContactBanner } from "@/components/ContactBanner";
import { AudienceChart } from "@/components/AudienceChart";
import { StatGrid } from "@/components/StatGrid";
import { Icon } from "@/components/Icon";
import { PixelArt } from "@/components/PixelArt";
import { MediaAsset } from "@/components/MediaAsset";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("services", locale, {
    title: dict.seo.services.title,
    description: dict.seo.services.description,
    image: "/images/brand/services-planning.webp",
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/${locale}/services`, languages: { "fi-FI": "/fi/services", "en-US": "/en/services" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/services`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.image, width: 1600, height: 1066, alt: "NØRR3 planners reviewing a media plan" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [seo.image] },
  };
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  const collabPhoto = imageSlot(content, "services.collab", locale, {
    src: "/images/brand/services-collab.webp",
    alt:
      locale === "fi"
        ? "Kaksi NØRR3:n kollegaa jakaa kampanjan tuloksen hymyillen"
        : "Two NØRR3 colleagues sharing a campaign result with a smile",
  });
  const planningPhoto = imageSlot(content, "services.planning", locale, {
    src: "/images/brand/services-planning.webp",
    alt:
      locale === "fi"
        ? "NØRR3:n suunnittelijat tarkastelevat mediasuunnitelmaa läppäriltä valoisassa neuvotteluhuoneessa"
        : "NØRR3 planners reviewing a media plan on a laptop in a bright meeting room",
  });
  const serviceCards = content.services;
  const cases = content.cases;
  const insights = content.posts;
  const { mediaPills } = content.brand;
  const s = dict.services;

  const pills = mediaPills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }));
  const relatedCases = cases.filter((c) => c.slug !== "suun-terveystalo").slice(0, 3);

  return (
    <>
      {/*
        Same section rhythm as the home page: a run of base-background sections
        opens with `pt-24 lg:pt-32` and every member closes with `pb-24 lg:pb-32`,
        so interior pages read as one family. Bands reset the run.
      */}

      {/* Hero */}
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{s.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={s.heroLeft}
          accent={s.heroAccent}
          className="mt-6 text-[9vw] leading-none lg:text-[6.5rem]"
        />
      </Container>
      <div className="mt-10 lg:mt-12">
        <PillMarquee items={pills} />
      </div>
      <Container className="pb-24 pt-12 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {s.heroBody}
          </p>
          <PillButton href={`/${locale}/contact`}>{dict.common.contactUs}</PillButton>
        </Reveal>
      </Container>

      {/* Six service areas — the numbered brand service cards */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={s.areas.heading} body={s.areas.body} />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <ServiceCard
                key={card.number}
                number={card.number}
                icon={card.icon}
                title={card[locale].title}
                body={card[locale].body}
                items={card.items?.map((item) => item[locale])}
                readMoreLabel={dict.common.readMore}
                href={`/${locale}/contact`}
              />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* NØRR3 Media Insights — black band */}
      {/* The black band needs a hairline in dark mode or it melts into the base. */}
      <section className="bg-ink py-24 lg:py-32 dark:border-y dark:border-white/10">
        <Container>
          <SectionHeader
            heading={s.insights.heading}
            body={s.insights.body}
            cta={s.insights.cta}
            ctaHref={`/${locale}/contact`}
            tone="light"
          />
          <Reveal delay={0.1} className="mx-auto mt-14 max-w-4xl lg:mt-16">
            <AudienceChart
              channels={dataset(content.datasets, "audienceChannels", locale, audienceChannels)}
              legendMen={s.insights.legendMen}
              legendWomen={s.insights.legendWomen}
              description={s.insights.chartAlt}
            />
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

      <LogoStrip clients={clients} locale={locale} />

      {/* Why choose Media Insights */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="overflow-hidden rounded-card">
              <MediaAsset
                src={collabPhoto.src}
                width={1600}
                height={1066}
                alt={collabPhoto.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </Reveal>
            <Reveal className="flex flex-col items-start gap-6">
              <h2 className="text-4xl font-medium leading-[1.1] tracking-tight text-ink lg:text-5xl dark:text-white">
                {s.why.heading}
              </h2>
              <p className="text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">{s.why.body}</p>
            </Reveal>
          </div>
          <StaggerGrid className="mt-16 grid gap-card-gap sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {s.why.benefits.map((b) => (
              <BenefitCard key={b.title} icon={b.icon} title={b.title} body={b.body} />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <Container className="pb-24 lg:pb-32">
        <PhotoInterstitial
          image={planningPhoto.src}
          alt={planningPhoto.alt}
          caption={s.photoCaption}
          pills={pills}
        />
      </Container>

      {/* Reliable data — a three-step explainer, so the index numbers take the
          primary purple rather than the yellow reserved for the numbered
          service cards above (yellow on a pastel ground reads poorly anyway).
          Card radius/padding follow BRAND_GUIDELINES §5. */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={s.data.heading} body={s.data.body} />
          <StaggerGrid className="mt-14 grid gap-card-gap lg:mt-16 lg:grid-cols-3">
            {s.data.cards.map((card, i) => (
              <div
                key={card.title}
                className={`relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-card px-card-pad pb-card-pad pt-16 text-center ${
                  i === 0
                    ? "bg-purple text-white"
                    : "bg-pastel-purple/60 text-ink dark:bg-white/[0.04] dark:text-white dark:ring-1 dark:ring-white/10"
                }`}
              >
                {i === 0 && (
                  <PixelArt className="pointer-events-none absolute -left-4 -top-4 w-2/3 opacity-90" />
                )}
                <div
                  className={`relative flex h-[64px] w-[64px] items-center justify-center rounded-[5px] ${
                    i === 0 ? "bg-yellow text-ink" : "bg-violet text-white"
                  }`}
                >
                  <Icon name={card.icon} style={{ fontSize: "28px" }} />
                </div>
                <span
                  className={`relative text-xl font-medium tabular-nums ${
                    i === 0 ? "text-yellow" : "text-purple dark:text-light-purple"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative text-lg font-medium">{card.title}</h3>
                <p className={`relative text-sm leading-relaxed ${i === 0 ? "text-white/85" : "text-ink/65 dark:text-white/65"}`}>
                  {card.body}
                </p>
              </div>
            ))}
          </StaggerGrid>

          <div className="mt-20 lg:mt-24">
            <StatGrid
              stats={s.data.stats.map((st) => ({ ...st }))}
              locale={locale}
              columns={3}
              size="medium"
            />
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={s.features.heading} body={s.features.body} />
          <div className="mt-14 grid items-start gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
            {/* Decorative product visual — purely illustrative, so it is hidden
                from assistive tech; the real chart above carries a description. */}
            <Reveal className="rounded-card bg-ink p-10 ring-1 ring-white/10 lg:sticky lg:top-28">
              <div aria-hidden className="mx-auto max-w-xs rounded-[16px] bg-white p-6">
                <div className="flex h-40 items-end gap-2">
                  {[30, 55, 40, 75, 50, 85].map((h, i) => (
                    <div key={i} className="flex h-full w-full flex-col justify-end gap-[2px]">
                      <div className="w-full bg-light-purple" style={{ height: `${h}%` }} />
                      <div className="w-full bg-purple" style={{ height: `${h * 0.5}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-[9px] text-ink/50">
                  <span>15-29</span>
                  <span>30-44</span>
                  <span>45-59</span>
                  <span>60-74</span>
                </div>
              </div>
            </Reveal>
            <ul className="divide-y divide-black/10 dark:divide-white/10">
              {s.features.items.map((f, i) => (
                <Reveal key={f.title} as="li" delay={i * 0.05} className="flex gap-6 py-8 first:pt-0">
                  {/* Violet tile + white icon — the brand icon-tile treatment,
                      identical in both themes instead of a grey/white split. */}
                  <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                    <Icon name={f.icon} style={{ fontSize: "24px" }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-ink dark:text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65 dark:text-white/65">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Related cases */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader
            heading={s.relatedCases}
            body={dict.cases.body}
            cta={dict.common.allCases}
            ctaHref={`/${locale}/cases`}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {relatedCases.map((c) => (
              <CaseCard key={c.slug} study={c} locale={locale} ctaLabel={dict.common.readCase} />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <HighlightsBand label={dict.common.highlights} clients={clients} />

      {/* Related posts — now has the same "all insights" exit as every other
          card grid on the site, instead of dead-ending. */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={s.relatedPosts}
            body={dict.home.blog.body}
            cta={dict.common.allInsights}
            ctaHref={`/${locale}/insights`}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {insights.slice(0, 3).map((post) => (
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
