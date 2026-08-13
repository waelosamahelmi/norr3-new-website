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
import { Icon } from "@/components/Icon";
import { mediaPills } from "@/content/services";
import { cases } from "@/content/cases";

export async function generateMetadata({ params }: PageProps<"/[locale]/engine">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.seo.engine.title,
    description: dict.seo.engine.description,
    alternates: { canonical: `/${locale}/engine`, languages: { "fi-FI": "/fi/engine", "en-US": "/en/engine" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/engine`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: dict.seo.engine.title,
      description: dict.seo.engine.description,
      images: [{ url: "/images/brand/engine-team.webp", width: 1500, height: 1000, alt: "The team behind the NØRR3 Marketing Engine" }],
    },
    twitter: { card: "summary_large_image" as const, title: dict.seo.engine.title, description: dict.seo.engine.description, images: ["/images/brand/engine-team.webp"] },
  };
}

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

      {/* Product intro — people + feature list */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="overflow-hidden rounded-[25px]">
              <img
                src="/images/brand/engine-workflow.webp"
                width={1600}
                height={1066}
                alt={locale === "fi" ? "NØRR3:n asiantuntija työskentelee Marketing Enginessä läppärillä" : "A NØRR3 specialist working in the Marketing Engine on a laptop"}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </Reveal>
            <div>
              <h2 className="text-3xl font-medium tracking-tight text-ink lg:text-4xl">{e.product.heading}</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70">{e.product.body}</p>
              <div className="mt-8 divide-y divide-black/10">
                {e.product.features.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.05} className="flex gap-5 py-5">
                    <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                      <Icon name={f.icon} style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-ink">{f.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">{f.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Product screenshot */}
      <section className="bg-pastel-purple/40 py-20">
        <Container>
          <SectionHeader heading={e.demo.heading} body={e.demo.body} />
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
            <DashboardMock locale={locale} />
          </Reveal>
        </Container>
      </section>

      {/* How Engine works — 3 steps */}
      <section className="pb-20">
        <Container>
          <SectionHeader heading={e.workflow.heading} />
          <StaggerGrid className="mt-12 grid gap-5 sm:grid-cols-3">
            {e.workflow.steps.map((step, i) => (
              <div key={step.title} className="flex h-full flex-col gap-4 rounded-[5px] bg-pastel-purple/40 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[5px] bg-ink text-white">
                    <Icon name={step.icon} style={{ fontSize: "26px" }} />
                  </div>
                  <span className="text-2xl font-medium text-yellow [text-shadow:0_0_1px_rgba(0,0,0,0.25)]">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-lg font-medium text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink/60">{step.body}</p>
              </div>
            ))}
          </StaggerGrid>
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

      {/* Book a demo — conversion band */}
      <section className="py-20">
        <Container>
          <Reveal className="flex flex-col items-center gap-6 rounded-[25px] bg-violet px-8 py-16 text-center text-white sm:px-16">
            <h2 className="max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">{e.bookDemo.heading}</h2>
            <p className="max-w-xl text-sm leading-relaxed text-white/80">{e.bookDemo.body}</p>
            <PillButton href={`/${locale}/contact`} variant="lavender">{dict.common.bookDemo}</PillButton>
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
