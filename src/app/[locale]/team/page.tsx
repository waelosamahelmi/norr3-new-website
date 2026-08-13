import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamMarquee } from "@/components/TeamMarquee";
import { CultureCard } from "@/components/cards/CultureCard";
import { TeamMemberCard, ViewAllTile } from "@/components/cards/TeamMemberCard";
import { PhotoInterstitial } from "@/components/PhotoInterstitial";
import { ContactBanner } from "@/components/ContactBanner";
import { StatGrid } from "@/components/StatGrid";
import { CountUpStat } from "@/components/CountUpStat";
import { Icon } from "@/components/Icon";
import { valuePills } from "@/content/services";
import { team, openRoles } from "@/content/team";

export async function generateMetadata({ params }: PageProps<"/[locale]/team">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.seo.team.title,
    description: dict.seo.team.description,
    alternates: { canonical: `/${locale}/team`, languages: { "fi-FI": "/fi/team", "en-US": "/en/team" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/team`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: dict.seo.team.title,
      description: dict.seo.team.description,
      images: [{ url: "/images/brand/group.webp", width: 2000, height: 1333, alt: "The NØRR3 team in the Helsinki studio" }],
    },
    twitter: { card: "summary_large_image" as const, title: dict.seo.team.title, description: dict.seo.team.description, images: ["/images/brand/group.webp"] },
  };
}

export default async function TeamPage({ params }: PageProps<"/[locale]/team">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.team;

  const inNumbers = [
    { value: 360, suffix: "°", label: locale === "fi" ? "Strategisesti aktiivinen insight- ja mediatoimisto" : "A strategically active insight and media agency" },
    { value: 2019, grouping: false, label: locale === "fi" ? "Perustettu" : "Founded" },
    { value: 14, label: locale === "fi" ? "Vakituista omaa työntekijää, kaikki kokeneita ja lähes kaikki partnereita" : "Permanent employees — all experienced, nearly all partners" },
    { value: 88, label: "NPS (05/2024)" },
    { value: 800, suffix: "+", label: locale === "fi" ? "Ammattilaista tukena ympäri maailmaa" : "Professionals supporting us worldwide" },
    { value: 11, suffix: " M€", label: locale === "fi" ? "Liikevaihtomme 2024" : "Our revenue 2024" },
  ];

  const pillarAlts = locale === "fi"
    ? [
        "NØRR3:n kollegat vilkkaassa keskustelussa neuvotteluhuoneessa Helsingin studiolla",
        "Kaksi NØRR3:n asiantuntijaa analysoi kampanjadataa iMacilla yhdessä",
        "NØRR3:n tiimi nauramassa yhdessä studion loungen sohvalla",
      ]
    : [
        "NØRR3 colleagues in a lively meeting-room discussion in the Helsinki studio",
        "Two NØRR3 specialists analysing campaign data on an iMac together",
        "NØRR3 team laughing together on the studio lounge sofa",
      ];

  return (
    <>
      {/* Hero — headline + always-sliding team strip */}
      <Container className="pt-10 lg:pt-16">
        <Reveal>
          <HeroPill>{t.pill}</HeroPill>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-5 text-[8vw] font-medium leading-none tracking-tight text-ink lg:text-[5.5rem]">
            {t.heroHeadline}
          </h1>
        </Reveal>
      </Container>
      <div className="mt-10">
        <TeamMarquee locale={locale} />
      </div>
      <Container className="pb-16 pt-10">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-sm whitespace-pre-line text-sm leading-relaxed text-ink/80">{t.heroBody}</p>
          <PillButton href={`/${locale}/contact`}>{dict.common.contactUs}</PillButton>
        </Reveal>
      </Container>

      {/* Intro + pillars */}
      <section className="border-t border-black/5 py-20">
        <Container>
          <SectionHeader heading={t.intro.heading} body={t.intro.body} />
          <div className="mt-16 space-y-20">
            {t.pillars.map((pillar, i) => (
              <Reveal key={pillar.title} className="grid items-start gap-10 lg:grid-cols-2">
                <div className={`aspect-[4/3] overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <img
                    src={["/images/brand/team-attitude.webp", "/images/brand/team-technology.webp", "/images/brand/team-talent.webp"][i]}
                    alt={pillarAlts[i]}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex h-full flex-col">
                  <h3 className="text-3xl font-medium tracking-tight text-ink lg:text-4xl">{pillar.title}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70">{pillar.body}</p>
                  <div className={`mt-auto grid gap-8 pt-10 ${pillar.stats.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
                    {pillar.stats.map((s) => (
                      <div key={s.label} className="border-t border-black/20 pt-2">
                        <p className="text-3xl font-medium tracking-tight text-ink lg:text-4xl">
                          <CountUpStat value={s.value} suffix={"suffix" in s ? s.suffix : undefined} locale={locale} />
                        </p>
                        <p className="mt-1 text-[11px] text-ink/60">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-24">
            <StatGrid stats={inNumbers} locale={locale} label={dict.common.inNumbers} />
          </div>
        </Container>
      </section>

      {/* Culture */}
      <section className="pb-20">
        <Container>
          <SectionHeader heading={t.culture.heading} body={t.culture.body} />
          <StaggerGrid className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.culture.principles.map((p, i) => (
              <CultureCard
                key={p.title}
                number={String(i + 1).padStart(2, "0")}
                icon={p.icon}
                title={p.title}
                body={p.body}
              />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <Container className="pb-20">
        <PhotoInterstitial
          image="/images/brand/team-space.webp"
          alt={locale === "fi" ? "NØRR3:n studion avoin lounge pehmeässä iltavalossa" : "The NØRR3 studio open lounge in soft evening light"}
          caption={t.valuesCaption}
          pills={valuePills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }))}
        />
      </Container>

      {/* Management team */}
      <section className="pb-20">
        <Container>
          <SectionHeader heading={t.management.heading} body={t.management.body} />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <TeamMemberCard
                key={m.id}
                member={m}
                locale={locale}
                linkedinLabel={dict.common.linkedin}
                emailLabel={dict.common.email}
              />
            ))}
            <ViewAllTile title={t.management.viewAllTitle} body={t.management.viewAllBody} />
          </StaggerGrid>
        </Container>
      </section>

      {/* Open roles */}
      <section className="pb-20">
        <Container>
          <SectionHeader heading={t.openRoles.heading} body={t.openRoles.body} />
          <StaggerGrid className="mt-14 grid gap-5 sm:grid-cols-3">
            {openRoles.map((role) => (
              <a
                key={role.id}
                href={`/${locale}/contact`}
                className="group flex h-full flex-col gap-3 bg-yellow p-7 transition-transform duration-300 hover:-translate-y-1"
              >
                <Icon name="work" className="text-[28px] text-ink/80" />
                <h3 className="text-lg font-medium leading-snug text-ink">{role.title[locale]}</h3>
                <p className="text-sm text-ink/70">{role.location[locale]}</p>
                <span className="mt-auto inline-flex items-center gap-1 border-t border-ink/30 pt-3 text-xs font-medium text-ink transition-transform group-hover:translate-x-0.5">
                  {t.openRoles.apply} <span aria-hidden>→</span>
                </span>
              </a>
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
