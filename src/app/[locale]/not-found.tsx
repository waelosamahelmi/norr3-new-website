import Link from "next/link";
import { headers } from "next/headers";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { SplitHeadline } from "@/components/SplitHeadline";
import { Reveal } from "@/components/Reveal";
import { linkTo } from "@/lib/links";

/**
 * The custom 404. `notFound()` is thrown by the CMS-page catch-all (and by
 * case/post detail pages), so this renders inside the locale layout — nav,
 * footer and all — which is exactly what a user lost on a bad URL needs.
 *
 * `not-found` components receive no props, so the locale is read from the
 * `x-norr3-locale` header the proxy sets on every page request. The page is
 * plain server-rendered HTML (no data fetching), which keeps the response a
 * hard 404 status rather than a streamed 200.
 */
export default async function NotFound() {
  const locale: Locale = (await headers()).get("x-norr3-locale") === "en" ? "en" : "fi";
  const dict = await getDictionary(locale);
  const n = dict.notFound;

  const linkHrefs: Record<string, string> = {
    home: linkTo(locale),
    services: linkTo(locale, "/services"),
    cases: linkTo(locale, "/caset"),
    insights: linkTo(locale, "/insights"),
    contact: linkTo(locale, "/contact"),
  };

  return (
    <>
      <Container className="pb-24 pt-12 lg:pb-32 lg:pt-20">
        <Reveal>
          <HeroPill>{n.pill}</HeroPill>
        </Reveal>
        <SplitHeadline
          left={n.left}
          accent={n.accent}
          className="mt-6 text-[9vw] leading-none lg:text-[6.5rem]"
        />
        <Reveal delay={0.15} className="mt-10 flex flex-col items-start gap-8">
          <p className="max-w-md text-[15px] leading-relaxed text-ink/80 lg:text-base dark:text-white/80">
            {n.body}
          </p>
          <nav aria-label={n.searchLabel} className="flex flex-wrap gap-3">
            {n.links.map((item) => (
              <Link
                key={item.key}
                href={linkHrefs[item.key] ?? linkTo(locale)}
                className="inline-flex items-center rounded-full border border-ink/30 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/30 dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-ink dark:focus-visible:outline-light-purple"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Reveal>
      </Container>
    </>
  );
}
