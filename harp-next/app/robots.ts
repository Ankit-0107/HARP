import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const c = getContent();
  // The reference build carries another company's template copy: never let it be indexed.
  if (c.source === "reference") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${c.brand.url.replace(/\/$/, "")}/sitemap.xml` };
}
