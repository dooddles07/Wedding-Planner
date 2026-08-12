"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * One field treatment for the whole site.
 *
 * Labels are always visible — placeholder-only labels disappear the moment
 * someone types, which is exactly when they’re needed. Errors sit under the
 * field they belong to and are wired up with aria-describedby.
 */
export function Field({
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
    className: string;
  }) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 font-mono text-[0.6875rem] tracking-[0.14em] uppercase"
      >
        <span>{label}</span>
        {optional ? <span className="text-ink-50 normal-case">optional</span> : null}
      </label>

      {hint ? (
        <p id={hintId} className="mt-1.5 font-sans text-xs text-ink-50">
          {hint}
        </p>
      ) : null}

      <div className="mt-2">
        {children({
          id,
          "aria-invalid": Boolean(error),
          "aria-describedby": describedBy,
          className: cn(inputClass, error && "border-ember"),
        })}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 font-sans text-xs text-ember-dim">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "min-h-12 w-full rounded-none border-0 border-b border-ink/25 bg-transparent py-3 font-sans text-base text-ink outline-none transition-colors placeholder:text-ink-50 focus:border-ink";
