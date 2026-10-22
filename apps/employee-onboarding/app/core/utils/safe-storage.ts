/** Reads JSON from localStorage; returns null when missing, unreadable, or rejected by `isValid`. */
export function readJson<T>(key: string, isValid: (value: unknown) => value is T): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Writes JSON to localStorage. Storage can be full or blocked, so failures are non-fatal. */
export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The app keeps working from in-memory state; data just won't survive a reload.
  }
}
