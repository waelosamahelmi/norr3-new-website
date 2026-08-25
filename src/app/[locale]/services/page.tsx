import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo } from "@/lib/pageSeo";
import { getSiteContent } from "@/lib/cms";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { PillMarquee } from "@/components/marquee/PillMarquee";
import { HighlightsBand } from "@/components/marquee/HighlightsBand";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";
import { Icon } from "@/components/Icon";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("services", locale, {
    title: dict.seo.services.title,
    description: dict.seo.services.description,
    image: ogImage("/images/brand/services-planning.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: linkTo(locale, "/services"), languages: { "fi-FI": "/services", "en-US": "/en/services" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/services")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 1600, height: 1066, alt: "NØRR3 planners reviewing a media plan" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  const serviceCards = content.services;
  const cases = content.cases;
  const insights = content.posts;
  const { mediaPills } = content.brand;
  const s = dict.services;

  const pills = mediaPills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }));
  const relatedCases = cases.filter((c) => c.slug !== "suun-terveystalo").slice(0, 3);

  return (
    <>
      {/* Hero — cycling headline ("Our services include _…"), two CTAs, no
          chips: the grid below is the navigation. */}
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{s.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={s.heroLeft}
          accent={s.heroAccent}
          accents={s.heroAccentWords}
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
          <div className="flex flex-wrap items-center gap-3">
            <PillButton href={linkTo(locale, "/contact")}>{dict.common.contactUs}</PillButton>
            <PillButton href={linkTo(locale, "/contact")} variant="secondary">
              {dict.common.bookCall}
            </PillButton>
          </div>
        </Reveal>
      </Container>

      {/* Six service areas — the numbered brand service cards. No CTAs inside:
          the cards are expanders, the − button opens the descriptions. */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader id="palvelut-alueet" heading={s.areas.heading} body={s.areas.body} />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <ServiceCard
                key={card.number}
                number={card.number}
                icon={card.icon}
                title={card[locale].title}
                body={card[locale].body}
                items={card.items?.map((item) => ({
                  label: item[locale],
                  desc: locale === "fi" ? item.desc_fi : item.desc_en,
                }))}
                outcomes={card.outcomes?.[locale]}
                whatYouGetLabel={dict.common.whatYouGet}
              />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* Marketing Engine — the products live in one platform, not as a box.
          This band is the single home for the demo/call/contact CTAs. */}
      <section className="bg-ink py-24 lg:py-32 dark:border-y dark:border-white/10">
        <Container>
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-yellow">
              {dict.nav.engine}
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-[1.1] tracking-tight text-white lg:text-5xl">
              {s.engineBand.heading}
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 lg:text-base">
              {s.engineBand.body}
            </p>
          </Reveal>
          <Reveal delay={0.05} className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {s.engineBand.points.map((p) => (
              <span key={p.label} className="flex items-center gap-2 text-sm text-white/85">
                <Icon name={p.icon} className="text-yellow" style={{ fontSize: "20px" }} />
                {p.label}
              </span>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap justify-center gap-3">
            <PillButton href={linkTo(locale, "/engine")} variant="lavender">
              {dict.common.bookDemo}
            </PillButton>
            <PillButton href={linkTo(locale, "/contact")} variant="outlineLight">
              {dict.common.bookCall}
            </PillButton>
            <PillButton href={linkTo(locale, "/contact")} variant="outlineLight">
              {dict.common.contactUs}
            </PillButton>
          </Reveal>
        </Container>
      </section>

      {/* Related cases */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={s.relatedCases}
            body={dict.cases.body}
            cta={dict.common.allCases}
            ctaHref={linkTo(locale, "/cases")}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {relatedCases.map((c) => (
              <CaseCard key={c.slug} study={c} locale={locale} ctaLabel={dict.common.readCase} />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <HighlightsBand clients={clients} />

      {/* Related posts — same "all insights" exit as every other card grid. */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={s.relatedPosts}
            body={dict.home.blog.body}
            cta={dict.common.allInsights}
            ctaHref={linkTo(locale, "/insights")}
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
