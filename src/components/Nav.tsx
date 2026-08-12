"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

export function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const other: Locale = locale === "fi" ? "en" : "fi";

  const items = [
    { key: "services", label: dict.nav.services, href: `/${locale}/services` },
    { key: "engine", label: dict.nav.engine, href: `/${locale}/engine` },
    { key: "cases", label: dict.nav.cases, href: `/${locale}/cases` },
    { key: "team", label: dict.nav.team, href: `/${locale}/team` },
    { key: "insights", label: dict.nav.insights, href: `/${locale}/insights` },
    { key: "contact", label: dict.nav.contact, href: `/${locale}/contact` },
  ];

  const otherPath = pathname.replace(`/${locale}`, `/${other}`);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-14"
      >
        <Link href={`/${locale}`} className="shrink-0">
          <Logo />
        </Link>

        {/* Figma nav: plain links, purple dot before the active page */}
        <nav className="hidden items-center gap-9 lg:flex">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative flex items-center gap-1.5 py-1 text-[15px] text-ink transition-colors hover:text-purple"
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
          <Link
            href={otherPath}
            className="text-sm font-medium tracking-wide text-ink/50 transition-colors hover:text-ink"
          >
            {other.toUpperCase()}
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className={`h-[1.5px] w-5 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
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
            className="flex flex-col gap-1 overflow-hidden border-t border-black/5 px-6 py-4 lg:hidden"
          >
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-2.5 text-base text-ink"
              >
                {isActive(item.href) && <span className="h-2 w-2 rounded-full bg-purple" />}
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
