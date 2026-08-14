import type { CaseStudy } from "@/content/cases";
import type { Locale } from "@/i18n/config";
import { PhotoLinkCard } from "./PhotoLinkCard";

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
    <PhotoLinkCard
      href={`/${locale}/cases/${study.slug}`}
      image={study.image}
      alt={`${study.client} — ${study.tagline[locale]}`}
      title={study.client}
      body={study.summary[locale]}
      ctaLabel={readMoreLabel}
      large={large}
      clampBody
    />
  );
}
