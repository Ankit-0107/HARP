import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { CATEGORY_SLUGS, getEntries, type CategorySlug } from "@/lib/news";
import { NewsCard } from "@/components/news/NewsCard";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { cn } from "@/lib/cn";

type Params = { category: string };
export const dynamicParams = false;
export const generateStaticParams = (): Params[] => Object.keys(CATEGORY_SLUGS).map((category) => ({ category }));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params; const c = getContent();
  if (!(category in CATEGORY_SLUGS)) return {};
  const label = CATEGORY_SLUGS[category as CategorySlug];
  return { title: `${label} — Workshops — ${c.brand.name}`, description: c.seo.newsroom.description, alternates: { canonical: `/newsroom/filters/${category}` },
    robots: c.source === "reference" ? { index: false, follow: false } : undefined };
}

export default async function NewsroomFilterPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  if (!(category in CATEGORY_SLUGS)) notFound();
  const c = getContent(); const label = CATEGORY_SLUGS[category as CategorySlug];
  const all = await getEntries(); const entries = all.filter((e) => e.category === label);
  return (
    <>
      <section className="container-x pb-8 pt-28 md:pb-12">
        <p className="eyebrow mb-4">{c.newsroom.eyebrow}</p>
        <h1 className="h-display text-[clamp(3rem,8vw,8rem)] font-light"><SplitText text={c.newsroom.title} trigger="mount" delay={0.2} /></h1>
        <nav aria-label="Workshops categories" className="mt-10 flex flex-wrap gap-2">
          {(Object.entries(CATEGORY_SLUGS) as [CategorySlug, string][]).map(([slug, name]) => (
            <Link key={slug} href={`/newsroom/filters/${slug}`} aria-current={slug === category ? "page" : undefined}
              className={cn("rounded-full border px-4 py-2 font-mono text-[12px] uppercase transition-colors duration-500", slug === category ? "border-ink bg-ink text-white" : "border-black/15 hover:border-black")}>
              {name}
            </Link>
          ))}
        </nav>
      </section>
      <section className="container-x pb-16 md:pb-28" aria-live="polite">
        {entries.length === 0 ? <p className="text-soft">No stories in this category yet.</p> : (
          <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((e, i) => <li key={e.slug}><Reveal delay={(i % 3) * 0.08}><NewsCard entry={e} sizes="(min-width:1200px) 33vw, (min-width:640px) 50vw, 92vw" /></Reveal></li>)}
          </ul>
        )}
      </section>
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </>
  );
}
