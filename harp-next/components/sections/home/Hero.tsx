"use client";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { DotReveal } from "@/components/canvas/DotReveal";
import { HeroVideo } from "@/components/media/HeroVideo";
import { SplitText } from "@/components/ui/SplitText";
import { RevealMask } from "@/components/ui/Reveal";
import type { SiteContent } from "@/content/types";


export function Hero({ c }: { c: SiteContent["home"]["hero"] }) {
  return (
    <section className="relative isolate h-svh min-h-[600px] overflow-hidden bg-black text-white md:min-h-[640px]" aria-labelledby="hero-title">
      <HeroVideo videoId="home-hero-video" posterId="hero-poster" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <DotReveal className="-z-10" />
      <div className="container-x flex h-full flex-col justify-center pb-28 md:pb-24">
        <h1 id="hero-title" className="h-display flex w-full flex-col text-[clamp(2.75rem,11.5vw,14rem)] leading-[0.9] md:text-[clamp(3.5rem,13vw,15rem)] md:leading-[0.8]">
          {/* Line 1: HARP on the left + logo on the right of HARP */}
          <div className="flex w-full items-center justify-start gap-2.5 md:gap-10">
            <span className="block">
              <SplitText text={c.lines[0]} trigger="mount" delay={0.9} />
            </span>
            <span className="inline-flex items-center shrink-0" aria-hidden="true">
              <motion.img
                src="/assets/harp/loading.png"
                alt="HARP Robotics"
                initial={{ opacity: 0, y: "0.35em", filter: "blur(10px)", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.95 }}
                className="h-[0.82em] w-auto object-contain translate-y-[0.02em] md:h-[clamp(8.5rem,8vw,10rem)] md:translate-y-0 md:-translate-x-7"
              />
            </span>
          </div>

          {/* Line 2: ROBOTICS below on the right */}
          <div className="mt-2 flex w-full justify-end md:mt-0">
            <span className="block text-right">
              <SplitText text={c.lines[1]} trigger="mount" delay={1.2} />
            </span>
          </div>
        </h1>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-24">
        <dl className="container-x grid grid-cols-2 gap-x-6 gap-y-5 pb-6 font-[family-name:var(--font-space-mono)] text-[12px] uppercase md:grid-cols-4">
          {c.meta.map((m) => (
            <div key={m.label} className="md:last:text-right">
              <dt className="text-white/50">{m.label}</dt>
              <dd><RevealMask delay={1.7}>{m.value}</RevealMask></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
