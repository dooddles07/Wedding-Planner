"use client";

import { useMemo, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TASK_CATEGORY_LABEL, TIMELINE_BANDS } from "@/content/tasks";
import { usePlanning } from "@/lib/store/planning";
import { track } from "@/lib/analytics";
import { daysUntil } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Never changes, so the store never notifies. */
const subscribeToNothing = () => () => undefined;

/**
 * Cached so the snapshot is referentially stable — a fresh Date.now() on every
 * read would put useSyncExternalStore into an infinite loop. Rounded to the day
 * because that is the only precision this page uses.
 */
let cachedNow: number | null = null;
function clientNow() {
  cachedNow ??= new Date().setHours(0, 0, 0, 0);
  return cachedNow;
}

/**
 * The timeline.
 *
 * Same tasks as the checklist, read the other way round: against the actual
 * date, with each band showing the real calendar month it falls in and whether
 * it has already passed. Setting a date turns the whole thing from a template
 * into a schedule, which is the entire point.
 */
export function Timeline() {
  const hydrated = usePlanning((state) => state.hydrated);
  const tasks = usePlanning((state) => state.tasks);
  const weddingDate = usePlanning((state) => state.weddingDate);
  const setWedding = usePlanning((state) => state.setWedding);
  const toggleTask = usePlanning((state) => state.toggleTask);
  const reduced = useReducedMotion();

  // The clock, read once on the client. The server has a different "now", so
  // reading it during render would make "passed" flicker on hydration —
  // useSyncExternalStore gives us null on the server and a stable value after.
  const now = useSyncExternalStore(
    subscribeToNothing,
    () => clientNow(),
    () => null,
  );

  const days = now !== null && weddingDate ? daysUntil(weddingDate) : null;

  const bands = useMemo(
    () =>
      TIMELINE_BANDS.map((band, index) => {
        const next = TIMELINE_BANDS[index + 1];
        const lower = next ? next.months : -1;
        const bandTasks = tasks.filter(
          (task) => task.monthsBefore <= band.months && task.monthsBefore > lower,
        );

        // The real month this band lands in, counting back from the date.
        let when: string | null = null;
        let passed = false;
        if (weddingDate) {
          const date = new Date(weddingDate);
          date.setMonth(date.getMonth() - Math.round(band.months));
          when = date.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          });
          passed = now !== null && date.getTime() < now;
        }

        const done = bandTasks.filter((task) => task.done).length;

        return { ...band, tasks: bandTasks, when, passed, done };
      }),
    [tasks, weddingDate, now],
  );

  return (
    <div className="pb-24">
      {/* --- The date ------------------------------------------------------- */}
      <div className="border-y border-ink/12 py-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <label htmlFor="wedding-date" className="eyebrow text-ink-50">
              The date
            </label>
            <input
              id="wedding-date"
              type="date"
              value={weddingDate ?? ""}
              onChange={(event) => {
                const date = event.target.value || null;
                setWedding({ weddingDate: date });
                if (date) track({ name: "timeline_saved" });
              }}
              className="mt-2 block min-h-12 border-b border-ink/25 bg-transparent py-2 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-none outline-none transition-colors focus:border-ink"
            />
          </div>

          {hydrated && days !== null ? (
            <div className="text-right">
              <p className="eyebrow text-ink-50">
                {days > 0 ? "To go" : days === 0 ? "Today" : "Since"}
              </p>
              <p className="mt-2 font-display text-[clamp(1.75rem,4vw,3rem)] leading-none tabular-nums">
                {Math.abs(days)}
                <span className="ml-2 font-sans text-base text-ink-50">
                  {Math.abs(days) === 1 ? "day" : "days"}
                </span>
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* --- The bands ------------------------------------------------------- */}
      <div className="relative pt-14">
        {/* The spine. Hairline, and the only vertical rule on the site. */}
        <div
          aria-hidden
          className="absolute top-14 bottom-0 left-[7px] w-px bg-ink/15 lg:left-[calc(7.5rem+7px)] xl:left-[calc(9.5rem+7px)]"
        />

        {bands.map((band) => {
          const complete = band.tasks.length > 0 && band.done === band.tasks.length;

          return (
            <section
              key={band.months}
              className="relative mb-14 lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]"
            >
              <div className="mb-5 lg:mb-0 lg:text-right">
                <p className="eyebrow">{band.label}</p>
                {band.when ? (
                  <p
                    className={cn(
                      "mt-2 font-mono text-[0.625rem] tracking-wide",
                      band.passed ? "text-ember-dim" : "text-ink-50",
                    )}
                  >
                    {band.when}
                    {band.passed ? " · passed" : ""}
                  </p>
                ) : null}
              </div>

              <div className="relative pl-8 lg:pl-8">
                {/* The node on the spine. Filled when the band is complete. */}
                <motion.span
                  aria-hidden
                  className="absolute top-1.5 left-0 block h-3.5 w-3.5 -translate-x-[calc(50%-7px)] rounded-full border-2 lg:-left-12 lg:translate-x-[calc(50%-7px)] xl:-left-12"
                  style={{
                    borderColor: complete ? "var(--color-ember)" : "var(--color-ink-30)",
                    backgroundColor: complete ? "var(--color-ember)" : "var(--color-paper)",
                  }}
                  initial={false}
                  animate={{ scale: complete && !reduced ? [1, 1.25, 1] : 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />

                <div className="flex items-baseline justify-between gap-4 border-b border-ink/12 pb-3">
                  <p className="font-display text-xl leading-tight font-light">
                    {band.note}
                  </p>
                  <p className="shrink-0 font-mono text-[0.625rem] tracking-wide text-ink-50 tabular-nums">
                    {band.done}/{band.tasks.length}
                  </p>
                </div>

                <ul className="mt-1">
                  {band.tasks.map((task) => (
                    <li key={task.id} className="border-b border-ink/8">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        role="checkbox"
                        aria-checked={task.done}
                        className="flex w-full items-start gap-4 py-3 text-left"
                      >
                        <span
                          aria-hidden
                          className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors"
                          style={{
                            borderColor: task.done
                              ? "var(--color-ember)"
                              : "var(--color-ink-30)",
                            backgroundColor: task.done ? "var(--color-ember)" : "transparent",
                          }}
                        >
                          {task.done ? (
                            <svg viewBox="0 0 12 10" width="10" height="8" fill="none">
                              <path d="M1 5l3.5 3.5L11 1" stroke="#2E2910" strokeWidth="1.6" />
                            </svg>
                          ) : null}
                        </span>

                        <span
                          className={cn(
                            "flex-1 font-sans text-[0.9375rem] leading-snug transition-colors",
                            task.done && "text-ink-50 line-through",
                          )}
                        >
                          {task.title}
                        </span>

                        <span className="shrink-0 pt-0.5 font-mono text-[0.625rem] tracking-wide text-ink-50">
                          {TASK_CATEGORY_LABEL[task.category]}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <p className="font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
        Everything is saved in this browser. Ticking here also ticks it on the
        checklist — it is the same list, read the other way round.
      </p>
    </div>
  );
}
