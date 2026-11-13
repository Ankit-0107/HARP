import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getContent } from "./content";
import type { NewsEntry } from "@/content/types";

interface Front { title?: string; category?: NewsEntry["category"]; date?: string; author?: string; heroAssetId?: string; authorAssetId?: string; lead?: string }
export interface Article { entry: NewsEntry; lead?: string; body?: string }

const dir = () => path.join(process.cwd(), "content/newsroom", getContent().source);

async function readMdx(): Promise<Map<string, { front: Front; body: string }>> {
  const out = new Map<string, { front: Front; body: string }>();
  let files: string[] = [];
  try { files = (await fs.readdir(dir())).filter((f) => f.endsWith(".mdx")); } catch { return out; }
  for (const f of files) {
    const { data, content } = matter(await fs.readFile(path.join(dir(), f), "utf8"));
    out.set(f.replace(/\.mdx$/, ""), { front: data as Front, body: content });
  }
  return out;
}

/** Data entries (incl. designed placeholders) overlaid with MDX stories; MDX-only slugs are added at the top. */
export async function getArticles(): Promise<Article[]> {
  const mdx = await readMdx(); const seen = new Set<string>(); const list: Article[] = [];
  for (const e of getContent().newsroom.entries) {
    const m = mdx.get(e.slug); seen.add(e.slug);
    list.push(m ? { entry: { ...e, ...cleanFront(m.front), slug: e.slug, status: "published" }, lead: m.front.lead, body: m.body } : { entry: e });
  }
  const added: Article[] = [...mdx].filter(([slug]) => !seen.has(slug)).map(([slug, m]) => ({
    entry: { slug, title: m.front.title ?? slug, category: m.front.category ?? "Article", date: m.front.date ?? null, author: m.front.author, heroAssetId: m.front.heroAssetId ?? "hero-poster", authorAssetId: m.front.authorAssetId, status: "published" as const },
    lead: m.front.lead, body: m.body,
  })).sort((a, b) => (b.entry.date ?? "").localeCompare(a.entry.date ?? ""));
  return [...added, ...list];
}
const cleanFront = (f: Front): Partial<NewsEntry> => Object.fromEntries(Object.entries({ title: f.title, category: f.category, date: f.date, author: f.author, heroAssetId: f.heroAssetId, authorAssetId: f.authorAssetId }).filter(([, v]) => v !== undefined));

export const getEntries = async () => (await getArticles()).map((a) => a.entry);
export const getArticle = async (slug: string) => (await getArticles()).find((a) => a.entry.slug === slug);

export const CATEGORY_SLUGS = { all: "All", article: "Article", "case-study": "Case Study" } as const;
export type CategorySlug = keyof typeof CATEGORY_SLUGS;
