import { Resend } from "resend";
import type { Lead, Inquiry } from "@/types";
import {
  buildLeadEmail,
  buildInquiryEmail,
  buildRsvpEmail,
  type RsvpPayload,
} from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLeadEmail(lead: Lead) {
  await resend.emails.send(buildLeadEmail(lead));
}

export async function sendInquiryEmail(inquiry: Inquiry) {
  await resend.emails.send(buildInquiryEmail(inquiry));
}

export async function sendRsvpEmail(rsvp: RsvpPayload, coupleEmail: string) {
  await resend.emails.send(buildRsvpEmail(rsvp, coupleEmail));
}
