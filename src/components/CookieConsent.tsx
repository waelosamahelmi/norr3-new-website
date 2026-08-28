"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { useLocalStorageItem } from "@/lib/useLocalStorageItem";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";
import { linkTo } from "@/lib/links";

const STORAGE_KEY = "norr3-cookie-consent";

export function CookieConsent({ dict, locale }: { dict: Dictionary["cookies"]; locale: Locale }) {
  // serverValue "pending" keeps the SSR and hydration renders empty — the
  // choice lives in localStorage, which only exists after mount. errorValue
  // "pending" stays silent when storage throws (private mode, blocked cookies).
  const [choice, choose] = useLocalStorageItem(STORAGE_KEY, {
    serverValue: "pending",
    errorValue: "pending",
  });
  // The page editor's live preview renders the site inside an iframe. A consent
  // dialog over an editor is noise, and dismissing it there would silently opt
  // the editor's own browser in, so the box sits out the preview route.
  const inEditorPreview = usePathname().includes("/cms-preview");
  const visible = choice === null && !inEditorPreview;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={dict.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto w-auto max-w-[360px] rounded-[22px] border border-white/40 bg-white/70 p-5 shadow-xl backdrop-blur-xl sm:inset-x-auto sm:bottom-10 sm:right-6 sm:w-[calc(100vw-2rem)] sm:p-6 dark:border-white/15 dark:bg-white/10 dark:text-white"
        >
          <p className="flex items-center gap-2 font-medium">
            <Icon name="cookie" className="text-[20px] text-ink dark:text-white" />
            {dict.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-white/70">
            {dict.body}{" "}
            <Link
              href={linkTo(locale, "/tietosuojaseloste")}
              className="rounded-sm text-ink underline underline-offset-2 hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
            >
              {dict.privacyLink}
            </Link>
          </p>
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => choose("declined")}
              className="rounded-full px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white/70 dark:hover:text-white dark:focus-visible:outline-light-purple"
            >
              {dict.decline}
            </button>
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:bg-purple dark:hover:bg-violet dark:focus-visible:outline-light-purple"
            >
              {dict.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
