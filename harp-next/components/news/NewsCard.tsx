import Link from "next/link";
import { Img } from "@/components/media/Img";
import type { NewsEntry } from "@/content/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Newsroom card (home preview + newsroom grid). Image zooms on hover (A8). */
export function NewsCard({ entry, className, sizes = "(min-width:810px) 33vw, 80vw" }: { entry: NewsEntry; className?: string; sizes?: string }) {
  return (
    <Link href={`/newsroom/${entry.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface-2">
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-expo group-hover:[@media(hover:hover)]:scale-[1.04]">
          <Img assetId={entry.heroAssetId} alt="" sizes={sizes} />
        </div>
      </div>
      <p className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase text-soft">
        <span className="rounded-full border border-black/15 px-2.5 py-1">{entry.category}</span>
        <span>{formatDate(entry.date)}</span>
      </p>
      <h3 className="mt-3 max-w-[28ch] text-balance text-[22px] font-normal leading-[1.15] tracking-[-0.03em]">{entry.title}</h3>
    </Link>
  );
}
