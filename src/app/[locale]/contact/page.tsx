import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { Icon } from "@/components/Icon";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { "fi-FI": "/fi/contact", "en-US": "/en/contact" },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/contact`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: dict.seo.contact.title,
      description: dict.seo.contact.description,
      images: [
        {
          url: "/images/brand/contact-portrait.webp",
          width: 1200,
          height: 800,
          alt: dict.contact.photoAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: dict.seo.contact.title,
      description: dict.seo.contact.description,
      images: ["/images/brand/contact-portrait.webp"],
    },
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      {/* Yellow hero band, echoing the design's contact banner */}
      <section className="bg-yellow">
        <Container className="py-16 lg:py-20">
          <Reveal>
            {/* The hero band stays yellow in dark mode, so the pill keeps its purple ink. */}
            <HeroPill onLight>{dict.contact.pill}</HeroPill>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 text-[10vw] font-medium leading-none tracking-tight text-ink lg:text-[6.5rem]">
              {dict.contact.heading}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/80">{dict.contact.body}</p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <Reveal>
            {/* Human face before the details — dims reserved so nothing shifts */}
            <div className="mb-8 aspect-[3/2] w-full overflow-hidden rounded-[25px]">
              <img
                src="/images/brand/contact-portrait.webp"
                alt={dict.contact.photoAlt}
                width={1200}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
              {dict.contact.directHeading}
            </p>
            <a
              href="mailto:info@norr3.fi"
              className="mt-4 block text-2xl font-medium text-purple hover:underline dark:text-light-purple"
            >
              info(at)norr3.fi
            </a>
            <p className="mt-1 text-lg text-ink/80 dark:text-white/80">{dict.footer.phone}</p>
            <div className="mt-8 space-y-1 text-sm text-ink/60 dark:text-white/60">
              {dict.footer.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {dict.footer.companyLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            {/* Static office card — no map embed, so no third-party keys or layout shift */}
            <div className="mt-8 rounded-[25px] bg-light-purple p-7 dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name="location_on" style={{ fontSize: "22px" }} />
                </span>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-ink/70 dark:text-white/70">
                  {dict.contact.locationHeading}
                </p>
              </div>
              <div className="mt-4 space-y-1 text-[15px] text-ink/80 dark:text-white/80">
                {dict.footer.addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm dict={dict.contact} />
            <p className="mt-4 flex items-center gap-2 text-xs text-ink/55 dark:text-white/55">
              <Icon name="schedule" style={{ fontSize: "16px" }} />
              {dict.contact.responseTime}
            </p>
          </Reveal>
        </div>
      </Container>

      <LogoStrip />
    </>
  );
}
