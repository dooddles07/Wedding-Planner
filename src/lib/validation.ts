import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().max(200).optional(),
  email: z.email(),
  weddingDate: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  guestCount: z.number().int().min(0).max(100000).optional(),
  message: z.string().max(5000).optional(),
  source: z.string().min(1).max(100),
  context: z.record(z.string(), z.unknown()).optional(),
});

export const inquirySchema = z.object({
  targetSlug: z.string().min(1).max(200),
  targetType: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  email: z.email(),
  weddingDate: z.string().max(50).optional(),
  message: z.string().max(5000).optional(),
});

const safeUrl = z
  .string()
  .max(2000)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "must be an http(s) URL")
  .optional()
  .or(z.literal(""));

export const weddingSiteDataSchema = z.object({
  template: z.enum(["first-light", "long-table", "last-dance"]),
  partnerOne: z.string().max(200),
  partnerTwo: z.string().max(200),
  date: z.string().max(50).nullable().optional(),
  location: z.string().max(200),
  venue: z.string().max(200),
  story: z.string().max(10_000),
  heroImageId: z.string().max(200),
  schedule: z
    .array(
      z.object({
        id: z.string().max(200).optional(),
        time: z.string().max(50),
        title: z.string().max(200),
        detail: z.string().max(2000),
      }),
    )
    .max(50),
  travel: z.string().max(5000),
  accommodation: z.string().max(5000),
  dressCode: z.string().max(1000),
  registry: z.string().max(5000),
  registryUrl: safeUrl,
  galleryImageIds: z.array(z.string().max(200)).max(100),
  rsvpEnabled: z.boolean(),
  published: z.boolean().optional(),
  updatedAt: z.string().max(50).optional(),
});

export const publishSiteSchema = weddingSiteDataSchema
  .partial()
  .extend({
    slug: z
      .string()
      .min(1)
      .max(200)
      .regex(/^[a-z0-9-]+$/, "slug must be lowercase alphanumeric with hyphens"),
    published: z.boolean().optional(),
  });

// The app only ever persists these keys (see MANAGED_KEYS in
// src/lib/data/storage.ts and LOCAL_KEYS in src/lib/auth/migrate-local-data.ts).
// Without an allowlist any authenticated user could PUT arbitrarily many
// distinct keys, each up to 1MB, growing the table without bound. See audit
// P2-1.
const USER_STATE_KEYS = ["planning", "wedding-site", "saves", "leads", "inquiries"] as const;

export const userStatePutSchema = z.object({
  key: z.enum(USER_STATE_KEYS),
  value: z.string().max(1_000_000),
});
