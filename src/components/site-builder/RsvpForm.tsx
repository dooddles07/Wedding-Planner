"use client";

import { useId, useState } from "react";
import { Field } from "@/components/forms/Field";
import { cn } from "@/lib/utils";

export function RsvpForm({
  siteSlug,
  skin,
}: {
  siteSlug: string;
  skin: { muted: string };
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">(
    "idle",
  );
  const [attending, setAttending] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const attendingId = useId();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || attending === null) return;
    setState("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteSlug, name, email, attending, guests, message }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <p className={cn("mt-7 font-sans text-base", skin.muted)} role="status">
        {attending ? "We'll see you there." : "Thanks for letting us know."}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-sm space-y-5 text-left">
      <Field label="Your name">
        {(props) => (
          <input
            {...props}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-11 w-full border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
            placeholder="Name"
          />
        )}
      </Field>

      <fieldset>
        <legend id={attendingId} className="eyebrow text-ink-50">
          Will you be there?
        </legend>
        <div className="mt-2 flex gap-3" role="group" aria-labelledby={attendingId}>
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              aria-pressed={attending === val}
              onClick={() => setAttending(val)}
              className={cn(
                "min-h-11 flex-1 border font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors",
                attending === val
                  ? "border-ember bg-ember text-ink"
                  : "border-ink/25 hover:border-ink",
              )}
            >
              {val ? "Yes, I'll be there" : "Sorry, can't make it"}
            </button>
          ))}
        </div>
      </fieldset>

      {attending ? (
        <Field label="How many of you?">
          {(props) => (
            <input
              {...props}
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="min-h-11 w-20 border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none focus:border-ink"
            />
          )}
        </Field>
      ) : null}

      <Field label="Email" optional>
        {(props) => (
          <input
            {...props}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="For the couple to reach you"
            className="min-h-11 w-full border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
          />
        )}
      </Field>

      <Field label="Message" optional>
        {(props) => (
          <textarea
            {...props}
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-20 w-full resize-y border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
            placeholder="Anything else for the couple"
          />
        )}
      </Field>

      {state === "failed" ? (
        <p role="alert" className="font-sans text-sm text-ember">
          That didn’t send. Try again, or email the couple directly.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending" || !name.trim() || attending === null}
        className="min-h-12 w-full bg-ember px-8 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-ink hover:text-champagne disabled:opacity-50"
      >
        {state === "sending" ? "Sending..." : "Send RSVP"}
      </button>
    </form>
  );
}
