"use client";

import { Icon } from "@/components/Icon";

const STORAGE_KEY = "norr3-theme";

/**
 * Light/dark switch. The current theme lives on <html> (written by the
 * pre-paint script in the root layout), so this component holds no state at
 * all — the two icons swap purely via the `dark:` variant. That keeps it out
 * of hydration entirely: no mismatch, no post-mount icon flip.
 */
export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can throw (private mode, blocked cookies) — the class still flipped.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white/70 dark:hover:text-white dark:focus-visible:outline-light-purple"
    >
      {/* Visibility lives on plain wrapper spans, not on the Icon itself:
          material-symbols' own `display: inline-block` is UNLAYERED css, so it
          always beats Tailwind's layered `hidden`/`dark:hidden` utilities and
          both glyphs would render at once. */}
      <span className="dark:hidden">
        <Icon name="dark_mode" className="text-[20px]" />
      </span>
      <span className="hidden dark:block">
        <Icon name="light_mode" className="text-[20px]" />
      </span>
    </button>
  );
}
