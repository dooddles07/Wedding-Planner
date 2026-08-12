import Link from "next/link";
import { brand } from "@/content/brand";
import { cn } from "@/lib/utils";

/**
 * MARRAM reads the same in both directions. The wordmark is set with even
 * tracking so the symmetry is visible, and nothing else is added to it.
 */
export function Wordmark({
  className,
  href = "/",
  size = "md",
}: {
  className?: string;
  href?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const content = (
    <span
      className={cn(
        "font-display leading-none",
        { sm: "text-base", md: "text-xl", lg: "text-3xl" }[size],
      )}
      style={{ letterSpacing: "0.22em", fontVariationSettings: '"WONK" 0, "SOFT" 0' }}
    >
      {brand.wordmark}
    </span>
  );

  if (!href) return <span className={className}>{content}</span>;

  return (
    <Link
      href={href}
      className={cn("inline-block transition-opacity hover:opacity-70", className)}
      aria-label={`${brand.name} — home`}
    >
      {content}
    </Link>
  );
}
