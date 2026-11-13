"use client";
import { useRef } from "react";
import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { fadeUp, maskUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Div = Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "animate">;

/** A7 — fade-up on scroll (opacity 0 / translateY 25px → rest). */
export function Reveal({ delay = 0, className, ...rest }: Div & { delay?: number }) {
  return (
    <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }} transition={{ delay }} {...rest} />
  );
}

/**
 * A4 — mask-slide reveal (content rises from translateY(110%) inside an overflow clip).
 * The IN-VIEW observer must watch the clipping wrapper, not the translated child: a child hidden by its own
 * parent's overflow never counts as intersecting and would stay hidden forever.
 */
export function RevealMask({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true }); // no negative margin: these are tiny labels that may sit at the very bottom edge of the first viewport
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div variants={maskUp} initial="hidden" animate={inView ? "show" : "hidden"} transition={{ delay }}>
        {children}
      </motion.div>
    </div>
  );
}

/** A6 — a line that draws from scaleX(0). */
export function DrawLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div aria-hidden className={cn("h-px origin-left bg-current", className)} initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }} />
  );
}
