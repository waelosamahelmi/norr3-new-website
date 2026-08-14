import Link from "next/link";
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
      <Reveal className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-14 lg:flex-row lg:items-start lg:justify-between lg:px-14 lg:py-16">
        {/* A full-width CTA band earns brand h3 (40px), not 24px. */}
        <h2 className="max-w-xl text-3xl font-medium leading-[1.15] tracking-[-0.015em] text-ink lg:text-h3">
          {heading}
        </h2>
        <div className="max-w-md">
          <p className="text-[15px] leading-relaxed text-ink/80">{body}</p>
          {/* next/link, not a bare <a> — a plain anchor dropped out of client
              routing and skipped the RouteWipe transition on every banner. */}
          <Link
            href={`/${locale}/contact`}
            className="mt-6 inline-flex items-center rounded-full border border-ink/60 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-[background-color,color,transform] duration-200 hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.97]"
          >
            {cta}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
