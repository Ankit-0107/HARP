"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Img } from "@/components/media/Img";
import type { Slide } from "@/content/types";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const DURATION = 6; // seconds per slide

/** A12 — autoplaying capability slider: crossfade + slow zoom, segmented progress bars (click to jump), pause on hover/focus. */
export function ProductSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const s = slides[i]!;
  return (
    <section id="hero-slider" aria-roledescription="carousel" aria-label="Featured products" className="container-x py-2 md:py-4"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-black text-white md:aspect-[16/8.2]">
        <AnimatePresence initial={false}>
          <motion.div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`} className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease }}>
            <Img assetId={s.assetId} alt="" tone="dark" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-5 p-6 pb-14 md:p-10 md:pb-16">
              <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-medium leading-[1.2] tracking-[-0.04em]">{s.title}</h2>
              <p className="max-w-[44ch] text-[15px] leading-[1.45] text-white/75">{s.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-x-6 bottom-5 z-10 flex gap-2 md:inset-x-10" role="tablist" aria-label="Choose slide">
          {slides.map((_, n) => (
            <button key={n} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className="group h-5 flex-1 py-2">
              <span className="relative block h-px w-full overflow-hidden bg-white/30">
                {n < i && <span className="absolute inset-0 bg-white" />}
                {n === i && (
                  <span key={`${i}-fill`} className={cn("progress-fill absolute inset-0 origin-left bg-white")}
                    style={{ animation: `fill ${DURATION}s linear forwards`, animationPlayState: paused ? "paused" : "running" }}
                    onAnimationEnd={() => setI((v) => (v + 1) % slides.length)} />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
