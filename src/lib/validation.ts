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

export const publishSiteSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase alphanumeric with hyphens"),
  published: z.boolean().optional(),
});

export const userStatePutSchema = z.object({
  key: z.string().min(1).max(200),
  value: z.string().max(1_000_000),
});
