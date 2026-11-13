import type { Metadata } from "next";
import { getContent } from "./content";
import type { SiteContent } from "@/content/types";

export function pageMetadata(key: keyof SiteContent["seo"], path: string): Metadata {
  const c = getContent();
  const m = c.seo[key];
  return {
    title: m.title, description: m.description, alternates: { canonical: path },
    openGraph: { title: m.title, description: m.description, url: path, siteName: c.brand.name, type: "website" },
    twitter: { card: "summary_large_image", title: m.title, description: m.description },
    robots: c.source === "reference" ? { index: false, follow: false } : undefined,
  };
}
