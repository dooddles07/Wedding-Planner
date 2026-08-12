import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";
import { weddings } from "@/content/weddings";
import { inspiration } from "@/content/inspiration";
import { venues } from "@/content/venues";
import { vendors } from "@/content/vendors";
import { services } from "@/content/services";

/**
 * Everything public. The dashboard and published couple sites are deliberately
 * absent — they are noindex, and a couple’s page has no business in a search
 * index.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/weddings", priority: 0.9, changeFrequency: "monthly" },
    { path: "/inspiration", priority: 0.9, changeFrequency: "weekly" },
    { path: "/venues", priority: 0.8, changeFrequency: "monthly" },
    { path: "/vendors", priority: 0.7, changeFrequency: "monthly" },
    { path: "/services", priority: 0.8, changeFrequency: "yearly" },
    { path: "/planning", priority: 0.8, changeFrequency: "monthly" },
    { path: "/planning/quiz", priority: 0.8, changeFrequency: "yearly" },
    { path: "/planning/budget", priority: 0.7, changeFrequency: "yearly" },
    { path: "/planning/timeline", priority: 0.6, changeFrequency: "yearly" },
    { path: "/planning/checklist", priority: 0.6, changeFrequency: "yearly" },
    { path: "/guide", priority: 0.7, changeFrequency: "yearly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.9, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.5, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  const dynamic = [
    ...weddings.map((item) => ({ path: `/weddings/${item.slug}`, priority: 0.8 })),
    ...inspiration.map((item) => ({ path: `/inspiration/${item.slug}`, priority: 0.5 })),
    ...venues.map((item) => ({ path: `/venues/${item.slug}`, priority: 0.7 })),
    ...vendors.map((item) => ({ path: `/vendors/${item.slug}`, priority: 0.6 })),
    ...services.map((item) => ({ path: `/services/${item.slug}`, priority: 0.7 })),
  ];

  return [
    ...staticPaths.map((entry) => ({
      url: `${brand.url}${entry.path}`,
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...dynamic.map((entry) => ({
      url: `${brand.url}${entry.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: entry.priority,
    })),
  ];
}
