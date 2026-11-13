"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Img } from "@/components/media/Img";
import { EmailLink } from "@/components/ui/HoverLink";
import type { Location } from "@/content/types";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Location picker: hover / focus / tap a city to swap the image, country and contact email. */
export function Locations({ eyebrow, locations }: { eyebrow: string; locations: Location[] }) {
  const [i, setI] = useState(0);
  const l = locations[i]!;
  return (
    <section className="container-x py-20 md:py-32" aria-label={eyebrow}>
      <p className="eyebrow mb-10 justify-center">{eyebrow}</p>
      <div className="mx-auto flex max-w-[760px] flex-col items-center">
        <div className="relative aspect-[16/10] w-[min(420px,80%)] overflow-hidden rounded-sm bg-surface-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
              <Img assetId={l.assetId} alt={l.city} sizes="420px" />
            </motion.div>
          </AnimatePresence>
        </div>
        <ul className="mt-10 text-center">
          {locations.map((x, k) => (
            <li key={`${x.city}-${k}`}>
              <button type="button" aria-pressed={k === i} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)}
                className={cn("block text-[clamp(2rem,4.4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.05em] transition-colors duration-500", k === i ? "text-ink" : "text-fog hover:text-mute")}>
                {x.city}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex w-full items-center justify-between text-[14px]" aria-live="polite">
          <span>{l.country}</span>
          <EmailLink email={l.email} />
        </div>
      </div>
    </section>
  );
}
