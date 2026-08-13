import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { brand, voice } from "@/content/brand";
import { fontVariables } from "@/lib/fonts";
import { organisationSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { AnalyticsSinkWirer } from "@/components/analytics/AnalyticsSinkWirer";
import { LocalDataMigrator } from "@/components/auth/LocalDataMigrator";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — ${brand.discipline}, ${brand.address.city}`,
    template: `%s — ${brand.name}`,
  },
  description: voice.metaDescription,
  applicationName: brand.name,
  authors: [{ name: brand.name, url: brand.url }],
  creator: brand.name,
  publisher: brand.name,
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: brand.name,
    url: brand.url,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7ee" },
    { media: "(prefers-color-scheme: dark)", color: "#2e2910" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Never block zoom.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={fontVariables}>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <a
          href="#main"
          className="sr-only-focusable focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:h-auto focus:w-auto focus:bg-ink focus:px-4 focus:py-3 focus:text-paper focus:[clip-path:none]"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            unstyled: false,
            classNames: {
              toast:
                "!rounded-xs !border !border-ink-15 !bg-paper !text-ink !font-sans !shadow-[0_12px_40px_-12px_rgba(46,41,16,0.3)]",
              title: "!text-sm !font-medium",
              description: "!text-sm !text-ink-70",
              actionButton: "!bg-ember !text-white !rounded-xs",
            },
          }}
        />
        <JsonLd data={organisationSchema()} />
        <AnalyticsSinkWirer />
        <Analytics />
        <LocalDataMigrator />
      </body>
    </html>
  );
}
