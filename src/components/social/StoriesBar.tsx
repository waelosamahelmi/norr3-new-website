"use client";

import { useCallback, useMemo, useState } from "react";
import { Avatar } from "./Avatar";
import { StoryViewer } from "./StoryViewer";
import { useSeenStories } from "./useSeenStories";
import type { SocialDict } from "./PostCard";
import { fill, type StoryGroup } from "@/lib/socialFormat";
import type { Locale } from "@/i18n/config";

/**
 * The row of story circles above the feed. A member's ring carries the brand
 * gradient while any of their stories is unwatched and turns grey once all of
 * them are; fully watched members slide to the end of the row. Opening one
 * plays that member's stories and carries on through the rest of the row.
 */
export function StoriesBar({ groups, locale, t }: { groups: StoryGroup[]; locale: Locale; t: SocialDict }) {
  const { seen, markSeen } = useSeenStories();
  const [viewer, setViewer] = useState<{ groups: StoryGroup[]; start: number; startIndex: number } | null>(null);
  const close = useCallback(() => setViewer(null), []);

  const ordered = useMemo(() => {
    const unseen = groups.filter((g) => g.stories.some((s) => !seen.has(s.id)));
    const watched = groups.filter((g) => g.stories.every((s) => seen.has(s.id)));
    return [...unseen, ...watched];
  }, [groups, seen]);

  if (groups.length === 0) return null;

  return (
    <section aria-label={t.storiesLabel} className="rounded-card bg-white ring-1 ring-black/[0.06] dark:bg-white/[0.035] dark:ring-white/10">
      <ul className="flex gap-4 overflow-x-auto overscroll-x-contain px-4 py-4 [scrollbar-width:none] sm:gap-5 sm:px-5 [&::-webkit-scrollbar]:hidden" data-lenis-prevent>
        {ordered.map((group, index) => {
          const allSeen = group.stories.every((s) => seen.has(s.id));
          // Start at the first story this browser hasn't watched.
          const firstUnseen = Math.max(0, group.stories.findIndex((s) => !seen.has(s.id)));
          return (
            <li key={group.member.slug} className="shrink-0">
              <button
                type="button"
                onClick={() => setViewer({ groups: ordered, start: index, startIndex: allSeen ? 0 : firstUnseen })}
                aria-label={fill(t.viewStories, { name: group.member.name })}
                className="group/story flex w-[76px] flex-col items-center gap-1.5 rounded-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple"
              >
                <Avatar
                  name={group.member.name}
                  photo={group.member.photo}
                  size={62}
                  ring={allSeen ? "seen" : "unseen"}
                  className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/story:scale-[1.04]"
                />
                <span className={`w-full truncate text-center text-[12px] ${allSeen ? "text-ink/50 dark:text-white/50" : "font-medium text-ink dark:text-white"}`}>
                  {group.member.name.split(" ")[0]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {viewer && (
        <StoryViewer
          groups={viewer.groups}
          startGroup={viewer.start}
          startIndex={viewer.startIndex}
          locale={locale}
          t={t}
          onClose={close}
          onSeen={markSeen}
        />
      )}
    </section>
  );
}
