export function createBrowserStore<T>(key: string, fallback: T) {
  let snapshot = fallback;
  let rawCache: string | null = null;
  const listeners = new Set<() => void>();

  function read(): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === rawCache) return snapshot;
      rawCache = raw;
      snapshot = raw ? (JSON.parse(raw) as T) : fallback;
      return snapshot;
    } catch {
      return fallback;
    }
  }

  function emit() {
    listeners.forEach((listener) => listener());
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      return read();
    },
    getServerSnapshot() {
      return fallback;
    },
    set(next: T | ((current: T) => T)) {
      const current = read();
      const value = typeof next === "function" ? (next as (current: T) => T)(current) : next;
      snapshot = value;
      rawCache = JSON.stringify(value);
      window.localStorage.setItem(key, rawCache);
      emit();
    },
    clear() {
      window.localStorage.removeItem(key);
      snapshot = fallback;
      rawCache = null;
      emit();
    },
  };
}
