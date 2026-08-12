import type { Metadata } from "next";
import { VenueDirectory } from "@/components/directory/VenueDirectory";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground } from "@/components/editorial/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Venues",
  description:
    "Eight places we know properly — country houses, barns, a net shed on the shingle, a masseria in Puglia. Filter by guest count, region and style.",
  path: "/venues",
  imageKey: "venue-elmhurst",
});

export default function VenuesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Venues", path: "/venues" },
        ])}
      />

      <PageHeader
        marker="Eight we know properly"
        title={"Places we have\nactually worked in."}
        standfirst="Not a directory of everywhere. These are the ones where we know the kitchen, the acoustics, which lane floods and what the light does at five o’clock — which is the only kind of recommendation worth having."
      />

      <VenueDirectory />

      <Ground name="ink" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-[22ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
                None of these quite right?
              </h2>
              <p className="mt-4 max-w-[46ch] font-sans text-base leading-relaxed text-paper/70">
                Sourcing is the cheapest thing we do and the most useful. A short
                list, honest notes on each, and contract review before you sign.
              </p>
            </div>
            <ButtonLink href="/services/venue-and-vendor-sourcing" variant="primary" size="lg">
              How sourcing works
            </ButtonLink>
          </div>
        </Container>
      </Ground>
    </>
  );
}
