import type { Metadata } from "next";
import { SiteBuilder } from "@/components/site-builder/SiteBuilder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Your wedding site",
  description: "Build the page you send to guests.",
  path: "/dashboard/site",
  noIndex: true,
});

export default function SiteBuilderPage() {
  return <SiteBuilder />;
}
