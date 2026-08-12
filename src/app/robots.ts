import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The dashboard is somebody’s own planning, and /w/ is their wedding
        // site. Neither belongs in a search index.
        disallow: ["/dashboard", "/dashboard/", "/w/", "/api/"],
      },
    ],
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
