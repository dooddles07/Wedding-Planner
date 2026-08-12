import type { Metadata } from "next";
import { PublishedSite } from "@/components/site-builder/PublishedSite";

export const metadata: Metadata = {
  title: "A wedding",
  // A couple’s own page has no business in a search index.
  robots: { index: false, follow: false },
};

/**
 * The published couple site.
 *
 * The content lives in the couple’s own browser in this build, so the page is
 * rendered on the client from that store. With a backend, this becomes a
 * server component that fetches by slug — the presentation component below it
 * would not change.
 */
export default async function PublishedWeddingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublishedSite slug={slug} />;
}
