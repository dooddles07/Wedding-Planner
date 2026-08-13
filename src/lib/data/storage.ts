import type { StateStorage } from "zustand/middleware";
import { supabaseStorage } from "./supabase-storage";
import { createClient } from "@/lib/supabase/client";

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

function createAuthAwareStorage(): StateStorage {
  return {
    async getItem(key) {
      if (typeof window === "undefined") return null;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) return supabaseStorage.getItem(key);
      return browserStorage.getItem(key);
    },
    async setItem(key, value) {
      if (typeof window === "undefined") return;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) return supabaseStorage.setItem(key, value);
      return browserStorage.setItem(key, value);
    },
    async removeItem(key) {
      if (typeof window === "undefined") return;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) return supabaseStorage.removeItem(key);
      return browserStorage.removeItem(key);
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
