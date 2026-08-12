import Link from "next/link";
import type { WeddingStory } from "@/types";
import { Photo, type PhotoRatio } from "@/components/editorial/Photo";
import { cn } from "@/lib/utils";

/**
 * A wedding story, in a list.
 *
 * Not a card — there is no box, no shadow and no border. The photograph and
 * the type sit directly on whatever ground they’re placed against, which is
 * what stops the site turning into a grid of tiles.
 */
export function WeddingCard({
  wedding,
  ratio = "landscape",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  size = "md",
  className,
  onDark = false,
}: {
  wedding: WeddingStory;
  ratio?: PhotoRatio;
  sizes?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onDark?: boolean;
}) {
  const meta = [
    wedding.location,
    `${wedding.guestCount} guests`,
    new Date(wedding.date).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    }),
  ];

  return (
    <article className={cn("group", className)}>
      <Link href={`/weddings/${wedding.slug}`} className="block">
        <div className="overflow-hidden">
          <Photo
            photoKey={wedding.heroImageId}
            ratio={ratio}
            sizes={sizes}
            imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>

        <div className={cn("mt-5", size === "lg" && "mt-7")}>
          <p
            className={cn(
              "eyebrow",
              onDark ? "text-champagne/85" : "text-ink-50",
            )}
          >
            {wedding.couple}
          </p>
          <h3
            className={cn(
              "mt-3 font-display leading-[1.12] font-light",
              {
                sm: "text-xl",
                md: "text-2xl sm:text-[1.75rem]",
                lg: "text-[clamp(1.75rem,3.4vw,3rem)]",
              }[size],
            )}
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px]">
              {wedding.title}
            </span>
          </h3>

          {size !== "sm" ? (
            <p
              className={cn(
                "mt-4 max-w-[52ch] font-sans leading-[1.65]",
                size === "lg" ? "text-base sm:text-lg" : "text-[0.9375rem]",
                onDark ? "text-champagne/80" : "text-ink-70",
              )}
            >
              {wedding.standfirst}
            </p>
          ) : null}

          <p
            className={cn(
              "mt-4 font-mono text-[0.6875rem] tracking-wide",
              onDark ? "text-champagne/80" : "text-ink-50",
            )}
          >
            {meta.join("  ·  ")}
          </p>
        </div>
      </Link>
    </article>
  );
}
