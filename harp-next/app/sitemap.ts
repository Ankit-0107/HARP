import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { getEntries } from "@/lib/news";

/** Only real pages are listed: designed placeholders (unpublished stories / capabilities) are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = getContent(); const base = c.brand.url.replace(/\/$/, "");
  const statics = ["/", "/about", "/capabilities", "/careers", "/contact", "/newsroom/filters/all", "/privacy"];
  const caps = Object.entries(c.capabilityDetails).filter(([, d]) => d.status === "published").map(([s]) => `/capabilities/${s}`);
  const news = (await getEntries()).filter((e) => e.status === "published").map((e) => `/newsroom/${e.slug}`);
  return [...statics, ...caps, ...news].map((p) => ({ url: `${base}${p}` }));
}
