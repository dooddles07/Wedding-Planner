import type { Metadata } from "next";
import { BudgetPlanner } from "@/components/tools/BudgetPlanner";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Container } from "@/components/editorial/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Budget planner",
  description:
    "A working budget model across thirteen lines that responds to guest count, region, style and how much planning help you’re buying. Override any line.",
  path: "/planning/budget",
  imageKey: "detail-paper",
});

export default function BudgetPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Planning", path: "/planning" },
          { name: "Budget planner", path: "/planning/budget" },
        ])}
      />

      <PageHeader
        marker="Thirteen lines"
        title={"Where the money\nactually goes."}
        standfirst="Move the sliders. Guest count changes the shape of a budget far more than the total does, and you can feel that here in about five seconds. Every line is editable — your number always wins."
      />

      <Container>
        <BudgetPlanner />
      </Container>
    </>
  );
}
