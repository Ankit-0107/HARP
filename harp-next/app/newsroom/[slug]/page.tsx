import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { getArticle, getEntries } from "@/lib/news";
import { formatDate } from "@/lib/format";
import { Img } from "@/components/media/Img";
import { NewsCard } from "@/components/news/NewsCard";
import { PreFooterCta } from "@/components/layout/PreFooterCta";
import { ArticleBody } from "@/components/sections/newsroom/ArticleBody";
import { FramedPanel } from "@/components/ui/FramedPanel";
import { ArrowDown, ArrowLeft } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

type Params = { slug: string };
export const dynamicParams = false;
export async function generateStaticParams(): Promise<Params[]> { return (await getEntries()).map((e) => ({ slug: e.slug })); }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params; const a = await getArticle(slug); const c = getContent();
  if (!a) return {};
  const published = a.entry.status === "published";
  return { title: `${a.entry.title} — ${c.brand.name}`, description: a.lead ?? (published ? c.seo.newsroom.description : "Story pending."),
    alternates: { canonical: `/newsroom/${slug}` }, robots: !published || c.source === "reference" ? { index: false, follow: false } : undefined,
    openGraph: { type: "article", title: a.entry.title, publishedTime: a.entry.date ?? undefined } };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params; const a = await getArticle(slug); const c = getContent();
  if (!a) notFound();
  const e = a.entry; const published = e.status === "published";
  const related = (await getEntries()).filter((x) => x.slug !== slug).slice(0, 3);
  const jsonLd = published && c.source === "harp" ? { "@context": "https://schema.org", "@type": "Article", headline: e.title, datePublished: e.date ?? undefined, author: e.author ? { "@type": "Person", name: e.author } : undefined, publisher: { "@type": "Organization", name: c.brand.name } } : null;

  return (
    <article>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <header className="container-x pb-8 pt-28 md:pb-12">
        <Link href="/newsroom/filters/all" className="mb-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase hover:opacity-60"><ArrowLeft /> Newsroom</Link>
        <p className="mb-5 font-mono text-[12px] uppercase"><span className="rounded-full border border-black/15 px-3 py-1.5">{e.category}</span></p>
        <h1 className="h-section max-w-[18ch] text-balance text-[clamp(2.5rem,6.2vw,6rem)]"><SplitText text={e.title} by="words" trigger="mount" delay={0.2} /></h1>
      </header>
      <div className="container-x pb-8"><div className="relative aspect-[16/8] overflow-hidden rounded-sm bg-surface-2"><Img assetId={e.heroAssetId} alt="" sizes="100vw" priority /></div></div>

      <div className="container-x grid gap-10 py-10 md:grid-cols-[minmax(220px,1fr)_2.2fr] md:gap-16 md:py-16">
        <aside className="md:sticky md:top-24 md:self-start">
          <dl className="space-y-6 text-[14px]">
            <div className="flex items-center gap-3">
              {e.author && <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface-2">{e.authorAssetId && <Img assetId={e.authorAssetId} alt="" sizes="44px" />}</div>}
              <div><dt className="font-mono text-[11px] uppercase text-mute">Author</dt><dd>{e.author ?? "[TBD] author"}</dd></div>
            </div>
            <div><dt className="font-mono text-[11px] uppercase text-mute">Published</dt><dd>{formatDate(e.date)}</dd></div>
          </dl>
          <p className="mt-10 hidden items-center gap-2 font-mono text-[11px] uppercase text-mute md:flex">Scroll <ArrowDown className="size-3" /></p>
        </aside>
        <div>
          {published && a.body ? (
            <>
              {a.lead && <Reveal><h2 className="sr-only">Overview</h2><p className="mb-10 max-w-[34ch] text-[clamp(1.4rem,2.2vw,1.9rem)] font-light leading-[1.25] tracking-[-0.03em]">{a.lead}</p></Reveal>}
              <ArticleBody source={a.body} />
            </>
          ) : (
            <FramedPanel inset={10} className="px-6 py-14 md:px-12 md:py-20">
              <p className="eyebrow mb-5">Story pending</p>
              <h2 className="max-w-[20ch] text-balance text-[clamp(1.5rem,2.6vw,2.25rem)] font-light tracking-[-0.04em]">This story is a designed placeholder.</h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.5] text-soft">{c.newsroom.bodyPlaceholder}</p>
              <p className="tbd mt-8 inline-block px-2 py-1 font-mono text-[11px] uppercase">[TBD] article body</p>
            </FramedPanel>
          )}
        </div>
      </div>

      <section className="container-x py-12 md:py-20" aria-labelledby="more-news">
        <h2 id="more-news" className="eyebrow mb-8">More from the newsroom</h2>
        <ul className="grid gap-x-5 gap-y-10 md:grid-cols-3">{related.map((r) => <li key={r.slug}><NewsCard entry={r} /></li>)}</ul>
      </section>
      <PreFooterCta heading={c.nav.cta.heading} button={c.nav.cta.button} />
    </article>
  );
}
