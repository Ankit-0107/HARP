import { DrawLine, Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/content/types";

export function IndustriesIndex({ c }: { c: SiteContent["capabilities"]["industries"] }) {
  return (
    <section className="container-x py-20 md:py-32" aria-labelledby="industries-title">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-16">
          <p className="eyebrow">{c.title}</p>
          <div>
            <h2 id="industries-title" className="sr-only">{c.title}</h2>
            <Reveal><p className="max-w-[36ch] text-[17px] font-medium leading-[1.3]">{c.body}</p></Reveal>
          </div>
        </div>
        <div>
          <p className="mb-3 text-[13px] text-mute">{c.eyebrow}</p>
          <ul>
            {c.list.map((ind, i) => (
              <li key={`${ind.name}-${i}`} className="group">
                <DrawLine className="text-black/15" delay={i * 0.05} />
                <div className="flex flex-col gap-1 py-3 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="text-[17px] font-medium tracking-[-0.02em] text-fog transition-colors duration-500 group-hover:[@media(hover:hover)]:text-ink">{ind.name}</h3>
                  <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-soft">{ind.items.map((it, k) => <li key={`${it}-${k}`}>{it}</li>)}</ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
