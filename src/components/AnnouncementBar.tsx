"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

const STORAGE_KEY = "norr3-announcement-dismissed";

/**
 * The black promo bar above the nav. Unlike the cookie box it renders on the
 * server (so the message is in the SSR HTML and gets indexed), then removes
 * itself on mount for anyone who has already dismissed it — the bar sits in
 * normal flow at the very top, so that removal only shifts the page up once,
 * before paint settles, and never mid-scroll.
 */
export function AnnouncementBar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["announcement"];
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) setVisible(false);
    } catch {
      // Storage can throw (private mode, blocked cookies) — keep the bar.
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore — hiding the bar is still the right response to a click.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="relative bg-ink px-6 py-2.5 text-center text-sm text-white dark:border-b dark:border-white/10">
      <Link
        href={`/${locale}/engine`}
        className="inline-flex items-center gap-2 transition-colors hover:text-light-purple"
      >
        <Icon name="auto_awesome" className="text-[18px]" />
        {dict.message}
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label={dict.dismiss}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-white/60 transition-colors hover:text-white"
      >
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  );
}
