"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/Icon";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

/** Shared field styling — one source of truth for every input/textarea. */
const fieldClass =
  "mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-ink outline-none transition-colors focus:border-purple focus-visible:ring-2 focus-visible:ring-purple/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-light-purple dark:focus-visible:ring-light-purple/40";
const labelClass = "text-sm font-medium text-ink/70 dark:text-white/80";

export function OpenApplicationForm({
  dict,
  locale = "fi",
}: {
  dict: Dictionary["careers"]["application"];
  locale?: Locale;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  /**
   * Posts multipart (text fields + optional CV) to `/api/application`, which
   * forwards the CV to the CMS file store and records the application with the
   * shared ingest secret. No manual Content-Type — the browser sets the
   * multipart boundary because a file is attached.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");

    const form = new FormData(e.currentTarget);
    form.set("locale", locale);

    try {
      const res = await fetch("/api/application", {
        method: "POST",
        body: form,
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSent(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : locale === "fi"
            ? "Hakemuksen lähetys ei onnistunut. Kirjoita suoraan osoitteeseen info@norr3.fi."
            : "We could not send your application. Please email info@norr3.fi instead."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="relative rounded-card bg-white p-8 ring-1 ring-black/5 sm:p-10 dark:bg-white/[0.04] dark:ring-white/10">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[320px] flex-col items-center justify-center text-center"
          >
            <Icon name="check_circle" className="text-5xl text-purple dark:text-light-purple" />
            <p className="mt-4 text-lg font-medium text-ink dark:text-white">{dict.success}</p>
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
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="app-name" className={labelClass}>
                  {dict.name}
                </label>
                <input required id="app-name" name="name" autoComplete="name" type="text" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="app-email" className={labelClass}>
                  {dict.email}
                </label>
                <input required id="app-email" name="email" autoComplete="email" type="email" className={fieldClass} />
              </div>
            </div>
            <div>
              <label htmlFor="app-phone" className={labelClass}>
                {dict.phone}
              </label>
              <input id="app-phone" name="phone" autoComplete="tel" type="tel" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="app-message" className={labelClass}>
                {dict.message}
              </label>
              <textarea
                id="app-message"
                name="message"
                rows={5}
                placeholder={dict.messagePlaceholder}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="app-portfolio" className={labelClass}>
                {dict.portfolio}
              </label>
              <input
                id="app-portfolio"
                name="portfolioUrl"
                type="url"
                placeholder={dict.portfolioPlaceholder}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="app-cv" className={labelClass}>
                {dict.cv}
              </label>
              <input
                id="app-cv"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className={`${fieldClass} file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-1.5 file:text-xs file:font-medium file:uppercase file:tracking-wide file:text-white hover:file:bg-purple dark:file:bg-purple dark:hover:file:bg-violet`}
              />
              <p className="mt-1.5 text-xs text-ink/50 dark:text-white/50">{dict.cvHint}</p>
            </div>

            {/* Bots fill every field they find; humans never see this one. */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="app-website">Website</label>
              <input id="app-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {error && (
              <p role="alert" className="text-sm text-accent-magenta dark:text-accent-pink">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="mt-2 self-start rounded-full bg-ink px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-purple dark:hover:bg-violet dark:focus-visible:outline-light-purple"
            >
              {sending ? (locale === "fi" ? "Lähetetään…" : "Sending…") : dict.submit}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
