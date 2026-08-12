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
    heroImageId: "first-light",
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
    { time: "13:30", title: "Guests arrive", detail: "Drinks on the lawn" },
    { time: "14:00", title: "Ceremony", detail: "Please be seated by ten to" },
    { time: "16:30", title: "Dinner", detail: "" },
    { time: "20:30", title: "Dancing", detail: "" },
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
        const slug =
          state.slug ||
          slugify(`${state.partnerOne}-and-${state.partnerTwo}`) ||
          "our-wedding";
        set({ published: true, slug, updatedAt: new Date().toISOString() });
        track({ name: "wedding_site_published", slug });
      },

      unpublish: () => set({ published: false }),
    }),
    {
      name: "wedding-site",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
