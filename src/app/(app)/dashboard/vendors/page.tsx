import type { Metadata } from "next";
import { SavedList } from "@/components/dashboard/SavedLists";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Saved suppliers",
  description: "People you’ve kept.",
  path: "/dashboard/vendors",
  noIndex: true,
});

export default function SavedVendorsPage() {
  return (
    <SavedList
      kind="vendor"
      title="Saved suppliers"
      emptyTitle="Nobody saved yet."
      emptyBody="Keep the photographers, florists and caterers you like as you browse. We’ll check their availability for your date."
      href="/vendors"
      cta="Browse suppliers"
    />
  );
}
