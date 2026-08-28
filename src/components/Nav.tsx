"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Icon } from "./Icon";
import { linkTo, otherLocaleHref } from "@/lib/links";
import { servicePages, servicePageLocalised } from "@/content/servicePages";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

// Every control in the site chrome gets the same house focus ring.
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple";

/** One menu entry as the CMS stores it: locale labels and a locale-relative href. */
export type NavEntry = { label: Record<Locale, string>; href: string };

/**
 * The header nav, now with sub-menus.
 *
 * Top-level order and labels come from the CMS (dictionary fallback). The
 * sub-links under Palvelut / Engine / Caset / Meistä jump straight to the
 * relevant section of the target page — an anchor (`/services#data`) where the
 * target has one, a filtered list where it doesn't. They are defined here per
 * route and labelled from the dictionary, so they stay translated and are one
 * place to maintain.
 */
export function Nav({
  locale,
  dict,
  menu,
  logo,
}: {
  locale: Locale;
  dict: Dictionary;
  /** Wordmark override, editable in the CMS under Design. */
  logo?: { wordmark: string };
  /**
   * Menu managed in the CMS. Order, labels and visibility are editable there;
   * when it is absent (CMS unreachable) the nav falls back to the seven routes
   * the site has always shipped, labelled from the dictionary.
   */
  menu?: NavEntry[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /** Which top-level item's panel is open on desktop (its key), or null. */
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  // Close any open panel when the route changes.
  useEffect(() => {
    setSubOpen(null);
    setOpen(false);
  }, [pathname]);

  const t = dict.nav;

  // The Palvelut mega-menu: main services as columns, their subservices under
  // each. Structure mirrors the 6-box service map on /services.
  const MEGA_GROUPS: { key: string; label: string; href: string; icon: string; children: { key: string; label: string; href: string }[] }[] = [
    {
      key: "insight",
      label: locale === "fi" ? "Insight & Strategia" : "Insight & Strategy",
      href: linkTo(locale, "/insight-strategia"),
      icon: "strategy",
      children: [
        { key: "is", label: servicePageLocalised(servicePages.find((p) => p.slug === "insight-strategia")!, locale).title, href: linkTo(locale, "/insight-strategia") },
        { key: "ms", label: servicePageLocalised(servicePages.find((p) => p.slug === "markkinointistrategia")!, locale).title, href: linkTo(locale, "/markkinointistrategia") },
        { key: "mediastrat", label: servicePageLocalised(servicePages.find((p) => p.slug === "mediastrategia")!, locale).title, href: linkTo(locale, "/mediastrategia") },
        { key: "tutk", label: servicePageLocalised(servicePages.find((p) => p.slug === "tutkimukset")!, locale).title, href: linkTo(locale, "/tutkimukset") },
      ],
    },
    {
      key: "media",
      label: locale === "fi" ? "Mediapalvelut" : "Media Services",
      href: linkTo(locale, "/mediasuunnittelu"),
      icon: "campaign",
      children: [
        { key: "ms", label: servicePageLocalised(servicePages.find((p) => p.slug === "mediasuunnittelu")!, locale).title, href: linkTo(locale, "/mediasuunnittelu") },
        { key: "radio", label: servicePageLocalised(servicePages.find((p) => p.slug === "mediasuunnittelu/radio")!, locale).title, href: linkTo(locale, "/mediasuunnittelu/radio") },
        { key: "tv", label: servicePageLocalised(servicePages.find((p) => p.slug === "mediasuunnittelu/televisio")!, locale).title, href: linkTo(locale, "/mediasuunnittelu/televisio") },
        { key: "oo", label: servicePageLocalised(servicePages.find((p) => p.slug === "/ulkomainonta".slice(1))!, locale).title, href: linkTo(locale, "/ulkomainonta") },
        { key: "mi", label: servicePageLocalised(servicePages.find((p) => p.slug === "mediasuunnittelu/norr3-media-insights")!, locale).title, href: linkTo(locale, "/mediasuunnittelu/norr3-media-insights") },
      ],
    },
    {
      key: "digital",
      label: locale === "fi" ? "Digimainonta" : "Digital Advertising",
      href: linkTo(locale, "/display-ja-videomainonta"),
      icon: "grid_view",
      children: [
        { key: "dv", label: servicePageLocalised(servicePages.find((p) => p.slug === "display-ja-videomainonta")!, locale).title, href: linkTo(locale, "/display-ja-videomainonta") },
        { key: "sm", label: servicePageLocalised(servicePages.find((p) => p.slug === "somemarkkinointi")!, locale).title, href: linkTo(locale, "/somemarkkinointi") },
        { key: "hm", label: servicePageLocalised(servicePages.find((p) => p.slug === "hakukonemainonta")!, locale).title, href: linkTo(locale, "/hakukonemainonta") },
        { key: "oo2", label: servicePageLocalised(servicePages.find((p) => p.slug === "ohjelmallinen-ostaminen")!, locale).title, href: linkTo(locale, "/ohjelmallinen-ostaminen") },
        { key: "dm", label: servicePageLocalised(servicePages.find((p) => p.slug === "dynaaminen-mainonta")!, locale).title, href: linkTo(locale, "/dynaaminen-mainonta") },
      ],
    },
    {
      key: "perf",
      label: locale === "fi" ? "Performance & data" : "Performance & Data",
      href: linkTo(locale, "/performance-markkinointi"),
      icon: "trending_up",
      children: [
        { key: "pm", label: servicePageLocalised(servicePages.find((p) => p.slug === "performance-markkinointi")!, locale).title, href: linkTo(locale, "/performance-markkinointi") },
        { key: "dm2", label: servicePageLocalised(servicePages.find((p) => p.slug === "data-ja-mittaus")!, locale).title, href: linkTo(locale, "/data-ja-mittaus") },
        { key: "db", label: servicePageLocalised(servicePages.find((p) => p.slug === "data-ja-mittaus/dashboardit")!, locale).title, href: linkTo(locale, "/data-ja-mittaus/dashboardit") },
        { key: "dmod", label: servicePageLocalised(servicePages.find((p) => p.slug === "data-ja-mittaus/datan-mallintaminen")!, locale).title, href: linkTo(locale, "/data-ja-mittaus/datan-mallintaminen") },
      ],
    },
    {
      key: "seo-ai",
      label: locale === "fi" ? "SEO, GEO & AI" : "SEO, GEO & AI",
      href: linkTo(locale, "/hakukoneoptimointi"),
      icon: "search",
      children: [
        { key: "seo", label: servicePageLocalised(servicePages.find((p) => p.slug === "hakukoneoptimointi")!, locale).title, href: linkTo(locale, "/hakukoneoptimointi") },
        { key: "ai", label: servicePageLocalised(servicePages.find((p) => p.slug === "ai-optimointi")!, locale).title, href: linkTo(locale, "/ai-optimointi") },
        { key: "luovat", label: servicePageLocalised(servicePages.find((p) => p.slug === "mediasuunnittelu/luovat")!, locale).title, href: linkTo(locale, "/mediasuunnittelu/luovat") },
      ],
    },
  ];

  const sub: Record<string, { key: string; label: string; href: string }[]> = {
    services: MEGA_GROUPS.flatMap((g) => g.children),
    engine: [
      { key: "product", label: t.engineSub.product, href: linkTo(locale, "/engine#tuote") },
      { key: "workflow", label: t.engineSub.workflow, href: linkTo(locale, "/engine#toiminta") },
      { key: "simulator", label: t.engineSub.simulator, href: linkTo(locale, "/engine#simulator") },
      { key: "demo", label: t.engineSub.demo, href: linkTo(locale, "/engine#demo") },
    ],
    cases: [
      { key: "all", label: t.casesSub.all, href: linkTo(locale, "/caset#kaikki-caset") },
      { key: "flow", label: "Flow Festival", href: linkTo(locale, "/flow-festival") },
      { key: "st1", label: "St1", href: linkTo(locale, "/st1") },
      { key: "km", label: "Kiinteistömaailma", href: linkTo(locale, "/kiinteistomaailma") },
    ],
    insights: [
      { key: "all", label: t.insightsSub.all, href: linkTo(locale, "/insights#kaikki-artikkelit") },
    ],
    about: [
      { key: "story", label: t.aboutSub.story, href: linkTo(locale, "/meista") },
      { key: "team", label: t.aboutSub.team, href: linkTo(locale, "/tiimi") },
      { key: "careers", label: t.aboutSub.careers, href: linkTo(locale, "/toihin-meille") },
    ],
  };

  const items =
    menu && menu.length > 0
      ? menu
          // The CMS menu also feeds the footer; keep the header to real sections.
          .filter((entry) => !["/tietosuojaseloste", "/kayttoehdot"].includes(entry.href))
          .map((entry) => {
            const key = entry.href.replace(/^\//, "") || "home";
            return {
              key,
              label: entry.label[locale] || entry.label.fi,
              href: linkTo(locale, entry.href.startsWith("/") ? entry.href : `/${entry.href}`),
              children: sub[key] ?? [],
            };
          })
      : ([
          { key: "services", label: t.services, href: linkTo(locale, "/services"), children: sub.services ?? [] },
          { key: "engine", label: t.engine, href: linkTo(locale, "/engine"), children: sub.engine ?? [] },
          { key: "caset", label: t.cases, href: linkTo(locale, "/caset"), children: sub.cases ?? [] },
          { key: "insights", label: t.insights, href: linkTo(locale, "/insights"), children: sub.insights ?? [] },
          { key: "contact", label: t.contact, href: linkTo(locale, "/contact"), children: [] },
          { key: "meista", label: t.about, href: linkTo(locale, "/meista"), children: sub.about ?? [] },
          { key: "toihin-meille", label: t.careers, href: linkTo(locale, "/toihin-meille"), children: [] },
        ] as const);

  const other: Locale = locale === "fi" ? "en" : "fi";
  const otherPath = otherLocaleHref(pathname, locale);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const openSub = (key: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setSubOpen(key);
  };
  const scheduleCloseSub = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setSubOpen(null), 120);
  };

  return (
    <header className="site-nav sticky top-0 z-50 bg-white/95 backdrop-blur dark:bg-background/95">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-14"
      >
        <Link
          href={linkTo(locale)}
          className={`shrink-0 rounded-sm transition-opacity hover:opacity-75 ${focusRing}`}
        >
          <Logo artwork={{ wordmark: logo?.wordmark }} className="dark:brightness-0 dark:invert" />
        </Link>

        {/* Figma nav: plain links, purple dot before the active page. Items
            with children open a hover panel that jumps straight to the
            relevant section — the nav is now a map of the site, not just its
            top level. */}
        <nav className="hidden items-center gap-8 lg:flex">
          {items.map((item) => {
            const hasChildren = item.children.length > 0;
            const active = isActive(item.href);
            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={hasChildren ? () => openSub(item.key) : undefined}
                onMouseLeave={hasChildren ? scheduleCloseSub : undefined}
              >
                <Link
                  href={item.href}
                  aria-haspopup={hasChildren || undefined}
                  aria-expanded={hasChildren ? subOpen === item.key : undefined}
                  onFocus={hasChildren ? () => openSub(item.key) : undefined}
                  className={`relative flex items-center gap-1.5 rounded-sm py-1 text-[15px] text-ink transition-colors hover:text-purple dark:text-white dark:hover:text-light-purple ${focusRing}`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="inline-block h-2 w-2 rounded-full bg-purple"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  {item.label}
                  {hasChildren && (
                    <span
                      aria-hidden
                      className={`text-[9px] text-ink/40 transition-transform duration-200 dark:text-white/40 ${subOpen === item.key ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  )}
                </Link>

                <AnimatePresence>
                  {hasChildren && subOpen === item.key && item.key === "services" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-full z-50 mt-1"
                    >
                      <div
                        role="menu"
                        aria-label={item.label}
                        className="w-[min(80vw,1060px)] overflow-hidden rounded-card bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.16)] ring-1 ring-black/5 sm:p-6 dark:bg-[#171225] dark:ring-white/10"
                      >
                        <div className="grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-3 lg:grid-cols-5">
                          {MEGA_GROUPS.map((group) => (
                            <div key={group.key}>
                              <Link
                                href={group.href}
                                className="group/g flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:text-purple dark:text-white dark:hover:text-light-purple"
                              >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                                  <Icon name={group.icon} className="text-[16px]" />
                                </span>
                                {group.label}
                              </Link>
                              <ul className="mt-1.5 space-y-0.5">
                                {group.children.map((child) => (
                                  <li key={child.key}>
                                    <Link
                                      href={child.href}
                                      role="menuitem"
                                      className="block rounded-[8px] px-2 py-1.5 text-[12.5px] leading-snug text-ink/70 transition-colors hover:bg-pastel-purple/50 hover:text-ink dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4 dark:border-white/10">
                          <Link href={linkTo(locale, "/services")} className="text-[12px] font-medium text-purple hover:underline dark:text-light-purple">
                            {locale === "fi" ? "Kaikki palvelut →" : "All services →"}
                          </Link>
                          <Link href={linkTo(locale, "/engine")} className="text-[12px] font-medium text-purple hover:underline dark:text-light-purple">
                            {dict.nav.engine} →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {hasChildren && subOpen === item.key && item.key !== "services" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2"
                    >
                      <div
                        role="menu"
                        aria-label={item.label}
                        className="min-w-56 overflow-hidden rounded-card bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.14)] ring-1 ring-black/5 dark:bg-[#171225] dark:ring-white/10"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.key}
                            href={child.href}
                            role="menuitem"
                            className="block rounded-[10px] px-4 py-2.5 text-sm text-ink/80 transition-colors hover:bg-pastel-purple/50 hover:text-ink focus-visible:bg-pastel-purple/50 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <ThemeToggle label={dict.common.toggleTheme} />
          <Link
            href={otherPath}
            className={`rounded-sm text-sm font-medium tracking-wide text-ink/50 transition-colors hover:text-ink dark:text-white/50 dark:hover:text-white ${focusRing}`}
          >
            {other.toUpperCase()}
          </Link>
          {/* Primary CTA — BRAND_GUIDELINES.md §5 solid black pill. On dark a
              black pill disappears into the base, so it becomes the brand
              primary accent (§8) instead. */}
          <Link
            href={linkTo(locale, "/engine")}
            className={`hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple lg:inline-flex dark:bg-purple dark:text-white dark:hover:bg-violet ${focusRing}`}
          >
            {dict.nav.engine}
          </Link>
          {/* Secondary CTA — Brief us (Antti's header CTA) */}
          <Link
            href={linkTo(locale, "/brief")}
            className={`hidden rounded-full border border-ink/30 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white lg:inline-flex dark:border-white/30 dark:text-white dark:hover:bg-white dark:hover:text-ink ${focusRing}`}
          >
            {dict.common.briefUs}
          </Link>
          <button
            aria-label={dict.common.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden ${focusRing}`}
          >
            <span className={`h-[1.5px] w-5 bg-ink transition-transform dark:bg-white ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-ink transition-transform dark:bg-white ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-1 overflow-hidden border-t border-black/5 px-6 py-4 lg:hidden dark:border-white/10"
          >
            {items.map((item) => (
              <div key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-sm py-2.5 text-base text-ink transition-colors hover:text-purple dark:text-white dark:hover:text-light-purple ${focusRing}`}
                >
                  {isActive(item.href) && <span className="h-2 w-2 rounded-full bg-purple" />}
                  {item.label}
                </Link>
                {/* Mobile: services render as grouped sections; others as flat list. */}
                {item.children.length > 0 && item.key === "services" && (
                  <div className="ml-3 flex flex-col gap-3 border-l border-black/10 pl-3 dark:border-white/10">
                    {MEGA_GROUPS.map((group) => (
                      <div key={group.key}>
                        <Link
                          href={group.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-2 py-1 text-[13px] font-semibold text-ink dark:text-white ${focusRing}`}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-violet text-white">
                            <Icon name={group.icon} className="text-[14px]" />
                          </span>
                          {group.label}
                        </Link>
                        <div className="mt-0.5 flex flex-col">
                          {group.children.map((child) => (
                            <Link
                              key={child.key}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={`rounded-sm py-1.5 pl-8 text-[13px] text-ink/60 transition-colors hover:text-purple dark:text-white/60 dark:hover:text-light-purple ${focusRing}`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {item.children.length > 0 && item.key !== "services" && (
                  <div className="ml-4 flex flex-col border-l border-black/10 dark:border-white/10">
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={`rounded-sm py-2 pl-4 text-sm text-ink/60 transition-colors hover:text-purple dark:text-white/60 dark:hover:text-light-purple ${focusRing}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href={linkTo(locale, "/engine")}
              onClick={() => setOpen(false)}
              className={`mt-3 w-full rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-purple dark:bg-purple dark:hover:bg-violet ${focusRing}`}
            >
              {dict.nav.engine}
            </Link>
            <Link
              href={linkTo(locale, "/brief")}
              onClick={() => setOpen(false)}
              className={`mt-2 w-full rounded-full border border-ink/30 px-5 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white dark:border-white/30 dark:text-white dark:hover:bg-white dark:hover:text-ink ${focusRing}`}
            >
              {dict.common.briefUs}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
