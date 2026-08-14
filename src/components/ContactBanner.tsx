import { Reveal } from "./Reveal";
import type { Locale } from "@/i18n/config";

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
      <Reveal className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 py-12 lg:flex-row lg:items-start lg:justify-between lg:px-14">
        <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl">{heading}</h2>
        <div className="max-w-md">
          <p className="text-sm leading-relaxed text-ink/80">{body}</p>
          <a
            href={`/${locale}/contact`}
            className="mt-5 inline-flex items-center rounded-full border border-ink/60 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white"
          >
            {cta}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
