"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { TaskCategory } from "@/types";
import { TASK_CATEGORY_LABEL, TIMELINE_BANDS } from "@/content/tasks";
import { usePlanning } from "@/lib/store/planning";
import { track } from "@/lib/analytics";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

/**
 * The checklist.
 *
 * Grouped by how far out the work happens rather than by category, because
 * that is the question people are actually asking — "what should we be doing
 * now?" Category becomes a filter instead.
 */
export function Checklist() {
  const hydrated = usePlanning((state) => state.hydrated);
  const tasks = usePlanning((state) => state.tasks);
  const toggleTask = usePlanning((state) => state.toggleTask);
  const addTask = usePlanning((state) => state.addTask);
  const removeTask = usePlanning((state) => state.removeTask);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (hydrated) track({ name: "checklist_started" });
  }, [hydrated]);

  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [hideDone, setHideDone] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftBand, setDraftBand] = useState(6);

  const usedCategories = useMemo(
    () => [...new Set(tasks.map((task) => task.category))],
    [tasks],
  );

  const visible = tasks.filter((task) => {
    if (hideDone && task.done) return false;
    if (categories.length && !categories.includes(task.category)) return false;
    return true;
  });

  const done = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const bands = TIMELINE_BANDS.map((band, index) => {
    const next = TIMELINE_BANDS[index + 1];
    const upper = band.months;
    const lower = next ? next.months : -1;
    return {
      ...band,
      tasks: visible.filter(
        (task) => task.monthsBefore <= upper && task.monthsBefore > lower,
      ),
    };
  }).filter((band) => band.tasks.length > 0);

  return (
    <div className="pb-24">
      {/* --- Progress ------------------------------------------------------- */}
      <div className="sticky top-19 z-30 -mx-6 border-y border-ink/12 bg-paper/98 px-6 py-4 backdrop-blur-[2px] sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <p className="font-display text-3xl leading-none tabular-nums">
              {hydrated ? `${progress}%` : "—"}
            </p>
            <p className="font-mono text-[0.6875rem] tracking-wide text-ink-50">
              {hydrated ? `${done} of ${tasks.length} done` : "Loading your list"}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setHideDone((on) => !on)}
              aria-pressed={hideDone}
              className={cn(
                "min-h-11 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors",
                hideDone ? "text-ember" : "text-ink-70 hover:text-ink",
              )}
            >
              Hide done
            </button>
          </div>
        </div>

        <div className="mt-3 h-px w-full bg-ink/15">
          <motion.div
            className="h-full bg-ember"
            initial={false}
            animate={{ width: `${hydrated ? progress : 0}%` }}
            transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* --- Category filter ------------------------------------------------- */}
      <div className="-mx-6 overflow-x-auto px-6 pt-8 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 sm:flex-wrap">
          {usedCategories.map((category) => (
            <Chip
              key={category}
              active={categories.includes(category)}
              onClick={() =>
                setCategories((current) =>
                  current.includes(category)
                    ? current.filter((item) => item !== category)
                    : [...current, category],
                )
              }
              className="shrink-0"
            >
              {TASK_CATEGORY_LABEL[category]}
            </Chip>
          ))}
        </div>
      </div>

      {/* --- Add ------------------------------------------------------------- */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          addTask({
            title: draft.trim(),
            category: "planning",
            monthsBefore: draftBand,
            done: false,
            priority: "normal",
            dueDate: null,
            note: null,
            custom: true,
          });
          setDraft("");
        }}
        className="mt-8 flex flex-wrap items-end gap-4 border-b border-ink/12 pb-6"
      >
        <div className="min-w-[16rem] flex-1">
          <label htmlFor="new-task" className="eyebrow text-ink-50">
            Add something of your own
          </label>
          <input
            id="new-task"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ring the registrar back"
            className="mt-2 min-h-12 w-full border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
          />
        </div>

        <div>
          <label htmlFor="new-task-band" className="eyebrow text-ink-50">
            When
          </label>
          <select
            id="new-task-band"
            value={draftBand}
            onChange={(event) => setDraftBand(Number(event.target.value))}
            className="mt-2 min-h-12 border-b border-ink/25 bg-transparent py-2 pr-8 font-sans text-base outline-none focus:border-ink"
          >
            {TIMELINE_BANDS.map((band) => (
              <option key={band.months} value={band.months}>
                {band.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="min-h-12 bg-ember px-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-ink hover:text-champagne"
        >
          Add
        </button>
      </form>

      {/* --- The list --------------------------------------------------------- */}
      {hydrated ? bands.length ? (
        <div className="pt-12">
          {bands.map((band) => (
            <section
              key={band.months}
              className="mb-12 lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[9.5rem_minmax(0,1fr)]"
            >
              <div className="mb-5 border-t border-ink/15 pt-4 lg:sticky lg:top-40 lg:mb-0 lg:self-start">
                <p className="eyebrow">{band.label}</p>
                <p className="mt-2 font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
                  {band.note}
                </p>
              </div>

              <ul className="border-t border-ink/12">
                {band.tasks.map((task) => (
                  <li key={task.id} className="group border-b border-ink/12">
                    <div className="flex items-start gap-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        role="checkbox"
                        aria-checked={task.done}
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border transition-colors"
                        style={{
                          borderColor: task.done ? "var(--color-ember)" : "var(--color-ink-30)",
                          backgroundColor: task.done ? "var(--color-ember)" : "transparent",
                        }}
                      >
                        <span className="sr-only">{task.title}</span>
                        {task.done ? (
                          <svg aria-hidden viewBox="0 0 12 10" width="11" height="9" fill="none">
                            <path d="M1 5l3.5 3.5L11 1" stroke="#2E2910" strokeWidth="1.6" />
                          </svg>
                        ) : null}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "font-sans text-[1.0625rem] leading-snug transition-colors",
                            task.done && "text-ink-50 line-through",
                          )}
                        >
                          {task.title}
                        </p>
                        {task.note ? (
                          <p className="mt-1.5 max-w-[62ch] font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
                            {task.note}
                          </p>
                        ) : null}
                      </div>

                      <span className="shrink-0 pt-1 font-mono text-[0.625rem] tracking-wide text-ink-50">
                        {TASK_CATEGORY_LABEL[task.category]}
                      </span>

                      {task.custom ? (
                        <button
                          type="button"
                          onClick={() => removeTask(task.id)}
                          className="h-9 w-9 shrink-0 text-ink-50 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 hover:text-ember"
                        >
                          <span className="sr-only">Remove {task.title}</span>
                          <svg aria-hidden viewBox="0 0 12 12" width="11" height="11" className="mx-auto">
                            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.3" />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="py-24">
          <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-light">
            {hideDone ? "That’s everything done." : "Nothing in this category."}
          </p>
          <p className="mt-4 max-w-[40ch] font-sans text-base leading-relaxed text-ink-70">
            {hideDone
              ? "Genuinely nothing left on the list. Either you are extremely organised or the wedding has happened."
              : "Try clearing the filters, or add something of your own above."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
