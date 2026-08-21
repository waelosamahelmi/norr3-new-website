import { Container } from "./Container";
import { PillButton } from "./PillButton";
import { Reveal } from "./Reveal";
import type { Locale } from "@/i18n/config";
import { linkTo } from "@/lib/links";

/**
 * The full-width contact band from the design — yellow mid-page, lavender
 * right before the footer. Heading left, copy + outlined CTA right.
 */
export function ContactBanner({
  locale,
  heading,
  body,
  cta,
  tone = "yellow",
}: {
  locale: Locale;
  heading: string;
  body: string;
  cta: string;
  tone?: "yellow" | "lavender";
}) {
  return (
    <section className={tone === "yellow" ? "bg-yellow" : "bg-pastel-purple/60 dark:bg-pastel-purple"}>
      <Container className="py-14 lg:py-16">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* A full-width CTA band earns brand h3 (40px), not 24px. */}
          <h2 className="max-w-xl text-3xl font-medium leading-[1.15] tracking-[-0.015em] text-ink lg:text-h3">
            {heading}
          </h2>
          <div className="max-w-md">
            <p className="text-[15px] leading-relaxed text-ink/80">{body}</p>
            <PillButton href={linkTo(locale, "/contact")} variant="outlineInk" className="mt-6">
              {cta}
            </PillButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
