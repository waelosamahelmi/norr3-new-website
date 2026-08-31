import { getDictionary } from "@/lib/dictionary";
import { linkTo } from "@/lib/links";
import type { Locale } from "@/i18n/config";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactBanner } from "@/components/ContactBanner";
import { Icon } from "@/components/Icon";
import { servicePageLocalised, servicePages, type ServicePage } from "@/content/servicePages";

/**
 * A keyword-optimised service landing page, rendered at a root slug
 * (`/hakukoneoptimointi`, `/mediasuunnittelu` …) via the [...slug] catch-all.
 */
export async function ServiceLandingView({ page, locale }: { page: ServicePage; locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = servicePageLocalised(page, locale);
  const related = servicePages.filter((p) => p.slug !== page.slug);

  return (
    <>
      <Container className="pt-12 lg:pt-16">
        <Reveal>
          <HeroPill>{t.title}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={t.heroLeft}
          accent={t.heroAccent}
          className="mt-6 text-[8vw] leading-none lg:text-[5.5rem]"
        />
        <Reveal delay={0.1} className="mt-8 flex flex-col items-start gap-6">
          <p className="max-w-xl text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">{t.intro}</p>
          <div className="flex flex-wrap items-center gap-3">
            <PillButton href={linkTo(locale, "/contact")}>{dict.common.contactUs}</PillButton>
            <PillButton href={linkTo(locale, "/services")} variant="secondary">
              {dict.common.allServices}
            </PillButton>
          </div>
        </Reveal>
      </Container>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
            {/* Content column */}
            <div className="space-y-12">
              {t.sections.map((section, i) => (
                <Reveal key={section.heading} delay={i * 0.05}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-2xl font-medium leading-tight tracking-tight text-ink lg:text-3xl dark:text-white">
                    {section.heading}
                  </h2>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/70 dark:text-white/70">{section.body}</p>
                </Reveal>
              ))}
            </div>

            {/* Photo + checklist column — sticky, never taller than the viewport */}
            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {page.image && (
                <Reveal delay={0.05}>
                  <div className="overflow-hidden rounded-card ring-1 ring-black/5 dark:ring-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.image}
                      alt={t.title}
                      width={800}
                      height={500}
                      loading="lazy"
                      className="max-h-[420px] w-full object-cover"
                    />
                  </div>
                </Reveal>
              )}
              <Reveal delay={0.1}>
                <div className="rounded-card bg-pastel-purple/60 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
                  <h3 className="text-lg font-medium text-ink dark:text-white">{dict.common.whatYouGet}</h3>
                  <ul className="mt-5 space-y-3">
                    {t.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/75 dark:text-white/75">
                        <Icon name="check" className="mt-[2px] shrink-0 text-[16px] text-purple dark:text-light-purple" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Related services — internal links for SEO + navigation */}
      <section className="pb-16 lg:pb-20">
        <Container>
          <SectionHeader heading={dict.services.relatedCases} body={dict.services.areas.body} />
          <Reveal className="mt-10 flex flex-wrap gap-3">
            {related.map((p) => {
              const pt = servicePageLocalised(p, locale);
              return (
                <a
                  key={p.slug}
                  href={linkTo(locale, `/${p.slug}`)}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/25 bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-ink"
                >
                  <Icon name={p.icon} style={{ fontSize: "18px" }} />
                  {pt.title}
                </a>
              );
            })}
          </Reveal>
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
