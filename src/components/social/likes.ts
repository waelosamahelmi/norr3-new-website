"use client";

import { useSyncExternalStore } from "react";

/**
 * Client-side like state, shared by every Like button and count on the page.
 *
 * - Which posts this visitor has liked is asked for in ONE request per render
 *   burst: buttons register their post id, and the ids are flushed together on
 *   the next tick (cards appended by "Load more" become a second batch).
 * - Counts start from the cached post data and are only overridden once the
 *   visitor has pressed something, then reconciled with the server's answer.
 */

type State = { liked: ReadonlySet<number>; counts: ReadonlyMap<number, number> };

let state: State = { liked: new Set(), counts: new Map() };
const listeners = new Set<() => void>();
const EMPTY: State = { liked: new Set(), counts: new Map() };

function set(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* ---------------------------------------------------------- initial load */

const requested = new Set<number>();
const queue = new Set<number>();
let flushTimer: number | undefined;

export function requestLikedState(id: number) {
  if (requested.has(id)) return;
  requested.add(id);
  queue.add(id);
  if (flushTimer !== undefined) return;
  flushTimer = window.setTimeout(async () => {
    flushTimer = undefined;
    const ids = [...queue];
    queue.clear();
    // The API caps a request; big pages simply take a few.
    for (let i = 0; i < ids.length; i += 100) {
      try {
        const res = await fetch(`/api/social/like?ids=${ids.slice(i, i + 100).join(",")}`, { cache: "no-store" });
        if (!res.ok) continue;
        const data = (await res.json()) as { liked?: number[] };
        if (!Array.isArray(data.liked) || data.liked.length === 0) continue;
        const liked = new Set(state.liked);
        for (const id of data.liked) if (!pending.has(id)) liked.add(id);
        set({ liked });
      } catch {
        /* likes are a nicety — the page works without them */
      }
    }
  }, 0);
}

/* --------------------------------------------------------------- toggling */

/** Posts with a request in flight → the state the visitor wants to end up in. */
const pending = new Map<number, boolean>();

export function toggleLike(id: number, baseCount: number) {
  const wasLiked = state.liked.has(id);
  const want = !wasLiked;
  const current = state.counts.get(id) ?? baseCount;
  const liked = new Set(state.liked);
  if (want) liked.add(id);
  else liked.delete(id);
  const counts = new Map(state.counts);
  counts.set(id, Math.max(0, current + (want ? 1 : -1)));
  set({ liked, counts });

  const inFlight = pending.has(id);
  pending.set(id, want);
  if (!inFlight) void send(id, want, wasLiked, current);
}

async function send(id: number, want: boolean, rollbackLiked: boolean, rollbackCount: number) {
  let result: { likeCount: number; liked: boolean } | null = null;
  try {
    const res = await fetch("/api/social/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, liked: want }),
    });
    if (res.ok) result = (await res.json()) as { likeCount: number; liked: boolean };
  } catch {
    result = null;
  }

  const latest = pending.get(id);
  if (latest !== undefined && latest !== want && result) {
    // The visitor changed their mind while this was in flight — send that too.
    pending.set(id, latest);
    return send(id, latest, result.liked, result.likeCount);
  }
  pending.delete(id);

  const liked = new Set(state.liked);
  const counts = new Map(state.counts);
  if (result && typeof result.likeCount === "number") {
    if (result.liked) liked.add(id);
    else liked.delete(id);
    counts.set(id, result.likeCount);
  } else {
    // Failed: put things back the way the server last had them.
    if (rollbackLiked) liked.add(id);
    else liked.delete(id);
    counts.set(id, rollbackCount);
  }
  set({ liked, counts });
}

/* ------------------------------------------------------------------- hooks */

export function useLike(id: number, baseCount: number): { liked: boolean; count: number } {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => EMPTY);
  return { liked: snapshot.liked.has(id), count: snapshot.counts.get(id) ?? baseCount };
}
