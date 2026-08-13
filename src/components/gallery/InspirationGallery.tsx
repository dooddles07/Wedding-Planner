"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Inspiration, WeddingStyleId } from "@/types";
import { inspiration, inspirationFacets } from "@/content/inspiration";
import { styleById } from "@/content/styles";
import { InspirationTile } from "@/components/cards/InspirationTile";
import { Photo } from "@/components/editorial/Photo";
import { SaveButton } from "@/components/ui/SaveButton";
import { Container } from "@/components/editorial/Layout";
import { useSaves } from "@/lib/store/saves";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type FacetKey = "style" | "season" | "location" | "venue" | "mood";

const FACETS: { key: FacetKey; label: string; values: readonly string[] }[] = [
  { key: "style", label: "Style", values: inspirationFacets.styles },
  { key: "season", label: "Season", values: inspirationFacets.seasons },
  { key: "location", label: "Location", values: inspirationFacets.locations },
  { key: "venue", label: "Venue", values: inspirationFacets.venueTypes },
  { key: "mood", label: "Mood", values: inspirationFacets.moods },
];

const pretty = (value: string) =>
  value.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

/**
 * The gallery.
 *
 * Filter state lives in the URL, so a filtered view can be sent to a partner
 * or a planner and arrive looking the same. Filtering is a substring-and-facet
 * match over the local dataset — fast enough that there is no loading state to
 * design, which is the right kind of fast.
 */
export function InspirationGallery() {
  const router = useRouter();
  const params = useSearchParams();
  const reduced = useReducedMotion();

  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);

  const savedItems = useSaves((state) => state.items);
  const hydrated = useSaves((state) => state.hydrated);

  const active = useMemo(() => {
    const map = {} as Record<FacetKey, string[]>;
    for (const facet of FACETS) {
      const raw = params.get(facet.key);
      map[facet.key] = raw ? raw.split(",").filter(Boolean) : [];
    }
    return map;
  }, [params]);

  const activeCount =
    Object.values(active).reduce((total, list) => total + list.length, 0) +
    (query ? 1 : 0);

  const setFacet = useCallback(
    (key: FacetKey, value: string) => {
      const next = new URLSearchParams(params.toString());
      const current = next.get(key)?.split(",").filter(Boolean) ?? [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      if (updated.length) next.set(key, updated.join(","));
      else next.delete(key);

      track({ name: "filter_applied", scope: "inspiration", facet: key, value });
      router.replace(`/inspiration?${next.toString()}`, { scroll: false });
    },
    [params, router],
  );

  const clearAll = useCallback(() => {
    setQuery("");
    setSavedOnly(false);
    router.replace("/inspiration", { scroll: false });
  }, [router]);

  // Search is debounced into the URL so typing doesn’t push a history entry
  // per keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (query) next.set("q", query);
      else next.delete("q");
      if ((params.get("q") ?? "") === query) return;
      if (query) track({ name: "search_performed", scope: "inspiration", query });
      router.replace(`/inspiration?${next.toString()}`, { scroll: false });
    }, 280);
    return () => clearTimeout(id);
  }, [query, params, router]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const savedSlugs = new Set(
      savedItems.filter((item) => item.kind === "inspiration").map((item) => item.slug),
    );

    return inspiration.filter((item) => {
      if (savedOnly && !savedSlugs.has(item.slug)) return false;
      if (active.style.length && !active.style.some((s) => item.styleIds.includes(s as WeddingStyleId)))
        return false;
      if (active.season.length && !active.season.includes(item.season)) return false;
      if (active.location.length && !active.location.includes(item.location)) return false;
      if (active.venue.length && !active.venue.includes(item.venueType)) return false;
      if (active.mood.length && !active.mood.some((m) => item.mood.includes(m))) return false;

      if (!needle) return true;
      const haystack = [
        item.title,
        item.caption,
        item.location,
        item.season,
        item.venueType,
        ...item.mood,
        ...item.styleIds,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, active, savedOnly, savedItems]);

  const open = openSlug ? inspiration.find((item) => item.slug === openSlug) : null;

  return (
    <>
      <Container>
        {/* --- Toolbar --------------------------------------------------- */}
        <div className="sticky top-19 z-30 -mx-6 border-y border-ink/12 bg-paper/98 px-6 py-3 backdrop-blur-[2px] sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="flex items-center gap-3">
            <label htmlFor="gallery-search" className="sr-only">
              Search inspiration
            </label>
            <svg aria-hidden viewBox="0 0 16 16" width="15" height="15" className="shrink-0 text-ink-50">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <input
              id="gallery-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “long table”, “February”, “candlelit”"
              className="min-h-11 w-full bg-transparent font-sans text-[0.9375rem] outline-none placeholder:text-ink-50"
            />

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="ml-auto flex min-h-11 shrink-0 items-center gap-2 px-3 font-mono text-[0.6875rem] tracking-[0.14em] uppercase lg:hidden"
            >
              Filter
              {activeCount ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center bg-ember px-1 text-[0.625rem] text-ink">
                  {activeCount}
                </span>
              ) : null}
            </button>
          </div>

          {/* Desktop facets sit inline; there are few enough to show at once. */}
          <div className="mt-2 hidden flex-wrap items-center gap-x-5 gap-y-2 lg:flex">
            {FACETS.map((facet) => (
              <details key={facet.key} className="group/facet relative">
                <summary className="flex min-h-9 cursor-pointer list-none items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-70 uppercase marker:content-none hover:text-ink">
                  {facet.label}
                  {active[facet.key].length ? (
                    <span className="text-ember">({active[facet.key].length})</span>
                  ) : null}
                  <svg aria-hidden viewBox="0 0 10 6" width="9" height="6" className="mt-px transition-transform group-open/facet:rotate-180">
                    <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </summary>
                <div className="absolute top-full left-0 z-40 mt-1 max-h-72 w-56 overflow-y-auto border border-ink/15 bg-paper p-2 shadow-[0_18px_50px_-20px_rgba(46,41,16,0.35)]">
                  {facet.values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFacet(facet.key, value)}
                      className={cn(
                        "flex min-h-9 w-full items-center gap-2 px-2 text-left font-sans text-sm transition-colors hover:bg-linen",
                        active[facet.key].includes(value) && "text-ember",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "inline-block h-3 w-3 border",
                          active[facet.key].includes(value)
                            ? "border-ember bg-ember"
                            : "border-ink/30",
                        )}
                      />
                      {facet.key === "style"
                        ? (styleById[value as WeddingStyleId]?.name ?? pretty(value))
                        : pretty(value)}
                    </button>
                  ))}
                </div>
              </details>
            ))}

            <button
              type="button"
              onClick={() => setSavedOnly((on) => !on)}
              aria-pressed={savedOnly}
              className={cn(
                "min-h-9 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors",
                savedOnly ? "text-ember" : "text-ink-70 hover:text-ink",
              )}
            >
              Saved{hydrated && savedItems.length ? ` (${savedItems.filter((i) => i.kind === "inspiration").length})` : ""}
            </button>

            <span className="ml-auto font-mono text-[0.6875rem] tracking-wide text-ink-50">
              {results.length} of {inspiration.length}
            </span>
          </div>
        </div>

        {/* --- Active filters -------------------------------------------- */}
        {activeCount ? (
          <div className="flex flex-wrap items-center gap-2 pt-5">
            {FACETS.flatMap((facet) =>
              active[facet.key].map((value) => (
                <button
                  key={`${facet.key}-${value}`}
                  type="button"
                  onClick={() => setFacet(facet.key, value)}
                  className="inline-flex min-h-9 items-center gap-2 border border-ember/50 bg-ember-wash px-3 font-sans text-[0.8125rem] text-ink transition-colors hover:border-ember"
                >
                  {pretty(value)}
                  <svg aria-hidden viewBox="0 0 10 10" width="9" height="9">
                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  <span className="sr-only">Remove filter</span>
                </button>
              )),
            )}
            {query ? (
              <span className="inline-flex min-h-9 items-center border border-ink/20 px-3 font-sans text-[0.8125rem]">
                “{query}”
              </span>
            ) : null}
            <button
              type="button"
              onClick={clearAll}
              className="min-h-9 px-2 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-50 uppercase underline-offset-4 hover:text-ink hover:underline"
            >
              Clear all
            </button>
          </div>
        ) : null}

        {/* --- Results ---------------------------------------------------- */}
        {results.length ? (
          <div className="columns-2 gap-4 pt-8 pb-24 lg:columns-4 lg:gap-6 lg:pt-10 [&>*]:mb-4 lg:[&>*]:mb-6">
            {results.map((item) => (
              <InspirationTile
                key={item.slug}
                item={item}
                onOpen={setOpenSlug}
                className="break-inside-avoid"
                sizes="(min-width: 1024px) 22vw, 46vw"
              />
            ))}
          </div>
        ) : (
          <EmptyState savedOnly={savedOnly} onClear={clearAll} />
        )}
      </Container>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        active={active}
        onToggle={setFacet}
        onClear={clearAll}
        count={results.length}
      />

      <DetailDialog
        item={open ?? null}
        onClose={() => setOpenSlug(null)}
        reduced={Boolean(reduced)}
      />
    </>
  );
}

/* -------------------------------------------------------------------------
   Empty state
   ------------------------------------------------------------------------- */

function EmptyState({ savedOnly, onClear }: { savedOnly: boolean; onClear: () => void }) {
  return (
    <div className="py-24 lg:py-32">
      <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-light">
        {savedOnly ? "Nothing saved yet." : "Nothing matches all of that."}
      </p>
      <p className="mt-4 max-w-[40ch] font-sans text-base leading-relaxed text-ink-70">
        {savedOnly
          ? "Start keeping the ones that feel like you. They stay in this browser — no account needed."
          : "Try loosening one filter. Season and venue together is usually the pair that empties the room."}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-7 inline-flex min-h-11 items-center border border-ink/25 px-6 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-ink hover:bg-ink hover:text-paper"
      >
        Clear filters
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Mobile filter sheet
   ------------------------------------------------------------------------- */

function FilterSheet({
  open,
  onClose,
  active,
  onToggle,
  onClear,
  count,
}: {
  open: boolean;
  onClose: () => void;
  active: Record<FacetKey, string[]>;
  onToggle: (key: FacetKey, value: string) => void;
  onClear: () => void;
  count: number;
}) {
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-[55] bg-ink/45 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="fixed inset-x-0 bottom-0 z-[56] max-h-[85svh] overflow-y-auto bg-paper lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-ink/12 bg-paper px-6 py-4">
              <p className="eyebrow text-ink-50">Filter</p>
              <button type="button" onClick={onClose} className="-mr-2 h-11 w-11">
                <span className="sr-only">Close filters</span>
                <svg aria-hidden viewBox="0 0 20 20" width="16" height="16" className="mx-auto">
                  <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>

            <div className="px-6 pb-8">
              {FACETS.map((facet) => (
                <fieldset key={facet.key} className="border-b border-ink/12 py-6">
                  <legend className="eyebrow mb-4 text-ink-50">{facet.label}</legend>
                  <div className="flex flex-wrap gap-2">
                    {facet.values.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onToggle(facet.key, value)}
                        aria-pressed={active[facet.key].includes(value)}
                        className={cn(
                          "min-h-11 border px-4 font-sans text-sm transition-colors",
                          active[facet.key].includes(value)
                            ? "border-ember bg-ember-wash text-ink"
                            : "border-ink/20 text-ink-70",
                        )}
                      >
                        {pretty(value)}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="sticky bottom-0 flex gap-3 border-t border-ink/12 bg-paper px-6 py-4">
              <button
                type="button"
                onClick={onClear}
                className="min-h-12 flex-1 border border-ink/25 font-mono text-[0.6875rem] tracking-[0.14em] uppercase"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-12 flex-[2] bg-ember font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase"
              >
                Show {count}
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------
   Detail dialog
   ------------------------------------------------------------------------- */

function DetailDialog({
  item,
  onClose,
  reduced,
}: {
  item: Inspiration | null;
  onClose: () => void;
  reduced: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = panel.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!items?.length) return;
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

    document.addEventListener("keydown", onKey);
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            className="grid max-h-full w-full max-w-5xl overflow-y-auto bg-paper md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <Photo photoKey={item.imageId} ratio="fill" sizes="(min-width: 768px) 55vw, 100vw" className="min-h-64 md:min-h-[32rem]" />

            <div className="flex flex-col justify-between p-7 lg:p-10">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="eyebrow text-ink-50">
                    {item.location} · {item.season}
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="-mt-2 -mr-2 h-11 w-11 shrink-0"
                  >
                    <span className="sr-only">Close</span>
                    <svg aria-hidden viewBox="0 0 20 20" width="16" height="16" className="mx-auto">
                      <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </button>
                </div>

                <h2 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.1] font-light">
                  {item.title}
                </h2>
                <p className="mt-4 font-sans text-[0.9375rem] leading-[1.7] text-ink-70">
                  {item.caption}
                </p>

                <div className="mt-7 flex items-center gap-2">
                  {item.colours.map((hex) => (
                    <span
                      key={hex}
                      className="h-6 w-6 rounded-full ring-1 ring-ink/10"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {item.styleIds.map((id) => (
                    <Link
                      key={id}
                      href={`/inspiration?style=${id}`}
                      onClick={onClose}
                      className="inline-flex min-h-9 items-center border border-ink/20 px-3 font-sans text-[0.8125rem] transition-colors hover:border-ink"
                    >
                      {styleById[id]?.name ?? id}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex items-center gap-3">
                <SaveButton kind="inspiration" slug={item.slug} className="-ml-2" />
                {item.storySlug ? (
                  <Link
                    href={`/weddings/${item.storySlug}`}
                    onClick={onClose}
                    className="inline-flex min-h-11 items-center bg-ember px-5 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-ink hover:text-champagne"
                  >
                    Read the wedding
                  </Link>
                ) : (
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="inline-flex min-h-11 items-center bg-ember px-5 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-ink hover:text-champagne"
                  >
                    Start planning
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
