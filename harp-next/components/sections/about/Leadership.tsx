import { Img } from "@/components/media/Img";
import { Plus } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { ScaleIn } from "@/components/ui/ScaleIn";
import { SplitText } from "@/components/ui/SplitText";
import type { SiteContent } from "@/content/types";

export function Leadership({ c }: { c: SiteContent["about"]["leadership"] }) {
  return (
    <section className="container-x py-16 md:py-24" aria-labelledby="leadership-title">
      <p className="eyebrow mb-4">{c.eyebrow}</p>
      <h2 id="leadership-title" className="h-section mb-10 text-[clamp(2.5rem,4.6vw,4.5rem)]"><SplitText text={c.title} by="words" /></h2>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {c.people.map((p, i) => (
          <li key={`${p.assetId}-${i}`}>
            <Reveal delay={(i % 4) * 0.07} className="group overflow-hidden rounded-sm bg-surface">
              <div className="relative aspect-[1/1.05] overflow-hidden bg-surface-2">
                <div className="absolute inset-0 transition-transform duration-[900ms] ease-expo group-hover:[@media(hover:hover)]:scale-[1.05]"><Img assetId={p.assetId} alt={p.name} sizes="(min-width:1200px) 24vw, 48vw" /></div>
                <ScaleIn delay={0.35} className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-sm bg-black/60 text-white"><Plus className="size-3" /></ScaleIn>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-[15px] font-normal tracking-[-0.02em]">{p.name}</h3>
                <p className="mt-1 font-mono text-[10.5px] uppercase text-mute">{p.role}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
