import type { Metadata } from "next";
import { SavedList } from "@/components/dashboard/SavedLists";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Saved venues",
  description: "Places you’ve kept.",
  path: "/dashboard/venues",
  noIndex: true,
});

export default function SavedVenuesPage() {
  return (
    <SavedList
      kind="venue"
      title="Saved venues"
      emptyTitle="No saved venues yet."
      emptyBody="Start collecting places that feel like you. Bring the list to the first call and it saves an hour."
      href="/venues"
      cta="Explore venues"
    />
  );
}
