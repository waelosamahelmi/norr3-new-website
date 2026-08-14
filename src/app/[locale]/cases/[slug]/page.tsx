import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "@/components/Container";
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

export async function generateMetadata({ params }: PageProps<"/[locale]/cases/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const study = getCase(slug);
  if (!study) return {};
  const title = locale === "fi" ? `${study.client} — NØRR3-case` : `${study.client} — NØRR3 case`;
  const description = study.tagline[locale];
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/cases/${slug}`,
      languages: { "fi-FI": `/fi/cases/${slug}`, "en-US": `/en/cases/${slug}` },
    },
    openGraph: {
      type: "article" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/cases/${slug}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title,
      description,
      images: [{ url: study.image, width: 1600, height: 1066, alt: `${study.client} — ${study.tagline[locale]}` }],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [study.image] },
  };
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
      {/* Editorial hero — magazine opener */}
      <section className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[16/7]">
          <img
            src={study.image}
            alt={`${study.client} — ${study.tagline[locale]}`}
            width={1600}
            height={1066}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
          <Container className="absolute inset-x-0 bottom-0 pb-10 lg:pb-14">
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-white/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                {dict.cases.pill}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-[13vw] font-medium leading-[0.92] tracking-tight text-white lg:text-[7rem]">
                {study.client}
              </h1>
            </Reveal>
            <Reveal delay={0.12} className="mt-5 flex flex-col items-start gap-6">
              <p className="max-w-xl text-base leading-relaxed text-white/85 lg:text-lg">{study.tagline[locale]}</p>
              <PillButton href={`/${locale}/contact`} variant="lavender">
                {dict.common.contactUs}
              </PillButton>
            </Reveal>
          </Container>
        </div>
      </section>

      {/* Intro lead */}
      <section className="border-t border-black/5 py-16 dark:border-white/10">
        <Container>
          <Reveal className="max-w-3xl">
            <p className="text-xl font-medium leading-snug tracking-tight text-ink lg:text-2xl dark:text-white">
              {study.intro[locale]}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Editorial pull-quote — the case's own thesis line */}
      <Container className="pb-16">
        <Reveal className="rounded-[25px] bg-purple px-8 py-16 text-center text-white sm:px-16 lg:py-20">
          <span aria-hidden className="block text-6xl leading-none text-yellow">
            “
          </span>
          <p className="mx-auto mt-2 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {study.tagline[locale]}
          </p>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-yellow">{study.client}</p>
        </Reveal>
      </Container>

      {/* 1. Objectives / 2. Solution — editorial text blocks */}
      <Container className="space-y-14 pb-20">
        <Reveal className="border-l-2 border-purple/40 pl-6">
          <h2 className="text-2xl font-medium text-ink dark:text-white">{d.objectives}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 dark:text-white/70">{study.objectives[locale]}</p>
        </Reveal>

        <Reveal className="border-l-2 border-purple/40 pl-6">
          <h2 className="text-2xl font-medium text-ink dark:text-white">{d.solution}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 dark:text-white/70">{study.solution[locale]}</p>
        </Reveal>
      </Container>

      {/* Methods */}
      <section className="pb-20">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-medium text-ink dark:text-white">{d.methods}</h2>
          </Reveal>
          <StaggerGrid className="mt-8 grid gap-5 sm:grid-cols-3">
            {study.methods.map((m) => (
              <div key={m[locale].title} className="flex h-full flex-col gap-4 bg-grey/60 p-7 dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[5px] bg-yellow text-ink">
                  <Icon name={m.icon} style={{ fontSize: "26px" }} />
                </div>
                <h3 className="text-base font-medium text-ink dark:text-white">{m[locale].title}</h3>
                <p className="text-sm leading-relaxed text-ink/60 dark:text-white/60">{m[locale].body}</p>
              </div>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* 3. Results */}
      <Container className="pb-20">
        {/* Photo echo — same shot, wider crop, as a visual breather before results */}
        <div className="mb-16 aspect-[16/6] w-full overflow-hidden rounded-[25px]">
          <img
            src={study.image}
            alt=""
            width={1600}
            height={600}
            loading="lazy"
            className="h-full w-full object-cover object-[center_30%]"
          />
        </div>

        <Reveal className="border-l-2 border-purple/40 pl-6">
          <h2 className="text-2xl font-medium text-ink dark:text-white">{d.results}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 dark:text-white/70">{study.results[locale]}</p>
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
