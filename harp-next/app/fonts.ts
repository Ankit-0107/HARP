import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";

// Geist: self-hosted from the `geist` npm package (original Framer-hosted woff2 files were unreachable — see assets/manifest.json).
export const sans = GeistSans; // exposes CSS variable --font-geist-sans

// PT Mono: self-hosted from @fontsource/pt-mono.
export const mono = localFont({
  src: "../node_modules/@fontsource/pt-mono/files/pt-mono-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-pt-mono",
  display: "swap",
});

// Space Mono: used by the original's small meta-label text preset (16tntm1). Self-hosted from @fontsource/space-mono.
export const spaceMono = localFont({
  src: "../node_modules/@fontsource/space-mono/files/space-mono-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-space-mono",
  display: "swap",
});
