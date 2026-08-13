import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { CoupleSite } from "@/components/site-builder/CoupleSite";
import type { WeddingSite } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("wedding_sites")
    .select("data")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!data) return {};

  const site = data.data as WeddingSite;
  return {
    title:
      site.partnerOne && site.partnerTwo
        ? `${site.partnerOne} & ${site.partnerTwo}`
        : "Our Wedding",
    robots: { index: false, follow: false },
  };
}

export default async function PublishedWeddingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("wedding_sites")
    .select("data")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!data) notFound();

  return <CoupleSite site={data.data as WeddingSite} />;
}
