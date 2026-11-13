"use client";
import { motion, type Variants } from "motion/react";
import { letterBlur } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface Props {
  text: string;
  by?: "chars" | "words";
  className?: string;
  stagger?: number;
  delay?: number;
  /** "mount" animates immediately (hero); "view" when scrolled into view. */
  trigger?: "mount" | "view";
  variants?: Variants;
}

/** A1/A2/A3 — per-letter (blur + rise) or per-word reveal. Accessible: the full text is exposed via aria-label. */
export function SplitText({ text, by = "chars", className, stagger, delay = 0, trigger = "view", variants = letterBlur }: Props) {
  const step = stagger ?? (by === "chars" ? 0.045 : 0.035);
  const words = text.split(" ");
  const trig = trigger === "mount" ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <motion.span role="text" aria-label={text} className={cn("inline", className)} initial="hidden" {...trig}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } }}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {by === "words" ? (
            <motion.span variants={variants} className="inline-block will-change-transform">{w}</motion.span>
          ) : (
            [...w].map((c, ci) => (
              <motion.span key={ci} variants={variants} className="inline-block will-change-transform">{c}</motion.span>
            ))
          )}
          {wi < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </motion.span>
  );
}
