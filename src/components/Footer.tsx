"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

const LETTERS = ["N", "Ø", "R", "R", "3"];

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="bg-purple text-white">
      {/* Giant black stencil wordmark, letters rising in on scroll */}
      <div className="mx-auto flex max-w-[1600px] items-end justify-between overflow-hidden px-6 pt-16 lg:px-14">
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: "60%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="select-none font-medium leading-[0.8] text-black"
            style={{ fontSize: "clamp(5rem, 17vw, 21rem)" }}
            aria-hidden={i > 0}
          >
            {letter}
          </motion.span>
        ))}
      </div>

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
            <p className="pt-1 underline decoration-white/40 underline-offset-2">
              <Link href={`/${locale}/contact`}>{dict.footer.billing}</Link>
            </p>
          </div>
        </div>

        <div>
          <p className="text-lg font-medium">{dict.footer.followHeading}</p>
          <div className="mt-4 space-y-1.5 text-sm text-white/80">
            <a href="https://linkedin.com/company/norr3" target="_blank" rel="noreferrer" className="block hover:text-white">
              LinkedIn
            </a>
            <a href="https://instagram.com/norr3.fi" target="_blank" rel="noreferrer" className="block hover:text-white">
              Instagram
            </a>
          </div>
        </div>

        <div>
          <p className="text-lg font-medium">{dict.footer.joinHeading}</p>
          <div className="mt-4 space-y-1.5 text-sm text-white/80">
            {dict.footer.joinLinks.map((label) => (
              <Link key={label} href={`/${locale}/team`} className="block hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Legal row: real routes now exist, so these are no longer href="#". */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-6 pb-8 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between lg:px-14">
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
