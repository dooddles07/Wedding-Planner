import type { Inquiry, Lead } from "@/types";
import { createClient } from "@/lib/supabase/client";
import type { Repository } from "./repository";

function id() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const supabaseRepository: Repository = {
  async createLead(input) {
    const lead: Lead = {
      ...input,
      id: id(),
      createdAt: new Date().toISOString(),
    };
    const supabase = createClient();
    await supabase.from("leads").insert({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      wedding_date: lead.weddingDate,
      location: lead.location,
      guest_count: lead.guestCount,
      message: lead.message,
      source: lead.source,
      context: lead.context,
      created_at: lead.createdAt,
    });

    // Email notification sent server-side (RESEND_API_KEY not available in browser)
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
    const supabase = createClient();
    await supabase.from("inquiries").insert({
      id: inquiry.id,
      target_slug: inquiry.targetSlug,
      target_type: inquiry.targetType,
      name: inquiry.name,
      email: inquiry.email,
      wedding_date: inquiry.weddingDate,
      message: inquiry.message,
      created_at: inquiry.createdAt,
    });
    void fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    }).catch(() => undefined);

    return inquiry;
  },

  async listLeads() {
    const supabase = createClient();
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      weddingDate: row.wedding_date,
      location: row.location,
      guestCount: row.guest_count,
      message: row.message,
      source: row.source,
      context: row.context ?? {},
      createdAt: row.created_at,
    }));
  },
};
