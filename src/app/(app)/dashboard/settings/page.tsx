import type { Metadata } from "next";
import { Settings } from "@/components/dashboard/Settings";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Settings",
  description: "Your names, the date, and where everything is stored.",
  path: "/dashboard/settings",
  noIndex: true,
});

export default function SettingsPage() {
  return <Settings />;
}
