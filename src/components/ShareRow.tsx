"use client";

import { useState } from "react";
import { Icon } from "./Icon";

const chipClass =
  "inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/25 dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-ink dark:focus-visible:outline-light-purple";

/**
 * End-of-article share row: LinkedIn (where this audience actually shares) and
 * a copy-link button. The copy state is announced politely rather than only
 * shown, and the label reverts after two seconds. No share counts, no tracking
 * pixels — the buttons are plain links.
 */
export function ShareRow({
  url,
  label,
  linkedinLabel,
  copyLabel,
  copiedLabel,
}: {
  url: string;
  label: string;
  linkedinLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — leave the
      // label untouched rather than claiming a copy that never happened.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">{label}</p>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        aria-label={linkedinLabel}
        className={chipClass}
      >
        LinkedIn
        <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
      </a>
      <button type="button" onClick={copy} className={chipClass}>
        {copied ? copiedLabel : copyLabel}
        <Icon name={copied ? "check" : "link"} style={{ fontSize: "14px" }} />
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}
