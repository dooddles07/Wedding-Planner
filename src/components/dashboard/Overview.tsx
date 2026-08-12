"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePlanning } from "@/lib/store/planning";
import { useSaves } from "@/lib/store/saves";
import { budgetTotals } from "@/lib/budget";
import { TASK_CATEGORY_LABEL } from "@/content/tasks";
import { venueBySlug } from "@/content/venues";
import { vendorBySlug } from "@/content/vendors";
import { inspirationBySlug } from "@/content/inspiration";
import { Photo } from "@/components/editorial/Photo";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { cn, daysUntil, formatCurrency, formatNumber } from "@/lib/utils";

const subscribeToNothing = () => () => undefined;
let cachedNow: number | null = null;
function clientNow() {
  cachedNow ??= new Date().setHours(0, 0, 0, 0);
  return cachedNow;
}

/**
 * The couple’s overview.
 *
 * Built around the two numbers that matter and nobody else’s: how long is
 * left, and how much of it is done. Everything else is a short list with a way
 * into it. No stat cards in a row of four — the numbers are set in the display
 * face at the size they deserve, which is how the rest of the site treats a
 * number that matters.
 */
export function Overview() {
  const hydrated = usePlanning((state) => state.hydrated);
  const partnerOne = usePlanning((state) => state.partnerOne);
  const partnerTwo = usePlanning((state) => state.partnerTwo);
  const weddingDate = usePlanning((state) => state.weddingDate);
  const location = usePlanning((state) => state.location);
  const tasks = usePlanning((state) => state.tasks);
  const guests = usePlanning((state) => state.guests);
  const budgetTotal = usePlanning((state) => state.budgetTotal);
  const budgetItems = usePlanning((state) => state.budgetItems);
  const toggleTask = usePlanning((state) => state.toggleTask);

  const savedItems = useSaves((state) => state.items);
  const reduced = useReducedMotion();

  const now = useSyncExternalStore(
    subscribeToNothing,
    () => clientNow(),
    () => null,
  );

  const days = now !== null && weddingDate ? daysUntil(weddingDate) : null;
  const done = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const totals = budgetTotals(budgetItems);

  const attending = guests.filter((guest) => guest.rsvp === "attending").length;
  const pending = guests.filter((guest) => guest.rsvp === "pending").length;

  // The next handful of things, in the order they need doing.
  const upcoming = useMemo(
    () =>
      [...tasks]
        .filter((task) => !task.done)
        .sort((a, b) => b.monthsBefore - a.monthsBefore)
        .slice(0, 5),
    [tasks],
  );

  const savedVenues = savedItems
    .filter((item) => item.kind === "venue")
    .map((item) => venueBySlug[item.slug])
    .filter(Boolean)
    .slice(0, 3);

  const savedVendors = savedItems
    .filter((item) => item.kind === "vendor")
    .map((item) => vendorBySlug[item.slug])
    .filter(Boolean)
    .slice(0, 3);

  const savedImages = savedItems
    .filter((item) => item.kind === "inspiration")
    .map((item) => inspirationBySlug[item.slug])
    .filter(Boolean)
    .slice(0, 4);

  const names =
    partnerOne && partnerTwo
      ? `${partnerOne} & ${partnerTwo}`
      : partnerOne || partnerTwo || null;

  return (
    <div className="pt-12 lg:pt-16">
      {/* --- The two numbers --------------------------------------------- */}
      <section className="grid gap-10 border-b border-ink/12 pb-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow text-ink-50">
            {names ? names : "Your wedding"}
            {weddingDate ? (
              <>
                {" · "}
                {new Date(weddingDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </>
            ) : null}
          </p>

          <p className="mt-4 font-display text-[clamp(3rem,9vw,6rem)] leading-[0.9] font-light tabular-nums">
            {hydrated && days !== null ? Math.abs(days) : "—"}
          </p>
          <p className="mt-3 font-sans text-lg text-ink-70">
            {days === null
              ? "Set a date to start the countdown"
              : days > 1
                ? `days to go, in ${location}`
                : days === 1
                  ? "one day to go"
                  : days === 0
                    ? "today"
                    : "days since"}
          </p>
        </div>

        <div>
          <p className="eyebrow text-ink-50">Planned</p>
          <p className="mt-4 font-display text-[clamp(3rem,9vw,6rem)] leading-[0.9] font-light tabular-nums">
            {hydrated ? `${progress}%` : "—"}
          </p>
          <div className="mt-5 h-px w-full bg-ink/15">
            <motion.div
              className="h-full bg-ember"
              initial={false}
              animate={{ width: `${hydrated ? progress : 0}%` }}
              transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <p className="mt-3 font-sans text-lg text-ink-70">
            {hydrated ? `${done} of ${tasks.length} done` : "Loading"}
          </p>
        </div>
      </section>

      {/* --- Next up ------------------------------------------------------ */}
      <div className="grid gap-14 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
        <section>
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl leading-none font-light">Next up</h2>
            <TextLink href="/dashboard/tasks">All tasks</TextLink>
          </div>

          {upcoming.length ? (
            <ul className="border-t border-ink/12">
              {upcoming.map((task) => (
                <li key={task.id} className="border-b border-ink/12">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    role="checkbox"
                    aria-checked={task.done}
                    className="flex w-full items-start gap-4 py-3.5 text-left"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-ink-30"
                    />
                    <span className="flex-1 font-sans text-[0.9375rem] leading-snug">
                      {task.title}
                    </span>
                    <span className="shrink-0 font-mono text-[0.625rem] tracking-wide text-ink-50">
                      {TASK_CATEGORY_LABEL[task.category]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              title="Nothing outstanding."
              body="Either you are extremely organised or the wedding has happened."
              href="/dashboard/tasks"
              cta="Open the list"
            />
          )}
        </section>

        {/* --- Money and guests ------------------------------------------- */}
        <section className="space-y-10">
          <div>
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl leading-none font-light">Budget</h2>
              <TextLink href="/dashboard/budget">Open</TextLink>
            </div>
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="eyebrow text-ink-50">Total</dt>
                <dd className="mt-2 font-display text-3xl tabular-nums">
                  {hydrated ? formatCurrency(budgetTotal) : "—"}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ink-50">Spent</dt>
                <dd className="mt-2 font-display text-3xl tabular-nums">
                  {hydrated ? formatCurrency(totals.spent) : "—"}
                </dd>
              </div>
            </dl>
            <div className="mt-4 h-[3px] w-full bg-ink/10">
              <div
                className="h-full bg-ember transition-[width] duration-500"
                style={{
                  width: `${Math.min(100, (totals.spent / Math.max(budgetTotal, 1)) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl leading-none font-light">Guests</h2>
              <TextLink href="/dashboard/guests">Open</TextLink>
            </div>
            {guests.length ? (
              <dl className="grid grid-cols-3 gap-6">
                <div>
                  <dt className="eyebrow text-ink-50">Invited</dt>
                  <dd className="mt-2 font-display text-3xl tabular-nums">
                    {formatNumber(guests.length)}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-50">Coming</dt>
                  <dd className="mt-2 font-display text-3xl tabular-nums">
                    {formatNumber(attending)}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-50">Waiting</dt>
                  <dd className="mt-2 font-display text-3xl tabular-nums">
                    {formatNumber(pending)}
                  </dd>
                </div>
              </dl>
            ) : (
              <Empty
                title="No guest list yet."
                body="Start with the people who have been to your flat. It is a better rule than it sounds."
                href="/dashboard/guests"
                cta="Add guests"
              />
            )}
          </div>
        </section>
      </div>

      {/* --- Saved --------------------------------------------------------- */}
      <section className="border-t border-ink/12 py-12">
        <div className="mb-7 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl leading-none font-light">Kept</h2>
          <TextLink href="/dashboard/inspiration">Everything saved</TextLink>
        </div>

        {savedImages.length || savedVenues.length || savedVendors.length ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            {savedImages.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {savedImages.map((item) => (
                  <Link key={item.slug} href={`/inspiration/${item.slug}`} className="group block">
                    <Photo
                      photoKey={item.imageId}
                      ratio="square"
                      sizes="(min-width: 640px) 18vw, 45vw"
                      imageClassName="transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </Link>
                ))}
              </div>
            ) : null}

            <div className="space-y-8">
              {savedVenues.length ? (
                <div>
                  <h3 className="eyebrow mb-3 text-ink-50">Venues</h3>
                  <ul className="space-y-2">
                    {savedVenues.map((venue) => (
                      <li key={venue.slug}>
                        <Link
                          href={`/venues/${venue.slug}`}
                          className="font-sans text-[0.9375rem] hover:text-ink-70"
                        >
                          {venue.name}
                          <span className="ml-3 font-mono text-[0.625rem] tracking-wide text-ink-50">
                            {venue.region}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {savedVendors.length ? (
                <div>
                  <h3 className="eyebrow mb-3 text-ink-50">Suppliers</h3>
                  <ul className="space-y-2">
                    {savedVendors.map((vendor) => (
                      <li key={vendor.slug}>
                        <Link
                          href={`/vendors/${vendor.slug}`}
                          className="font-sans text-[0.9375rem] hover:text-ink-70"
                        >
                          {vendor.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <Empty
            title="Nothing kept yet."
            body="Start collecting places and images that feel like you. They stay in this browser, and they make the first conversation with anyone twice as useful."
            href="/inspiration"
            cta="Open the gallery"
          />
        )}
      </section>

      {/* --- Quick actions -------------------------------------------------- */}
      <section className="border-t border-ink/12 pt-10">
        <h2 className="eyebrow mb-5 text-ink-50">Quick things</h2>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/dashboard/tasks" variant="onLight" arrow={false}>
            Add a task
          </ButtonLink>
          <ButtonLink href="/dashboard/guests" variant="onLight" arrow={false}>
            Add a guest
          </ButtonLink>
          <ButtonLink href="/dashboard/budget" variant="onLight" arrow={false}>
            Update the budget
          </ButtonLink>
          <ButtonLink href="/dashboard/site" variant="onLight" arrow={false}>
            Edit your site
          </ButtonLink>
          <ButtonLink href="/contact" variant="primary">
            Talk to a planner
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}

/** One empty state treatment, used everywhere on the dashboard. */
function Empty({
  title,
  body,
  href,
  cta,
  className,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  className?: string;
}) {
  return (
    <div className={cn("border-l-2 border-ember/40 py-1 pl-6", className)}>
      <p className="font-display text-xl leading-snug font-light">{title}</p>
      <p className="mt-2 max-w-[44ch] font-sans text-[0.9375rem] leading-relaxed text-ink-70">
        {body}
      </p>
      <div className="mt-4">
        <TextLink href={href} arrow>
          {cta}
        </TextLink>
      </div>
    </div>
  );
}

export { Empty };
