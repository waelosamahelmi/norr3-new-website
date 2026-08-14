"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/content/dictionary";

export function ContactForm({ dict }: { dict: Dictionary["contact"] }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend wired up yet — replace with a real submission handler
    // (email API, CRM webhook, etc.) before launch.
    setSent(true);
  }

  return (
    <div className="relative rounded-[25px] bg-white p-8 ring-1 ring-black/5 sm:p-10 dark:bg-white/[0.04] dark:ring-white/10">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[320px] flex-col items-center justify-center text-center"
          >
            <span className="material-symbols-outlined text-5xl text-purple">check_circle</span>
            <p className="mt-4 text-lg font-medium text-ink dark:text-white">{dict.formSuccess}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <div>
              <label className="text-sm font-medium text-ink/70 dark:text-white/80">{dict.formName}</label>
              <input
                required
                type="text"
                className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-ink outline-none transition-colors focus:border-purple focus-visible:ring-2 focus-visible:ring-purple/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-purple"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-ink/70 dark:text-white/80">{dict.formEmail}</label>
                <input
                  required
                  type="email"
                  className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-ink outline-none transition-colors focus:border-purple focus-visible:ring-2 focus-visible:ring-purple/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-purple"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70 dark:text-white/80">{dict.formCompany}</label>
                <input
                  type="text"
                  className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-ink outline-none transition-colors focus:border-purple focus-visible:ring-2 focus-visible:ring-purple/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-purple"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70 dark:text-white/80">{dict.formMessage}</label>
              <textarea
                required
                rows={4}
                className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-ink outline-none transition-colors focus:border-purple focus-visible:ring-2 focus-visible:ring-purple/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-purple"
              />
            </div>
            <button
              type="submit"
              className="mt-2 self-start rounded-full bg-ink px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-transform duration-200 active:scale-[0.97] hover:bg-purple dark:bg-purple dark:hover:bg-violet"
            >
              {dict.formSubmit}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
