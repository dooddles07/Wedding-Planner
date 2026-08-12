import type { Metadata } from "next";
import { Checklist } from "@/components/tools/Checklist";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Tasks",
  description: "Everything left to do, grouped by how far out it happens.",
  path: "/dashboard/tasks",
  noIndex: true,
});

/**
 * The same checklist as the public tool, reading the same store — so ticking
 * something here ticks it there. One list, two doors.
 */
export default function TasksPage() {
  return (
    <div className="pt-10">
      <Checklist />
    </div>
  );
}
