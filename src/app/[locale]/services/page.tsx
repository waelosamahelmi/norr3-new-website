import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
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
import { CaseCard } from "@/components/cards/CaseCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { PhotoInterstitial } from "@/components/PhotoInterstitial";
import { ContactBanner } from "@/components/ContactBanner";
import { AudienceChart } from "@/components/AudienceChart";
import { StatGrid } from "@/components/StatGrid";
import { Icon } from "@/components/Icon";
import { PixelArt } from "@/components/PixelArt";
import { mediaPills } from "@/content/services";
import { cases } from "@/content/cases";
import { insights } from "@/content/insights";

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const s = dict.services;

  const pills = mediaPills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }));
  const relatedCases = cases.filter((c) => c.slug !== "terveystalo").slice(0, 3);

  return (
    <>
      {/* Hero */}
      <Container className="pt-10 lg:pt-16">
        <Reveal>
          <HeroPill>{s.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={s.heroLeft}
          accent={s.heroAccent}
          className="mt-5 text-[9vw] leading-none lg:text-[6.5rem]"
        />
      </Container>
      <div className="mt-8">
        <PillMarquee items={pills} />
      </div>
      <Container className="pb-16 pt-12">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-sm text-sm leading-relaxed text-ink/80">{s.heroBody}</p>
          <PillButton href={`/${locale}/contact`}>{dict.common.contactUs}</PillButton>
        </Reveal>
      </Container>

      {/* NØRR3 Media Insights — black band */}
      <section className="bg-ink py-20">
        <Container>
          <SectionHeader
            heading={s.insights.heading}
            body={s.insights.body}
            cta={s.insights.cta}
            ctaHref={`/${locale}/contact`}
            tone="light"
          />
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
            <AudienceChart legendMen={s.insights.legendMen} legendWomen={s.insights.legendWomen} />
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

      <LogoStrip />

      {/* Why choose Media Insights */}
      <section className="py-20">
        <Container>
          <SectionHeader heading={s.why.heading} body={s.why.body} />
          <StaggerGrid className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s.why.benefits.map((b) => (
              <BenefitCard key={b.title} icon={b.icon} title={b.title} body={b.body} />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <Container className="pb-20">
        <PhotoInterstitial
          image="/images/office/office-11.jpg"
          caption={s.photoCaption}
          pills={pills}
        />
      </Container>

      {/* Reliable data */}
      <section className="pb-20">
        <Container>
          <SectionHeader heading={s.data.heading} body={s.data.body} />
          <StaggerGrid className="mt-14 grid gap-5 lg:grid-cols-3">
            {s.data.cards.map((card, i) => (
              <div
                key={card.title}
                className={`relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-[5px] px-8 pb-9 pt-20 text-center ${
                  i === 0 ? "bg-purple text-white" : "bg-pastel-purple/60 text-ink"
                }`}
              >
                {i === 0 && (
                  <PixelArt color="#000000" className="pointer-events-none absolute -left-4 -top-4 w-2/3 opacity-90" />
                )}
                <div
                  className={`relative flex h-[64px] w-[64px] items-center justify-center rounded-[5px] ${
                    i === 0 ? "bg-yellow text-ink" : "bg-ink text-white"
                  }`}
                >
                  <Icon name={card.icon} style={{ fontSize: "28px" }} />
                </div>
                <span className={`relative text-xl font-medium ${i === 0 ? "text-yellow" : "text-ink/40"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative text-base font-medium">{card.title}</h3>
                <p className={`relative text-sm leading-relaxed ${i === 0 ? "text-white/80" : "text-ink/60"}`}>
                  {card.body}
                </p>
              </div>
            ))}
          </StaggerGrid>

          <div className="mt-16">
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
      <section className="pb-20">
        <Container>
          <SectionHeader heading={s.features.heading} body={s.features.body} />
          <div className="mt-14 grid items-start gap-10 lg:grid-cols-2">
            <Reveal className="rounded-[5px] bg-ink p-10 lg:sticky lg:top-28">
              <div className="mx-auto max-w-xs rounded-md bg-white p-6">
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
            <div className="divide-y divide-black/10">
              {s.features.items.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.05} className="flex gap-6 py-7">
                  <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[5px] bg-grey text-ink/70">
                    <Icon name={f.icon} style={{ fontSize: "24px" }} />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-ink">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Related cases */}
      <section className="pb-16">
        <Container>
          <SectionHeader
            heading={s.relatedCases}
            body={dict.cases.body}
            cta={dict.common.allCases}
            ctaHref={`/${locale}/cases`}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCases.map((c) => (
              <CaseCard key={c.slug} study={c} locale={locale} readMoreLabel={dict.common.readMore} />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <HighlightsBand label={dict.common.highlights} />

      {/* Related posts */}
      <section className="py-20">
        <Container>
          <SectionHeader heading={s.relatedPosts} body={dict.home.blog.body} />
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
