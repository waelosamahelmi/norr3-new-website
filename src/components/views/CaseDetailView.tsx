import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/content/dictionary";
import type { CaseStudy } from "@/content/cases";
import { getCases } from "@/lib/cms";
import { linkTo } from "@/lib/links";
import { Container } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { CaseCard } from "@/components/cards/CaseCard";
import { ContactBanner } from "@/components/ContactBanner";
import { StatGrid } from "@/components/StatGrid";
import { CountUpStat } from "@/components/CountUpStat";
import { ParallaxImage } from "@/components/ParallaxImage";
import { Icon } from "@/components/Icon";

/**
 * The case-study detail page body. Lives at the domain root (`/st1`,
 * `/kiinteistomaailma`) — the catch-all route resolves single-segment slugs
 * against the case collection and renders this view, so a case's URL is as
 * short as it can be (matching the old WordPress site's structure).
 */
export async function CaseDetailView({
  study,
  locale,
  dict,
}: {
  study: CaseStudy;
  locale: Locale;
  dict: Dictionary;
}) {
  const related = (await getCases()).filter((c) => c.slug !== study.slug).slice(0, 3);
  const d = dict.cases.detail;

  // Narrative blocks share one editorial layout: the numbered heading holds a
  // column of its own, the prose sits beside it. Titles keep their Figma
  // numbering ("1. Objectives"), so no separate index numeral is added.
  const narrative = [
    { heading: d.objectives, body: study.objectives[locale] },
    { heading: d.solution, body: study.solution[locale] },
  ];

  return (
    <>
      {/* Breadcrumb structured data — lets Google show Home › Cases › Client
          under the result instead of a bare URL. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "NØRR3", item: `https://norr3.fi${linkTo(locale)}` },
              { "@type": "ListItem", position: 2, name: dict.cases.heading, item: `https://norr3.fi${linkTo(locale, "/caset")}` },
              { "@type": "ListItem", position: 3, name: study.client },
            ],
          }),
        }}
      />

      {/* Editorial hero — magazine opener */}
      <section className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] lg:aspect-[16/7]">
          {study.parallax ? (
            <ParallaxImage
              src={study.image}
              alt={`${study.client} — ${study.tagline[locale]}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img
              src={study.image}
              alt={`${study.client} — ${study.tagline[locale]}`}
              width={1600}
              height={1066}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
          <Container className="absolute inset-x-0 bottom-0 pb-10 lg:pb-14">
            <Reveal>
              {/* HeroPill metrics, on-photo colours — white ink over the image. */}
              <span className="inline-flex items-center rounded-full border border-white/40 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                {dict.cases.pill}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-[13vw] font-medium leading-[0.92] tracking-tight text-white lg:text-[7rem]">
                {study.client}
              </h1>
            </Reveal>
            <Reveal delay={0.12} className="mt-5 flex flex-col items-start gap-6">
              <p className="max-w-xl text-base leading-relaxed text-white/85 lg:text-lg">{study.tagline[locale]}</p>
              <div className="flex flex-wrap gap-3">
                <PillButton href={linkTo(locale, "/contact")} variant="lavender">
                  {dict.common.contactUs}
                </PillButton>
                {/* A way back to the index from a case that was landed on
                    directly — previously the nav was the only exit. */}
                <PillButton href={linkTo(locale, "/caset")} variant="outlineLight">
                  {dict.common.allCases}
                </PillButton>
              </div>
            </Reveal>
          </Container>
        </div>
      </section>

      {/* Intro lede — deliberately tighter than the page rhythm, because the
          lede and the result pull-quote below it read as one opening unit. */}
      <section className="border-t border-black/5 pb-16 pt-16 lg:pb-20 lg:pt-20 dark:border-white/10">
        <Container>
          <Reveal className="max-w-3xl border-l-2 border-purple pl-6 lg:pl-8">
            <p className="text-xl font-medium leading-snug tracking-tight text-ink lg:text-2xl dark:text-white">
              {study.intro[locale]}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Pull-quote — the case's headline result, not a repeat of the hero line.
          Brand rule: a claim on this site resolves to a number, so the loudest
          type on the page is the figure itself. */}
      <Container className="pb-24 lg:pb-32">
        <Reveal>
          <figure className="rounded-card bg-purple px-8 py-16 text-center text-white sm:px-16 lg:py-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-yellow">
              {dict.cases.resultLabel}
            </p>
            <p className="mx-auto mt-6 max-w-4xl text-6xl font-medium leading-[1.05] tabular-nums tracking-[-0.06em] sm:text-8xl lg:text-stat">
              <CountUpStat
                value={study.kpi.value}
                decimals={study.kpi.decimals ?? 0}
                prefix={study.kpi.prefix}
                suffix={study.kpi.suffix}
                locale={locale}
              />
            </p>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-snug text-white/85 lg:text-xl">
              {study.kpi.label[locale]}
            </p>
            <figcaption className="mt-8 text-xs font-medium uppercase tracking-[0.14em] text-yellow">
              {study.client}
            </figcaption>
          </figure>
        </Reveal>
      </Container>

      {/* 1. Objectives / 2. Solution — editorial two-column narrative */}
      <Container className="pb-24 lg:pb-32">
        <div className="divide-y divide-black/10 dark:divide-white/10">
          {narrative.map((block) => (
            <Reveal
              key={block.heading}
              className="grid gap-5 py-10 first:pt-0 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-14"
            >
              <h2 className="text-3xl font-medium leading-[1.15] tracking-tight text-ink lg:text-4xl dark:text-white">
                {block.heading}
              </h2>
              <p className="max-w-2xl text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
                {block.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Methods */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <Reveal>
            <h2 className="text-3xl font-medium leading-[1.15] tracking-tight text-ink lg:text-4xl dark:text-white">
              {d.methods}
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-card-gap sm:grid-cols-3 lg:mt-12">
            {study.methods.map((m, i) => (
              <Reveal
                key={m[locale].title}
                as="li"
                delay={i * 0.08}
                className="flex h-full flex-col gap-5 rounded-card bg-grey/70 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10"
              >
                <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-yellow text-ink">
                  <Icon name={m.icon} style={{ fontSize: "28px" }} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-ink dark:text-white">{m[locale].title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/65 dark:text-white/65">{m[locale].body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 3. Results */}
      <Container className="pb-24 lg:pb-32">
        {/* Photo echo — same shot, wider crop, on a slow parallax: a visual
            breather before the numbers. Decorative duplicate, so alt="". */}
        <Reveal className="mb-16 aspect-[16/6] w-full overflow-hidden rounded-card lg:mb-20">
          <ParallaxImage src={study.image} />
        </Reveal>

        <Reveal className="grid gap-5 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-14">
          <h2 className="text-3xl font-medium leading-[1.15] tracking-tight text-ink lg:text-4xl dark:text-white">
            {d.results}
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
            {study.results[locale]}
          </p>
        </Reveal>

        <div className="mt-16 lg:mt-20">
          <StatGrid
            stats={study.metrics.map((m) => ({
              value: m.value,
              decimals: m.decimals,
              prefix: m.prefix,
              suffix: m.suffix,
              label: m.label[locale],
              // A year is not a quantity — no thousands separator on 2022.
              grouping: m.value !== 2022,
            }))}
            locale={locale}
            label={d.resultsInNumbers}
            columns={study.metrics.length % 3 === 0 ? 3 : 2}
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
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader heading={d.moreCases} body={dict.cases.body} cta={dict.common.allCases} ctaHref={linkTo(locale, "/caset")} />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {related.map((c) => (
              <CaseCard key={c.slug} study={c} locale={locale} ctaLabel={dict.common.readCase} />
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
