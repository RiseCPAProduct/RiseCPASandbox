import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT = "rise-stored-value-change";

// Used when localStorage is blocked (private mode, disabled site data),
// so dismissals still work for the current visit.
const memory = new Map<string, string>();

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    if (value === null) memory.delete(key);
    else memory.set(key, value);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// Returns undefined on the server and during hydration, so callers can
// render nothing until the stored value is known (no flash, no mismatch).
export function useStoredValue(key: string): [string | null | undefined, (value: string | null) => void] {
  const value = useSyncExternalStore<string | null | undefined>(
    subscribe,
    () => read(key),
    () => undefined,
  );
  const setValue = useCallback((next: string | null) => write(key, next), [key]);
  return [value, setValue];
}
