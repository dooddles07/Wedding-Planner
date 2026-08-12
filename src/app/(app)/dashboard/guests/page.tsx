import type { Metadata } from "next";
import { GuestTable } from "@/components/dashboard/GuestTable";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Guests",
  description: "The guest list, RSVPs, meals and dietary requirements.",
  path: "/dashboard/guests",
  noIndex: true,
});

export default function GuestsPage() {
  return <GuestTable />;
}
