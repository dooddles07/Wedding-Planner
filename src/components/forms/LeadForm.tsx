"use client";

import { useState } from "react";
import { z } from "zod";
import type { LeadSource } from "@/types";
import { repository } from "@/lib/data/repository";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "./Field";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "We’ll need something to call you."),
  email: z.email("That address doesn’t look right."),
  weddingDate: z.string().optional(),
  location: z.string().optional(),
  guestCount: z.string().optional(),
  message: z.string().optional(),
});

type Values = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Values, string>>;

/**
 * The lead form.
 *
 * Two fields to begin with, because the decision to start typing is the whole
 * battle. The rest appears once there’s a name in the box — they’re genuinely
 * useful to us, and by then nobody minds.
 */
export function LeadForm({
  source,
  context = {},
  submitLabel = "Send it",
  compact = false,
  className,
}: {
  source: LeadSource;
  context?: Record<string, unknown>;
  submitLabel?: string;
  compact?: boolean;
  className?: string;
}) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    weddingDate: "",
    location: "",
    guestCount: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [started, setStarted] = useState(false);

  const expanded = !compact || values.name.trim().length > 1;

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    if (!started) {
      setStarted(true);
      track({ name: "lead_form_started", source });
    }
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        next[key] ??= issue.message;
      }
      setErrors(next);
      // Move focus to the first thing that needs attention.
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setState("sending");
    try {
      await repository.createLead({
        name: parsed.data.name,
        email: parsed.data.email,
        weddingDate: parsed.data.weddingDate || null,
        location: parsed.data.location || null,
        guestCount: parsed.data.guestCount ? Number(parsed.data.guestCount) : null,
        message: parsed.data.message || null,
        source,
        context,
      });
      track({ name: "lead_form_completed", source });
      track({ name: "consultation_requested", source });
      setState("done");
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <div className={cn("border-l-2 border-ember pl-6", className)} role="status">
        <p className="font-display text-2xl leading-tight font-light">
          Got it, {values.name.split(" ")[0]}.
        </p>
        <p className="mt-3 max-w-[44ch] font-sans text-[0.9375rem] leading-relaxed text-ink-70">
          One of us reads these — usually the same day, always within two. If
          it’s urgent, ring instead; the number is in the footer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("w-full", className)}>
      <div className="space-y-7">
        <Field label="Your names" error={errors.name}>
          {(props) => (
            <input
              {...props}
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="Both of them, if you like"
            />
          )}
        </Field>

        <Field label="Email" error={errors.email}>
          {(props) => (
            <input
              {...props}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
              placeholder="you@example.com"
            />
          )}
        </Field>

        {/* Everything below appears once there’s a name in the box. */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-7 pt-0.5">
              <div className="grid gap-7 sm:grid-cols-2">
                <Field
                  label="Wedding date"
                  hint="A rough month is fine."
                  optional
                  error={errors.weddingDate}
                >
                  {(props) => (
                    <input
                      {...props}
                      type="text"
                      value={values.weddingDate}
                      onChange={(event) => set("weddingDate", event.target.value)}
                      placeholder="September 2027"
                      tabIndex={expanded ? undefined : -1}
                    />
                  )}
                </Field>

                <Field label="Guests" optional error={errors.guestCount}>
                  {(props) => (
                    <input
                      {...props}
                      type="number"
                      inputMode="numeric"
                      min={2}
                      max={2000}
                      value={values.guestCount}
                      onChange={(event) => set("guestCount", event.target.value)}
                      placeholder="90"
                      tabIndex={expanded ? undefined : -1}
                    />
                  )}
                </Field>
              </div>

              <Field label="Where" optional error={errors.location}>
                {(props) => (
                  <input
                    {...props}
                    type="text"
                    value={values.location}
                    onChange={(event) => set("location", event.target.value)}
                    placeholder="Suffolk, or somewhere in Puglia, or no idea"
                    tabIndex={expanded ? undefined : -1}
                  />
                )}
              </Field>

              <Field
                label="Anything else"
                hint="What you already know, or what’s worrying you."
                optional
                error={errors.message}
              >
                {(props) => (
                  <textarea
                    {...props}
                    rows={4}
                    value={values.message}
                    onChange={(event) => set("message", event.target.value)}
                    className={cn(inputClass, "min-h-28 resize-y py-3")}
                    tabIndex={expanded ? undefined : -1}
                  />
                )}
              </Field>
            </div>
          </div>
        </div>
      </div>

      {state === "failed" ? (
        <p role="alert" className="mt-6 border-l-2 border-ember pl-4 font-sans text-sm text-ink-70">
          That didn’t go through. It’s saved on this device, so nothing is lost —
          try again, or email us directly.
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-9" disabled={state === "sending"}>
        {state === "sending" ? "Sending" : submitLabel}
      </Button>

      <p className="mt-5 max-w-[44ch] font-mono text-[0.625rem] leading-relaxed tracking-wide text-ink-50">
        Demo build: this is stored in your browser and posted to a local
        endpoint. Nothing is sent anywhere else.
      </p>
    </form>
  );
}
