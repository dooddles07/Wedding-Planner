import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { weddingSites } from "@/lib/db/schema";
import { CoupleSite } from "@/components/site-builder/CoupleSite";
import type { WeddingSite } from "@/types";

async function getSite(slug: string) {
  const [row] = await db
    .select({ data: weddingSites.data })
    .from(weddingSites)
    .where(and(eq(weddingSites.slug, slug), eq(weddingSites.published, true)))
    .limit(1);
  return row?.data as WeddingSite | undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return {};

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
  const site = await getSite(slug);
  if (!site) notFound();

  return <CoupleSite site={site} />;
}
