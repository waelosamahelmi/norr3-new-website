import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { PillMarquee } from "@/components/marquee/PillMarquee";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { MediaMixSimulator } from "@/components/simulator/MediaMixSimulator";
import { DashboardMock } from "@/components/DashboardMock";
import { ContactBanner } from "@/components/ContactBanner";
import { CaseCard } from "@/components/cards/CaseCard";
import { StaggerGrid } from "@/components/StaggerGrid";
import { mediaPills } from "@/content/services";
import { cases } from "@/content/cases";

export default async function EnginePage({ params }: PageProps<"/[locale]/engine">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const e = dict.engine;

  const pills = mediaPills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }));
  const related = cases.filter((c) => ["st1", "kokkola", "flow-festival"].includes(c.slug));

  return (
    <>
      {/* Hero */}
      <Container className="pt-10 lg:pt-16">
        <Reveal>
          <HeroPill>{e.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={e.heroLeft}
          accent={e.heroAccent}
          className="mt-5 text-[9vw] leading-none lg:text-[6.5rem]"
        />
      </Container>
      <div className="mt-8">
        <PillMarquee items={pills} />
      </div>
      <Container className="pb-16 pt-12">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-sm text-sm leading-relaxed text-ink/80">{e.heroBody}</p>
          <div className="flex flex-wrap gap-3">
            <PillButton href="#simulator">{dict.common.accessDemo}</PillButton>
            <PillButton href={`/${locale}/contact`} variant="secondary">
              {dict.common.contactUs}
            </PillButton>
          </div>
        </Reveal>
      </Container>

      {/* Product screenshot */}
      <section className="bg-pastel-purple/40 py-20">
        <Container>
          <SectionHeader heading={e.demo.heading} body={e.demo.body} />
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
            <DashboardMock locale={locale} />
          </Reveal>
        </Container>
      </section>

      {/* Interactive media-mix simulator — black band, per the design language */}
      <section id="simulator" className="bg-ink py-20">
        <Container>
          <SectionHeader heading={e.simulator.heading} body={e.simulator.body} tone="light" />
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
            <MediaMixSimulator locale={locale} labels={e.simulator} />
          </Reveal>
        </Container>
      </section>

      {/* Case proof — big pull-quote card */}
      <section className="py-20">
        <Container>
          <Reveal className="bg-purple px-8 py-16 text-center text-white sm:px-16">
            <p className="text-3xl font-medium leading-tight tracking-tight sm:text-5xl">{e.quote.stat}</p>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/80">{e.quote.body}</p>
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-yellow">{e.quote.client}</p>
          </Reveal>
        </Container>
      </section>

      <LogoStrip />

      {/* Related cases */}
      <section className="py-20">
        <Container>
          <SectionHeader
            heading={dict.services.relatedCases}
            body={dict.cases.body}
            cta={dict.common.allCases}
            ctaHref={`/${locale}/cases`}
          />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CaseCard key={c.slug} study={c} locale={locale} readMoreLabel={dict.common.readMore} />
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
