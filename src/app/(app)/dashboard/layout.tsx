import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Header } from "@/components/chrome/Header";
import { Container } from "@/components/editorial/Layout";

/**
 * The dashboard shares the site’s header and typography — it is the same
 * brand, not an admin panel bolted on. What it adds is a second row of
 * navigation, and a narrower rhythm: less air, more density, because this is
 * somewhere you work rather than somewhere you browse.
 */
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {/* The header is fixed, so the dashboard's own navigation needs its
          height reserved — otherwise the second row starts underneath the
          first one and is invisible until you scroll. */}
      <div aria-hidden className="h-19" />
      <DashboardNav />
      <main id="main" className="min-h-[60svh] pb-24">
        <Container>{children}</Container>
      </main>
    </>
  );
}
