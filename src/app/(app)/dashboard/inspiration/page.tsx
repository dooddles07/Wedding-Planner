import type { Metadata } from "next";
import { SavedList } from "@/components/dashboard/SavedLists";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Saved inspiration",
  description: "Images you’ve kept.",
  path: "/dashboard/inspiration",
  noIndex: true,
});

export default function SavedInspirationPage() {
  return (
    <SavedList
      kind="inspiration"
      title="Kept"
      emptyTitle="Nothing kept yet."
      emptyBody="Start collecting images that feel like you. Twenty of them tell a florist more than any brief you could write."
      href="/inspiration"
      cta="Open the gallery"
    />
  );
}
