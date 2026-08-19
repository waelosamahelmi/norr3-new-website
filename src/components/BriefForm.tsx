"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/content/dictionary";

type BriefDict = Dictionary["brief"];

const CHANNELS_FI = [
  "TV", "Suomalaiset suoratoistopalvelut, video", "YouTube", "Perinteinen radio",
  "Digitaalinen audio; Spotify, podcastit, jne.", "Printtimainonta", "Display-mainonta",
  "Natiivimainonta", "Ulkomainonta", "Elokuvamainonta leffateattereissa",
  "Vaikuttajamainonta", "PR", "Hakukonemarkkinointi", "Applikaatiomainonta (Android, iOS)",
  "Facebook-mainonta", "Instagram-mainonta", "LinkedIn-mainonta", "Jodel-mainonta",
  "TikTok-mainonta", "Snapchat-mainonta", "Orgaaninen FB & IG",
];

const CHANNELS_EN = [
  "TV", "Finnish streaming services, video", "YouTube", "Traditional radio",
  "Digital audio; Spotify, podcasts, etc.", "Print advertising", "Display advertising",
  "Native advertising", "Out-of-home", "Cinema advertising",
  "Influencer marketing", "PR", "Search engine marketing", "App advertising (Android, iOS)",
  "Facebook advertising", "Instagram advertising", "LinkedIn advertising", "Jodel advertising",
  "TikTok advertising", "Snapchat advertising", "Organic FB & IG",
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-ink outline-none transition-colors focus:border-purple focus-visible:ring-2 focus-visible:ring-purple/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:border-purple";
const labelClass = "text-sm font-medium text-ink/70 dark:text-white/80";
const textareaClass = inputClass + " resize-y";
const radioClass =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-black/10 px-4 py-3 text-sm text-ink/80 transition-colors hover:border-purple/50 dark:border-white/15 dark:text-white/80";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
  name,
  otherPlaceholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  name: string;
  otherPlaceholder?: string;
}) {
  return (
    <div className="mt-1.5 flex flex-col gap-2">
      {options.map((opt) => (
        <label key={opt} className={radioClass}>
          <input
            type="radio"
            name={name}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="size-4 accent-purple"
          />
          {opt}
        </label>
      ))}
      {otherPlaceholder !== undefined && (
        <label className={radioClass}>
          <input
            type="radio"
            name={name}
            checked={value.startsWith("__other__")}
            onChange={() => onChange("__other__")}
            className="size-4 accent-purple"
          />
          {otherPlaceholder}
          {value.startsWith("__other__") && (
            <input
              type="text"
              value={value === "__other__" ? "" : value.slice("__other__".length)}
              onChange={(e) => onChange("__other__" + e.target.value)}
              className="ml-1 min-w-0 flex-1 border-b border-black/20 bg-transparent px-1 text-sm outline-none dark:border-white/20"
              placeholder="…"
            />
          )}
        </label>
      )}
    </div>
  );
}

export function BriefForm({ locale, dict }: { locale: Locale; dict: BriefDict }) {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const channels = locale === "fi" ? CHANNELS_FI : CHANNELS_EN;
  const [form, setForm] = useState<Record<string, string>>({});
  const [channelPrefs, setChannelPrefs] = useState<Record<string, number>>({});
  const [services, setServices] = useState<string[]>([]);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const totalSteps = 7;

  const askAI = async () => {
    setAiLoading(true);
    setAiSuggestion("");
    try {
      const summary = [
        form.campaignName && `Campaign: ${form.campaignName}`,
        form.campaignType && `Type: ${form.campaignType}`,
        form.mediaBudget && `Media budget: ${form.mediaBudget}`,
        services.length && `Services: ${services.join(", ")}`,
        Object.entries(channelPrefs)
          .filter(([, v]) => v >= 3)
          .map(([k]) => channels[Number(k)])
          .slice(0, 5)
          .join(", ") && `Preferred channels: ${Object.entries(channelPrefs).filter(([, v]) => v >= 3).map(([k]) => channels[Number(k)]).slice(0, 5).join(", ")}`,
      ].filter(Boolean).join(". ");
      const res = await fetch("/api/brief-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: summary || "Campaign brief", locale }),
      });
      const data = await res.json();
      setAiSuggestion(data.reply || "");
    } catch {
      setAiSuggestion("");
    } finally {
      setAiLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-purple">task_alt</span>
        <h2 className="mt-6 text-3xl font-medium tracking-tight text-ink dark:text-white">
          {dict.successTitle}
        </h2>
        <p className="mt-4 max-w-md text-ink/70 dark:text-white/70">{dict.successBody}</p>
        <Link
          href={`/${locale}`}
          className="mt-8 rounded-full bg-ink px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-purple dark:bg-purple dark:hover:bg-violet"
        >
          {dict.successCta}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-8 flex items-center gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">
          {dict.step} {step + 1} {dict.of} {totalSteps}
        </p>
        <div className="flex flex-1 gap-1.5">
          {dict.steps.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-purple" : "bg-black/10 dark:bg-white/10"}`} />
              <p className={`mt-1.5 hidden text-[10px] uppercase tracking-wide sm:block ${i === step ? "text-purple dark:text-light-purple" : "text-ink/40 dark:text-white/40"}`}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 0 — email + intro */}
      {step === 0 && (
        <div className="flex flex-col gap-6">
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink/70 dark:text-white/70">{dict.intro}</p>
          <Field label={dict.emailLabel}>
            <input
              required
              type="email"
              value={form.email || ""}
              onChange={(e) => set("email", e.target.value)}
              placeholder={dict.emailPlaceholder}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2.5 text-sm text-ink/70 dark:text-white/70">
            <input
              type="checkbox"
              checked={form.copy === "1"}
              onChange={(e) => set("copy", e.target.checked ? "1" : "")}
              className="size-4 accent-purple"
            />
            {dict.copyOfResponses}
          </label>
        </div>
      )}

      {/* STEP 1 — company basics */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-medium tracking-tight text-ink dark:text-white">{dict.step1Title}</h2>
          <Field label={dict.companyName}>
            <input className={inputClass} value={form.company || ""} onChange={(e) => set("company", e.target.value)} />
          </Field>
          <Field label={dict.yourName}>
            <input className={inputClass} value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label={dict.phone}>
            <input type="tel" className={inputClass} value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label={dict.hasAgency}>
            <input className={inputClass} value={form.agency || ""} onChange={(e) => set("agency", e.target.value)} />
          </Field>
          <Field label={dict.usedAgencyBefore}>
            <RadioGroup options={[dict.yes, dict.no]} value={form.usedBefore || ""} onChange={(v) => set("usedBefore", v)} name="usedBefore" />
          </Field>
          <Field label={dict.hearAbout}>
            <RadioGroup options={dict.hearOptions} value={form.hear || ""} onChange={(v) => set("hear", v)} name="hear" otherPlaceholder={dict.other} />
          </Field>
          <Field label={dict.proceed}>
            <RadioGroup options={dict.proceedOptions} value={form.proceed || ""} onChange={(v) => set("proceed", v)} name="proceed" otherPlaceholder={dict.other} />
          </Field>
          <Field label={dict.meetWhen}>
            <input type="date" className={inputClass} value={form.meetDate || ""} onChange={(e) => set("meetDate", e.target.value)} />
          </Field>
        </div>
      )}

      {/* STEP 2 — campaign details */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-medium tracking-tight text-ink dark:text-white">{dict.step2Title}</h2>
          <Field label={dict.campaignName}>
            <input className={inputClass} value={form.campaignName || ""} onChange={(e) => set("campaignName", e.target.value)} />
          </Field>
          <Field label={dict.costCenter}>
            <input className={inputClass} value={form.costCenter || ""} onChange={(e) => set("costCenter", e.target.value)} />
          </Field>
          <Field label={dict.campaignType}>
            <RadioGroup options={dict.campaignTypeOptions} value={form.campaignType || ""} onChange={(v) => set("campaignType", v)} name="campaignType" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={dict.startDate}>
              <input type="date" className={inputClass} value={form.startDate || ""} onChange={(e) => set("startDate", e.target.value)} />
            </Field>
            <Field label={dict.endDate}>
              <input type="date" className={inputClass} value={form.endDate || ""} onChange={(e) => set("endDate", e.target.value)} />
            </Field>
          </div>
          <Field label={dict.mediaBudget}>
            <textarea rows={3} className={textareaClass} value={form.mediaBudget || ""} onChange={(e) => set("mediaBudget", e.target.value)} />
          </Field>
          <Field label={dict.labourBudget}>
            <textarea rows={2} className={textareaClass} value={form.labourBudget || ""} onChange={(e) => set("labourBudget", e.target.value)} />
          </Field>

          {/* Channel preference table */}
          <div>
            <p className={labelClass}>{dict.channelPrefs}</p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-black/10 dark:border-white/15">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="bg-black/5 text-left dark:bg-white/5">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink/60 dark:text-white/60">Channel</th>
                    {dict.channelCols.map((col) => (
                      <th key={col} className="px-2 py-3 text-center text-[10px] font-medium uppercase tracking-wide text-ink/60 dark:text-white/60">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {channels.map((channel, i) => (
                    <tr key={channel} className="border-t border-black/5 dark:border-white/10">
                      <td className="px-4 py-2 text-ink/80 dark:text-white/80">{channel}</td>
                      {dict.channelCols.map((_, colIdx) => (
                        <td key={colIdx} className="px-2 py-2 text-center">
                          <input
                            type="radio"
                            name={`channel-${i}`}
                            checked={(channelPrefs[i] ?? 0) === colIdx}
                            onChange={() => setChannelPrefs((c) => ({ ...c, [i]: colIdx }))}
                            className="size-4 accent-purple"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Field label={dict.dynamic}>
            <RadioGroup options={dict.dynamicOptions} value={form.dynamic || ""} onChange={(v) => set("dynamic", v)} name="dynamic" otherPlaceholder={dict.other} />
          </Field>

          {/* Services sought */}
          <div>
            <p className={labelClass}>{dict.servicesSought}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {dict.serviceOptions.map((opt) => (
                <label key={opt} className={radioClass}>
                  <input
                    type="checkbox"
                    checked={services.includes(opt)}
                    onChange={(e) => setServices((s) => (e.target.checked ? [...s, opt] : s.filter((x) => x !== opt)))}
                    className="size-4 accent-purple"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <Field label={dict.division}>
            <textarea rows={2} className={textareaClass} value={form.division || ""} onChange={(e) => set("division", e.target.value)} />
          </Field>
          <Field label={dict.channelSetup}>
            <textarea rows={2} className={textareaClass} value={form.channelSetup || ""} onChange={(e) => set("channelSetup", e.target.value)} />
          </Field>

          {/* AI suggestion */}
          <div className="rounded-card bg-pastel-purple/40 p-6 dark:bg-white/[0.04]">
            <button
              type="button"
              onClick={askAI}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 rounded-full bg-purple px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-violet disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              {aiLoading ? dict.aiSuggesting : dict.aiSuggest}
            </button>
            {aiSuggestion && (
              <p className="mt-4 text-sm leading-relaxed text-ink/80 dark:text-white/80">
                <span className="font-medium text-purple dark:text-light-purple">{dict.aiNote}</span>{" "}
                {aiSuggestion}
              </p>
            )}
          </div>
        </div>
      )}

      {/* STEP 3 — target group */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-medium tracking-tight text-ink dark:text-white">{dict.step3Title}</h2>
          <Field label={dict.targetType}>
            <RadioGroup options={dict.targetOptions} value={form.targetType || ""} onChange={(v) => set("targetType", v)} name="targetType" otherPlaceholder={dict.other} />
          </Field>
          <Field label={dict.primaryTarget}>
            <textarea rows={4} className={textareaClass} value={form.primaryTarget || ""} onChange={(e) => set("primaryTarget", e.target.value)} />
          </Field>
          <Field label={dict.secondaryTarget}>
            <textarea rows={3} className={textareaClass} value={form.secondaryTarget || ""} onChange={(e) => set("secondaryTarget", e.target.value)} />
          </Field>
          <Field label={dict.hasResearch}>
            <RadioGroup options={dict.researchOptions} value={form.research || ""} onChange={(v) => set("research", v)} name="research" />
          </Field>
        </div>
      )}

      {/* STEP 4 — goals */}
      {step === 4 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-medium tracking-tight text-ink dark:text-white">{dict.step4Title}</h2>
          <Field label={dict.primaryGoal}>
            <textarea rows={3} className={textareaClass} value={form.primaryGoal || ""} onChange={(e) => set("primaryGoal", e.target.value)} />
          </Field>
          <Field label={dict.secondaryGoal}>
            <textarea rows={3} className={textareaClass} value={form.secondaryGoal || ""} onChange={(e) => set("secondaryGoal", e.target.value)} />
          </Field>
          <Field label={dict.otherGoals}>
            <textarea rows={2} className={textareaClass} value={form.otherGoals || ""} onChange={(e) => set("otherGoals", e.target.value)} />
          </Field>
          <Field label={dict.awarenessVs}>
            <RadioGroup options={dict.awarenessOptions} value={form.awareness || ""} onChange={(v) => set("awareness", v)} name="awareness" />
          </Field>
          <Field label={dict.measurement}>
            <RadioGroup options={dict.measurementOptions} value={form.measurement || ""} onChange={(v) => set("measurement", v)} name="measurement" otherPlaceholder={dict.other} />
          </Field>
          <Field label={dict.reporting}>
            <RadioGroup options={dict.reportingOptions} value={form.reporting || ""} onChange={(v) => set("reporting", v)} name="reporting" otherPlaceholder={dict.other} />
          </Field>
        </div>
      )}

      {/* STEP 5 — materials */}
      {step === 5 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-medium tracking-tight text-ink dark:text-white">{dict.step5Title}</h2>
          <Field label={dict.materialsReady}>
            <textarea rows={4} className={textareaClass} value={form.materials || ""} onChange={(e) => set("materials", e.target.value)} />
          </Field>
          <Field label={dict.trafficTarget}>
            <input className={inputClass} value={form.traffic || ""} onChange={(e) => set("traffic", e.target.value)} />
          </Field>
        </div>
      )}

      {/* STEP 6 — free comments */}
      {step === 6 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-medium tracking-tight text-ink dark:text-white">{dict.step6Title}</h2>
          <Field label={dict.freeCampaign}>
            <textarea rows={4} className={textareaClass} value={form.freeCampaign || ""} onChange={(e) => set("freeCampaign", e.target.value)} />
          </Field>
          <Field label={dict.freeCollab}>
            <textarea rows={4} className={textareaClass} value={form.freeCollab || ""} onChange={(e) => set("freeCollab", e.target.value)} />
          </Field>
        </div>
      )}

      {sendError && (
        <p role="alert" className="mt-8 text-sm text-accent-magenta dark:text-accent-pink">
          {sendError}
        </p>
      )}

      {/* Navigation buttons */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`rounded-full border border-ink/25 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink dark:border-white/25 dark:text-white dark:hover:border-white ${step === 0 ? "invisible" : ""}`}
        >
          {dict.back}
        </button>
        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
            className="rounded-full bg-ink px-7 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-purple dark:bg-purple dark:hover:bg-violet"
          >
            {dict.continue}
          </button>
        ) : (
          <button
            type="button"
            disabled={sending}
            onClick={async () => {
              if (sending) return;
              setSending(true);
              setSendError("");
              try {
                // Posts to the site's own route, which forwards the whole answer
                // set into the CMS inbox with the shared ingest secret.
                const res = await fetch("/api/brief", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ form, channelPrefs, services, locale }),
                });
                const data = (await res.json().catch(() => ({}))) as { error?: string };
                if (!res.ok) throw new Error(data.error || "Could not send the brief.");
                setSent(true);
              } catch (error) {
                setSendError(
                  error instanceof Error
                    ? error.message
                    : locale === "fi"
                      ? "Briefin lähetys ei onnistunut. Lähetä se osoitteeseen info@norr3.fi."
                      : "We could not send the brief. Please email info@norr3.fi instead."
                );
              } finally {
                setSending(false);
              }
            }}
            className="rounded-full bg-ink px-7 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-purple disabled:cursor-not-allowed disabled:opacity-60 dark:bg-purple dark:hover:bg-violet"
          >
            {sending ? (locale === "fi" ? "Lähetetään…" : "Sending…") : dict.send}
          </button>
        )}
      </div>
    </div>
  );
}