"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { voice } from "@/content/brand";
import { repository } from "@/lib/data/repository";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.email("That address doesn’t look right."),
});

export function NewsletterForm({
  location = "footer",
  className,
  onDark = true,
}: {
  location?: string;
  className?: string;
  onDark?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ email });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setError(null);
    setState("sending");

    try {
      await repository.createLead({
        name: "",
        email: parsed.data.email,
        weddingDate: null,
        location: null,
        guestCount: null,
        message: null,
        source: "newsletter",
        context: { location },
      });
      track({ name: "newsletter_signup", location });
      setState("done");
      toast.success(voice.newsletter.confirmation);
    } catch {
      setState("idle");
      setError("Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <p
        className={cn(
          "font-sans text-sm leading-relaxed",
          onDark ? "text-champagne" : "text-forest",
          className,
        )}
        role="status"
      >
        {voice.newsletter.confirmation}
      </p>
    );
  }

  const errorId = "newsletter-error";

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} noValidate>
      <div
        className={cn(
          "flex items-stretch border-b transition-colors",
          onDark ? "border-paper/25 focus-within:border-paper" : "border-ink/25 focus-within:border-ink",
          error && "border-ember",
        )}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          placeholder="you@example.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "min-h-12 w-full bg-transparent py-3 pr-3 font-sans text-base outline-none",
            onDark ? "placeholder:text-paper/65" : "placeholder:text-ink/35",
          )}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className={cn(
            "shrink-0 self-center font-mono text-[0.6875rem] tracking-[0.16em] uppercase transition-opacity disabled:opacity-50",
            onDark ? "text-ember hover:text-champagne" : "text-ember-dim hover:text-ink",
          )}
        >
          {state === "sending" ? "Sending" : voice.newsletter.cta}
        </button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 font-sans text-xs text-ember">
          {error}
        </p>
      ) : null}
    </form>
  );
}
