import type { Metadata } from "next";
import { Checklist } from "@/components/tools/Checklist";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container } from "@/components/editorial/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Wedding checklist",
  description:
    "Forty-four things, grouped by how far out they happen rather than by category. Tick them off, add your own — it all saves in your browser.",
  path: "/planning/checklist",
  imageKey: "detail-stationery",
});

export default function ChecklistPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Planning", path: "/planning" },
          { name: "Checklist", path: "/planning/checklist" },
        ])}
      />

      <PageHeader
        marker="Forty-four things"
        title={"What to do,\nand when to do it."}
        standfirst="Grouped by how far out the work happens rather than by category, because that’s the question you’re actually asking. Tick as you go, add your own, and ignore the ones that don’t apply."
      />

      <Container>
        <Checklist />
      </Container>
    </>
  );
}
