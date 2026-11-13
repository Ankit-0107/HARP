import { harp } from "@/content/harp";
import { reference } from "@/content/reference";
import type { SiteContent, Source } from "@/content/types";

export function contentSource(): Source {
  return process.env.NEXT_PUBLIC_CONTENT_SOURCE === "reference" ? "reference" : "harp";
}
export function getContent(): SiteContent {
  return contentSource() === "reference" ? reference : harp;
}
export const isTbd = (s: string | null | undefined) => !s || s.startsWith("[TBD]") || s === "TBD";
