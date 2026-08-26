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
import { MediaMixSimulator } from "@/components/simulator/MediaMixSimulator";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { CaseCard } from "@/components/cards/CaseCard";
import { Icon } from "@/components/Icon";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/engine">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const seo = await pageSeo("engine", locale, {
    title: dict.seo.engine.title,
    description: dict.seo.engine.description,
    image: ogImage("/images/brand/engine-team.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: linkTo(locale, "/engine"), languages: { "fi-FI": "/engine", "en-US": "/en/engine" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/engine")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 1500, height: 1000, alt: "The team behind the NØRR3 Marketing Engine" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function EnginePage({ params }: PageProps<"/[locale]/engine">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  const e = dict.engine;
  const cases = content.cases;

  const related = cases.filter((c) => ["st1", "kokkola", "flow-festival"].includes(c.slug));

  return (
    <>
      {/* Hero — promise + CTAs in one block, no separate intro band */}
      <Container className="pt-12 lg:pt-16">
        <Reveal>
          <HeroPill>{e.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={e.heroLeft}
          accent={e.heroAccent}
          className="mt-6 text-[9vw] leading-none lg:text-[6.5rem]"
        />
        <Reveal delay={0.1} className="mt-8 flex flex-col items-start gap-6">
          <p className="max-w-xl text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {e.heroBody}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <PillButton href={linkTo(locale, "/contact")}>{dict.common.contactUs}</PillButton>
            <PillButton href="#simulator" variant="secondary">
              {dict.common.bookDemo}
            </PillButton>
            <PillButton href={linkTo(locale, "/contact")} variant="secondary">
              {dict.common.bookCall}
            </PillButton>
          </div>
        </Reveal>
      </Container>

      {/* The five apps */}
      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeader heading={e.apps.heading} body={e.apps.body} />
          <StaggerGrid className="mt-12 grid gap-card-gap sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 xl:grid-cols-5">
            {e.apps.items.map((app) => (
              <div
                key={app.title}
                className="flex h-full flex-col gap-4 rounded-card bg-pastel-purple/60 p-6 dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10"
              >
                <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name={app.icon} style={{ fontSize: "26px" }} />
                </span>
                <h3 className="text-lg font-medium text-ink dark:text-white">{app.title}</h3>
                <p className="text-sm leading-relaxed text-ink/65 dark:text-white/65">{app.body}</p>
              </div>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* Licence what you need + users */}
      <section className="bg-pastel-purple/40 py-16 lg:py-20 dark:bg-white/[0.04]">
        <Container>
          <SectionHeader heading={e.licensing.heading} body={e.licensing.body} />
          <StaggerGrid className="mt-12 grid gap-card-gap sm:grid-cols-3 lg:mt-14">
            {e.licensing.points.map((point) => (
              <div
                key={point.title}
                className="flex h-full flex-col gap-4 rounded-card bg-white p-6 ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10"
              >
                <span className="flex h-[48px] w-[48px] items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name={point.icon} style={{ fontSize: "22px" }} />
                </span>
                <h3 className="text-base font-medium text-ink dark:text-white">{point.title}</h3>
                <p className="text-sm leading-relaxed text-ink/65 dark:text-white/65">{point.body}</p>
              </div>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* Setup — 2–6 weeks + the seven steps, compact */}
      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeader heading={e.setup.heading} body={e.setup.body} />
          <ol className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:mt-14">
            {e.setup.steps.map((step, i) => (
              <Reveal
                key={step.title}
                as="li"
                delay={i * 0.04}
                className="flex items-start gap-3 border-t border-black/10 pt-4 dark:border-white/10"
              >
                <span className="mt-0.5 text-base font-medium tabular-nums text-purple dark:text-light-purple">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[15px] font-medium leading-snug text-ink dark:text-white">{step.title}</h3>
                  {"desc" in step && step.desc && (
                    <p className="mt-0.5 text-[13px] leading-relaxed text-ink/55 dark:text-white/55">{step.desc}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Interactive media-mix simulator — the live demo */}
      <section id="simulator" className="scroll-mt-24 bg-ink py-16 lg:py-20 dark:border-y dark:border-white/10">
        <Container>
          <SectionHeader heading={e.simulator.heading} body={e.simulator.body} tone="light" />
          <Reveal delay={0.1} className="mt-12 lg:mt-14">
            <MediaMixSimulator locale={locale} labels={e.simulator} channels={content.channels} />
          </Reveal>
        </Container>
      </section>

      {/* Benefit + close — one band, one set of CTAs */}
      <section className="bg-violet py-16 lg:py-20">
        <Container>
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-medium leading-[1.1] tracking-tight text-white lg:text-4xl">
              {e.benefit.heading}
            </h2>
            <p className="max-w-xl text-[15px] leading-relaxed text-white/75">{e.benefit.body}</p>
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2">
              {e.benefit.points.map((p) => (
                <span key={p.label} className="flex items-center gap-2 text-sm text-white/85">
                  <Icon name={p.icon} className="text-yellow" style={{ fontSize: "18px" }} />
                  {p.label}
                </span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <PillButton href={linkTo(locale, "/contact")} variant="lavender">
                {dict.common.contactUs}
              </PillButton>
              <PillButton href="#simulator" variant="outlineLight">
                {dict.common.bookDemo}
              </PillButton>
              <PillButton href={linkTo(locale, "/contact")} variant="outlineLight">
                {dict.common.bookCall}
              </PillButton>
            </div>
          </Reveal>
        </Container>
      </section>

      <LogoStrip clients={clients} locale={locale} />

      {/* Related cases */}
      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeader
            heading={dict.services.relatedCases}
            body={dict.cases.body}
            cta={dict.common.allCases}
            ctaHref={linkTo(locale, "/cases")}
          />
          <StaggerGrid className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {related.map((c) => (
              <CaseCard key={c.slug} study={c} locale={locale} ctaLabel={dict.common.readCase} />
            ))}
          </StaggerGrid>
        </Container>
      </section>
    </>
  );
}
