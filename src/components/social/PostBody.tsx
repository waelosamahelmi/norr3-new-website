"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { tokenizeBody } from "@/lib/socialFormat";
import { linkTo } from "@/lib/links";
import type { Locale } from "@/i18n/config";

const linkClass =
  "font-medium text-purple underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-light-purple dark:focus-visible:outline-light-purple";

/** Plain post text with line breaks kept, URLs and #hashtags linked. */
export function BodyText({ body, locale }: { body: string; locale: Locale }) {
  return (
    <>
      {tokenizeBody(body).map((token, i) => {
        if (token.type === "url") {
          return (
            <a key={i} href={token.href} target="_blank" rel="noopener noreferrer nofollow ugc" className={`${linkClass} break-all`}>
              {token.value.replace(/^https?:\/\//, "")}
            </a>
          );
        }
        if (token.type === "tag") {
          return (
            <Link key={i} href={`${linkTo(locale, "/feed")}?tag=${encodeURIComponent(token.tag)}`} className={linkClass}>
              {token.value}
            </Link>
          );
        }
        return <span key={i}>{token.value}</span>;
      })}
    </>
  );
}

/**
 * The post text, clamped to a few lines with a LinkedIn-style "…see more".
 * Whether the clamp actually cuts anything is measured in the browser (fonts
 * and widths vary), so short posts never show the button. `lang` marks posts
 * written in the other language for screen readers and hyphenation.
 */
export function PostBody({
  body,
  lang,
  locale,
  clamp = true,
  lines = 5,
  seeMore,
  seeLess,
  size = "md",
}: {
  body: string;
  /** The language the text is written in, when known. */
  lang?: "fi" | "en";
  locale: Locale;
  clamp?: boolean;
  lines?: number;
  seeMore: string;
  seeLess: string;
  size?: "md" | "sm";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !clamp) return;
    const observer = new ResizeObserver(() => {
      if (el.dataset.expanded === "true") return;
      setOverflowing(el.scrollHeight > el.clientHeight + 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [clamp, body]);

  if (!body.trim()) return null;
  const clamped = clamp && !expanded;

  return (
    <div>
      <div
        ref={ref}
        id={id}
        lang={lang}
        data-expanded={expanded ? "true" : "false"}
        className={`whitespace-pre-line break-words text-ink/85 dark:text-white/85 ${
          size === "sm" ? "text-[14px] leading-relaxed" : "text-[15px] leading-relaxed"
        } ${clamped ? "overflow-hidden" : ""}`}
        style={clamped ? { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: lines } : undefined}
      >
        <BodyText body={body} locale={locale} />
      </div>
      {clamp && (overflowing || expanded) && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 rounded-sm text-[14px] font-medium text-ink/55 transition-colors hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white/55 dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
        >
          {expanded ? seeLess : seeMore}
        </button>
      )}
    </div>
  );
}
