import Link from "next/link";
import { Photo } from "@/components/editorial/Photo";

/**
 * 404. Written the way a planner would say it: what happened, and what to do
 * instead. No error code, no apology, and a way onward that is genuinely the
 * most useful page on the site.
 */
export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-dvh items-end bg-ink text-paper">
      <Photo
        photoKey="venue-hollow"
        ratio="fill"
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full"
        overlay={62}
      />

      <div className="mx-auto w-full max-w-[100rem] px-6 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <p className="eyebrow text-paper/60">Nothing here</p>
        <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.02] font-light">
          This page has gone the way of a lost seating plan.
        </h1>
        <p className="mt-6 max-w-[46ch] font-sans text-lg leading-[1.6] text-paper/70">
          Either the address is slightly wrong or we moved something. Both are
          fixable.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center bg-ember px-7 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-paper hover:text-ink"
          >
            Back to the start
          </Link>
          <Link
            href="/weddings"
            className="inline-flex min-h-12 items-center border border-paper/35 px-7 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Read a wedding
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center border border-paper/35 px-7 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Start planning
          </Link>
        </div>
      </div>
    </div>
  );
}
