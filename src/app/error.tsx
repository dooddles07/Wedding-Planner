"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * The error boundary.
 *
 * "Something went a little off" rather than a stack trace — but the digest is
 * still shown, small, because when someone emails us about it that string is
 * the only thing that helps.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink px-6 text-paper">
      <div className="max-w-[46ch]">
        <p className="eyebrow text-paper/60">Something went a little off</p>
        <h1 className="mt-6 font-display text-[clamp(1.75rem,4.4vw,3rem)] leading-[1.05] font-light">
          That didn&rsquo;t load properly.
        </h1>
        <p className="mt-5 font-sans text-base leading-[1.7] text-paper/70">
          Nothing you did. Try it again — and if it keeps happening, tell us and
          we&rsquo;ll go and look.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center bg-ember px-7 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-paper"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center border border-paper/35 px-7 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Back to the start
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-10 font-mono text-[0.625rem] tracking-wide text-paper/65">
            Reference {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
