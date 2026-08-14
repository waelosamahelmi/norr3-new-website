"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/content/dictionary";

/** Shared field styling — one source of truth for every input/textarea. */
const fieldClass =
  "mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-ink outline-none transition-colors focus:border-purple focus-visible:ring-2 focus-visible:ring-purple/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-purple";
const labelClass = "text-sm font-medium text-ink/70 dark:text-white/80";

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
            {/* Every label is wired to its field (htmlFor/id) so the label is a
                real click target and screen readers announce the pair. */}
            <div>
              <label htmlFor="contact-name" className={labelClass}>
                {dict.formName}
              </label>
              <input required id="contact-name" name="name" autoComplete="name" type="text" className={fieldClass} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  {dict.formEmail}
                </label>
                <input
                  required
                  id="contact-email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="contact-company" className={labelClass}>
                  {dict.formCompany}
                </label>
                <input
                  id="contact-company"
                  name="company"
                  autoComplete="organization"
                  type="text"
                  className={fieldClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className={labelClass}>
                {dict.formMessage}
              </label>
              <textarea required id="contact-message" name="message" rows={4} className={fieldClass} />
            </div>
            <button
              type="submit"
              className="mt-2 self-start rounded-full bg-ink px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-transform duration-200 hover:bg-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple active:scale-[0.97] dark:bg-purple dark:hover:bg-violet dark:focus-visible:outline-light-purple"
            >
              {dict.formSubmit}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
