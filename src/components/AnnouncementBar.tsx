"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useLocalStorageItem } from "@/lib/useLocalStorageItem";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";
import { linkTo } from "@/lib/links";

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
  message,
  href = "/engine",
}: {
  locale: Locale;
  dict: Dictionary["announcement"];
  /** Live message from the CMS; falls back to the dictionary copy. */
  message?: string;
  /** Where the bar links to — also editable in the CMS. */
  href?: string;
}) {
  // serverValue null keeps the bar in the SSR HTML; errorValue null keeps it
  // when storage throws (private mode, blocked cookies).
  const [dismissed, setDismissed] = useLocalStorageItem(STORAGE_KEY, {
    serverValue: null,
    errorValue: null,
  });
  // Hidden in the page editor's preview frame: it belongs to the site chrome,
  // not to the page being composed, and it eats vertical space in a narrow frame.
  const inEditorPreview = usePathname().includes("/cms-preview");

  if (dismissed || inEditorPreview) return null;

  return (
    <div className="relative z-[60] bg-ink px-6 py-2.5 text-center text-sm text-white dark:border-b dark:border-white/10">
      <Link
        href={linkTo(locale, `${href.startsWith("/") ? href : `/${href}`}`)}
        className="inline-flex items-center gap-2 rounded-sm transition-colors hover:text-light-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Icon name="auto_awesome" className="text-[18px]" />
        {message || dict.message}
      </Link>
      <button
        type="button"
        onClick={() => setDismissed("1")}
        aria-label={dict.dismiss}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  );
}
