import type { StateStorage } from "zustand/middleware";
import { getSession } from "next-auth/react";

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

const serverStorage: StateStorage = {
  async getItem(key) {
    const res = await fetch(`/api/user-state?key=${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.value ?? null;
  },
  async setItem(key, value) {
    await fetch("/api/user-state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  },
  async removeItem(key) {
    await fetch(`/api/user-state?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
  },
};

function createAuthAwareStorage(): StateStorage {
  return {
    async getItem(key) {
      const session = await getSession();
      return session?.user
        ? serverStorage.getItem(key)
        : browserStorage.getItem(key);
    },
    async setItem(key, value) {
      const session = await getSession();
      return session?.user
        ? serverStorage.setItem(key, value)
        : browserStorage.setItem(key, value);
    },
    async removeItem(key) {
      const session = await getSession();
      return session?.user
        ? serverStorage.removeItem(key)
        : browserStorage.removeItem(key);
    },
  };
}

export const storage: StateStorage =
  typeof window === "undefined" ? noopStorage : createAuthAwareStorage();

const MANAGED_KEYS = [
  "planning",
  "wedding-site",
  "saves",
  "leads",
  "inquiries",
] as const;

export function clearAllStoredData() {
  MANAGED_KEYS.forEach((key) => storage.removeItem(key));
}
