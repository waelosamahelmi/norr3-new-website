"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorageItem } from "@/lib/useLocalStorageItem";

const KEY = "norr3-social-seen-stories";
/** Stories live 24 h; a few hundred ids is weeks of history. */
const MAX = 400;

/**
 * Which story ids this browser has watched, in localStorage. Before hydration
 * (and when storage is blocked) nothing counts as seen, so rings render as
 * unseen — the honest default for a first visit.
 */
export function useSeenStories() {
  const [raw, setRaw] = useLocalStorageItem(KEY, { serverValue: null, errorValue: null });

  const seen = useMemo(() => {
    try {
      const parsed = JSON.parse(raw ?? "[]") as unknown;
      return new Set(Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === "number") : []);
    } catch {
      return new Set<number>();
    }
  }, [raw]);

  const markSeen = useCallback(
    (id: number) => {
      let current: number[] = [];
      try {
        const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as unknown;
        if (Array.isArray(parsed)) current = parsed.filter((v): v is number => typeof v === "number");
      } catch {
        /* start over */
      }
      if (current.includes(id)) return;
      setRaw(JSON.stringify([...current, id].slice(-MAX)));
    },
    [setRaw]
  );

  return { seen, markSeen };
}
