import type { Inquiry, Lead } from "@/types";
import { storage } from "./storage";

/**
 * Writes that would leave the browser in production: leads and inquiries.
 *
 * The interface is the swap point. `localRepository` keeps them in the
 * browser and posts them to /api/lead so there is one real network call to
 * point at a CRM, an inbox or a database later.
 */
export interface Repository {
  createLead(input: Omit<Lead, "id" | "createdAt">): Promise<Lead>;
  createInquiry(input: Omit<Inquiry, "id" | "createdAt">): Promise<Inquiry>;
  listLeads(): Promise<Lead[]>;
}

function id() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function read<T>(key: string): Promise<T[]> {
  const raw = await storage.getItem(key);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function write<T>(key: string, value: T[]): Promise<void> {
  await storage.setItem(key, JSON.stringify(value));
}

export const localRepository: Repository = {
  async createLead(input) {
    const lead: Lead = { ...input, id: id(), createdAt: new Date().toISOString() };

    const existing = await read<Lead>("leads");
    await write("leads", [lead, ...existing]);

    // The one real network call in the product. Failure is not surfaced to
    // the couple — their submission is already saved locally.
    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    }).catch(() => undefined);

    return lead;
  },

  async createInquiry(input) {
    const inquiry: Inquiry = {
      ...input,
      id: id(),
      createdAt: new Date().toISOString(),
    };
    const existing = await read<Inquiry>("inquiries");
    await write("inquiries", [inquiry, ...existing]);
    return inquiry;
  },

  async listLeads() {
    return read<Lead>("leads");
  },
};

import { supabaseRepository } from "./supabase-repository";

export const repository: Repository = supabaseRepository;
