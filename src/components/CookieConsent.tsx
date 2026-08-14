"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import type { Dictionary } from "@/content/dictionary";

const STORAGE_KEY = "norr3-cookie-consent";

export function CookieConsent({ dict }: { dict: Dictionary["cookies"] }) {
  // Starts false so the server render and the first client render both emit
  // nothing — the choice lives in localStorage, which only exists after mount.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Storage can throw (private mode, blocked cookies) — stay silent.
    }
  }, []);

  function choose(choice: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Ignore — hiding the box is still the right response to a click.
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
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
              href="#"
              className="text-ink underline underline-offset-2 hover:text-ink/70 dark:text-white dark:hover:text-white/70"
            >
              {dict.privacyLink}
            </Link>
          </p>
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => choose("declined")}
              className="px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:text-ink dark:text-white/70 dark:hover:text-white"
            >
              {dict.decline}
            </button>
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink/90 dark:bg-purple dark:hover:bg-violet"
            >
              {dict.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
