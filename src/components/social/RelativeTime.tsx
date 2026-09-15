"use client";

import { useSyncExternalStore } from "react";
import { absoluteDate, relativeTime } from "@/lib/socialFormat";
import type { Locale } from "@/i18n/config";

/**
 * One shared minute clock for every timestamp on the page. The snapshot is the
 * current minute, so it stays referentially stable between ticks.
 */
const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    timer = window.setInterval(() => listeners.forEach((l) => l()), 60_000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

const minuteNow = () => Math.floor(Date.now() / 60_000);

/**
 * `<time>` that renders a stable absolute date on the server (and during
 * hydration) and switches to "3 h" style relative time in the browser — so the
 * cached HTML never claims "5 min ago" an hour later.
 */
export function RelativeTime({
  iso,
  locale,
  justNow,
  className = "",
}: {
  iso: string;
  locale: Locale;
  justNow: string;
  className?: string;
}) {
  const minute = useSyncExternalStore(subscribe, minuteNow, () => 0);
  if (!iso) return null;
  const label = minute === 0 ? absoluteDate(iso, locale) : relativeTime(iso, locale, minute * 60_000 + 59_999, justNow);
  return (
    <time dateTime={iso} title={absoluteDate(iso, locale, true)} className={className}>
      {label}
    </time>
  );
}
