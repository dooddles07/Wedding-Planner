"use client";

import { useState } from "react";
import { toast } from "sonner";
import { weddingStyles } from "@/content/styles";
import { BUDGET_LOCATIONS } from "@/lib/budget";
import { usePlanning } from "@/lib/store/planning";
import { useSaves } from "@/lib/store/saves";
import { clearAllStoredData } from "@/lib/data/storage";
import { Chip } from "@/components/ui/Chip";
import { Field } from "@/components/forms/Field";

/**
 * Settings.
 *
 * The wedding’s own details, and one destructive action that says plainly what
 * it does. The reset asks twice — not with a modal, but by making the second
 * click a different button, which is harder to do by accident than dismissing
 * a dialog.
 */
export function Settings() {
  const hydrated = usePlanning((state) => state.hydrated);
  const partnerOne = usePlanning((state) => state.partnerOne);
  const partnerTwo = usePlanning((state) => state.partnerTwo);
  const weddingDate = usePlanning((state) => state.weddingDate);
  const location = usePlanning((state) => state.location);
  const guestCount = usePlanning((state) => state.guestCount);
  const styleId = usePlanning((state) => state.styleId);
  const setWedding = usePlanning((state) => state.setWedding);
  const reset = usePlanning((state) => state.reset);
  const clearSaves = useSaves((state) => state.clear);

  const [confirming, setConfirming] = useState(false);

  function onReset() {
    reset();
    clearSaves();
    clearAllStoredData();
    setConfirming(false);
    toast.success("Cleared. Everything is back to where it started.");
  }

  return (
    <div className="max-w-2xl pt-12">
      <h1 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none font-light">
        Settings
      </h1>

      <div className="mt-10 space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <Field label="Your name">
            {(props) => (
              <input
                {...props}
                type="text"
                value={partnerOne}
                onChange={(event) => setWedding({ partnerOne: event.target.value })}
                placeholder="Freya"
              />
            )}
          </Field>

          <Field label="And theirs">
            {(props) => (
              <input
                {...props}
                type="text"
                value={partnerTwo}
                onChange={(event) => setWedding({ partnerTwo: event.target.value })}
                placeholder="Kwame"
              />
            )}
          </Field>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field label="The date" hint="Change it as often as you like.">
            {(props) => (
              <input
                {...props}
                type="date"
                value={weddingDate ?? ""}
                onChange={(event) =>
                  setWedding({ weddingDate: event.target.value || null })
                }
              />
            )}
          </Field>

          <Field label="Guests">
            {(props) => (
              <input
                {...props}
                type="number"
                min={2}
                max={2000}
                value={guestCount}
                onChange={(event) =>
                  setWedding({ guestCount: Number(event.target.value) || 0 })
                }
              />
            )}
          </Field>
        </div>

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
          <legend className="eyebrow mb-3 text-ink-50">Direction</legend>
          <div className="flex flex-wrap gap-2">
            {weddingStyles.map((style) => (
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
      </div>

      {/* --- Data ---------------------------------------------------------- */}
      <section className="mt-14 border-t border-ink/12 pt-10">
        <h2 className="font-display text-2xl leading-tight font-light">
          Where your data lives
        </h2>
        <p className="mt-3 max-w-[54ch] font-sans text-[0.9375rem] leading-[1.7] text-ink-70">
          You&rsquo;re signed in, so this is synced to your account — it follows
          you to another device. &ldquo;Start again&rdquo; below clears that
          copy along with the one on this device. Export the guest list if you
          want something that outlives either.
        </p>

        <div className="mt-7">
          {confirming ? (
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onReset}
                className="min-h-11 bg-ember px-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-ink hover:text-champagne"
              >
                Yes, clear everything
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="min-h-11 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-50 uppercase underline-offset-4 hover:text-ink hover:underline"
              >
                Keep it
              </button>
              <p className="w-full font-sans text-sm text-ink-70">
                This removes your tasks, budget, guest list and everything
                saved. It cannot be undone.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={!hydrated}
              className="min-h-11 border border-ink/25 px-6 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-40"
            >
              Start again
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
