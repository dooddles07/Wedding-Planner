import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Header } from "@/components/chrome/Header";
import { Container } from "@/components/editorial/Layout";
import { signOut } from "./actions";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  return (
    <>
      <Header />
      <div aria-hidden className="h-19" />
      <DashboardNav>
        <form action={signOut}>
          <button
            type="submit"
            className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-50 uppercase transition-colors hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </DashboardNav>
      <main id="main" className="min-h-[60svh] pb-24">
        <Container>{children}</Container>
      </main>
    </>
  );
}
