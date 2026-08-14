"use client";

import { useMemo } from "react";
import type { SaveableKind } from "@/types";
import { useSaves } from "@/lib/store/saves";
import { venueBySlug } from "@/content/venues";
import { vendorBySlug } from "@/content/vendors";
import { inspirationBySlug } from "@/content/inspiration";
import { VenueCard } from "@/components/cards/VenueCard";
import { VendorCard } from "@/components/cards/VendorCard";
import { InspirationTile } from "@/components/cards/InspirationTile";
import { Empty } from "./Overview";

/**
 * One component for all three saved lists — venues, suppliers and images.
 * They differ only in which card they render, and keeping them together means
 * the empty states stay in the same voice.
 */
export function SavedList({
  kind,
  title,
  emptyTitle,
  emptyBody,
  href,
  cta,
}: {
  kind: SaveableKind;
  title: string;
  emptyTitle: string;
  emptyBody: string;
  href: string;
  cta: string;
}) {
  const hydrated = useSaves((state) => state.hydrated);
  const allItems = useSaves((state) => state.items);
  const items = useMemo(
    () => allItems.filter((item) => item.kind === kind),
    [allItems, kind],
  );

  if (!hydrated) {
    return (
      <div className="grid gap-8 pt-12 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="aspect-[3/2] animate-pulse bg-linen" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="pt-12">
        <h1 className="mb-8 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none font-light">
          {title}
        </h1>
        <Empty title={emptyTitle} body={emptyBody} href={href} cta={cta} />
      </div>
    );
  }

  return (
    <div className="pt-12">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none font-light">
          {title}
        </h1>
        <p className="font-mono text-[0.6875rem] tracking-wide text-ink-50">
          {items.length} kept
        </p>
      </div>

      {kind === "inspiration" ? (
        <div className="columns-2 gap-4 lg:columns-4 lg:gap-6 [&>*]:mb-4 lg:[&>*]:mb-6">
          {items.map((item) => {
            const image = inspirationBySlug[item.slug];
            if (!image) return null;
            return (
              <InspirationTile
                key={item.slug}
                item={image}
                className="break-inside-avoid"
                sizes="(min-width: 1024px) 22vw, 46vw"
              />
            );
          })}
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            if (kind === "venue") {
              const venue = venueBySlug[item.slug];
              return venue ? <VenueCard key={item.slug} venue={venue} /> : null;
            }
            const vendor = vendorBySlug[item.slug];
            return vendor ? <VendorCard key={item.slug} vendor={vendor} /> : null;
          })}
        </div>
      )}
    </div>
  );
}
