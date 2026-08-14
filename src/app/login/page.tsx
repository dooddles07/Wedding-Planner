import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { signInWithEmail, signInWithGoogle } from "./actions";

export const metadata: Metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to Marram to keep your planning saved across every device.",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/dashboard";

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-light leading-tight">
          Sign in to Marram
        </h1>
        <p className="mt-3 font-sans text-base text-ink-70">
          Your planning, saved across every device.
        </p>

        {params.error ? (
          <p
            role="alert"
            className="mt-6 border-l-2 border-ember pl-4 font-sans text-sm text-ink-70"
          >
            That link didn’t work. Try again, or use Google instead.
          </p>
        ) : null}

        <form action={signInWithEmail} className="mt-8 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="email" className="eyebrow text-ink-50">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 block min-h-12 w-full border-b border-ink/25 bg-transparent py-2 font-sans text-base outline-none transition-colors placeholder:text-ink-50 focus:border-ink"
            />
          </div>
          <button
            type="submit"
            className="min-h-12 w-full bg-ember px-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink uppercase transition-colors hover:bg-ink hover:text-champagne"
          >
            Send sign-in link
          </button>
        </form>

        <div className="relative mt-7 border-t border-ink/12 pt-7">
          <form action={signInWithGoogle}>
            <input type="hidden" name="next" value={next} />
            <button
              type="submit"
              className="min-h-12 w-full border border-ink/25 px-6 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors hover:border-ink"
            >
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
