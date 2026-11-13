import { Img } from "@/components/media/Img";
import { DrawLine, Reveal, RevealMask } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import type { SiteContent } from "@/content/types";

export function Timeline({ c }: { c: SiteContent["about"]["timeline"] }) {
  return (
    <section className="container-x py-20 md:py-32" aria-labelledby="timeline-title">
      <h2 id="timeline-title" className="h-section mb-14 text-[clamp(2.5rem,4.6vw,4.5rem)]"><SplitText text={c.title} by="words" /></h2>
      <ol>
        {c.items.map((it, i) => (
          <li key={`${it.year}-${i}`}>
            <DrawLine className="text-black/15" />
            <div className="grid gap-6 py-8 md:grid-cols-[1fr_1.2fr_1fr] md:gap-10 md:py-10">
              <RevealMask><h3 className="text-[clamp(1.5rem,2.2vw,2rem)] font-light tracking-[-0.04em]">{it.year}</h3></RevealMask>
              <Reveal delay={0.08}><p className="max-w-[46ch] text-[15px] leading-[1.45] text-[#333]">{it.body}</p></Reveal>
              <Reveal delay={0.16}><div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface-2"><Img src={`/assets/harp/milestone${i + 1}.webp`} assetId={it.assetId} alt={it.year} sizes="(min-width:810px) 30vw, 90vw" className="object-contain" /></div></Reveal>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
