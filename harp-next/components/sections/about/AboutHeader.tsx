import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { SiteContent } from "@/content/types";

export function AboutHeader({ c }: { c: SiteContent["about"]["header"] }) {
  return (
    <>
      <section className="container-x flex min-h-[88svh] flex-col justify-between pb-10 pt-28 md:pb-16" aria-labelledby="about-title">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <p className="eyebrow">{c.eyebrow}</p>
          <Reveal delay={0.5}><p className="max-w-[34ch] text-[17px] leading-[1.35] md:text-[19px]">{c.body}</p></Reveal>
        </div>
        <h1 id="about-title" className="h-display mt-20 text-[clamp(3.25rem,11vw,11rem)] font-light">
          <SplitText text="ABOUT" trigger="mount" delay={0.3} stagger={0.035} />
          <br />
          <div className="font-medium">
            <SplitText text="HARP ROBOTICS" trigger="mount" delay={0.6} stagger={0.035} />
          </div>
        </h1>
      </section>
      <section className="container-x pb-6" aria-hidden>
        <ParallaxImage assetId="about-fixed-image" className="h-[70svh] min-h-[360px]" />
      </section>
    </>
  );
}
