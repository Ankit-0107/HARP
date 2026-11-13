"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Img } from "@/components/media/Img";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import type { Slide } from "@/content/types";
import { ease } from "@/lib/motion";

/** A12 — industries slider ("1 / 5"): drag the image, use the arrows or ←/→ keys. */
export function CapableIndustries({ slides }: { slides: Slide[] }) {
  const [[i, dir], set] = useState<[number, number]>([0, 1]);
  const n = slides.length;
  const go = (d: number) => set(([v]) => [(v + d + n) % n, d]);
  const s = slides[i]!;
  return (
    <section aria-roledescription="carousel" aria-label="Industries" className="container-x py-10 md:py-20"
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}>
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[520px] touch-pan-y overflow-hidden rounded-sm bg-surface-2">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div key={i} custom={dir} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
              onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing" initial={{ x: `${dir * 30}%`, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              exit={{ x: `${dir * -30}%`, opacity: 0 }} transition={{ duration: 0.9, ease }}>
              <Img assetId={s.assetId} alt="" sizes="(min-width:810px) 40vw, 90vw" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="md:max-w-[460px]">
          <div role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`} aria-live="polite" className="min-h-[190px]">
            <span className="inline-block rounded-sm bg-surface px-2 py-1 font-mono text-[11px]">{i + 1} / {n}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease }}>
                <h3 className="mt-4 text-[24px] font-medium tracking-[-0.03em]">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.45] text-soft">{s.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex gap-2">
            <button aria-label="Previous slide" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-graphite"><ArrowLeft /></button>
            <button aria-label="Next slide" onClick={() => go(1)} className="grid size-11 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-graphite"><ArrowRight /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
