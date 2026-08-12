import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";

/**
 * The public site. Header floats over whatever ground is beneath it, so
 * nothing here reserves space for it — pages that don’t open on a full-bleed
 * hero add their own top padding.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
