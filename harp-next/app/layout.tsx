import type { Metadata, Viewport } from "next";
import { sans, mono, spaceMono } from "./fonts";
import "./globals.css";
import { getContent } from "@/lib/content";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteNav } from "@/components/layout/SiteNav";
import { Footer } from "@/components/layout/Footer";

const c = getContent();

export const metadata: Metadata = {
  metadataBase: new URL(c.brand.url),
  title: { default: c.seo.home.title, template: `%s` },
  description: c.seo.home.description,
  applicationName: c.brand.name,
  // Reference mode is a visual-comparison build of someone else's template content: never index it.
  robots: c.source === "reference" ? { index: false, follow: false } : undefined,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${spaceMono.variable}`}>
      <body>
        <MotionProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
          <SmoothScroll />
          <SiteNav wordmark={c.brand.wordmark} menuLabel={c.brand.menuLabel} links={c.nav.links} socials={c.nav.socials} />
          <main id="main">{children}</main>
          <Footer c={c} />
        </MotionProvider>
      </body>
    </html>
  );
}
