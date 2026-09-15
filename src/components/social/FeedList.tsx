"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { PostCard, type SocialDict } from "./PostCard";
import { linkTo } from "@/lib/links";
import { hasTag, type Post } from "@/lib/socialFormat";
import type { Locale } from "@/i18n/config";

const moreButton =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-ink/60 px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-ink transition-[transform,background-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink hover:text-white active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/50 dark:text-white dark:hover:bg-white dark:hover:text-ink dark:focus-visible:outline-light-purple";

/**
 * The feed's post list. The first page arrives server-rendered; "Load more"
 * pages through `/api/social/feed?before=<id>`, a thin cached proxy of the
 * CMS feed. A `#tag` (from a hashtag link) filters what has been loaded.
 */
export function FeedList({
  initialPosts,
  initialNextBefore,
  locale,
  t,
  tag,
}: {
  initialPosts: Post[];
  initialNextBefore: number | null;
  locale: Locale;
  t: SocialDict;
  tag?: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextBefore, setNextBefore] = useState(initialNextBefore);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function loadMore() {
    if (!nextBefore || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/social/feed?before=${nextBefore}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { posts: Post[]; nextBefore: number | null };
      setPosts((current) => {
        const known = new Set(current.map((p) => p.id));
        return [...current, ...data.posts.filter((p) => !known.has(p.id))];
      });
      setNextBefore(data.posts.length > 0 ? data.nextBefore : null);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  const visible = tag ? posts.filter((p) => hasTag(p, tag)) : posts;

  return (
    <div>
      {tag && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-card bg-pastel-purple/40 px-4 py-3 dark:bg-white/[0.06]">
          <p className="text-[14px] text-ink/70 dark:text-white/70">
            {t.taggedHeading} <span className="font-medium text-purple dark:text-light-purple">#{tag}</span>
          </p>
          <Link
            href={linkTo(locale, "/feed")}
            className="inline-flex items-center gap-1 rounded-sm text-[13px] font-medium text-ink hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
          >
            {t.clearTag}
            <Icon name="close" style={{ fontSize: "16px" }} />
          </Link>
        </div>
      )}

      {tag && visible.length === 0 && posts.length > 0 && (
        <p className="rounded-card bg-white px-5 py-8 text-center text-[14px] text-ink/60 ring-1 ring-black/[0.06] dark:bg-white/[0.035] dark:text-white/60 dark:ring-white/10">
          {t.taggedEmpty}
        </p>
      )}

      <ol aria-label={t.postsLabel} className="space-y-4 sm:space-y-5">
        {visible.map((post) => (
          <li key={post.id}>
            <PostCard post={post} locale={locale} t={t} />
          </li>
        ))}
      </ol>

      {posts.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          {nextBefore ? (
            <button type="button" onClick={loadMore} disabled={status === "loading"} aria-busy={status === "loading"} className={moreButton}>
              {status === "loading" ? t.loading : t.loadMore}
            </button>
          ) : (
            <p className="text-[13px] text-ink/45 dark:text-white/45">{t.endOfFeed}</p>
          )}
          <p role="status" className="text-[13px] font-medium text-violet dark:text-light-purple">
            {status === "error" ? t.loadError : ""}
          </p>
        </div>
      )}
    </div>
  );
}
