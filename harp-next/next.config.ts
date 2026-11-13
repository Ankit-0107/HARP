import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: { cpus: 1 },
  env: { NEXT_PUBLIC_CONTENT_SOURCE: process.env.CONTENT_SOURCE === "reference" ? "reference" : "harp" },
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      // URL parity with the static export (…/index.html → clean URL)
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path*/index.html", destination: "/:path*", permanent: true },
    ];
  },
};

export default config;
