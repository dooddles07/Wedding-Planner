import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

/**
 * The public site. Header floats over whatever ground is beneath it, so
 * nothing here reserves space for it — pages that don’t open on a full-bleed
 * hero add their own top padding.
 *
 * Session state for the header's account link is read client-side (not here)
 * so marketing pages stay statically generated rather than opting the whole
 * site into per-request rendering just for one nav link.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <PageViewTracker />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
