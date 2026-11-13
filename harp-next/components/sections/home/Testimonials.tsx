"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { SplitText } from "@/components/ui/SplitText";
import type { Quote } from "@/content/types";
import { ease } from "@/lib/motion";

/** A3/A13 — testimonial slider with word-by-word quote reveal. */
export function Testimonials({ items }: { items: Quote[] }) {
  const [i, setI] = useState(0);
  const n = items.length;
  const q = items[i]!;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  return (
    <section aria-roledescription="carousel" aria-label="Testimonials" className="container-x py-16 md:py-24"
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}>
      <div className="mx-auto flex max-w-[860px] flex-col items-center gap-6 text-center">
        <p className="flex items-center gap-3 font-mono text-[11px]">
          <span className="rounded-sm bg-surface px-2 py-1">{i + 1} / {n}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} className="uppercase text-mute">{q.company}</motion.span>
          </AnimatePresence>
        </p>
        <blockquote aria-live="polite" className="min-h-[7.5em] text-balance text-[clamp(1.4rem,2.4vw,2rem)] font-light leading-[1.25] tracking-[-0.03em]">
          <SplitText key={i} text={`“${q.quote}”`} by="words" trigger="mount" stagger={0.03} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }} />
        </blockquote>
        <div className="flex gap-2">
          <button aria-label="Previous testimonial" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-full bg-ink text-white hover:bg-graphite"><ArrowLeft /></button>
          <button aria-label="Next testimonial" onClick={() => go(1)} className="grid size-11 place-items-center rounded-full bg-ink text-white hover:bg-graphite"><ArrowRight /></button>
        </div>
      </div>
    </section>
  );
}
