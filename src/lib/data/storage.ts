import type { StateStorage } from "zustand/middleware";

/**
 * The persistence backend, in one place.
 *
 * Every planning store writes through this. Today it is localStorage, which
 * means the whole product works with no account and no server. Replacing it
 * with Supabase (or anything else) means implementing three methods here —
 * no store, hook or component changes.
 */

const PREFIX = "marram:";

/** Server renders have no storage. Returning nulls keeps SSR quiet. */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const browserStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(PREFIX + name);
    } catch {
      // Private browsing, disabled storage, quota — none of these should
      // break the page. The couple just loses persistence.
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(PREFIX + name, value);
    } catch {
      /* ignore */
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(PREFIX + name);
    } catch {
      /* ignore */
    }
  },
};

export const storage: StateStorage =
  typeof window === "undefined" ? noopStorage : browserStorage;

const MANAGED_KEYS = ["planning", "wedding-site", "saves", "leads", "inquiries"] as const;

/** Wipes every Marram key. Routes through the storage binding so a swapped backend is also cleared. */
export function clearAllStoredData() {
  MANAGED_KEYS.forEach((key) => storage.removeItem(key));
}
