"use client";
import { motion, type MotionStyle } from "motion/react";
import type { ReactNode } from "react";
import { scaleIn } from "@/lib/motion";

/** A5 — scale(0) → 1 pop-in for markers, dots and icon chips when they enter the viewport. */
export function ScaleIn({ children, className, style, delay = 0 }: { children?: ReactNode; className?: string; style?: MotionStyle; delay?: number }) {
  return (
    <motion.span aria-hidden className={className} style={style} variants={scaleIn} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -5% 0px" }} transition={{ delay }}>
      {children}
    </motion.span>
  );
}
