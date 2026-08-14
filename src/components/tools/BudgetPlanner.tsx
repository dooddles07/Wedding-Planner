"use client";

import { useState } from "react";
import { styleById, weddingStyles } from "@/content/styles";
import {
  BUDGET_COLOURS,
  BUDGET_LOCATIONS,
  budgetTotals,
  perHead,
  type PlanningLevel,
} from "@/lib/budget";
import { usePlanning } from "@/lib/store/planning";
import { Chip } from "@/components/ui/Chip";
import { AllocationRing } from "./AllocationRing";
import { LeadForm } from "@/components/forms/LeadForm";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const LEVELS: { value: PlanningLevel; label: string }[] = [
  { value: "full", label: "Full planning" },
  { value: "partial", label: "Partial" },
  { value: "day-of", label: "Day only" },
  { value: "none", label: "On our own" },
];

/**
 * The budget planner.
 *
 * Five inputs at the top, thirteen lines below, and everything recalculates as
 * you move. The couple can override any line — their number wins and is kept
 * when the model rebuilds, because a tool that argues with you is not a tool.
 */
export function BudgetPlanner({
  variant = "public",
}: {
  /**
   * `"dashboard"` is an authenticated couple looking at their own account —
   * they don't need to email themselves a copy of a plan they're already
   * looking at, so the lead-capture form is dropped for that variant.
   */
  variant?: "public" | "dashboard";
}) {
  const hydrated = usePlanning((state) => state.hydrated);
  const total = usePlanning((state) => state.budgetTotal);
  const guests = usePlanning((state) => state.guestCount);
  const location = usePlanning((state) => state.location);
  const styleId = usePlanning((state) => state.styleId);
  const level = usePlanning((state) => state.planningLevel);
  const items = usePlanning((state) => state.budgetItems);
  const setWedding = usePlanning((state) => state.setWedding);
  const setAllocated = usePlanning((state) => state.setAllocated);

  const [editing, setEditing] = useState<string | null>(null);

  const totals = budgetTotals(items);
  const head = perHead(items, guests);
  const difference = totals.allocated - total;

  return (
    <div className="pb-24">
      {/* --- Inputs --------------------------------------------------------- */}
      <div className="border-y border-ink/12 py-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="budget-total" className="eyebrow text-ink-50">
                Everything, all in
              </label>
              <output
                htmlFor="budget-total"
                className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none tabular-nums"
              >
                {formatCurrency(total)}
              </output>
            </div>
            <input
              id="budget-total"
              type="range"
              min={8000}
              max={250000}
              step={1000}
              value={total}
              onChange={(event) =>
                setWedding({ budgetTotal: Number(event.target.value) })
              }
              className="marram-range mt-2 w-full"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor="budget-guests" className="eyebrow text-ink-50">
                Guests
              </label>
              <output
                htmlFor="budget-guests"
                className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-none tabular-nums"
              >
                {formatNumber(guests)}
              </output>
            </div>
            <input
              id="budget-guests"
              type="range"
              min={10}
              max={300}
              step={5}
              value={guests}
              onChange={(event) =>
                setWedding({ guestCount: Number(event.target.value) })
              }
              className="marram-range mt-2 w-full"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-3">
          <fieldset>
            <legend className="eyebrow mb-3 text-ink-50">Where</legend>
            <div className="flex flex-wrap gap-2">
              {BUDGET_LOCATIONS.map((place) => (
                <Chip
                  key={place}
                  active={location === place}
                  onClick={() => setWedding({ location: place })}
                >
                  {place}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-3 text-ink-50">Style</legend>
            <div className="flex flex-wrap gap-2">
              {weddingStyles.slice(0, 6).map((style) => (
                <Chip
                  key={style.id}
                  active={styleId === style.id}
                  onClick={() =>
                    setWedding({ styleId: styleId === style.id ? null : style.id })
                  }
                >
                  {style.name}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-3 text-ink-50">Planning help</legend>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((item) => (
                <Chip
                  key={item.value}
                  active={level === item.value}
                  onClick={() => setWedding({ planningLevel: item.value })}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* --- Summary -------------------------------------------------------- */}
      <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4">
            <div>
              <p className="eyebrow text-ink-50">Planned so far</p>
              <p className="mt-1.5 font-display text-3xl tabular-nums">
                {formatCurrency(totals.allocated)}
              </p>
            </div>
            <div>
              <p className="eyebrow text-ink-50">Per head</p>
              <p className="mt-1.5 font-display text-3xl tabular-nums">
                {formatCurrency(head)}
              </p>
            </div>
            {Math.abs(difference) > 50 ? (
              <div>
                <p className="eyebrow text-ink-50">
                  {difference > 0 ? "Over" : "Left to plan"}
                </p>
                <p
                  className={cn(
                    "mt-1.5 font-display text-3xl tabular-nums",
                    difference > 0 ? "text-ember-dim" : "text-forest",
                  )}
                >
                  {formatCurrency(Math.abs(difference))}
                </p>
              </div>
            ) : null}
          </div>

          {/* --- Lines ------------------------------------------------------ */}
          <ul className="mt-10 border-t border-ink/12">
            {items.map((item) => {
              const share = totals.allocated
                ? (item.allocated / totals.allocated) * 100
                : 0;
              const isEditing = editing === item.category;

              return (
                <li key={item.category} className="border-b border-ink/12 py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="flex items-center gap-3 font-sans text-[0.9375rem]">
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0"
                        style={{ backgroundColor: BUDGET_COLOURS[item.category] }}
                      />
                      {item.label}
                    </span>

                    {isEditing ? (
                      <span className="flex items-center gap-2">
                        <label htmlFor={`alloc-${item.category}`} className="sr-only">
                          Amount for {item.label}
                        </label>
                        <input
                          id={`alloc-${item.category}`}
                          type="number"
                          min={0}
                          step={50}
                          value={item.allocated}
                          autoFocus
                          onChange={(event) =>
                            setAllocated(item.category, Number(event.target.value))
                          }
                          onBlur={() => setEditing(null)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === "Escape") {
                              setEditing(null);
                            }
                          }}
                          className="w-28 border-b border-ink bg-transparent py-1 text-right font-mono text-sm tabular-nums outline-none"
                        />
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditing(item.category)}
                        className="min-h-9 font-mono text-sm tabular-nums underline-offset-4 hover:underline"
                      >
                        {formatCurrency(item.allocated)}
                        <span className="sr-only">— edit {item.label}</span>
                      </button>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center gap-4">
                    <div className="h-[3px] flex-1 bg-ink/10">
                      <div
                        className="h-full transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          width: `${share}%`,
                          backgroundColor: BUDGET_COLOURS[item.category],
                        }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right font-mono text-[0.625rem] text-ink-50 tabular-nums">
                      {share.toFixed(0)}%
                    </span>
                  </div>

                  {item.note ? (
                    <p className="mt-2 max-w-[58ch] font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
                      {item.note}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        {/* --- Chart and capture ------------------------------------------- */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="aspect-square w-full">
            {hydrated ? (
              <AllocationRing
                items={items}
                total={totals.allocated}
                label="How the budget divides"
              />
            ) : (
              <div className="h-full w-full animate-pulse rounded-full border-[3rem] border-linen" />
            )}
          </div>

          <p className="mt-6 max-w-[36ch] font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
            A working model, not a national average. It responds to guest count,
            region, style and how much planning help you are buying — which are
            the four things that actually move the numbers.
          </p>

          {variant === "dashboard" ? null : (
            <div className="mt-8 border-t border-ink/12 pt-8">
              <h2 className="font-display text-2xl leading-tight font-light">
                Save this plan
              </h2>
              <p className="mt-3 max-w-[36ch] font-sans text-sm leading-relaxed text-ink-70">
                We&rsquo;ll send it back to you with notes on where we&rsquo;d push
                and where we&rsquo;d pull.
              </p>
              <LeadForm
                source="budget"
                context={{ total, guests, location, styleId, level }}
                submitLabel="Send me this plan"
                compact
                className="mt-5"
              />
            </div>
          )}
        </aside>
      </div>

      {styleId ? (
        <p className="font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
          Weighted toward a {styleById[styleId].name.toLowerCase()} wedding.
          Everything is saved in this browser.
        </p>
      ) : null}
    </div>
  );
}
