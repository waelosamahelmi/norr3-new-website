import Link from "next/link";
import type { CaseStudy } from "@/content/cases";
import type { Locale } from "@/i18n/config";

/** Photo-led case card: image, client name, summary, outlined READ MORE. */
export function CaseCard({
  study,
  locale,
  readMoreLabel,
  large = false,
}: {
  study: CaseStudy;
  locale: Locale;
  readMoreLabel: string;
  large?: boolean;
}) {
  return (
    <Link href={`/${locale}/cases/${study.slug}`} className="group flex h-full flex-col">
      <div className={`overflow-hidden ${large ? "aspect-[4/3]" : "aspect-[4/3]"}`}>
        <img
          src={study.image}
          alt={study.client}
          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
      <h3 className={`mt-4 font-medium text-ink ${large ? "text-xl" : "text-base"}`}>{study.client}</h3>
      <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-ink/60">
        {study.summary[locale]}
      </p>
      <span className="mt-4 inline-flex w-fit items-center rounded-full border border-ink/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-ink transition-colors group-hover:bg-ink group-hover:text-white">
        {readMoreLabel}
      </span>
    </Link>
  );
}
