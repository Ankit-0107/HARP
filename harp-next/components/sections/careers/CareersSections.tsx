import { Img } from "@/components/media/Img";
import { Marquee } from "@/components/ui/Marquee";
import { PixelButton } from "@/components/ui/PixelButton";
import { Plus } from "@/components/ui/Icons";
import { Reveal, RevealMask } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { CountUp } from "@/components/ui/CountUp";
import type { SiteContent } from "@/content/types";

type C = SiteContent["careers"];

export function CareersHeader({ c }: { c: C }) {
  return (
    <section className="container-x flex min-h-[86svh] flex-col justify-end pb-10 pt-28 md:pb-16" aria-labelledby="careers-title">
      <p className="eyebrow mb-6">{c.eyebrow}</p>
      <h1 id="careers-title" className="h-display max-w-[14ch] text-[clamp(3rem,8vw,8rem)] font-light"><SplitText text={c.title} trigger="mount" delay={0.2} stagger={0.03} /></h1>
      <Reveal delay={0.7} className="mt-8 flex max-w-[44ch] flex-col items-start gap-6"><p className="text-[17px] font-medium leading-[1.3]">{c.body}</p><PixelButton href="#positions">{c.cta}</PixelButton></Reveal>
    </section>
  );
}

export function Values({ c }: { c: C }) {
  return (
    <section className="container-x py-6" aria-label="Values">
      <ul className="grid gap-1 md:grid-cols-2">
        {c.values.map((v, i) => (
          <li key={v.index}>
            <Reveal delay={(i % 2) * 0.08} className="flex min-h-[260px] flex-col justify-between rounded-sm bg-surface p-5 md:min-h-[300px] md:p-7">
              <div><p className="font-mono text-[11px] text-mute">[{v.index}]</p><RevealMask className="mt-3"><h2 className="text-[clamp(1.4rem,2vw,1.75rem)] font-light tracking-[-0.04em]">{v.title}</h2></RevealMask></div>
              <p className="max-w-[34ch] text-[14px] leading-[1.4] text-soft">{v.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

const GALLERY = ["careers-gallery-1", "careers-gallery-2", "careers-gallery-3", "careers-gallery-4", "careers-gallery-5", "careers-gallery-6"];
const HEIGHTS = ["h-56", "h-72", "h-48", "h-80", "h-60", "h-72"];

export function GalleryTicker({ line }: { line: string }) {
  return (
    <section className="py-20 md:py-32" aria-label="Team gallery">
      <Marquee duration={60} gap="1rem" label="Team photos" className="py-2">
        {GALLERY.map((id, i) => <div key={id} className={`relative w-56 shrink-0 self-end overflow-hidden rounded-sm bg-surface-2 md:w-72 ${HEIGHTS[i]}`}><Img assetId={id} alt="" sizes="300px" /></div>)}
      </Marquee>
      <p className="container-x mt-16 text-[clamp(3rem,10vw,10rem)] font-light leading-[0.9] tracking-[-0.07em]"><SplitText text={line} /></p>
    </section>
  );
}

export function Positions({ c }: { c: C }) {
  return (
    <section id="positions" className="container-x scroll-mt-10 py-16 md:py-24" aria-labelledby="positions-title">
      <p className="eyebrow mb-4">{c.apply}</p>
      <h2 id="positions-title" className="h-section text-[clamp(2.5rem,4.6vw,4.5rem)]"><SplitText text={c.positionsTitle} by="words" /></h2>
      <p className="mt-5 inline-flex items-center gap-2 rounded-sm bg-surface px-2.5 py-1.5 text-[13px]"><span className="font-mono"><CountUp value={c.positionsCount} /></span> Open Positions</p>
      <ul className="mt-10 grid grid-cols-2 gap-1 md:grid-cols-3 xl:grid-cols-4">
        {c.jobs.map((j, i) => (
          <li key={`${j.title}-${i}`}>
            <Reveal delay={(i % 4) * 0.06} className="group flex min-h-[170px] flex-col justify-between rounded-sm bg-surface p-4 md:min-h-[190px] md:p-5">
              <div><h3 className="text-[16px] font-normal leading-[1.15] tracking-[-0.02em]">{j.title}</h3>{(j.meta[0] || j.meta[1]) && <p className="mt-2 font-mono text-[10.5px] uppercase text-mute">{[j.meta[0], j.meta[1]].filter(Boolean).join(" · ")}</p>}</div>
              <span aria-hidden className="grid size-7 place-items-center self-start rounded-sm bg-black/10 transition-colors duration-500 group-hover:[@media(hover:hover)]:bg-ink group-hover:[@media(hover:hover)]:text-white"><Plus className="size-3" /></span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
