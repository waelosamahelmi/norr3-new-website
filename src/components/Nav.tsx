"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
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
  const sub: Record<string, { key: string; label: string; href: string }[]> = {
    // The Palvelut dropdown lists the keyword-optimised landing pages under
    // /palvelut, driven by the same content module the pages render from.
    services: servicePages.map((p) => ({
      key: p.slug,
      label: servicePageLocalised(p, locale).title,
      href: linkTo(locale, `/${p.slug}`),
    })),
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
                  {hasChildren && subOpen === item.key && (
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
                {/* Mobile: the same sub-links, indented under their parent. */}
                {item.children.length > 0 && (
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
