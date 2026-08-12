import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Contrast, checked rather than assumed:
 *
 *   ink on ember          5.18:1   primary rest
 *   champagne on ink     11.15:1   primary hover (inverts, never darkens —
 *                                  ink on ember-deep is only 3.79:1)
 *   ink on paper         12.9:1    secondary
 *   ember-dim on paper    4.87:1   the only orange safe for small text on paper
 *   ember on ink          5.18:1   orange is safe for text on dark grounds
 *
 * Every variant clears 44px of touch target through min-height, and the arrow
 * is the microinteraction — it moves, the colour doesn’t have to.
 */

const button = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-3",
    "min-h-11 rounded-xs font-sans text-sm leading-none font-medium",
    "transition-[background-color,color,border-color] duration-300",
    "disabled:pointer-events-none disabled:opacity-45",
  ],
  {
    variants: {
      variant: {
        primary: "bg-ember text-ink hover:bg-ink hover:text-champagne",
        onDark:
          "border border-paper/35 text-paper hover:border-paper hover:bg-paper hover:text-ink",
        onLight:
          "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
        forest: "bg-forest text-champagne hover:bg-ink hover:text-champagne",
        quiet:
          "text-ink-70 hover:text-ink underline-offset-[6px] hover:underline decoration-ember decoration-1",
      },
      size: {
        sm: "px-4 py-2.5 text-[0.8125rem]",
        md: "px-6 py-4",
        lg: "px-8 py-5 text-[0.9375rem]",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  },
);

export type ButtonVariants = VariantProps<typeof button>;

/** The arrow that leans forward on hover. One shape, used everywhere. */
function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 10"
      width="20"
      height="10"
      fill="none"
      className={cn(
        "shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "group-hover/btn:translate-x-1",
        className,
      )}
    >
      <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

type Common = ButtonVariants & {
  children: React.ReactNode;
  className?: string;
  /** Shows the leaning arrow. On by default for primary. */
  arrow?: boolean;
};

export function Button({
  children,
  className,
  variant,
  size,
  full,
  arrow,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const showArrow = arrow ?? (variant === "primary" || variant === undefined);
  return (
    <button className={cn(button({ variant, size, full }), className)} {...props}>
      {children}
      {showArrow ? <Arrow /> : null}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  variant,
  size,
  full,
  arrow,
  href,
  ...props
}: Common &
  Omit<React.ComponentProps<typeof Link>, "className" | "children">) {
  const showArrow = arrow ?? (variant === "primary" || variant === undefined);
  return (
    <Link
      href={href}
      className={cn(button({ variant, size, full }), className)}
      {...props}
    >
      {children}
      {showArrow ? <Arrow /> : null}
    </Link>
  );
}

/**
 * The text link. An underline that draws in from the left rather than simply
 * appearing — the smallest piece of motion on the site, and the most used.
 */
export function TextLink({
  children,
  href,
  className,
  arrow = false,
  onDark = false,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  arrow?: boolean;
  onDark?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "className" | "children" | "href">) {
  return (
    <Link
      href={href}
      className={cn(
        "group/btn inline-flex items-center gap-2 font-sans text-sm",
        onDark ? "text-paper/80 hover:text-paper" : "text-ink-70 hover:text-ink",
        "transition-colors duration-300",
        className,
      )}
      {...props}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-ember",
            "transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "group-hover/btn:origin-left group-hover/btn:scale-x-100",
          )}
        />
      </span>
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

export { Arrow };
