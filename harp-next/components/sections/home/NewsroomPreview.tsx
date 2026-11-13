import Link from "next/link";
import { NewsCard } from "@/components/news/NewsCard";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowUpRight } from "@/components/ui/Icons";
import type { NewsEntry } from "@/content/types";

/** Desktop: 3-up grid. Mobile: auto-scrolling marquee (the original's "Newsroom (Mobile)" variant — now one responsive component, no duplicated DOM). */
export function NewsroomPreview({ eyebrow, title, entries }: { eyebrow: string; title: string; entries: NewsEntry[] }) {
  const latest = entries.slice(0, 3);
  return (
    <section className="py-16 md:py-28" aria-labelledby="news-title">
      <div className="container-x mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 id="news-title" className="h-section text-[clamp(2.5rem,4.6vw,4.5rem)]"><SplitText text={title} by="words" /></h2>
        </div>
        <Link href="/newsroom/filters/all" className="hidden items-center gap-2 font-mono text-[12px] uppercase hover:opacity-60 md:flex">View all <ArrowUpRight /></Link>
      </div>
      <div className="container-x hidden gap-5 md:grid md:grid-cols-3">
        {latest.map((e, i) => <Reveal key={e.slug} delay={i * 0.1}><NewsCard entry={e} /></Reveal>)}
      </div>
      <div className="md:hidden">
        <Marquee duration={50} gap="1.25rem" fade={false} label="Latest news">
          {latest.map((e) => <NewsCard key={e.slug} entry={e} className="w-[78vw] shrink-0" sizes="80vw" />)}
        </Marquee>
      </div>
    </section>
  );
}
