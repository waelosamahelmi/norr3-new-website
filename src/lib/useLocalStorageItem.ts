"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * localStorage as an external store (the documented alternative to reading it
 * in an effect and calling setState). Same-tab writes don't fire the browser's
 * "storage" event, so setters also notify a local listener set.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useLocalStorageItem(
  key: string,
  {
    serverValue,
    errorValue,
  }: {
    /** Snapshot used for SSR and the hydration render, before storage is readable. */
    serverValue: string | null;
    /** Snapshot when storage throws (private mode, blocked cookies). */
    errorValue: string | null;
  },
) {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return errorValue;
    }
  }, [key, errorValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, () => serverValue);

  const setValue = useCallback(
    (next: string) => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // Ignore — the UI should still respond to the click.
      }
      for (const listener of listeners) listener();
    },
    [key],
  );

  return [value, setValue] as const;
}
