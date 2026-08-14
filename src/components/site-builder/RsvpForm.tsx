"use client";

import { useState } from "react";
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
      <div>
        <label className="eyebrow text-ink-50">Your name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 block min-h-11 w-full border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
          placeholder="Name"
        />
      </div>

      <div className="flex gap-3">
        {[true, false].map((val) => (
          <button
            key={String(val)}
            type="button"
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

      {attending ? (
        <div>
          <label className="eyebrow text-ink-50">How many of you?</label>
          <input
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-2 block min-h-11 w-20 border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none focus:border-ink"
          />
        </div>
      ) : null}

      <div>
        <label className="eyebrow text-ink-50">Email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="For the couple to reach you"
          className="mt-2 block min-h-11 w-full border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
        />
      </div>

      <div>
        <label className="eyebrow text-ink-50">Message (optional)</label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 block min-h-20 w-full resize-y border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
          placeholder="Anything else for the couple"
        />
      </div>

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
