"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { PillButton } from "@/components/PillButton";
import { OpenApplicationForm } from "@/components/OpenApplicationForm";
import { HoverLift } from "@/components/HoverLift";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

/**
 * "Avoin hakemus" card that sits beside the "Yhdessä" card under the open
 * roles. The form no longer renders inline in the page — the button opens it
 * in a popup, so the recruitment page stays scannable until someone actually
 * decides to apply.
 */
export function OpenApplicationCta({
  dict,
  locale = "fi",
}: {
  dict: Dictionary["careers"]["application"];
  locale?: Locale;
}) {
  const [open, setOpen] = useState(false);
  const closeLabel = locale === "fi" ? "Sulje" : "Close";

  return (
    <>
      <HoverLift className="h-full" lift={3} scale={1.015}>
        <div className="flex h-full flex-col gap-6 rounded-card bg-grey/70 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-yellow text-ink">
            <Icon name="drafts" style={{ fontSize: "28px" }} />
          </div>
          <div className="flex flex-1 flex-col">
            <h3 className="text-lg font-medium text-ink dark:text-white">{dict.heading}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink/65 dark:text-white/65">{dict.body}</p>
            <div className="mt-6">
              <PillButton onClick={() => setOpen(true)}>{dict.cta}</PillButton>
            </div>
          </div>
        </div>
      </HoverLift>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-3 backdrop-blur-sm sm:p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={dict.heading}
              className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={closeLabel}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow ring-1 ring-black/10 transition-colors hover:bg-black/5 dark:bg-white/10 dark:text-white dark:ring-white/15"
              >
                <Icon name="close" style={{ fontSize: "20px" }} />
              </button>
              <OpenApplicationForm dict={dict} locale={locale} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
