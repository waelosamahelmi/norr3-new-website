"use client";

const STORAGE_KEY = "norr3-cookie-consent";

/**
 * Footer control that re-opens the cookie consent box. Clearing the stored
 * choice and reloading lets a visitor change or withdraw consent at any time
 * (GDPR art. 7(3)) — without it, the choice could only be reset through
 * browser settings.
 */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Storage blocked (private mode, blocked cookies) — nothing to clear.
        }
        window.location.reload();
      }}
      className="rounded-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {label}
    </button>
  );
}