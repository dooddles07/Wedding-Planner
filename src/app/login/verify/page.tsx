import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Check your inbox",
  description: "We sent you a sign-in link.",
  path: "/login/verify",
  noIndex: true,
});

export default async function VerifyRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-light">Check your inbox</h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-ink-70">
          {params.email ? (
            <>
              We sent a link to <strong>{params.email}</strong>. Click it to
              sign in — no password needed.
            </>
          ) : (
            "We sent you a sign-in link. Click it to continue — no password needed."
          )}
        </p>
      </div>
    </main>
  );
}
