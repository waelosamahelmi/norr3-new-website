import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionary";
import { pageSeo } from "@/lib/pageSeo";
import { getSiteContent } from "@/lib/cms";
import { imageSlot } from "@/content/imageSlots";
import { Container, HeroPill } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { LeadContactCard } from "@/components/cards/LeadContactCard";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { PillButton } from "@/components/PillButton";
import { Icon } from "@/components/Icon";

/** The five people who take direct contact on this page. The rest of the
 *  roster lives on /team — this row is a routing aid, not a second roster. */
const LEAD_CONTACT_NAMES = [
  "Antti Ujainen",
  "Maria Malila",
  "Marika Salovaara",
  "Anne-Mari Lahtinen",
  "Karoliina Mäkelä",
];

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // CMS-owned SEO for this route, falling back to the dictionary entry and the
  // page's own social image so an untouched row changes nothing.
  const seo = await pageSeo("contact", locale, {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
    image: "/images/brand/group.webp",
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { "fi-FI": "/fi/contact", "en-US": "/en/contact" },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/contact`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: seo.image,
          width: 1200,
          height: 800,
          alt: dict.contact.photoAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = await getSiteContent();
  const { clients } = content.brand;
  const dict = content.dictionaries[locale];
  const contactPhoto = imageSlot(content, "contact.portrait", locale, {
    src: "/images/brand/group.webp",
    alt: dict.contact.photoAlt,
  });
  const team = content.team;

  // Ordered by the list above, not by roster order, and silently skipping a
  // name that ever leaves team.ts rather than rendering a hole.
  const leadContacts = LEAD_CONTACT_NAMES.map((name) =>
    team.find((m) => m.name === name),
  ).filter((m) => m !== undefined);

  return (
    <>
      {/* Yellow hero band, echoing the design's contact banner. The
          response-time promise sits here rather than under the Send button —
          the reassurance is worth more before someone starts typing. */}
      <section className="bg-yellow">
        <Container className="py-20 lg:py-28">
          <Reveal>
            {/* The hero band stays yellow in dark mode, so the pill keeps its purple ink. */}
            <HeroPill onLight>{dict.contact.pill}</HeroPill>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 text-[10vw] font-medium leading-[0.95] tracking-tight text-ink lg:text-[6.5rem]">
              {dict.contact.heading}
            </h1>
          </Reveal>
          <Reveal delay={0.15} className="mt-6 flex flex-col items-start gap-6">
            <p className="max-w-xl text-[15px] leading-relaxed text-ink/80 lg:text-base">{dict.contact.body}</p>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-medium text-ink/80">
              <Icon name="schedule" style={{ fontSize: "16px" }} />
              {dict.contact.responseTime}
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="pb-24 pt-16 lg:pb-32 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <Reveal>
            {/* Human face before the details — dims reserved so nothing shifts */}
            <div className="aspect-[3/2] w-full overflow-hidden rounded-card">
              <img
                src={contactPhoto.src}
                alt={contactPhoto.alt}
                width={1200}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            <h2 className="mt-10 text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">
              {dict.contact.directHeading}
            </h2>
            {/* Labelled email/phone rows: the two things people came for read as
                one pair instead of a headline and an orphan line under it. */}
            <ul className="mt-6 space-y-3">
              {[
                {
                  href: "mailto:info@norr3.fi",
                  icon: "mail",
                  label: dict.common.email,
                  value: dict.footer.email,
                },
                {
                  href: "tel:+358468100118",
                  icon: "call",
                  label: dict.contact.phoneLabel,
                  value: dict.footer.phone,
                },
              ].map((row) => (
                <li key={row.href}>
                  <a
                    href={row.href}
                    className="group flex items-center gap-4 rounded-card p-3 transition-colors hover:bg-grey/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:hover:bg-white/[0.06] dark:focus-visible:outline-light-purple"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-purple text-white">
                      <Icon name={row.icon} style={{ fontSize: "20px" }} />
                    </span>
                    <span>
                      <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
                        {row.label}
                      </span>
                      <span className="block text-lg font-medium text-ink transition-colors group-hover:text-purple dark:text-white dark:group-hover:text-light-purple">
                        {row.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Static office card — no map embed, so no third-party keys or layout shift */}
            <div className="mt-8 rounded-card bg-light-purple p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name="location_on" style={{ fontSize: "22px" }} />
                </span>
                <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-ink/70 dark:text-white/70">
                  {dict.contact.locationHeading}
                </h3>
              </div>
              <address className="mt-5 space-y-1 text-[15px] not-italic leading-relaxed text-ink/80 dark:text-white/80">
                {dict.footer.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Pursimiehenkatu+26+C%2C+00150+Helsinki"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-ink/40 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/40 dark:text-white dark:hover:bg-white dark:hover:text-ink dark:focus-visible:outline-light-purple"
              >
                {dict.contact.mapLink}
                <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
              </a>
            </div>

            <div className="mt-8 space-y-1 text-sm text-ink/60 dark:text-white/60">
              {dict.footer.companyLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">
              {dict.contact.formHeading}
            </h2>
            <div className="mt-6">
              <ContactForm dict={dict.contact} locale={locale} />
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink/55 dark:text-white/55">
              <Icon name="lock" style={{ fontSize: "16px" }} />
              <span>
                {dict.contact.privacyNote}{" "}
                <Link
                  href={`/${locale}/privacy`}
                  className="rounded-sm font-medium text-purple underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-light-purple dark:focus-visible:outline-light-purple"
                >
                  {dict.footer.privacy}
                </Link>
              </span>
            </p>
          </Reveal>
        </div>
      </Container>

      {/* Lead contacts — the five people worth reaching directly. The full
          roster stays on /team so this page keeps one job. */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <SectionHeader heading={dict.contact.leads.heading} body={dict.contact.leads.body} />
          <StaggerGrid className="mt-14 grid gap-card-gap sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-5">
            {leadContacts.map((member) => (
              <LeadContactCard
                key={member.id}
                member={member}
                locale={locale}
                emailLabel={dict.common.email}
                linkedinLabel={dict.common.linkedin}
              />
            ))}
          </StaggerGrid>
          <Reveal className="mt-12 flex justify-center">
            <PillButton href={`/${locale}/team`} variant="secondary">
              {dict.contact.leads.fullTeam}
            </PillButton>
          </Reveal>
        </Container>
      </section>

      <LogoStrip clients={clients} />
    </>
  );
}
