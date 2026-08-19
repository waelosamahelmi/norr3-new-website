"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

// Every control in the site chrome gets the same house focus ring.
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple";

/** One menu entry as the CMS stores it: locale labels and a locale-relative href. */
export type NavEntry = { label: Record<Locale, string>; href: string };

export function Nav({
  locale,
  dict,
  menu,
  logo,
}: {
  locale: Locale;
  dict: Dictionary;
  /** Logo artwork and treatment, both editable in the CMS under Design. */
  logo?: { mark: string; wordmark: string; navVariant: "lockup" | "mark" | "wordmark" };
  /**
   * Menu managed in the CMS. Order, labels and visibility are editable there;
   * when it is absent (CMS unreachable) the nav falls back to the seven routes
   * the site has always shipped, labelled from the dictionary.
   */
  menu?: NavEntry[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const other: Locale = locale === "fi" ? "en" : "fi";

  const items =
    menu && menu.length > 0
      ? menu.map((entry) => ({
          key: entry.href,
          label: entry.label[locale] || entry.label.fi,
          href: `/${locale}${entry.href.startsWith("/") ? entry.href : `/${entry.href}`}`,
        }))
      : ([
          { key: "services", label: dict.nav.services, href: `/${locale}/services` },
          { key: "engine", label: dict.nav.engine, href: `/${locale}/engine` },
          { key: "cases", label: dict.nav.cases, href: `/${locale}/cases` },
          { key: "insights", label: dict.nav.insights, href: `/${locale}/insights` },
          { key: "contact", label: dict.nav.contact, href: `/${locale}/contact` },
          { key: "about", label: dict.nav.about, href: `/${locale}/about` },
          { key: "careers", label: dict.nav.careers, href: `/${locale}/careers` },
        ] as const);

  const otherPath = pathname.replace(`/${locale}`, `/${other}`);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-nav sticky top-0 z-50 bg-white/95 backdrop-blur dark:bg-background/95">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-14"
      >
        <Link
          href={`/${locale}`}
          className={`shrink-0 rounded-sm transition-opacity hover:opacity-75 ${focusRing}`}
        >
          <Logo
            variant={logo?.navVariant ?? "lockup"}
            artwork={{ mark: logo?.mark, wordmark: logo?.wordmark }}
            className="dark:brightness-0 dark:invert"
          />
        </Link>

        {/* Figma nav: plain links, purple dot before the active page */}
        <nav className="hidden items-center gap-9 lg:flex">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex items-center gap-1.5 rounded-sm py-1 text-[15px] text-ink transition-colors hover:text-purple dark:text-white dark:hover:text-light-purple ${focusRing}`}
            >
              {isActive(item.href) && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="inline-block h-2 w-2 rounded-full bg-purple"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {item.label}
            </Link>
          ))}
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
            href={`/${locale}/engine`}
            className={`hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple lg:inline-flex dark:bg-purple dark:text-white dark:hover:bg-violet ${focusRing}`}
          >
            {dict.nav.engine}
          </Link>
          {/* Secondary CTA — Brief us (Antti's header CTA) */}
          <Link
            href={`/${locale}/brief`}
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
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-sm py-2.5 text-base text-ink transition-colors hover:text-purple dark:text-white dark:hover:text-light-purple ${focusRing}`}
              >
                {isActive(item.href) && <span className="h-2 w-2 rounded-full bg-purple" />}
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/engine`}
              onClick={() => setOpen(false)}
              className={`mt-3 w-full rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-purple dark:bg-purple dark:hover:bg-violet ${focusRing}`}
            >
              {dict.nav.engine}
            </Link>
            <Link
              href={`/${locale}/brief`}
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
