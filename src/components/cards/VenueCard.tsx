import Link from "next/link";
import type { Venue } from "@/types";
import { VENUE_TYPE_LABEL } from "@/content/venues";
import { Photo } from "@/components/editorial/Photo";
import { SaveButton } from "@/components/ui/SaveButton";
import { PriceBand } from "@/components/ui/Chip";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * A venue, in a list. Large photograph, no box, and the three numbers that
 * actually decide whether it is worth a viewing: seats, beds, and the band.
 */
export function VenueCard({
  venue,
  sizes = "(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw",
  className,
  ratio = "landscape",
}: {
  venue: Venue;
  sizes?: string;
  className?: string;
  ratio?: "landscape" | "portrait" | "wide";
}) {
  return (
    <article className={cn("group relative", className)}>
      <Link href={`/venues/${venue.slug}`} className="block">
        <div className="overflow-hidden">
          <Photo
            photoKey={venue.heroImageId}
            ratio={ratio}
            sizes={sizes}
            imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>

        <div className="mt-5">
          <p className="eyebrow text-ink-50">
            {venue.region} · {VENUE_TYPE_LABEL[venue.type]}
          </p>

          <h3 className="mt-3 font-display text-2xl leading-tight font-light">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px]">
              {venue.name}
            </span>
          </h3>

          <p className="mt-3 max-w-[46ch] font-sans text-[0.9375rem] leading-[1.65] text-ink-70">
            {venue.standfirst}
          </p>

          <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.6875rem] tracking-wide text-ink-50">
            <div className="flex gap-1.5">
              <dt className="sr-only">Seats</dt>
              <dd>{formatNumber(venue.capacitySeated)} seated</dd>
            </div>
            {venue.accommodation ? (
              <div className="flex gap-1.5">
                <dt className="sr-only">Beds</dt>
                <dd>{venue.accommodation} beds</dd>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <dt className="sr-only">Indicative hire</dt>
              <dd className="flex items-center gap-2">
                <PriceBand band={venue.priceBand} />
                <span>from {formatCurrency(venue.priceFrom)}</span>
              </dd>
            </div>
          </dl>
        </div>
      </Link>

      <div className="absolute top-1 right-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100 sm:top-2 sm:right-2">
        <SaveButton
          kind="venue"
          slug={venue.slug}
          onDark
          size="sm"
          className="bg-ink/45 backdrop-blur-[2px]"
        />
      </div>
    </article>
  );
}
