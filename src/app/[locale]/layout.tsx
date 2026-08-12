import { notFound } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { RouteWipe } from "@/components/RouteWipe";
import { HtmlLangSync } from "@/components/HtmlLangSync";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.meta.title, description: dict.meta.description };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <MotionConfig reducedMotion="user">
      <HtmlLangSync locale={locale} />
      <SmoothScroll />
      <RouteWipe />
      <Nav locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
    </MotionConfig>
  );
}
