import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo } from "@/lib/pageSeo";
import { getSiteContent } from "@/lib/cms";
import { imageSlot } from "@/content/imageSlots";
import { dashboardData, dataset } from "@/content/datasets";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { TriadLine } from "@/components/TriadLine";
import { ParallaxImage } from "@/components/ParallaxImage";
import { PillMarquee } from "@/components/marquee/PillMarquee";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { MediaMixSimulator } from "@/components/simulator/MediaMixSimulator";
import { DashboardMock } from "@/components/DashboardMock";
import { ContactBanner } from "@/components/ContactBanner";
import { CaseCard } from "@/components/cards/CaseCard";
import { StaggerGrid } from "@/components/StaggerGrid";
import { Icon } from "@/components/Icon";
import { MediaAsset } from "@/components/MediaAsset";
import { linkTo } from "@/lib/links";

export async function generateMetadata({ params }: PageProps<"/[locale]/engine">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("engine", locale, {
    title: dict.seo.engine.title,
    description: dict.seo.engine.description,
    image: "/images/brand/engine-team.webp",
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
      images: [{ url: seo.image, width: 1500, height: 1000, alt: "The team behind the NØRR3 Marketing Engine" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [seo.image] },
  };
}

export default async function EnginePage({ params }: PageProps<"/[locale]/engine">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  const workflowPhoto = imageSlot(content, "engine.workflow", locale, {
    src: "/images/brand/engine-workflow.webp",
    alt:
      locale === "fi"
        ? "NØRR3:n asiantuntija työskentelee Marketing Enginessä läppärillä"
        : "A NØRR3 specialist working in the Marketing Engine on a laptop",
  });
  // Decorative parallax band — alt stays empty unless someone sets one.
  const enginePhoto = imageSlot(content, "engine.team", locale, { src: "/images/brand/engine-team.webp" });
  const cases = content.cases;
  const { mediaPills } = content.brand;
  const e = dict.engine;

  const pills = mediaPills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }));
  const related = cases.filter((c) => ["st1", "kokkola", "flow-festival"].includes(c.slug));

  return (
    <>
      {/*
        Same section rhythm as Home and Services: a run of base-background
        sections opens with `pt-24 lg:pt-32` and every member closes with
        `pb-24 lg:pb-32`. Full-width bands (dashboard, simulator, LogoStrip,
        ContactBanner) bring their own padding and reset the run.
      */}

      {/* Hero */}
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{e.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={e.heroLeft}
          accent={e.heroAccent}
          className="mt-6 text-[9vw] leading-none lg:text-[6.5rem]"
        />
      </Container>
      <div className="mt-10 lg:mt-12">
        <PillMarquee items={pills} />
      </div>
      <Container className="pb-24 pt-12 lg:pb-32">
        {/* Promise + CTAs on the left, the product's proof line on the right —
            the triad is the page's claim, so it gets its own column instead of
            being buried in a paragraph. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <Reveal className="flex flex-col items-start gap-6">
            <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
              {e.heroBody}
            </p>
            <div className="flex flex-wrap gap-3">
              <PillButton href="#simulator">{dict.common.accessDemo}</PillButton>
              <PillButton href={linkTo(locale, "/contact")} variant="secondary">
                {dict.common.contactUs}
              </PillButton>
            </div>
          </Reveal>
          <TriadLine clauses={e.triad} className="text-3xl lg:text-4xl lg:text-right" />
        </div>
      </Container>

      {/* Product intro — people + feature list */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-card">
                <MediaAsset
                  src={workflowPhoto.src}
                  width={1600}
                  height={1066}
                  alt={workflowPhoto.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* "Built in-house, not licensed" — the caption the copy deck asks
                  for, previously written but never rendered on this page. */}
              <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-white/70">{e.workflow.caption}</p>
            </Reveal>
            <div>
              <h2 className="text-4xl font-medium leading-[1.1] tracking-tight text-ink lg:text-5xl dark:text-white">
                {e.product.heading}
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
                {e.product.body}
              </p>
              <ul className="mt-8 divide-y divide-black/10 dark:divide-white/10">
                {e.product.features.map((f, i) => (
                  <Reveal key={f.title} as="li" delay={i * 0.05} className="flex gap-6 py-6 first:pt-0">
                    {/* Violet tile + white icon — the brand icon-tile treatment,
                        identical in both themes (BRAND_GUIDELINES §5). */}
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
          </div>
        </Container>
      </section>

      {/* Product screenshot */}
      <section className="bg-pastel-purple/40 py-24 lg:py-32 dark:bg-white/[0.04]">
        <Container>
          <SectionHeader heading={e.demo.heading} body={e.demo.body} />
          <Reveal delay={0.1} className="mx-auto mt-14 max-w-5xl lg:mt-16">
            <DashboardMock locale={locale} labels={e.dashboard} data={dataset(content.datasets, "dashboard", locale, dashboardData)} />
            {/* Sample data, said plainly — evidence-first tone means labelling
                the mock instead of implying it is a live client account. */}
            <p className="mt-4 text-center text-xs text-ink/50 dark:text-white/50">{e.demo.note}</p>
          </Reveal>
        </Container>
      </section>

      {/* How Engine works — 3 numbered steps */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader heading={e.workflow.heading} />
          {/* A real ordered list, because the steps are a sequence — brief, then
              plan & buy, then prove. Reveal carries the stagger so the list
              stays an <ol>/<li> rather than a grid of divs. */}
          <ol className="mt-14 grid gap-card-gap sm:grid-cols-3 lg:mt-16">
            {e.workflow.steps.map((step, i) => (
              <Reveal
                key={step.title}
                as="li"
                delay={i * 0.08}
                className="flex h-full flex-col gap-5 rounded-card bg-pastel-purple/40 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-violet text-white">
                    <Icon name={step.icon} style={{ fontSize: "28px" }} />
                  </div>
                  {/* Purple, not yellow — same call as the services data cards:
                      yellow on a pastel ground reads poorly in light mode. */}
                  <span
                    aria-hidden
                    className="text-3xl font-medium text-purple dark:text-light-purple"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-ink dark:text-white">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/65 dark:text-white/65">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Interactive media-mix simulator — black band, per the design language.
          scroll-mt keeps the heading clear of the sticky nav on the #simulator jump. */}
      <section id="simulator" className="scroll-mt-24 bg-ink py-24 lg:py-32 dark:border-y dark:border-white/10">
        <Container>
          <SectionHeader heading={e.simulator.heading} body={e.simulator.body} tone="light" />
          <Reveal delay={0.1} className="mx-auto mt-14 max-w-5xl lg:mt-16">
            <MediaMixSimulator locale={locale} labels={e.simulator} channels={content.channels} />
          </Reveal>
        </Container>
      </section>

      {/* Case proof — the Kiinteistömaailma triad as a big pull-quote */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <Reveal>
            <figure className="rounded-card bg-purple px-8 py-16 text-center text-white sm:px-16 lg:py-20">
              <blockquote>
                <TriadLine
                  clauses={e.quote.clauses}
                  tone="light"
                  className="items-center text-3xl sm:text-5xl lg:text-6xl"
                />
              </blockquote>
              <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-white/80">{e.quote.body}</p>
              <figcaption className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-yellow">
                {e.quote.client}
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      {/* Book a demo — the page's conversion close, with parallax bg image */}
      <section className="relative overflow-hidden pb-24 lg:pb-32">
        <ParallaxImage
          src={enginePhoto.src}
          alt={enginePhoto.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-violet/85" />
        <Container className="relative z-10">
          <Reveal className="flex flex-col items-center gap-7 rounded-card bg-violet/90 px-8 py-16 text-center text-white ring-1 ring-white/10 backdrop-blur-sm sm:px-16 lg:py-20">
            <h2 className="max-w-2xl text-4xl font-medium leading-[1.1] tracking-tight lg:text-5xl">
              {e.bookDemo.heading}
            </h2>
            <p className="max-w-xl text-[15px] leading-relaxed text-white/80 lg:text-base">{e.bookDemo.body}</p>
            {/* What the 30 minutes actually contains — including "we'll say if
                you don't need us", the challenger candor line from the TOV. */}
            <ul className="flex flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-7">
              {e.bookDemo.points.map((p) => (
                <li key={p.label} className="flex items-center gap-2 text-sm text-white/85">
                  <Icon name={p.icon} className="text-[18px] text-yellow" />
                  {p.label}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap justify-center gap-3">
              <PillButton href={linkTo(locale, "/contact")} variant="lavender">{dict.common.bookDemo}</PillButton>
              <PillButton href="#simulator" variant="outlineLight">{dict.common.accessDemo}</PillButton>
            </div>
          </Reveal>
        </Container>
      </section>

      <LogoStrip clients={clients} locale={locale} />

      {/* Related cases */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader
            heading={dict.services.relatedCases}
            body={dict.cases.body}
            cta={dict.common.allCases}
            ctaHref={linkTo(locale, "/cases")}
          />
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
