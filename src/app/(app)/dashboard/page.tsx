import type { Metadata } from "next";
import { Overview } from "@/components/dashboard/Overview";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Your wedding",
  description: "Countdown, progress, what to do next, and everything you’ve kept.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return <Overview />;
}
