import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Plus } from "@/components/ui/Icons";
import { ScaleIn } from "@/components/ui/ScaleIn";
import type { SiteContent } from "@/content/types";

export function Stats({ c }: { c: SiteContent["home"]["stats"] }) {
  return (
    <section className="container-x py-16 md:py-28" aria-labelledby="stats-title">
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col justify-end">
          <p className="eyebrow mb-4">{c.eyebrow}</p>
          <h2 id="stats-title" className="h-section text-[clamp(2.5rem,4.6vw,4.5rem)]"><SplitText text={c.title} by="words" /></h2>
        </div>
        <ul className="grid gap-1 sm:grid-cols-2">
          {c.items.map((s, i) => (
            <li key={s.tag}>
              <Reveal delay={i * 0.08} className="group relative flex aspect-[1.25/1] flex-col justify-between overflow-hidden rounded-sm bg-surface p-5 md:p-6 [@media(hover:none)]:aspect-auto [@media(hover:none)]:gap-6" tabIndex={0}>
                <div>
                  <p className="text-[clamp(2rem,3vw,2.75rem)] font-light tracking-[-0.05em]"><CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} /></p>
                  <p className="mt-2 max-w-[28ch] text-[14px] leading-[1.35] text-soft">{s.label}</p>
                </div>
                <ScaleIn delay={0.3 + i * 0.08} className="grid size-7 place-items-center rounded-full bg-black/10 text-black/60"><Plus className="size-3" /></ScaleIn>
                {/* reveal panel: always visible without hover support (touch), slides up on hover/focus otherwise */}
                <div className="absolute inset-x-0 bottom-0 translate-y-0 bg-ink [@media(hover:none)]:static [@media(hover:none)]:-mx-5 [@media(hover:none)]:-mb-5 [@media(hover:none)]:mt-0 p-5 text-white transition-transform duration-[550ms] ease-expo [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus:translate-y-0 md:p-6">
                  <p className="mb-2 font-mono text-[11px] text-accent">{s.tag}</p>
                  <p className="text-[14px] leading-[1.4] text-white/75">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
