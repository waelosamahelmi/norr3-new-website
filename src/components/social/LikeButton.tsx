"use client";

import { useEffect, useState } from "react";
import { SocialIcon } from "./SocialIcon";
import { requestLikedState, toggleLike, useLike } from "./likes";
import { countLabel } from "@/lib/socialFormat";

export const actionClass =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[6px] px-3 text-[13px] font-medium text-ink/70 transition-colors hover:bg-grey hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple dark:text-white/70 dark:hover:bg-white/[0.07] dark:hover:text-white dark:focus-visible:outline-light-purple";

/**
 * Public Like. Anyone can press it — no login — and it answers instantly: the
 * heart fills and the count moves before the server has replied, then both are
 * reconciled with what the server says.
 */
export function LikeButton({ postId, likeCount, label, unlabel }: { postId: number; likeCount: number; label: string; unlabel: string }) {
  const { liked } = useLike(postId, likeCount);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    requestLikedState(postId);
  }, [postId]);

  return (
    <button
      type="button"
      aria-pressed={liked}
      title={liked ? unlabel : undefined}
      onClick={() => {
        if (!liked) setBurst((n) => n + 1);
        toggleLike(postId, likeCount);
      }}
      className={`${actionClass} ${liked ? "text-purple hover:text-purple dark:text-light-purple dark:hover:text-light-purple" : ""}`}
    >
      <span className="relative inline-flex">
        <SocialIcon
          key={burst}
          name="heart"
          filled={liked}
          size={20}
          className={`${liked ? "text-accent-magenta dark:text-accent-pink" : ""} ${burst > 0 && liked ? "social-like-pop" : ""}`}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

/** The like tally in a post's footer, kept in step with the button. */
export function LikeCount({ postId, likeCount, one, many }: { postId: number; likeCount: number; one: string; many: string }) {
  const { count } = useLike(postId, likeCount);
  if (count <= 0) return <span aria-hidden />;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-accent-magenta text-white">
        <SocialIcon name="heart" filled size={11} />
      </span>
      <span className="tabular-nums">{countLabel(count, one, many)}</span>
    </span>
  );
}
