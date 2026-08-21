import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo } from "@/lib/pageSeo";
import { getSiteContent } from "@/lib/cms";
import { imageSlot } from "@/content/imageSlots";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { BenefitCard } from "@/components/cards/BenefitCard";
import { PhotoInterstitial } from "@/components/PhotoInterstitial";
import { ContactBanner } from "@/components/ContactBanner";
import { Icon } from "@/components/Icon";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";

export async function generateMetadata({ params }: PageProps<"/[locale]/careers">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("careers", locale, {
    title: dict.seo.careers.title,
    description: dict.seo.careers.description,
    image: ogImage("/images/brand/team-energy.webp"),
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: linkTo(locale, "/careers"), languages: { "fi-FI": "/careers", "en-US": "/en/careers" } },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale, "/careers")}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage(seo.image), width: 1600, height: 1066, alt: "The NØRR3 team celebrating a shared achievement" }],
    },
    twitter: { card: "summary_large_image" as const, title: seo.title, description: seo.description, images: [ogImage(seo.image)] },
  };
}

export default async function CareersPage({ params }: PageProps<"/[locale]/careers">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const dict = content.dictionaries[locale];
  const careersValuesPhoto = imageSlot(content, "careers.values", locale, {
    src: "/images/brand/team-energy.webp",
    alt:
      locale === "fi"
        ? "NØRR3-tiimi juhlii yhteistä saavutusta"
        : "The NØRR3 team celebrating a shared achievement",
  });
  const openRoles = content.openRoles;
  const { valuePills } = content.brand;
  const c = dict.careers;

  return (
    <>
      {/* Same section rhythm as the other interior pages: opener
          `pt-12 lg:pt-20`, members close `pb-24 lg:pb-32`, bands reset. */}

      <Container className="pt-12 lg:pt-20">
        <Reveal>
          <HeroPill>{c.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={c.heroLeft}
          accent={c.heroAccent}
          className="mt-6 text-[9vw] leading-none lg:text-[6.5rem]"
        />
      </Container>
      <Container className="pb-24 pt-12 lg:pb-32">
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {c.heroBody}
          </p>
          <div className="flex flex-wrap gap-3">
            {/* Full path + hash, like the team page's roles CTA, so the link
                resolves the same whether it is clicked or copied. */}
            <PillButton href={linkTo(locale, "/careers#open-roles")}>{dict.common.openJobs}</PillButton>
            <PillButton href={linkTo(locale, "/about")} variant="secondary">
              {c.culture.cta}
            </PillButton>
          </div>
        </Reveal>
      </Container>

      {/* Open roles — the same yellow role card as the team page, so a role
          reads identically wherever someone meets it. */}
      <section id="open-roles" className="scroll-mt-24 pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={c.roles.heading} body={c.roles.body} />
          <Reveal delay={0.05} className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 text-center">
            <Icon name="drafts" className="text-purple dark:text-light-purple" style={{ fontSize: "18px" }} />
            <p className="text-[15px] font-medium text-ink/80 dark:text-white/80">{c.roles.candor}</p>
          </Reveal>
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-3 lg:mt-16">
            {openRoles.map((role) => (
              <Link
                key={role.id}
                href={linkTo(locale, "/contact")}
                className="group flex h-full flex-col rounded-card bg-yellow p-8 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple"
              >
                <span className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-white/60 text-ink">
                  <Icon name="work" style={{ fontSize: "28px" }} />
                </span>
                <h3 className="mt-8 text-lg font-medium leading-snug text-ink">{role.title[locale]}</h3>
                <p className="mt-1.5 text-sm text-ink/70">{role.location[locale]}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-8 text-xs font-medium uppercase tracking-[0.08em] text-ink transition-transform group-hover:translate-x-0.5">
                  {c.roles.apply} <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <Container className="pb-24 lg:pb-32">
        <PhotoInterstitial
          image={careersValuesPhoto.src}
          alt={careersValuesPhoto.alt}
          pills={valuePills.map((p) => ({ id: p.id, icon: p.icon, label: p[locale] }))}
        />
      </Container>

      {/* Culture — the blurb plus the route into the About Us page */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader
            heading={c.culture.heading}
            body={c.culture.body}
            cta={c.culture.cta}
            ctaHref={linkTo(locale, "/about")}
          />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {c.culture.benefits.map((b) => (
              <BenefitCard key={b.title} icon={b.icon} title={b.title} body={b.body} />
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
