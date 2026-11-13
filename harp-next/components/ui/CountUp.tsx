"use client";
import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

interface Props { value: number | null; decimals?: number; suffix?: string; className?: string }

/** A14 — count-up when scrolled into view. `null` (unverified HARP figure) renders "TBD" and never animates. */
export function CountUp({ value, decimals = 0, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const fmt = (v: number) => `${v.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || value === null || reduce) return;
    if (!inView) { el.textContent = fmt(0); return; }
    const controls = animate(0, value, { duration: 1.8, ease, onUpdate: (v) => (el.textContent = fmt(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduce]);

  return <span ref={ref} className={className}>{value === null ? "TBD" : fmt(value)}</span>;
}
