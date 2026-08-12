"use client";

import { useMemo, useState } from "react";
import type { VendorCategory } from "@/types";
import { VENDOR_CATEGORY_LABEL, vendorFacets, vendors } from "@/content/vendors";
import { VendorCard } from "@/components/cards/VendorCard";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/editorial/Layout";
import { useSaves } from "@/lib/store/saves";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Supplier search.
 *
 * Category is how people actually think about this ("we need a photographer"),
 * so it leads and everything else is secondary. No ratings — there are no real
 * ones, and inventing them would be worse than useless.
 */
export function VendorDirectory() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [travels, setTravels] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);

  const savedItems = useSaves((state) => state.items);

  function toggleCategory(category: VendorCategory) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
    track({ name: "filter_applied", scope: "vendors", facet: "category", value: category });
  }

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const savedSlugs = new Set(
      savedItems.filter((item) => item.kind === "vendor").map((item) => item.slug),
    );

    return vendors.filter((vendor) => {
      if (savedOnly && !savedSlugs.has(vendor.slug)) return false;
      if (categories.length && !categories.includes(vendor.category)) return false;
      if (travels && !vendor.travelsInternationally) return false;
      if (!needle) return true;

      return [
        vendor.name,
        vendor.location,
        vendor.standfirst,
        VENDOR_CATEGORY_LABEL[vendor.category],
        ...vendor.specialities,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [query, categories, travels, savedOnly, savedItems]);

  const activeCount = categories.length + (travels ? 1 : 0) + (query ? 1 : 0);

  function clearAll() {
    setQuery("");
    setCategories([]);
    setTravels(false);
    setSavedOnly(false);
  }

  return (
    <Container>
      <div className="border-y border-ink/12 py-6">
        <div className="flex items-center gap-3 border-b border-ink/20 focus-within:border-ink">
          <svg aria-hidden viewBox="0 0 16 16" width="15" height="15" className="shrink-0 text-ink-50">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <label htmlFor="vendor-search" className="sr-only">
            Search suppliers
          </label>
          <input
            id="vendor-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Photographer, fire cooking, letterpress"
            className="min-h-12 w-full bg-transparent font-sans text-base outline-none placeholder:text-ink-50"
          />
        </div>

        <div className="mt-6 -mx-6 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 sm:flex-wrap">
            {vendorFacets.categories.map((category) => (
              <Chip
                key={category}
                active={categories.includes(category)}
                onClick={() => toggleCategory(category)}
                className="shrink-0"
              >
                {VENDOR_CATEGORY_LABEL[category]}
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setTravels((on) => !on)}
              aria-pressed={travels}
              className={cn(
                "min-h-11 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors",
                travels ? "text-ember" : "text-ink-70 hover:text-ink",
              )}
            >
              Travels abroad
            </button>
            <button
              type="button"
              onClick={() => setSavedOnly((on) => !on)}
              aria-pressed={savedOnly}
              className={cn(
                "min-h-11 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors",
                savedOnly ? "text-ember" : "text-ink-70 hover:text-ink",
              )}
            >
              Saved only
            </button>
          </div>

          <div className="flex items-center gap-6">
            {activeCount ? (
              <button
                type="button"
                onClick={clearAll}
                className="min-h-11 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-50 uppercase underline-offset-4 hover:text-ink hover:underline"
              >
                Clear
              </button>
            ) : null}
            <span className="font-mono text-[0.6875rem] tracking-wide text-ink-50">
              {results.length} of {vendors.length}
            </span>
          </div>
        </div>
      </div>

      {results.length ? (
        <div className="grid gap-x-8 gap-y-14 pt-12 pb-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
          {results.map((vendor) => (
            <VendorCard key={vendor.slug} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="py-24 lg:py-32">
          <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-light">
            {savedOnly ? "No saved suppliers yet." : "Nothing here matches."}
          </p>
          <p className="mt-4 max-w-[42ch] font-sans text-base leading-relaxed text-ink-70">
            {savedOnly
              ? "Keep the ones you like as you browse. They stay in this browser — no account needed."
              : "This is a short, deliberate list rather than a directory. If the category you need isn’t here, ask us — we have someone."}
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-7 inline-flex min-h-11 items-center border border-ink/25 px-6 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            Clear filters
          </button>
        </div>
      )}

      <p className="pb-16 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
        Sample suppliers, invented for this build. We take no commission from
        anyone on this list.
      </p>
    </Container>
  );
}
