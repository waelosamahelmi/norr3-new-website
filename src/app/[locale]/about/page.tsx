import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo } from "@/lib/pageSeo";
import { getSiteContent } from "@/lib/cms";
import { imageSlot } from "@/content/imageSlots";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { TextCta } from "@/components/TextCta";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { PillMarquee } from "@/components/marquee/PillMarquee";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { TeamMarquee } from "@/components/TeamMarquee";
import { ContactBanner } from "@/components/ContactBanner";
import { StatGrid } from "@/components/StatGrid";
import { Icon } from "@/components/Icon";
import { MediaAsset } from "@/components/MediaAsset";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("about", locale, {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
    image: ogImage("/images/brand/group.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: linkTo(locale, "/about"), languages: { "fi-FI": "/about", "en-US": "/en/about" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/about")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 2000, height: 1333, alt: "The NØRR3 team in the Helsinki studio" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  // Alt falls back to the dictionary value this page already used.
  const storyPhoto = imageSlot(content, "about.story", locale, {
    src: "/images/brand/group.webp",
    alt: dict.about.story.photoAlt,
  });
  const { valuePills } = content.brand;
  const a = dict.about;

  const pills = valuePills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }));

  return (
    <>
      {/*
        Same section rhythm as Home / Services / Team: a run of base-background
        sections opens with `pt-24 lg:pt-32` and every member closes with
        `pb-24 lg:pb-32`; full-bleed bands reset the run.
      */}

      {/* Hero — no middle graphic here: the story section below carries the
          group photo, and a second visual in the fold would fight it. */}
      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{a.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={a.heroLeft}
          accent={a.heroAccent}
          className="mt-6 text-[9vw] leading-none lg:text-[6.5rem]"
        />
      </Container>
      <Container className="pb-24 pt-12 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {a.heroBody}
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <PillButton href={linkTo(locale, "/contact")}>{dict.common.contactUs}</PillButton>
            <PillButton href={linkTo(locale, "/careers")} variant="secondary">
              {dict.common.openJobs}
            </PillButton>
            <TextCta href={linkTo(locale, "/team")}>{dict.common.heroMeetTeam}</TextCta>
          </div>
        </Reveal>
      </Container>

      <LogoStrip clients={clients} locale={locale} />

      {/* The story — photo left, narrative right */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="overflow-hidden rounded-card">
              <MediaAsset
                src={storyPhoto.src}
                width={2000}
                height={1333}
                alt={storyPhoto.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </Reveal>
            <Reveal delay={0.05} className="flex flex-col items-start gap-6">
              <h2 className="text-4xl font-medium leading-[1.1] tracking-tight text-ink lg:text-5xl dark:text-white">
                {a.story.heading}
              </h2>
              <p className="text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
                {a.story.body}
              </p>
              <div className="space-y-5">
                {a.story.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-xl text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values — the home page's value pills, then the four principles */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={a.values.heading} body={a.values.body} />
        </Container>
        <div className="mt-14 lg:mt-16">
          <PillMarquee items={pills} />
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={a.principles.heading} body={a.principles.body} />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {a.principles.items.map((p) => (
              <div
                key={p.title}
                className="flex h-full flex-col gap-6 rounded-card bg-grey/70 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10"
              >
                {/* Violet tile + white icon — the brand icon-tile treatment,
                    identical in both themes. */}
                <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name={p.icon} style={{ fontSize: "28px" }} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-ink dark:text-white">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/65 dark:text-white/65">{p.body}</p>
                </div>
              </div>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* Big numbers */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <StatGrid stats={a.stats.items.map((s) => ({ ...s }))} locale={locale} label={a.stats.heading} />
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={dict.banner.heading}
        body={dict.banner.body}
        cta={dict.common.contactUs}
        tone="yellow"
      />

      {/* Team teaser — the sliding roster, with the full team one click away */}
      <section className="pb-24 pt-24 lg:pb-32 lg:pt-32">
        <Container>
          <SectionHeader heading={a.team.heading} body={a.team.body} />
        </Container>
        <div className="mt-14 lg:mt-16">
          <TeamMarquee locale={locale} members={content.team} />
        </div>
        <Container className="mt-12 flex justify-center">
          <PillButton href={linkTo(locale, "/team")}>{dict.common.meetTeam}</PillButton>
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
