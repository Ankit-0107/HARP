import { FramedPanel } from "@/components/ui/FramedPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/content/types";

export function AboutIntro({ c }: { c: SiteContent["home"]["about"] }) {
  return (
    <section className="container-x py-6 md:py-10" aria-labelledby="about-intro">
      <FramedPanel inset={7} bg="bg-transparent" interactive className="px-6 py-16 md:px-[10%] md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <Reveal><h2 id="about-intro" className="text-[clamp(1.75rem,2.6vw,2.5rem)] font-light tracking-[-0.05em]">{c.title}</h2></Reveal>
          <div className="grid gap-8 md:grid-cols-2">
            {c.columns.map((col, i) => (
              <Reveal key={col.heading} delay={0.1 * (i + 1)}>
                <h3 className="mb-3 text-[15px] font-medium">{col.heading}</h3>
                <p className="text-[15px] leading-[1.45] text-[#333]">{col.body}</p>
                {i === 0 && <div className="mt-6"><PixelButton href={c.cta.href}>{c.cta.label}</PixelButton></div>}
              </Reveal>
            ))}
          </div>
        </div>
      </FramedPanel>
    </section>
  );
}
