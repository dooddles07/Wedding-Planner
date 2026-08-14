import type { Lead, Inquiry } from "@/types";
import { escapeHtml as esc } from "./escape";

// Resend's JSON API (not raw SMTP) means CR/LF in a subject can't forge
// extra headers the way it could over SMTP — this is defense-in-depth, not
// a fix for an exploitable path today.
const subjectSafe = (value: string) => esc(value).replace(/[\r\n]+/g, " ");

export type RsvpPayload = {
  siteSlug: string;
  name: string;
  email?: string;
  attending: boolean;
  guests: number;
  message?: string;
};

function base(content: string) {
  return `<!doctype html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a0e">${content}</body></html>`;
}

export function buildLeadEmail(lead: Lead) {
  return {
    from: "Marram <onboarding@resend.dev>",
    to: "hello@marram.studio",
    subject: `New enquiry — ${subjectSafe(lead.source)}`,
    html: base(`
      <h2 style="font-weight:300;margin-top:0">New enquiry</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;width:140px">Source</td><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(lead.source)}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee">${lead.name ? esc(lead.name) : "—"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee"><a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Wedding date</td><td style="padding:8px 0;border-bottom:1px solid #eee">${lead.weddingDate ? esc(lead.weddingDate) : "—"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Location</td><td style="padding:8px 0;border-bottom:1px solid #eee">${lead.location ? esc(lead.location) : "—"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Guests</td><td style="padding:8px 0;border-bottom:1px solid #eee">${lead.guestCount ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Message</td><td style="padding:8px 0">${lead.message ? esc(lead.message) : "—"}</td></tr>
      </table>
      <p style="margin-top:24px;color:#888;font-size:12px">Submitted ${new Date(lead.createdAt).toLocaleString("en-GB")}</p>
    `),
  };
}

export function buildInquiryEmail(inquiry: Inquiry) {
  return {
    from: "Marram <onboarding@resend.dev>",
    to: "hello@marram.studio",
    subject: `Enquiry about ${subjectSafe(inquiry.targetSlug)} (${subjectSafe(inquiry.targetType)})`,
    html: base(`
      <h2 style="font-weight:300;margin-top:0">Venue/vendor enquiry</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;width:140px">Target</td><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(inquiry.targetSlug)} (${esc(inquiry.targetType)})</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(inquiry.name)}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee"><a href="mailto:${esc(inquiry.email)}">${esc(inquiry.email)}</a></td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Wedding date</td><td style="padding:8px 0;border-bottom:1px solid #eee">${inquiry.weddingDate ? esc(inquiry.weddingDate) : "—"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Message</td><td style="padding:8px 0">${inquiry.message ? esc(inquiry.message) : "—"}</td></tr>
      </table>
      <p style="margin-top:24px;color:#888;font-size:12px">Submitted ${new Date(inquiry.createdAt).toLocaleString("en-GB")}</p>
    `),
  };
}

export function buildRsvpEmail(rsvp: RsvpPayload, coupleEmail: string) {
  return {
    from: "Marram <onboarding@resend.dev>",
    to: coupleEmail,
    subject: `RSVP from ${subjectSafe(rsvp.name)}`,
    html: base(`
      <h2 style="font-weight:300;margin-top:0">New RSVP for your wedding</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;width:140px">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(rsvp.name)}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Attending</td><td style="padding:8px 0;border-bottom:1px solid #eee">${rsvp.attending ? "Yes" : "No"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Guests</td><td style="padding:8px 0;border-bottom:1px solid #eee">${rsvp.guests}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee">${rsvp.email ? esc(rsvp.email) : "—"}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Message</td><td style="padding:8px 0">${rsvp.message ? esc(rsvp.message) : "—"}</td></tr>
      </table>
    `),
  };
}
