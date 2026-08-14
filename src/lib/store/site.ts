"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SiteTemplate, WeddingSite } from "@/types";
import { storage } from "@/lib/data/storage";
import { slugify } from "@/lib/utils";
import { track } from "@/lib/analytics";

/**
 * The couple’s own wedding site.
 *
 * A structured document plus a template choice — not a page editor. Three
 * templates, each a real design rather than a colour scheme, and the content
 * is the same shape in all of them, so switching template never loses work.
 */
export const TEMPLATES: {
  id: SiteTemplate;
  name: string;
  note: string;
  heroImageId: string;
}[] = [
  {
    id: "first-light",
    name: "First light",
    note: "Dark, quiet, one photograph doing all the work.",
    // The thumbnail advertises the treatment, not the couple's own photograph,
    // so a dark template needs a dark plate behind its name.
    heroImageId: "couple-dusk",
  },
  {
    id: "long-table",
    name: "Long table",
    note: "Warm and generous. Best with a lot of people and a lot of food.",
    heroImageId: "long-table",
  },
  {
    id: "last-dance",
    name: "Last dance",
    note: "Pale, spare, almost no colour. Lets the schedule do the talking.",
    heroImageId: "style-minimal",
  },
];

interface SiteState extends WeddingSite {
  hydrated: boolean;
  setHydrated: () => void;
  update: (patch: Partial<WeddingSite>) => void;
  publish: () => void;
  unpublish: () => void;
  slugSuffix: string | null;
}

const initial: WeddingSite = {
  slug: "",
  template: "first-light",
  partnerOne: "",
  partnerTwo: "",
  date: null,
  location: "",
  venue: "",
  story: "",
  heroImageId: "first-light",
  schedule: [
    { id: "entry-arrival", time: "13:30", title: "Guests arrive", detail: "Drinks on the lawn" },
    { id: "entry-ceremony", time: "14:00", title: "Ceremony", detail: "Please be seated by ten to" },
    { id: "entry-dinner", time: "16:30", title: "Dinner", detail: "" },
    { id: "entry-dancing", time: "20:30", title: "Dancing", detail: "" },
  ],
  travel: "",
  accommodation: "",
  dressCode: "",
  registry: "",
  registryUrl: "",
  galleryImageIds: [],
  rsvpEnabled: true,
  published: false,
  updatedAt: new Date(0).toISOString(),
};

export const useSite = create<SiteState>()(
  persist(
    (set, get) => ({
      ...initial,
      hydrated: false,
      slugSuffix: null,
      setHydrated: () => set({ hydrated: true }),

      update: (patch) => {
        const next = { ...patch, updatedAt: new Date().toISOString() };

        // The slug follows the names until the couple has published, after
        // which it is frozen — a published URL that changes is a broken one.
        const state = get();
        if (!state.published && (patch.partnerOne || patch.partnerTwo)) {
          const one = patch.partnerOne ?? state.partnerOne;
          const two = patch.partnerTwo ?? state.partnerTwo;
          if (one && two) Object.assign(next, { slug: slugify(`${one}-and-${two}`) });
        }

        set(next as Partial<SiteState>);
      },

      publish: () => {
        const state = get();

        // Once a site has published before, `state.slug` already has the
        // suffix baked in — reusing it verbatim (rather than appending the
        // suffix again) is what actually keeps an unpublish → republish
        // cycle on the same URL, instead of growing it by another suffix
        // every time.
        if (state.slugSuffix && state.slug) {
          set({ published: true, updatedAt: new Date().toISOString() });
          track({ name: "wedding_site_published", slug: state.slug });
          void fetch("/api/publish-site", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...get(), published: true }),
          }).catch(() => undefined);
          return;
        }

        const suffix = Math.random().toString(36).slice(2, 6);
        const base =
          state.slug ||
          slugify(`${state.partnerOne}-and-${state.partnerTwo}`) ||
          "our-wedding";
        const slug = `${base}-${suffix}`;
        set({ published: true, slug, slugSuffix: suffix, updatedAt: new Date().toISOString() });
        track({ name: "wedding_site_published", slug });
        void fetch("/api/publish-site", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...get(), published: true }),
        }).catch(() => undefined);
      },

      unpublish: () => {
        const state = get();
        set({ published: false });
        if (state.slug) {
          void fetch("/api/publish-site", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: state.slug, published: false }),
          }).catch(() => undefined);
        }
      },
    }),
    {
      name: "wedding-site",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
