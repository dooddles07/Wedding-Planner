import Link from "next/link";
import type { Vendor } from "@/types";
import { VENDOR_CATEGORY_LABEL } from "@/content/vendors";
import { Photo } from "@/components/editorial/Photo";
import { SaveButton } from "@/components/ui/SaveButton";
import { PriceBand } from "@/components/ui/Chip";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * A supplier, in a list.
 *
 * The standfirst is the whole card — a planner’s one-line description of what
 * this supplier is actually like is worth more than a star rating, and there
 * are no real ratings here to show.
 */
export function VendorCard({
  vendor,
  sizes = "(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw",
  className,
}: {
  vendor: Vendor;
  sizes?: string;
  className?: string;
}) {
  const priceLabel =
    vendor.category === "caterers"
      ? `${formatCurrency(vendor.priceFrom)} a head`
      : `from ${formatCurrency(vendor.priceFrom)}`;

  return (
    <article className={cn("group relative", className)}>
      <Link href={`/vendors/${vendor.slug}`} className="block">
        <div className="overflow-hidden">
          <Photo
            photoKey={vendor.heroImageId}
            ratio="landscape"
            sizes={sizes}
            imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>

        <div className="mt-5">
          <p className="eyebrow text-ink-50">
            {VENDOR_CATEGORY_LABEL[vendor.category]} · {vendor.location}
          </p>

          <h3 className="mt-3 font-display text-2xl leading-tight font-light">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[length:100%_1px]">
              {vendor.name}
            </span>
          </h3>

          <p className="mt-3 max-w-[46ch] font-sans text-[0.9375rem] leading-[1.65] text-ink-70">
            {vendor.standfirst}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.6875rem] tracking-wide text-ink-50">
            <span className="flex items-center gap-2">
              <PriceBand band={vendor.priceBand} />
              {priceLabel}
            </span>
            {vendor.travelsInternationally ? <span>Travels abroad</span> : null}
          </div>
        </div>
      </Link>

      <div className="absolute top-1 right-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100 sm:top-2 sm:right-2">
        <SaveButton
          kind="vendor"
          slug={vendor.slug}
          onDark
          size="sm"
          className="bg-ink/45 backdrop-blur-[2px]"
        />
      </div>
    </article>
  );
}
