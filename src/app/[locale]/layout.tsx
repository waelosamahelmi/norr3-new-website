import { notFound } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { Host_Grotesk } from "next/font/google";
import "material-symbols/outlined.css";
import "../globals.css";
import { ThemeStyle } from "@/components/ThemeStyle";
import { CustomBodyEnd, CustomHead } from "@/components/CustomCode";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { getSiteContent } from "@/lib/cms";
import { pageSeo, robotsDirective } from "@/lib/pageSeo";
import { linkTo } from "@/lib/links";
import { ogImage } from "@/lib/ogImage";
import { isProductionHost } from "@/lib/host";
import { headers } from "next/headers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { RouteWipe } from "@/components/RouteWipe";
import { CookieConsent } from "@/components/CookieConsent";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Analytics } from "@/components/Analytics";
import { MotionSettingsProvider } from "@/components/MotionSettingsProvider";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin", "latin-ext"],
});

/**
 * Runs before first paint so the stored theme is on <html> ahead of hydration —
 * without it the page paints light, then snaps to dark (FOUC). Kept
 * dependency-free and tiny on purpose; it ships inside every document.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem("norr3-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

/**
 * The locale segment IS the root layout: every page request routes through it
 * (the proxy rewrites root-level paths to `/fi/…`), and nothing outside it
 * renders a document — the rest are route handlers and metadata files. That
 * keeps `<html lang>` correct per locale in the SSR output crawlers see, which
 * the old root-layout setup could not do (it had no access to the locale).
 */
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
  const homeUrl = `https://norr3.fi${linkTo(locale)}`;
  // Non-production hosts (staging, raw IP) must be noindexed even if a crawler
  // ignores robots.txt — the DNS cutover has not happened yet.
  const prod = isProductionHost((await headers()).get("host"));
  return {
    metadataBase: new URL("https://norr3.fi"),
    applicationName: "NØRR3",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
    robots: prod ? robotsDirective(seo.robots) : { index: false, follow: false },
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical || linkTo(locale),
      languages: { "fi-FI": "/", "en-US": "/en" },
    },
    openGraph: {
      // Metadata is merged shallowly, so this object replaces the root
      // layout's openGraph — type/siteName/images must be repeated here.
      type: "website" as const,
      siteName: "NØRR3",
      url: homeUrl,
      locale: locale === "fi" ? "fi_FI" : "en_US",
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: ogImage(seo.image),
          width: 1200,
          height: 630,
          alt: "The NØRR3 team in the Helsinki studio",
        },
      ],
    },
    twitter: {
      // Shallow-merged like openGraph — repeat the card + image and localize
      // title/description so the Finnish pages don't inherit English strings.
      card: "summary_large_image" as const,
      title: seo.title,
      description: seo.description,
      images: [ogImage(seo.image)],
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
    // suppressHydrationWarning: the theme script mutates <html>'s class list
    // before React hydrates, so the client class never matches the SSR one.
    <html
      lang={locale}
      className={`${hostGrotesk.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Google Search Console site verification — content owned by the CMS. */}
        {content.integrations.gsc && (
          <meta name="google-site-verification" content={content.integrations.gsc} />
        )}
        {/* Design-token overrides from the CMS, after the stylesheet so they win. */}
        <ThemeStyle />
        {/* Admin-written CSS and head snippet, after the tokens so it can override them. */}
        <CustomHead />
      </head>
      <body className="min-h-full flex flex-col bg-offwhite text-ink dark:bg-background dark:text-foreground">
        {/* reducedMotion="user" is not configurable: the OS setting always wins over
            whatever is set in the CMS. */}
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
          <SmoothScroll />
          <RouteWipe />
          <Nav locale={locale} dict={dict} menu={content.nav.header} logo={content.brand.logo} />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer locale={locale} dict={dict} logo={content.brand.logo} />
          <CookieConsent dict={dict.cookies} locale={locale} />
          {/* GA4, gated on cookie consent (see the component). */}
          <Analytics ga4={content.integrations.ga4} />
          </MotionSettingsProvider>
        </MotionConfig>
        <CustomBodyEnd />
      </body>
    </html>
  );
}
