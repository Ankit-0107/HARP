import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { HeroVideo } from "@/components/media/HeroVideo";
import { GridDrift } from "@/components/canvas/GridDrift";
import { PixelButton } from "@/components/ui/PixelButton";
import { SplitText } from "@/components/ui/SplitText";

export const metadata: Metadata = { title: getContent().seo.notFound.title, description: getContent().seo.notFound.description, robots: { index: false, follow: false } };

export default function NotFound() {
  const n = getContent().notFound;
  return (
    <section className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-black text-white">
      <HeroVideo videoId="notfound-video" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <GridDrift className="-z-10" />
      <div className="container-x flex flex-col items-center gap-6 py-32 text-center">
        <p className="font-mono text-[12px] uppercase text-white/60">Error</p>
        <h1 className="h-display text-[clamp(7rem,24vw,24rem)]"><SplitText text={n.code} trigger="mount" delay={0.2} /></h1>
        <p className="text-[clamp(1.4rem,2.4vw,2rem)] font-light tracking-[-0.03em]">{n.title}</p>
        <p className="max-w-[40ch] text-[15px] leading-[1.45] text-white/65">{n.body}</p>
        <PixelButton href="/" variant="light">{n.cta}</PixelButton>
      </div>
    </section>
  );
}
