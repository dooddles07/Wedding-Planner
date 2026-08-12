"use client";

import { cn } from "@/lib/utils";

/**
 * The filter control, used by both directories.
 *
 * A rectangle with a hairline, not a pill — the brief bans excessive pill
 * buttons and rectangles match the rest of the page. Active state is ember on
 * a wash, which is the only place orange appears in a directory.
 */
export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-11 items-center border px-4 font-sans text-[0.8125rem] transition-colors duration-200",
        active
          ? "border-ember bg-ember-wash text-ink"
          : "border-ink/20 text-ink-70 hover:border-ink/50 hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Indicative price, shown as marks rather than a fabricated exact figure. */
export function PriceBand({ band, className }: { band: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <span className="sr-only">Price band {band} of 4</span>
      {[1, 2, 3, 4].map((step) => (
        <span
          key={step}
          aria-hidden
          className={cn(
            "font-mono text-[0.6875rem]",
            step <= band ? "text-ink" : "text-ink-50",
          )}
        >
          £
        </span>
      ))}
    </span>
  );
}
