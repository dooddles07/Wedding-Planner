import type { Metadata } from "next";
import { BudgetPlanner } from "@/components/tools/BudgetPlanner";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Budget",
  description: "Your budget model, and what you’ve spent against it.",
  path: "/dashboard/budget",
  noIndex: true,
});

export default function DashboardBudgetPage() {
  return (
    <div className="pt-10">
      <BudgetPlanner variant="dashboard" />
    </div>
  );
}
