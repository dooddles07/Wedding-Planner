import type { Metadata } from "next";
import { Timeline } from "@/components/tools/Timeline";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container } from "@/components/editorial/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Wedding timeline",
  description:
    "Set your date and every task lands on a real month — including the ones that should already have happened. Eighteen months to the day itself.",
  path: "/planning/timeline",
  imageKey: "land-light",
});

export default function TimelinePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Planning", path: "/planning" },
          { name: "Timeline", path: "/planning/timeline" },
        ])}
      />

      <PageHeader
        marker="Eighteen months"
        title={"Set the date and\nthe rest follows."}
        standfirst="The same list as the checklist, read against your actual calendar. It will tell you what should already have happened, which is uncomfortable and useful in that order."
      />

      <Container>
        <Timeline />
      </Container>
    </>
  );
}
