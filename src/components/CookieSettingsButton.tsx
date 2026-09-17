"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

/**
 * Footer control that re-opens the cookie consent box with the current choice
 * loaded, so a visitor can change or withdraw consent at any time without
 * hunting through browser settings (GDPR art. 7(3), Finnish Act on Electronic
 * Communications Services). Saving a new choice replaces the old record.
 */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
      }}
      className="rounded-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {label}
    </button>
  );
}
