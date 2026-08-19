"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";


export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="bg-purple text-white">
      {/* Giant logo wordmark — uses the real NØRR3 animated SVG so the
          wordmark matches the brand exactly (incl. the 3→Δ morph). The SVG
          is black-on-purple (the footer bg), same as the nav logo on white.
          Letters rise in on scroll for the reveal. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1600px] items-end justify-center overflow-hidden px-6 pt-16 lg:px-14"
      >
        <img
          src="/logo-animated.svg"
          alt=""
          className="h-auto w-full max-w-[1400px] select-none"
          style={{ filter: "brightness(0)" }}
        />
      </motion.div>

      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 pb-16 pt-24 sm:grid-cols-2 lg:grid-cols-4 lg:px-14 lg:pt-36">
        <div>
          <p className="text-lg font-medium">NØRR3</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">{dict.footer.blurb1}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">{dict.footer.blurb2}</p>
        </div>

        <div>
          <p className="text-lg font-medium">{dict.footer.contactHeading}</p>
          <div className="mt-4 space-y-1 text-sm leading-relaxed text-white/80">
            {dict.footer.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className="pt-2">{dict.footer.email}</p>
            <p>{dict.footer.phone}</p>
            <div className="pt-2">
              {dict.footer.companyLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="pt-1">
              <Link
                href={`/${locale}/contact`}
                className="rounded-sm underline decoration-white/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {dict.footer.billing}
              </Link>
            </p>
          </div>
        </div>

        <div>
          <p className="text-lg font-medium">{dict.footer.followHeading}</p>
          <div className="mt-4 space-y-1.5 text-sm text-white/80">
            <a
              href="https://linkedin.com/company/norr3"
              target="_blank"
              rel="noreferrer"
              className="block w-fit rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com/norr3.fi"
              target="_blank"
              rel="noreferrer"
              className="block w-fit rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Instagram
            </a>
          </div>
        </div>

        <div>
          <p className="text-lg font-medium">{dict.footer.joinHeading}</p>
          <div className="mt-4 space-y-1.5 text-sm text-white/80">
            {/* Each label now has its own route (About / Careers / Team)
                instead of three links all landing on /team. */}
            {dict.footer.joinLinks.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}/${item.path}`}
                className="block w-fit rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Legal row: real routes now exist, so these are no longer href="#". */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-6 pb-8 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between lg:px-14">
        <p>{dict.footer.copyright}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href={`/${locale}/privacy`}
            className="rounded-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {dict.footer.privacy}
          </Link>
          <Link
            href={`/${locale}/terms`}
            className="rounded-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {dict.footer.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
}
