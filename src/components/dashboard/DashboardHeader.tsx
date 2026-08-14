import { Wordmark } from "@/components/chrome/Wordmark";

/**
 * The dashboard's own header — no marketing nav, no lead CTA. Just enough to
 * orient someone mid-task: who they're signed in as, a way out, a way home.
 */
export function DashboardHeader({
  user,
  signOutAction,
}: {
  user: { name?: string | null; email?: string | null };
  signOutAction: () => Promise<void>;
}) {
  return (
    <header
      data-ground="paper"
      className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper text-ink"
    >
      <div className="mx-auto flex h-19 w-full max-w-[100rem] items-center justify-between gap-8 px-6 sm:px-8 lg:px-12">
        <Wordmark size="md" />
        <div className="flex items-center gap-6">
          <span className="hidden font-mono text-[0.6875rem] tracking-[0.14em] text-ink-50 uppercase sm:inline">
            {user.name ?? user.email}
          </span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-50 uppercase transition-colors hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
