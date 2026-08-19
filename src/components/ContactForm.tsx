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

export function ContactForm({
  dict,
  locale = "fi",
}: {
  dict: Dictionary["contact"];
  locale?: Locale;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  /**
   * Posts to the site's own `/api/contact`, which forwards the message into the
   * CMS inbox with the shared ingest secret. Doing the hop server-side keeps the
   * secret off the client and means the CMS never accepts unauthenticated writes.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company"),
          message: form.get("message"),
          website: form.get("website"),
          locale,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSent(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : locale === "fi"
            ? "Viestin lähetys ei onnistunut. Kirjoita suoraan osoitteeseen info@norr3.fi."
            : "We could not send your message. Please email info@norr3.fi instead."
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

            {/* Bots fill every field they find; humans never see this one. */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
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
              {sending ? (locale === "fi" ? "Lähetetään…" : "Sending…") : dict.formSubmit}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
