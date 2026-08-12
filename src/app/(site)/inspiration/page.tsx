import type { Metadata } from "next";
import { Suspense } from "react";
import { InspirationGallery } from "@/components/gallery/InspirationGallery";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container } from "@/components/editorial/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Inspiration",
  description:
    "A filterable gallery of wedding photography — by style, season, location, venue and mood. Keep what you like; it stays in your browser, no account needed.",
  path: "/inspiration",
  imageKey: "golden-hour",
});

export default function InspirationPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Inspiration", path: "/inspiration" },
        ])}
      />

      <PageHeader
        marker="Keep what you like"
        title={"Other people’s weddings,\nfiled properly."}
        standfirst="Filter by style, season, colour or venue. Keep the ones that feel like yours — they stay in this browser, and they make the first call twice as useful."
      />

      <Suspense fallback={<GalleryFallback />}>
        <InspirationGallery />
      </Suspense>
    </>
  );
}

/** Skeleton in the shape of the masonry, so nothing jumps when it arrives. */
function GalleryFallback() {
  const heights = [280, 360, 240, 320, 300, 380, 260, 340];
  return (
    <Container>
      <div className="h-14 border-y border-ink/12" />
      <div className="columns-2 gap-4 pt-8 pb-24 lg:columns-4 lg:gap-6 [&>*]:mb-4 lg:[&>*]:mb-6">
        {heights.map((height, index) => (
          <div
            key={index}
            className="animate-pulse break-inside-avoid bg-linen"
            style={{ height }}
          />
        ))}
      </div>
    </Container>
  );
}
