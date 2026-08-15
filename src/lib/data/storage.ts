import type { StateStorage } from "zustand/middleware";
import { getSession } from "next-auth/react";
import { migrateLocalDataIfNeeded } from "@/lib/auth/migrate-local-data";

const PREFIX = "marram:";

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

// `getItem` distinguishes "confirmed empty" (null) from "we don't know" —
// a failed request throws instead of resolving null, so a transient 500 or
// network blip can never be read by zustand's persist as "no data yet" and
// hydrate the store to defaults, which the next autosave would then write
// back over the couple's real saved data. See audit P0-1.
const serverStorage: StateStorage = {
  async getItem(key) {
    const res = await fetch(`/api/user-state?key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error(`user-state GET failed: ${res.status}`);
    const data = await res.json();
    return data.value ?? null;
  },
  async setItem(key, value) {
    const res = await fetch("/api/user-state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) {
      window.dispatchEvent(new CustomEvent("marram:save-error", { detail: { key, status: res.status } }));
      throw new Error(`user-state PUT failed: ${res.status}`);
    }
  },
  async removeItem(key) {
    const res = await fetch(`/api/user-state?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`user-state DELETE failed: ${res.status}`);
  },
};

// Runs once per login: pushes any pre-account localStorage data up to the
// server before the store's very first server-backed read, so a couple who
// planned anonymously and then signs in doesn't have that read see an empty
// row, hydrate to defaults, and have the next autosave overwrite it. See
// audit P0-2. Cached so concurrent stores (planning/site/saves all mount at
// once) share one in-flight migration rather than racing three copies.
let migrationReady: Promise<void> | null = null;
function ensureMigrated(): Promise<void> {
  if (!migrationReady) {
    migrationReady = migrateLocalDataIfNeeded().catch(() => {
      migrationReady = null;
    });
  }
  return migrationReady;
}

// Every persisted store write (planning/site/saves, on every autosave —
// effectively every keystroke) was calling getSession(), each a round trip
// to /api/auth/session, just to decide which backend to use. Short TTL
// cache cuts that to roughly once per few seconds of activity; login/logout
// mid-window at worst delays which backend a single save lands in, which
// the per-user-scoped API routes make harmless.
let cachedSession: { value: Awaited<ReturnType<typeof getSession>>; at: number } | null = null;
const SESSION_CACHE_MS = 3000;
async function getCachedSession() {
  const now = Date.now();
  if (cachedSession && now - cachedSession.at < SESSION_CACHE_MS) return cachedSession.value;
  const value = await getSession();
  cachedSession = { value, at: now };
  return value;
}

function createAuthAwareStorage(): StateStorage {
  return {
    async getItem(key) {
      const session = await getCachedSession();
      if (!session?.user) return browserStorage.getItem(key);
      await ensureMigrated();
      return serverStorage.getItem(key);
    },
    async setItem(key, value) {
      const session = await getCachedSession();
      return session?.user
        ? serverStorage.setItem(key, value)
        : browserStorage.setItem(key, value);
    },
    async removeItem(key) {
      const session = await getCachedSession();
      return session?.user
        ? serverStorage.removeItem(key)
        : browserStorage.removeItem(key);
    },
  };
}

export const storage: StateStorage =
  typeof window === "undefined" ? noopStorage : createAuthAwareStorage();

// "leads"/"inquiries" were dropped when repository.ts moved to hitting
// /api/lead and /api/inquiry directly instead of persisting through this
// storage layer — nothing writes those keys anymore, so clearing them here
// was always a no-op. Kept out to avoid implying they're still live.
const MANAGED_KEYS = ["planning", "wedding-site", "saves"] as const;

export function clearAllStoredData() {
  MANAGED_KEYS.forEach((key) => storage.removeItem(key));
}
