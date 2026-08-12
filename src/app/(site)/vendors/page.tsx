import type { Metadata } from "next";
import { VendorDirectory } from "@/components/directory/VendorDirectory";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container, Ground } from "@/components/editorial/Layout";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Suppliers",
  description:
    "Photographers, florists, caterers, bands and the rest — a short list of people we have worked with and would book ourselves. No commission, ever.",
  path: "/vendors",
  imageKey: "vendor-photography",
});

export default function VendorsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Suppliers", path: "/vendors" },
        ])}
      />

      <PageHeader
        marker="Short on purpose"
        title={"People we would\nbook ourselves."}
        standfirst="Sixteen names rather than six hundred. We take no commission from any of them — if one offers, we ask them to take it off your invoice instead, which is the only thing that makes a shortlist mean anything."
      />

      <VendorDirectory />

      <Ground name="ink" className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-[22ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] font-light">
                Need someone who isn&rsquo;t here?
              </h2>
              <p className="mt-4 max-w-[46ch] font-sans text-base leading-relaxed text-paper/70">
                This is who we use in East Anglia and abroad. For anywhere else,
                sourcing gets you a shortlist with honest notes on each — and
                contract review before you sign anything.
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
