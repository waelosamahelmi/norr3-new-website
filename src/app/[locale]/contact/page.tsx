import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { LogoStrip } from "@/components/marquee/LogoStrip";

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
            <HeroPill>{dict.contact.pill}</HeroPill>
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
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50">
              {dict.contact.directHeading}
            </p>
            <a
              href="mailto:info@norr3.fi"
              className="mt-4 block text-2xl font-medium text-purple hover:underline"
            >
              info(at)norr3.fi
            </a>
            <p className="mt-1 text-lg text-ink/80">{dict.footer.phone}</p>
            <div className="mt-8 space-y-1 text-sm text-ink/60">
              {dict.footer.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {dict.footer.companyLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm dict={dict.contact} />
          </Reveal>
        </div>
      </Container>

      <LogoStrip />
    </>
  );
}
