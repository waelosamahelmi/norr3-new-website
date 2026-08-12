import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { CaseCard } from "@/components/cards/CaseCard";
import { ContactBanner } from "@/components/ContactBanner";
import { StatGrid } from "@/components/StatGrid";
import { Icon } from "@/components/Icon";
import { cases, getCase } from "@/content/cases";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export default async function CaseDetailPage({ params }: PageProps<"/[locale]/cases/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const d = dict.cases.detail;
  const study = getCase(slug);
  if (!study) notFound();

  const related = cases.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Hero — Terveystalo-detail pattern: plain title, short sub, CTA */}
      <Container className="pb-14 pt-10 lg:pt-16">
        <Reveal>
          <HeroPill>{dict.cases.pill}</HeroPill>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-5 text-[10vw] font-medium leading-none tracking-tight text-ink lg:text-[6.5rem]">
            {study.client}
          </h1>
        </Reveal>
        <Reveal delay={0.15} className="mt-8 flex flex-col items-start gap-6">
          <p className="max-w-sm text-sm leading-relaxed text-ink/80">{study.tagline[locale]}</p>
          <PillButton href={`/${locale}/contact`}>{dict.common.contactUs}</PillButton>
        </Reveal>
      </Container>

      {/* Intro */}
      <section className="border-t border-black/5 py-16">
        <Container>
          <SectionHeader heading={study.tagline[locale]} body={study.intro[locale]} />
        </Container>
      </section>

      {/* 1. Objectives / 2. Solution — alternating photo + numbered text */}
      <Container className="space-y-20 pb-20">
        <Reveal className="grid items-center gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={study.detailImages.objectives} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-ink">{d.objectives}</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70">{study.objectives[locale]}</p>
          </div>
        </Reveal>

        <Reveal className="grid items-center gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden lg:order-2">
            <img src={study.detailImages.solution} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-ink">{d.solution}</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70">{study.solution[locale]}</p>
          </div>
        </Reveal>
      </Container>

      {/* Methods */}
      <section className="pb-20">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-medium text-ink">{d.methods}</h2>
          </Reveal>
          <StaggerGrid className="mt-8 grid gap-5 sm:grid-cols-3">
            {study.methods.map((m) => (
              <div key={m[locale].title} className="flex h-full flex-col gap-4 bg-grey/60 p-7">
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[5px] bg-yellow text-ink">
                  <Icon name={m.icon} style={{ fontSize: "26px" }} />
                </div>
                <h3 className="text-base font-medium text-ink">{m[locale].title}</h3>
                <p className="text-sm leading-relaxed text-ink/60">{m[locale].body}</p>
              </div>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* 3. Results */}
      <Container className="pb-20">
        <Reveal className="grid items-center gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={study.detailImages.results} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-ink">{d.results}</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70">{study.results[locale]}</p>
          </div>
        </Reveal>

        <div className="mt-16">
          <StatGrid
            stats={study.metrics.map((m) => ({
              value: m.value,
              decimals: m.decimals,
              prefix: m.prefix,
              suffix: m.suffix,
              label: m.label[locale],
              grouping: m.value !== 2022,
            }))}
            locale={locale}
            size="medium"
          />
        </div>
      </Container>

      <ContactBanner
        locale={locale}
        heading={dict.cases.banner.heading}
        body={dict.cases.banner.body}
        cta={dict.common.contactUs}
        tone="yellow"
      />

      {/* More cases */}
      <section className="py-20">
        <Container>
          <SectionHeader heading={d.moreCases} body={dict.cases.body} cta={dict.common.allCases} ctaHref={`/${locale}/cases`} />
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
