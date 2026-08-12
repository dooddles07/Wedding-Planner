"use client";

import Link from "next/link";
import { useSite } from "@/lib/store/site";
import { CoupleSite } from "./CoupleSite";
import { brand } from "@/content/brand";

/**
 * Reads the couple’s site out of their browser and renders it.
 *
 * Three states worth designing: still loading, published and matching, or
 * anything else. The last one has to be honest — in this build a published
 * page only exists on the device that made it, and pretending otherwise would
 * be the wrong kind of demo.
 */
export function PublishedSite({ slug }: { slug: string }) {
  const hydrated = useSite((state) => state.hydrated);
  const site = useSite();

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ink">
        <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-paper/65 uppercase">
          Loading
        </p>
      </div>
    );
  }

  if (site.published && site.slug === slug) {
    return <CoupleSite site={site} />;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink px-6 text-paper">
      <div className="max-w-[46ch] text-center">
        <p className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-light">
          Nothing published here yet.
        </p>
        <p className="mt-5 font-sans text-base leading-[1.7] text-paper/70">
          In this build a couple&rsquo;s site lives in their own browser, so it
          only opens on the device that made it. Wire the builder to a database
          and this page serves anyone.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard/site"
            className="inline-flex min-h-11 items-center bg-ember px-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase"
          >
            Build one
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center border border-paper/30 px-6 font-mono text-[0.6875rem] tracking-[0.14em] uppercase"
          >
            {brand.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
