import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { LegalArticle } from "@/components/LegalArticle";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.seo.privacy.title,
    description: dict.seo.privacy.description,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { "fi-FI": "/fi/privacy", "en-US": "/en/privacy" },
    },
    openGraph: {
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi/${locale}/privacy`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: dict.seo.privacy.title,
      description: dict.seo.privacy.description,
      images: [
        {
          url: "/images/brand/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "The NØRR3 team in the Helsinki studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: dict.seo.privacy.title,
      description: dict.seo.privacy.description,
      images: ["/images/brand/og-image.jpg"],
    },
  };
}

/*
 * TEMPLATE COPY — the wording lives in dictionary.ts under `legal.privacy` and
 * is a structured placeholder for a Finnish marketing agency. It must be
 * reviewed by legal counsel before this page goes live.
 */
export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const legal = dict.legal;

  return (
    <LegalArticle
      pill={legal.privacy.pill}
      heading={legal.privacy.heading}
      intro={legal.privacy.intro}
      updatedLabel={legal.updatedLabel}
      updated={legal.privacy.updated}
      tocLabel={legal.tocLabel}
      sections={legal.privacy.sections}
      relatedLabel={legal.relatedLabel}
      relatedLinks={[
        { href: `/${locale}/terms`, label: dict.footer.terms },
        { href: `/${locale}/contact`, label: dict.common.contactUs },
      ]}
      reviewNote={legal.reviewNote}
    />
  );
}
