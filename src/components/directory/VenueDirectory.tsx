"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { VenueType, WeddingStyleId } from "@/types";
import { VENUE_TYPE_LABEL, venueFacets, venues } from "@/content/venues";
import { styleById } from "@/content/styles";
import { VenueCard } from "@/components/cards/VenueCard";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/editorial/Layout";
import { useSaves } from "@/lib/store/saves";
import { track } from "@/lib/analytics";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Venue search.
 *
 * Guest count is the filter that actually matters — it eliminates more of the
 * list than everything else combined — so it gets a slider at the top rather
 * than being buried among the chips.
 */
export function VenueDirectory() {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState(0);
  const [types, setTypes] = useState<VenueType[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [styles, setStyles] = useState<WeddingStyleId[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetPanel = useRef<HTMLDivElement>(null);

  const savedItems = useSaves((state) => state.items);

  // Escape closes the sheet, focus is trapped while it's open, and the page
  // behind it can't scroll — matches the mobile menu and inspiration filters.
  useEffect(() => {
    if (!sheetOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        sheetPanel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSheetOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [sheetOpen]);

  function toggle<T>(list: T[], set: (next: T[]) => void, value: T, facet: string) {
    set(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
    track({ name: "filter_applied", scope: "venues", facet, value: String(value) });
  }

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const savedSlugs = new Set(
      savedItems.filter((item) => item.kind === "venue").map((item) => item.slug),
    );

    return venues.filter((venue) => {
      if (savedOnly && !savedSlugs.has(venue.slug)) return false;
      if (guests && venue.capacitySeated < guests) return false;
      if (types.length && !types.includes(venue.type)) return false;
      if (regions.length && !regions.includes(venue.region)) return false;
      if (styles.length && !styles.some((id) => venue.styleIds.includes(id))) return false;
      if (!needle) return true;

      return [venue.name, venue.location, venue.region, venue.standfirst, ...venue.features]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [query, guests, types, regions, styles, savedOnly, savedItems]);

  const activeCount =
    types.length + regions.length + styles.length + (guests ? 1 : 0) + (query ? 1 : 0);

  function clearAll() {
    setQuery("");
    setGuests(0);
    setTypes([]);
    setRegions([]);
    setStyles([]);
    setSavedOnly(false);
  }

  const filters = (
    <>
      <fieldset>
        <legend className="eyebrow mb-3 text-ink-50">Kind of place</legend>
        <div className="flex flex-wrap gap-2">
          {venueFacets.types.map((type) => (
            <Chip
              key={type}
              active={types.includes(type)}
              onClick={() => toggle(types, setTypes, type, "type")}
            >
              {VENUE_TYPE_LABEL[type]}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="eyebrow mb-3 text-ink-50">Where</legend>
        <div className="flex flex-wrap gap-2">
          {venueFacets.regions.map((region) => (
            <Chip
              key={region}
              active={regions.includes(region)}
              onClick={() => toggle(regions, setRegions, region, "region")}
            >
              {region}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="eyebrow mb-3 text-ink-50">Style</legend>
        <div className="flex flex-wrap gap-2">
          {venueFacets.styles.map((id) => (
            <Chip
              key={id}
              active={styles.includes(id)}
              onClick={() => toggle(styles, setStyles, id, "style")}
            >
              {styleById[id]?.name ?? id}
            </Chip>
          ))}
        </div>
      </fieldset>
    </>
  );

  return (
    <Container>
      {/* --- Search and guest count ------------------------------------- */}
      <div className="border-y border-ink/12 py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center lg:gap-16">
          <div className="flex items-center gap-3 border-b border-ink/20 focus-within:border-ink">
            <svg aria-hidden viewBox="0 0 16 16" width="15" height="15" className="shrink-0 text-ink-50">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <label htmlFor="venue-search" className="sr-only">
              Search venues
            </label>
            <input
              id="venue-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Barn, château, somewhere near the sea"
              className="min-h-12 w-full bg-transparent font-sans text-base outline-none placeholder:text-ink-50"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="venue-guests" className="eyebrow text-ink-50">
                At least this many seated
              </label>
              <output htmlFor="venue-guests" className="font-display text-xl tabular-nums">
                {guests ? formatNumber(guests) : "Any"}
              </output>
            </div>
            <input
              id="venue-guests"
              type="range"
              min={0}
              max={220}
              step={10}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              className="marram-range mt-1 w-full"
            />
          </div>
        </div>

        {/* Desktop chips inline; mobile gets a sheet. */}
        <div className="mt-6 hidden lg:block">{filters}</div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex min-h-11 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] uppercase lg:hidden"
          >
            Filter
            {activeCount ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center bg-ember px-1 text-[0.625rem] text-ink">
                {activeCount}
              </span>
            ) : null}
          </button>

          <div className="flex items-center gap-6">
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
              {results.length} of {venues.length}
            </span>
          </div>
        </div>
      </div>

      {/* --- Results ------------------------------------------------------ */}
      {results.length ? (
        <div className="grid gap-x-8 gap-y-14 pt-12 pb-24 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
          {results.map((venue, index) => (
            <VenueCard
              key={venue.slug}
              venue={venue}
              ratio={index % 5 === 0 ? "portrait" : "landscape"}
              className={index % 5 === 0 ? "sm:row-span-2" : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 lg:py-32">
          <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-light">
            {savedOnly ? "No saved venues yet." : "Nothing matches all of that."}
          </p>
          <p className="mt-4 max-w-[42ch] font-sans text-base leading-relaxed text-ink-70">
            {savedOnly
              ? "Start collecting places that feel like you. They stay in this browser — no account needed."
              : `Guest count is usually the culprit. ${
                  guests ? `Try dropping below ${formatNumber(guests)}.` : "Try removing a region."
                }`}
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

      {/* --- Mobile sheet -------------------------------------------------- */}
      {sheetOpen ? (
        <div className="fixed inset-0 z-[55] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/45"
            onClick={() => setSheetOpen(false)}
          />
          <div
            ref={sheetPanel}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto bg-paper"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-ink/12 bg-paper px-6 py-4">
              <p className="eyebrow text-ink-50">Filter venues</p>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="-mr-2 h-11 w-11"
              >
                <span className="sr-only">Close</span>
                <svg aria-hidden viewBox="0 0 20 20" width="16" height="16" className="mx-auto">
                  <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6">{filters}</div>
            <div className="sticky bottom-0 flex gap-3 border-t border-ink/12 bg-paper px-6 py-4">
              <button
                type="button"
                onClick={clearAll}
                className="min-h-12 flex-1 border border-ink/25 font-mono text-[0.6875rem] tracking-[0.14em] uppercase"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="min-h-12 flex-[2] bg-ember font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase"
              >
                Show {results.length}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="pb-16 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
        Sample venues, invented for this build. Prices are indicative bands, not
        quotes — from {formatCurrency(Math.min(...venues.map((v) => v.priceFrom)))}.
      </p>
    </Container>
  );
}
