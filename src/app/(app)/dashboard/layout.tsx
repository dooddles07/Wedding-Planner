import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Container } from "@/components/editorial/Layout";
import { signOut } from "./actions";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/dashboard");

  return (
    <>
      <DashboardHeader user={session.user} signOutAction={signOut} />
      <div aria-hidden className="h-19" />
      <DashboardNav />
      <main id="main" className="min-h-[60svh] pb-24">
        <Container>{children}</Container>
      </main>
    </>
  );
}
