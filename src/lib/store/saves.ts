"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SaveableKind, SavedItem } from "@/types";
import { storage } from "@/lib/data/storage";
import { track } from "@/lib/analytics";

/**
 * Things the couple has kept.
 *
 * Deliberately available before there is any account: saving is the first
 * micro-conversion on the site, and asking someone to sign up before they can
 * keep a photograph they liked is the fastest way to lose them.
 *
 * `hydrated` is false until localStorage has been read. Components that show
 * saved state must wait for it, or the server-rendered markup and the first
 * client render disagree.
 */
interface SavesState {
  items: SavedItem[];
  hydrated: boolean;
  setHydrated: () => void;
  toggle: (kind: SaveableKind, slug: string) => void;
  has: (kind: SaveableKind, slug: string) => boolean;
  byKind: (kind: SaveableKind) => SavedItem[];
  clear: () => void;
}

export const useSaves = create<SavesState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      toggle: (kind, slug) => {
        const saved = get().items.some(
          (item) => item.kind === kind && item.slug === slug,
        );

        if (saved) {
          set({
            items: get().items.filter(
              (item) => !(item.kind === kind && item.slug === slug),
            ),
          });
          if (kind === "inspiration") track({ name: "inspiration_unsaved", slug });
          return;
        }

        set({
          items: [{ kind, slug, savedAt: new Date().toISOString() }, ...get().items],
        });
        if (kind === "inspiration") track({ name: "inspiration_saved", slug });
      },

      has: (kind, slug) =>
        get().items.some((item) => item.kind === kind && item.slug === slug),

      byKind: (kind) => get().items.filter((item) => item.kind === kind),

      clear: () => set({ items: [] }),
    }),
    {
      name: "saves",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ items: state.items }) as SavesState,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
