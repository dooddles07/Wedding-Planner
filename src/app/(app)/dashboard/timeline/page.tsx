import type { Metadata } from "next";
import { Timeline } from "@/components/tools/Timeline";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Timeline",
  description: "Every task against your actual calendar.",
  path: "/dashboard/timeline",
  noIndex: true,
});

export default function DashboardTimelinePage() {
  return (
    <div className="pt-10">
      <Timeline />
    </div>
  );
}
