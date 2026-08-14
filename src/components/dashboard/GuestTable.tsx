"use client";

import { useMemo, useState } from "react";
import type { MealChoice, RsvpStatus } from "@/types";
import { usePlanning } from "@/lib/store/planning";
import { Chip } from "@/components/ui/Chip";
import { Empty } from "./Overview";
import { cn, formatNumber } from "@/lib/utils";

const RSVP: { value: RsvpStatus; label: string }[] = [
  { value: "pending", label: "Waiting" },
  { value: "attending", label: "Coming" },
  { value: "declined", label: "Can’t" },
  { value: "maybe", label: "Maybe" },
];

const MEALS: { value: MealChoice; label: string }[] = [
  { value: null, label: "—" },
  { value: "meat", label: "Meat" },
  { value: "fish", label: "Fish" },
  { value: "vegetarian", label: "Veg" },
  { value: "vegan", label: "Vegan" },
  { value: "child", label: "Child" },
];

const RSVP_COLOUR: Record<RsvpStatus, string> = {
  attending: "text-forest",
  declined: "text-ink-50",
  maybe: "text-ink-70",
  pending: "text-ember-dim",
};

/**
 * The guest list.
 *
 * A real table on desktop and a stack of records on mobile — a five-column
 * table at 375px is unreadable however cleverly it scrolls. Everything is
 * editable in place, because a guest list is edited forty times and opened in
 * a modal never.
 */
export function GuestTable() {
  const hydrated = usePlanning((state) => state.hydrated);
  const guests = usePlanning((state) => state.guests);
  const addGuest = usePlanning((state) => state.addGuest);
  const updateGuest = usePlanning((state) => state.updateGuest);
  const removeGuest = usePlanning((state) => state.removeGuest);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RsvpStatus | "all">("all");
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return guests.filter((guest) => {
      if (filter !== "all" && guest.rsvp !== filter) return false;
      if (!needle) return true;
      return [guest.name, guest.group, guest.email ?? "", guest.dietary ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [guests, query, filter]);

  const counts = useMemo(
    () => ({
      total: guests.length + guests.filter((g) => g.plusOne).length,
      attending: guests.filter((g) => g.rsvp === "attending").length,
      pending: guests.filter((g) => g.rsvp === "pending").length,
      dietary: guests.filter((g) => g.dietary).length,
    }),
    [guests],
  );

  function onAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    addGuest({
      name: name.trim(),
      email: null,
      group: group.trim() || "Everyone else",
      side: "both",
      rsvp: "pending",
      meal: null,
      dietary: null,
      plusOne: false,
      plusOneName: null,
      events: ["ceremony", "dinner", "party"],
      note: null,
    });
    setName("");
  }

  /** Export as CSV, generated and downloaded entirely in the browser. */
  function exportCsv() {
    const header = [
      "Name",
      "Group",
      "RSVP",
      "Meal",
      "Dietary",
      "Plus one",
      "Plus one name",
      "Email",
    ];
    const rows = guests.map((guest) => [
      guest.name,
      guest.group,
      guest.rsvp,
      guest.meal ?? "",
      guest.dietary ?? "",
      guest.plusOne ? "yes" : "no",
      guest.plusOneName ?? "",
      guest.email ?? "",
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "guest-list.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="pt-12 lg:pt-16">
      {/* --- Counts --------------------------------------------------------- */}
      <dl className="flex flex-wrap gap-x-12 gap-y-6 border-b border-ink/12 pb-8">
        {[
          { label: "On the list", value: counts.total },
          { label: "Coming", value: counts.attending },
          { label: "Waiting", value: counts.pending },
          { label: "Dietary notes", value: counts.dietary },
        ].map((stat) => (
          <div key={stat.label}>
            <dt className="eyebrow text-ink-50">{stat.label}</dt>
            <dd className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] leading-none tabular-nums">
              {hydrated ? formatNumber(stat.value) : "—"}
            </dd>
          </div>
        ))}
      </dl>

      {/* --- Add ------------------------------------------------------------ */}
      <form onSubmit={onAdd} className="flex flex-wrap items-end gap-4 py-8">
        <div className="min-w-[14rem] flex-1">
          <label htmlFor="guest-name" className="eyebrow text-ink-50">
            Add someone
          </label>
          <input
            id="guest-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ada Okonjo"
            className="mt-2 min-h-12 w-full border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
          />
        </div>
        <div className="min-w-[10rem]">
          <label htmlFor="guest-group" className="eyebrow text-ink-50">
            Group
          </label>
          <input
            id="guest-group"
            value={group}
            onChange={(event) => setGroup(event.target.value)}
            placeholder="University"
            className="mt-2 min-h-12 w-full border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
          />
        </div>
        <button
          type="submit"
          className="min-h-12 bg-ember px-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-ink hover:text-champagne"
        >
          Add
        </button>
      </form>

      {/* --- Filters -------------------------------------------------------- */}
      {guests.length ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-ink/12 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>
              Everyone
            </Chip>
            {RSVP.map((option) => (
              <Chip
                key={option.value}
                active={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <label htmlFor="guest-search" className="sr-only">
              Search guests
            </label>
            <input
              id="guest-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="min-h-11 w-40 border-b border-ink/20 bg-transparent font-sans text-sm outline-none placeholder:text-ink-50 focus:border-ink"
            />
            <button
              type="button"
              onClick={exportCsv}
              className="min-h-11 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-70 uppercase underline-offset-4 hover:text-ink hover:underline"
            >
              Download list
            </button>
          </div>
        </div>
      ) : null}

      {/* --- The list -------------------------------------------------------- */}
      {!hydrated ? (
        <div className="space-y-3 py-10">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-12 animate-pulse bg-linen" />
          ))}
        </div>
      ) : filtered.length ? (
        <>
          {/* Desktop */}
          <table className="mt-2 hidden w-full border-collapse lg:table">
            <thead>
              <tr className="border-b border-ink/12">
                {["Name", "Group", "RSVP", "Meal", "Dietary", "+1", ""].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="py-3 text-left font-mono text-[0.625rem] tracking-[0.14em] text-ink-50 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest) => (
                <tr key={guest.id} className="group border-b border-ink/12">
                  <td className="py-2 pr-4">
                    <input
                      aria-label={`Name of ${guest.name}`}
                      value={guest.name}
                      onChange={(event) =>
                        updateGuest(guest.id, { name: event.target.value })
                      }
                      className="min-h-10 w-full bg-transparent font-sans text-[0.9375rem] outline-none focus:border-b focus:border-ink"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      aria-label={`Group for ${guest.name}`}
                      value={guest.group}
                      onChange={(event) =>
                        updateGuest(guest.id, { group: event.target.value })
                      }
                      className="min-h-10 w-full bg-transparent font-sans text-sm text-ink-70 outline-none focus:border-b focus:border-ink"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <select
                      aria-label={`RSVP for ${guest.name}`}
                      value={guest.rsvp}
                      onChange={(event) =>
                        updateGuest(guest.id, { rsvp: event.target.value as RsvpStatus })
                      }
                      className={cn(
                        "min-h-10 bg-transparent font-sans text-sm outline-none",
                        RSVP_COLOUR[guest.rsvp],
                      )}
                    >
                      {RSVP.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <select
                      aria-label={`Meal for ${guest.name}`}
                      value={guest.meal ?? ""}
                      onChange={(event) =>
                        updateGuest(guest.id, {
                          meal: (event.target.value || null) as MealChoice,
                        })
                      }
                      className="min-h-10 bg-transparent font-sans text-sm text-ink-70 outline-none"
                    >
                      {MEALS.map((option) => (
                        <option key={option.label} value={option.value ?? ""}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      aria-label={`Dietary requirements for ${guest.name}`}
                      value={guest.dietary ?? ""}
                      onChange={(event) =>
                        updateGuest(guest.id, { dietary: event.target.value || null })
                      }
                      placeholder="—"
                      className="min-h-10 w-full bg-transparent font-sans text-sm text-ink-70 outline-none placeholder:text-ink-50 focus:border-b focus:border-ink"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={guest.plusOne}
                      aria-label={`Plus one for ${guest.name}`}
                      onClick={() => updateGuest(guest.id, { plusOne: !guest.plusOne })}
                      className="flex h-6 w-6 items-center justify-center border transition-colors"
                      style={{
                        borderColor: guest.plusOne
                          ? "var(--color-ember)"
                          : "var(--color-ink-30)",
                        backgroundColor: guest.plusOne ? "var(--color-ember)" : "transparent",
                      }}
                    >
                      {guest.plusOne ? (
                        <svg aria-hidden viewBox="0 0 12 10" width="10" height="8" fill="none">
                          <path d="M1 5l3.5 3.5L11 1" stroke="#2E2910" strokeWidth="1.6" />
                        </svg>
                      ) : null}
                    </button>
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeGuest(guest.id)}
                      className="h-9 w-9 text-ink-50 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 hover:text-ember"
                    >
                      <span className="sr-only">Remove {guest.name}</span>
                      <svg aria-hidden viewBox="0 0 12 12" width="11" height="11" className="mx-auto">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile */}
          <ul className="mt-2 lg:hidden">
            {filtered.map((guest) => (
              <li key={guest.id} className="border-b border-ink/12 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <input
                      aria-label={`Name of ${guest.name}`}
                      value={guest.name}
                      onChange={(event) =>
                        updateGuest(guest.id, { name: event.target.value })
                      }
                      className="min-h-10 w-full bg-transparent font-sans text-base outline-none"
                    />
                    <input
                      aria-label={`Group for ${guest.name}`}
                      value={guest.group}
                      onChange={(event) =>
                        updateGuest(guest.id, { group: event.target.value })
                      }
                      className="min-h-9 w-full bg-transparent font-mono text-[0.6875rem] tracking-wide text-ink-50 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGuest(guest.id)}
                    className="h-11 w-11 shrink-0 text-ink-50 hover:text-ember"
                  >
                    <span className="sr-only">Remove {guest.name}</span>
                    <svg aria-hidden viewBox="0 0 12 12" width="11" height="11" className="mx-auto">
                      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <select
                    aria-label={`RSVP for ${guest.name}`}
                    value={guest.rsvp}
                    onChange={(event) =>
                      updateGuest(guest.id, { rsvp: event.target.value as RsvpStatus })
                    }
                    className={cn(
                      "min-h-11 border border-ink/20 px-3 font-sans text-sm",
                      RSVP_COLOUR[guest.rsvp],
                    )}
                  >
                    {RSVP.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label={`Meal for ${guest.name}`}
                    value={guest.meal ?? ""}
                    onChange={(event) =>
                      updateGuest(guest.id, {
                        meal: (event.target.value || null) as MealChoice,
                      })
                    }
                    className="min-h-11 border border-ink/20 px-3 font-sans text-sm text-ink-70"
                  >
                    {MEALS.map((option) => (
                      <option key={option.label} value={option.value ?? ""}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => updateGuest(guest.id, { plusOne: !guest.plusOne })}
                    aria-pressed={guest.plusOne}
                    className={cn(
                      "min-h-11 border px-3 font-sans text-sm transition-colors",
                      guest.plusOne
                        ? "border-ember bg-ember-wash"
                        : "border-ink/20 text-ink-70",
                    )}
                  >
                    +1
                  </button>
                </div>

                <input
                  aria-label={`Dietary requirements for ${guest.name}`}
                  value={guest.dietary ?? ""}
                  onChange={(event) =>
                    updateGuest(guest.id, { dietary: event.target.value || null })
                  }
                  placeholder="Dietary requirements"
                  className="mt-3 min-h-11 w-full border-b border-ink/20 bg-transparent font-sans text-sm outline-none placeholder:text-ink-50 focus:border-ink"
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Empty
          className="my-10"
          title={guests.length ? "Nobody matches that." : "No guest list yet."}
          body={
            guests.length
              ? "Try clearing the filter, or searching for something shorter."
              : "Start with the people who have been to your flat. It is a better rule than it sounds, and it holds up in an argument."
          }
          href="/planning/checklist"
          cta={guests.length ? "See the checklist" : "See what else needs doing"}
        />
      )}

      <p className="mt-10 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
        Synced to your account, so it&rsquo;s here on any device you sign into.
        Export the CSV if you want a copy that outlives it.
      </p>
    </div>
  );
}
