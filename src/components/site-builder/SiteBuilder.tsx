"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { photoKeys } from "@/content/media";
import { TEMPLATES, useSite } from "@/lib/store/site";
import { usePlanning } from "@/lib/store/planning";
import { Photo } from "@/components/editorial/Photo";
import { Field, inputClass } from "@/components/forms/Field";
import { Chip } from "@/components/ui/Chip";
import { CoupleSite } from "./CoupleSite";
import { brand } from "@/content/brand";
import { cn } from "@/lib/utils";

/** A short, curated set — the whole register would be a choice paralysis. */
const HERO_CHOICES = [
  "first-light",
  "long-table",
  "golden-hour",
  "the-ceremony",
  "style-garden",
  "style-coastal",
  "venue-elmhurst",
  "style-minimal",
];

/**
 * The builder.
 *
 * A form on the left, the real page on the right — the same component that
 * serves /w/[slug], so what you see is literally what publishes. Deliberately
 * not a drag-and-drop editor: couples want a good page, not a canvas.
 */
export function SiteBuilder() {
  const site = useSite();
  const update = useSite((state) => state.update);
  const publish = useSite((state) => state.publish);
  const unpublish = useSite((state) => state.unpublish);

  const partnerOne = usePlanning((state) => state.partnerOne);
  const partnerTwo = usePlanning((state) => state.partnerTwo);
  const weddingDate = usePlanning((state) => state.weddingDate);

  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const url = `${brand.url}/w/${site.slug || "your-names"}`;

  function pullFromPlanning() {
    update({
      partnerOne: partnerOne || site.partnerOne,
      partnerTwo: partnerTwo || site.partnerTwo,
      date: weddingDate ?? site.date,
    });
    toast.success("Pulled in from your planning details.");
  }

  return (
    <div className="pt-12 lg:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/12 pb-6">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none font-light">
            Your wedding site
          </h1>
          <p className="mt-3 font-mono text-[0.6875rem] tracking-wide text-ink-50">
            {site.published ? (
              <>
                Live at{" "}
                <Link href={`/w/${site.slug}`} className="text-ember underline-offset-4 hover:underline">
                  {url}
                </Link>
              </>
            ) : (
              <>Not published — {url}</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={pullFromPlanning}
            className="min-h-11 border border-ink/25 px-5 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-ink"
          >
            Use my details
          </button>
          {site.published ? (
            <button
              type="button"
              onClick={() => {
                unpublish();
                toast("Taken down. Nobody can see it now.");
              }}
              className="min-h-11 border border-ink/25 px-5 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-ink"
            >
              Take it down
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                publish();
                toast.success("Published. Send the link to whoever you like.");
              }}
              className="min-h-11 bg-ember px-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-ink hover:text-champagne"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Small screens get tabs; there is no room for a live preview beside a
          form at 375px, and a squashed one is worse than none. */}
      <div className="mt-6 flex gap-2 lg:hidden">
        <Chip active={tab === "edit"} onClick={() => setTab("edit")}>
          Edit
        </Chip>
        <Chip active={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </Chip>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        {/* --- Form --------------------------------------------------------- */}
        <div className={cn(tab === "edit" ? "block" : "hidden", "lg:block")}>
          <fieldset className="border-b border-ink/12 pb-8">
            <legend className="eyebrow mb-4 text-ink-50">Template</legend>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => update({ template: template.id })}
                  aria-pressed={site.template === template.id}
                  className="text-left"
                >
                  <div
                    className={cn(
                      "overflow-hidden transition-all",
                      site.template === template.id
                        ? "ring-2 ring-ember ring-offset-2 ring-offset-paper"
                        : "",
                    )}
                  >
                    <Photo
                      photoKey={template.heroImageId}
                      ratio="portrait"
                      sizes="20vw"
                      overlay={site.template === template.id ? 0 : 20}
                    />
                  </div>
                  <p className="mt-2 font-sans text-sm">{template.name}</p>
                  <p className="mt-1 font-mono text-[0.5625rem] leading-relaxed tracking-wide text-ink-50">
                    {template.note}
                  </p>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-7 py-8">
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Your name">
                {(props) => (
                  <input
                    {...props}
                    value={site.partnerOne}
                    onChange={(event) => update({ partnerOne: event.target.value })}
                    placeholder="Freya"
                  />
                )}
              </Field>
              <Field label="And theirs">
                {(props) => (
                  <input
                    {...props}
                    value={site.partnerTwo}
                    onChange={(event) => update({ partnerTwo: event.target.value })}
                    placeholder="Kwame"
                  />
                )}
              </Field>
            </div>

            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Date">
                {(props) => (
                  <input
                    {...props}
                    type="date"
                    value={site.date ?? ""}
                    onChange={(event) => update({ date: event.target.value || null })}
                  />
                )}
              </Field>
              <Field label="Place">
                {(props) => (
                  <input
                    {...props}
                    value={site.location}
                    onChange={(event) => update({ location: event.target.value })}
                    placeholder="Suffolk"
                  />
                )}
              </Field>
            </div>

            <Field label="The venue" optional>
              {(props) => (
                <input
                  {...props}
                  value={site.venue}
                  onChange={(event) => update({ venue: event.target.value })}
                  placeholder="Elmhurst House, near Framlingham"
                />
              )}
            </Field>

            <Field
              label="Something about you"
              hint="Two or three sentences. Guests read this once and then look for the times."
              optional
            >
              {(props) => (
                <textarea
                  {...props}
                  rows={4}
                  value={site.story}
                  onChange={(event) => update({ story: event.target.value })}
                  className={cn(inputClass, "min-h-28 resize-y")}
                  placeholder="We met on a train that was going the wrong way."
                />
              )}
            </Field>
          </div>

          {/* --- Schedule --------------------------------------------------- */}
          <fieldset className="border-t border-ink/12 py-8">
            <legend className="eyebrow mb-5 text-ink-50">The day</legend>
            <div className="space-y-3">
              {site.schedule.map((entry, index) => (
                <div key={index} className="flex flex-wrap items-center gap-3">
                  <label className="sr-only" htmlFor={`sched-time-${index}`}>
                    Time for item {index + 1}
                  </label>
                  <input
                    id={`sched-time-${index}`}
                    value={entry.time}
                    onChange={(event) => {
                      const next = [...site.schedule];
                      next[index] = { ...entry, time: event.target.value };
                      update({ schedule: next });
                    }}
                    className="min-h-11 w-20 border-b border-ink/25 bg-transparent text-center font-mono text-sm tabular-nums outline-none focus:border-ink"
                  />
                  <label className="sr-only" htmlFor={`sched-title-${index}`}>
                    Title for item {index + 1}
                  </label>
                  <input
                    id={`sched-title-${index}`}
                    value={entry.title}
                    onChange={(event) => {
                      const next = [...site.schedule];
                      next[index] = { ...entry, title: event.target.value };
                      update({ schedule: next });
                    }}
                    placeholder="Ceremony"
                    className="min-h-11 min-w-[8rem] flex-1 border-b border-ink/25 bg-transparent font-sans text-[0.9375rem] outline-none focus:border-ink"
                  />
                  <label className="sr-only" htmlFor={`sched-detail-${index}`}>
                    Detail for item {index + 1}
                  </label>
                  <input
                    id={`sched-detail-${index}`}
                    value={entry.detail}
                    onChange={(event) => {
                      const next = [...site.schedule];
                      next[index] = { ...entry, detail: event.target.value };
                      update({ schedule: next });
                    }}
                    placeholder="Detail"
                    className="min-h-11 min-w-[8rem] flex-1 border-b border-ink/25 bg-transparent font-sans text-sm text-ink-70 outline-none focus:border-ink"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      update({ schedule: site.schedule.filter((_, i) => i !== index) })
                    }
                    className="h-11 w-11 shrink-0 text-ink-50 hover:text-ember"
                  >
                    <span className="sr-only">Remove item {index + 1}</span>
                    <svg aria-hidden viewBox="0 0 12 12" width="11" height="11" className="mx-auto">
                      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                update({
                  schedule: [...site.schedule, { time: "", title: "", detail: "" }],
                })
              }
              className="mt-5 min-h-11 border border-ink/25 px-5 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-ink"
            >
              Add a moment
            </button>
          </fieldset>

          {/* --- Practical -------------------------------------------------- */}
          <div className="space-y-7 border-t border-ink/12 py-8">
            <Field label="Getting there" optional>
              {(props) => (
                <textarea
                  {...props}
                  rows={2}
                  value={site.travel}
                  onChange={(event) => update({ travel: event.target.value })}
                  className={cn(inputClass, "min-h-20 resize-y")}
                  placeholder="Nearest station is Wickham Market. We’ll run a minibus from the Crown at one."
                />
              )}
            </Field>

            <Field label="Staying" optional>
              {(props) => (
                <textarea
                  {...props}
                  rows={2}
                  value={site.accommodation}
                  onChange={(event) => update({ accommodation: event.target.value })}
                  className={cn(inputClass, "min-h-20 resize-y")}
                  placeholder="We’ve held twenty rooms at the Crown until March."
                />
              )}
            </Field>

            <Field label="What to wear" optional>
              {(props) => (
                <input
                  {...props}
                  value={site.dressCode}
                  onChange={(event) => update({ dressCode: event.target.value })}
                  placeholder="Whatever makes you feel good. It’s a field — bring flat shoes."
                />
              )}
            </Field>

            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Presents" optional>
                {(props) => (
                  <input
                    {...props}
                    value={site.registry}
                    onChange={(event) => update({ registry: event.target.value })}
                    placeholder="Your being there is plenty. If you insist —"
                  />
                )}
              </Field>
              <Field label="Link to the list" optional>
                {(props) => (
                  <input
                    {...props}
                    type="url"
                    value={site.registryUrl}
                    onChange={(event) => update({ registryUrl: event.target.value })}
                    placeholder="https://"
                  />
                )}
              </Field>
            </div>
          </div>

          {/* --- Pictures ---------------------------------------------------- */}
          <fieldset className="border-t border-ink/12 py-8">
            <legend className="eyebrow mb-4 text-ink-50">The main picture</legend>
            <div className="grid grid-cols-4 gap-2">
              {HERO_CHOICES.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => update({ heroImageId: key })}
                  aria-pressed={site.heroImageId === key}
                  className={cn(
                    "overflow-hidden transition-all",
                    site.heroImageId === key
                      ? "ring-2 ring-ember ring-offset-2 ring-offset-paper"
                      : "",
                  )}
                >
                  <span className="sr-only">Use this photograph</span>
                  <Photo photoKey={key} ratio="square" sizes="12vw" />
                </button>
              ))}
            </div>

            <legend className="eyebrow mt-8 mb-4 text-ink-50">A few more</legend>
            <div className="grid grid-cols-6 gap-2">
              {photoKeys.slice(0, 24).map((key) => {
                const on = site.galleryImageIds.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      update({
                        galleryImageIds: on
                          ? site.galleryImageIds.filter((item) => item !== key)
                          : [...site.galleryImageIds, key],
                      })
                    }
                    aria-pressed={on}
                    className={cn(
                      "overflow-hidden transition-all",
                      on ? "ring-2 ring-ember ring-offset-2 ring-offset-paper" : "opacity-70 hover:opacity-100",
                    )}
                  >
                    <span className="sr-only">
                      {on ? "Remove from the gallery" : "Add to the gallery"}
                    </span>
                    <Photo photoKey={key} ratio="square" sizes="8vw" />
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="border-t border-ink/12 py-8">
            <button
              type="button"
              onClick={() => update({ rsvpEnabled: !site.rsvpEnabled })}
              aria-pressed={site.rsvpEnabled}
              className={cn(
                "min-h-11 border px-5 font-sans text-sm transition-colors",
                site.rsvpEnabled
                  ? "border-ember bg-ember-wash"
                  : "border-ink/20 text-ink-70",
              )}
            >
              {site.rsvpEnabled ? "RSVP shown" : "RSVP hidden"}
            </button>
          </div>
        </div>

        {/* --- Preview -------------------------------------------------------- */}
        <div className={cn(tab === "preview" ? "block" : "hidden", "lg:block")}>
          <div className="lg:sticky lg:top-40">
            <p className="eyebrow mb-3 text-ink-50">
              Preview — this is the page itself
            </p>
            <div className="max-h-[76svh] overflow-y-auto border border-ink/15">
              <CoupleSite site={site} preview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
