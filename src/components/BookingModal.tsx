"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import type { Locale } from "@/i18n/config";

/**
 * The two booking dialogs behind the contact page's CTAs.
 *
 *  - kind="demo"    → Buukkaa demo: two proposed time slots + contact fields
 *  - kind="meeting" → Varaa 30 min palaveri: topic, preferred person, message
 *                     + contact fields
 *
 * Bot defence: hidden honeypot field, a time-trap (elapsed since open) and a
 * small sum the visitor solves — all verified server-side.
 * Tracking: on successful submit a GA4 event (`generate_lead`, with the
 * `booking_kind`) fires via gtag if the consent-gated Analytics has loaded.
 */

type Labels = {
  demoTitle: string;
  meetingTitle: string;
  company: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  demoIntro: string;
  slotLabel: string;
  slot1: string;
  slot2: string;
  meetingIntro: string;
  topicLabel: string;
  topics: string[];
  personLabel: string;
  people: string[];
  messageLabel: string;
  botCheck: string;
  submitDemo: string;
  submitMeeting: string;
  sending: string;
  successTitle: string;
  successBody: string;
  close: string;
  anyPerson: string;
  slotPlaceholder: string;
};

const FI: Labels = {
  demoTitle: "Buukkaa demo",
  meetingTitle: "Varaa 30 min palaveri",
  company: "Yritys",
  firstName: "Etunimi",
  lastName: "Sukunimi",
  phone: "Puhelinnumero",
  email: "Sähköposti",
  demoIntro: "Ehdota kahta sopivaa aikaa 30 min demon — vahvistamme yhden niistä sähköpostitse.",
  slotLabel: "Ehdotetut ajat",
  slot1: "Ehdotus 1",
  slot2: "Ehdotus 2 (valinnainen)",
  meetingIntro: "Kerro lyhyesti, mistä haluaisit keskustella — oikea ihminen ottaa yhteyttä.",
  topicLabel: "Kiinnostuksen aihe",
  topics: [
    "Yleinen tutustumistapaaminen",
    "Strategiapalvelut",
    "Kampanjapalvelut",
    "Workshopit ja projektit",
    "Marketing Engine",
    "Muu asia",
  ],
  personLabel: "Haluttu henkilö (valinnainen)",
  people: ["Ei Preferenssiä", "Antti Ujainen", "Maria Malila", "Marika Salovaara", "Anne-Mari Lahtinen", "Lotta Brech", "Karoliina Mäkelä"],
  messageLabel: "Viesti (valinnainen)",
  botCheck: "Ihmisvarmistus",
  submitDemo: "Lähetä demoehdotus",
  submitMeeting: "Lähetä varauspyyntö",
  sending: "Lähetetään…",
  successTitle: "Kiitos!",
  successBody: "Saimme ehdotuksesi — vahvistamme ajan sähköpostitse yhden arkipäivän kuluessa.",
  close: "Sulje",
  anyPerson: "Ei preferenssiä",
  slotPlaceholder: "esim. ti 15.9. klo 10:00",
};

const EN: Labels = {
  demoTitle: "Book a demo",
  meetingTitle: "Book a 30 min call",
  company: "Company",
  firstName: "First name",
  lastName: "Last name",
  phone: "Phone number",
  email: "Email",
  demoIntro: "Suggest two times that suit you for a 30-minute demo — we'll confirm one by email.",
  slotLabel: "Suggested times",
  slot1: "Suggestion 1",
  slot2: "Suggestion 2 (optional)",
  meetingIntro: "Tell us briefly what you'd like to discuss — the right person will get back to you.",
  topicLabel: "I'm interested in",
  topics: [
    "General get-to-know-each-other",
    "Strategy services",
    "Campaigning services",
    "Workshops or projects",
    "Marketing Engine",
    "Something else",
  ],
  personLabel: "Preferred person (optional)",
  people: ["No preference", "Antti Ujainen", "Maria Malila", "Marika Salovaara", "Anne-Mari Lahtinen", "Lotta Brech", "Karoliina Mäkelä"],
  messageLabel: "Message (optional)",
  botCheck: "Human check",
  submitDemo: "Send demo request",
  submitMeeting: "Send booking request",
  sending: "Sending…",
  successTitle: "Thank you!",
  successBody: "We got your request — we'll confirm a time by email within one business day.",
  close: "Close",
  anyPerson: "No preference",
  slotPlaceholder: "e.g. Tue 15 Sep at 10:00",
};

type BookingModalProps = {
  kind: "demo" | "meeting";
  locale: Locale;
  open: boolean;
  onClose: () => void;
};

const inputCls =
  "w-full rounded-[10px] border border-ink/20 bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-purple dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 dark:focus:border-light-purple";

export function BookingModal({ kind, locale, open, onClose }: BookingModalProps) {
  const t = locale === "fi" ? FI : EN;
  const [state, setState] = useState<"form" | "sending" | "done" | "error">("form");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    company: "", firstName: "", lastName: "", phone: "", email: "",
    slot1: "", slot2: "", topic: t.topics[0], person: t.people[0], message: "",
    website: "", captchaAnswer: "",
  });
  const openedAt = useRef<number>(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Fresh math challenge per open, stored in a ref (not state → bots scraping
  // the DOM don't get it re-rendered into an attribute).
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, op: "+" });
  useEffect(() => {
    if (open) {
      let a = 2 + Math.floor(Math.random() * 8);
      let b = 1 + Math.floor(Math.random() * 8);
      const op = Math.random() < 0.5 ? "+" : "−";
      if (op === "−" && b > a) [a, b] = [b, a]; // keep the answer non-negative
      setCaptcha({ a, b, op });
      openedAt.current = Date.now();
      setState("form");
      setError(null);
    }
  }, [open]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          locale,
          ...form,
          captchaA: captcha.a,
          captchaB: captcha.b,
          captchaOp: captcha.op,
          elapsed: Math.round((Date.now() - openedAt.current) / 1000),
          slots: kind === "demo" ? [form.slot1, form.slot2].filter(Boolean) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      // GA4 conversion — only fires when consent-gated gtag has loaded.
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.("event", "generate_lead", {
        booking_kind: kind,
        ...(kind === "meeting" ? { booking_topic: form.topic } : {}),
      });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setState("form");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-3 backdrop-blur-sm sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={kind === "demo" ? t.demoTitle : t.meetingTitle}
            className="max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-card bg-offwhite p-6 shadow-2xl dark:bg-[#171225] sm:p-8"
          >
            {state === "done" ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-purple text-white">
                  <Icon name="task_alt" style={{ fontSize: "32px" }} />
                </span>
                <h3 className="text-2xl font-medium text-ink dark:text-white">{t.successTitle}</h3>
                <p className="max-w-sm text-sm leading-relaxed text-ink/65 dark:text-white/65">{t.successBody}</p>
                <button
                  onClick={onClose}
                  className="mt-2 rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-purple dark:bg-purple dark:hover:bg-violet"
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium text-ink dark:text-white">
                      {kind === "demo" ? t.demoTitle : t.meetingTitle}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink/60 dark:text-white/60">
                      {kind === "demo" ? t.demoIntro : t.meetingIntro}
                    </p>
                  </div>
                  <button type="button" onClick={onClose} aria-label={t.close} className="rounded-full p-1.5 text-ink/50 transition-colors hover:bg-black/5 hover:text-ink dark:text-white/50 dark:hover:bg-white/10">
                    <Icon name="close" style={{ fontSize: "20px" }} />
                  </button>
                </div>

                {kind === "demo" ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.slot1} *</span>
                      <input required value={form.slot1} onChange={set("slot1")} placeholder={t.slotPlaceholder} className={inputCls} />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.slot2}</span>
                      <input value={form.slot2} onChange={set("slot2")} placeholder={t.slotPlaceholder} className={inputCls} />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.topicLabel} *</span>
                      <select required value={form.topic} onChange={set("topic")} className={inputCls}>
                        {t.topics.map((x) => <option key={x} value={x}>{x}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.personLabel}</span>
                      <select value={form.person} onChange={set("person")} className={inputCls}>
                        {t.people.map((x) => <option key={x} value={x}>{x}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.messageLabel}</span>
                      <textarea rows={3} value={form.message} onChange={set("message")} className={`${inputCls} resize-none`} />
                    </label>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.company} *</span>
                    <input required value={form.company} onChange={set("company")} className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.email} *</span>
                    <input required type="email" value={form.email} onChange={set("email")} className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.firstName} *</span>
                    <input required value={form.firstName} onChange={set("firstName")} className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.lastName} *</span>
                    <input required value={form.lastName} onChange={set("lastName")} className={inputCls} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">{t.phone}</span>
                    <input value={form.phone} onChange={set("phone")} className={inputCls} />
                  </label>
                </div>

                {/* Human check: simple sum, verified server-side */}
                <label className="block">
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.1em] text-ink/50 dark:text-white/50">
                    {t.botCheck}: {captcha.a} {captcha.op} {captcha.b} = ? *
                  </span>
                  <input
                    required
                    inputMode="numeric"
                    value={form.captchaAnswer}
                    onChange={set("captchaAnswer")}
                    className={`${inputCls} max-w-[120px]`}
                  />
                </label>

                {/* Honeypot — visually and programmatically hidden */}
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={set("website")}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                {error && <p className="text-[13px] text-[#c94a10]">{error}</p>}

                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="w-full rounded-full bg-purple px-6 py-3.5 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-violet disabled:opacity-60"
                >
                  {state === "sending" ? t.sending : kind === "demo" ? t.submitDemo : t.submitMeeting}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
