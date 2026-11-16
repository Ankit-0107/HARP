"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import type { Step } from "@/content/types";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

const STEP_DEG = 24;
const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * A11 — Process Orbit (Archived from Home Page).
 * A 500svh scroll track with a sticky stage: a tick-marked ring rotates as you scroll,
 * bringing the next numbered step to the 3 o'clock position while the step text cross-fades.
 * All steps stay in the DOM (sr-only list) for assistive tech / SEO.
 */
export function ProcessOrbit({ steps, label }: { steps: Step[]; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const n = steps.length;
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -(n - 1) * STEP_DEG]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(n - 1, Math.max(0, Math.round(v * (n - 1))))));
  const s = steps[active]!;

  return (
    <div ref={track} role="region" aria-label={label} className="relative h-[500svh] bg-carbon text-white">
      <ol className="sr-only">{steps.map((st) => <li key={st.title}><strong>{st.title}</strong> {st.body}</li>)}</ol>
      <div aria-hidden className="sticky top-0 h-svh overflow-hidden [--R:min(52vw,62svh)] md:[--R:min(78svh,620px)]">
        {/* rotating ring */}
        <motion.div style={{ rotate }} className="absolute left-[calc(var(--R)*-0.6)] top-[calc(36%-var(--R))] size-[calc(var(--R)*2)] md:top-[calc(50%-var(--R))] md:left-[calc(var(--R)*-0.55)]">
          <svg viewBox="0 0 1000 1000" className="absolute inset-0 size-full text-white/60">
            <circle cx="500" cy="500" r="480" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {Array.from({ length: 120 }, (_, k) => (
              <line key={k} x1="980" x2={k % 5 === 0 ? 955 : 968} y1="500" y2="500" stroke="currentColor" strokeWidth={k % 5 === 0 ? 2 : 1} transform={`rotate(${k * 3} 500 500)`} />
            ))}
          </svg>
          {steps.map((st, k) => (
            <div key={st.title} className="absolute left-1/2 top-1/2 size-0" style={{ transform: `rotate(${k * STEP_DEG}deg)` }}>
              <span className={cn("absolute whitespace-nowrap font-light tracking-[-0.05em] transition-all duration-700 ease-expo", k === active ? "text-white" : "text-white/35")}
                style={{ left: 0, top: 0, transformOrigin: "100% 50%", transform: `translate(calc(var(--R) - 2.2rem - 100%), -50%) scale(${k === active ? 1 : 0.55})`, fontSize: "clamp(40px,5vw,64px)" }}>
                {pad(k)}
              </span>
            </div>
          ))}
        </motion.div>
        {/* fixed bracket at 3 o'clock */}
        <span className="absolute left-[calc(var(--R)*0.4+var(--R)-0.5rem)] top-[36%] h-16 w-2 -translate-y-1/2 border-y border-r border-white md:left-[calc(var(--R)*0.45+var(--R)-0.5rem)] md:top-1/2" />
        {/* step copy */}
        <div className="absolute inset-x-5 bottom-10 md:inset-x-auto md:bottom-auto md:left-[calc(var(--R)*1.45+3.5rem)] md:right-10 md:top-1/2 md:max-w-[440px] md:-translate-y-1/2">
          <p className="mb-3 inline-block rounded-sm bg-white/10 px-2 py-1 font-mono text-[11px]">{active + 1} / {n}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease }}>
              <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-normal tracking-[-0.04em]">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.45] text-white/65">{s.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
