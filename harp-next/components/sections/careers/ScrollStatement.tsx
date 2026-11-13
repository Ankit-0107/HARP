"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Img } from "@/components/media/Img";

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const opacity = useTransform(p, [(i / n) * 0.8, (i / n) * 0.8 + 0.08], [0.18, 1]);
  return <motion.span style={{ opacity }} className="inline-block">{w}&nbsp;</motion.span>;
}

function Float({ id, from, to, className, p }: { id: string; from: number; to: number; className: string; p: MotionValue<number> }) {
  const y = useTransform(p, [0, 1], [from, to]);
  return <motion.div style={{ y }} className={className}><div className="relative size-full overflow-hidden rounded-sm bg-surface-2"><Img assetId={id} alt="" sizes="30vw" /></div></motion.div>;
}

/** A18/A20 — sticky scroll stage: the statement lights up word by word while photos drift at different speeds. */
export function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = text.split(" ");
  return (
    <div ref={ref} className="relative h-[260svh]" aria-label={text} role="group">
      <div aria-hidden className="sticky top-0 grid h-svh place-items-center overflow-hidden">
        <p className="container-x relative z-10 max-w-[800px] text-balance text-center text-[clamp(1.6rem,3.4vw,3rem)] font-light leading-[1.15] tracking-[-0.04em]">
          {words.map((w, i) => <Word key={i} w={w} i={i} n={words.length} p={p} />)}
        </p>
        <Float id="careers-hero" from={160} to={-260} p={p} className="absolute left-[3%] top-[12%] hidden h-[34svh] w-[16vw] md:block" />
        <Float id="careers-team-photo-1" from={320} to={-180} p={p} className="absolute right-[3%] top-[14%] h-[22svh] w-[34vw] opacity-30 md:h-[36svh] md:w-[16vw] md:opacity-100" />
        <Float id="careers-team-photo-2" from={420} to={-300} p={p} className="absolute bottom-[6%] left-[6%] h-[20svh] w-[40vw] opacity-30 md:left-[12%] md:h-[28svh] md:w-[13vw] md:opacity-100" />
      </div>
    </div>
  );
}
