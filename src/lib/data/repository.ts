import type { Inquiry, Lead } from "@/types";

/**
 * Writes that would leave the browser in production: leads and inquiries.
 *
 * Neon has no client-safe query layer (unlike Supabase's PostgREST), so every
 * write goes through an API route — Drizzle only ever runs server-side.
 */
export interface Repository {
  createLead(input: Omit<Lead, "id" | "createdAt">): Promise<Lead>;
  createInquiry(input: Omit<Inquiry, "id" | "createdAt">): Promise<Inquiry>;
}

export const repository: Repository = {
  async createLead(input) {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create lead");
    return res.json();
  },

  async createInquiry(input) {
    const res = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create inquiry");
    return res.json();
  },
};
