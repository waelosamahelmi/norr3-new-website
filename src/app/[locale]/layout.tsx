import { notFound } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { getSiteContent } from "@/lib/cms";
import { pageSeo } from "@/lib/pageSeo";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { RouteWipe } from "@/components/RouteWipe";
import { HtmlLangSync } from "@/components/HtmlLangSync";
import { CookieConsent } from "@/components/CookieConsent";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MotionSettingsProvider } from "@/components/MotionSettingsProvider";
import { linkTo } from "@/lib/links";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  // The home route's SEO, owned by the CMS Pages screen.
  const seo = await pageSeo("home", locale, {
    title: dict.meta.title,
    description: dict.meta.description,
    image: "/images/brand/og-image.jpg",
  });
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: linkTo(locale),
      languages: { "fi-FI": "/", "en-US": "/en" },
    },
    openGraph: {
      // Metadata is merged shallowly, so this object replaces the root
      // layout's openGraph — type/siteName/images must be repeated here.
      type: "website" as const,
      siteName: "NØRR3",
      url: `https://norr3.fi${linkTo(locale)}`,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: seo.image,
          width: 1200,
          height: 630,
          alt: "The NØRR3 team in the Helsinki studio",
        },
      ],
    },
    twitter: {
      // Shallow-merged like openGraph — repeat the card + image and localize
      // title/description so /fi doesn't inherit the root's English strings.
      card: "summary_large_image" as const,
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = await getSiteContent();
  const dict = content.dictionaries[locale];

  return (
    // reducedMotion="user" is not configurable: the OS setting always wins over
    // whatever is set in the CMS.
    <MotionConfig reducedMotion="user">
      <MotionSettingsProvider value={content.motion}>
      {/* Keyboard users otherwise cross ~16 tab stops of chrome per page. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus:bg-purple dark:focus-visible:outline-light-purple"
      >
        {dict.common.skipToContent}
      </a>
      {/* Sits in normal flow above the sticky nav, so it scrolls away. */}
      <AnnouncementBar
        locale={locale}
        dict={dict.announcement}
        message={content.announcement?.message[locale]}
        href={content.announcement?.href || "/engine"}
      />
      <HtmlLangSync locale={locale} />
      <SmoothScroll />
      <RouteWipe />
      <Nav locale={locale} dict={dict} menu={content.nav.header} logo={content.brand.logo} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer locale={locale} dict={dict} logo={content.brand.logo} />
      <CookieConsent dict={dict.cookies} locale={locale} />
      </MotionSettingsProvider>
    </MotionConfig>
  );
}
