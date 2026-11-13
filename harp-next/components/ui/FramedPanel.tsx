"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { ScaleIn } from "./ScaleIn";

/** Panel with faint grid lines and "+" crosshairs at the inner intersections (About Us box, Pre-footer CTA). */
export function FramedPanel({
  children,
  className,
  inset = 12,
  bg = "bg-surface",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  inset?: number;
  bg?: string;
  interactive?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const rawLeftShift = useMotionValue(0);
  const rawRightShift = useMotionValue(0);
  const rawTopShift = useMotionValue(0);
  const rawBottomShift = useMotionValue(0);

  const rawCursorX = useMotionValue(0);
  const rawCursorY = useMotionValue(0);
  const rawGuideOpacity = useMotionValue(0);
  const rawLineOpacity = useMotionValue(0.12);

  const springConfig = { stiffness: 180, damping: 22, mass: 0.5 };
  const cursorSpringConfig = { stiffness: 350, damping: 30, mass: 0.2 };

  const leftShift = useSpring(rawLeftShift, springConfig);
  const rightShift = useSpring(rawRightShift, springConfig);
  const topShift = useSpring(rawTopShift, springConfig);
  const bottomShift = useSpring(rawBottomShift, springConfig);

  const cursorX = useSpring(rawCursorX, cursorSpringConfig);
  const cursorY = useSpring(rawCursorY, cursorSpringConfig);
  const guideOpacity = useSpring(rawGuideOpacity, { stiffness: 250, damping: 25 });
  const lineOpacity = useSpring(rawLineOpacity, { stiffness: 200, damping: 25 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || shouldReduceMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = x / rect.width - 0.5; // -0.5 to +0.5
    const normY = y / rect.height - 0.5; // -0.5 to +0.5

    // Displace guidelines in response to cursor position
    rawLeftShift.set(normX * 45 + normY * 8);
    rawRightShift.set(normX * 45 - normY * 8);
    rawTopShift.set(normY * 30 + normX * 8);
    rawBottomShift.set(normY * 30 - normX * 8);

    rawCursorX.set(x);
    rawCursorY.set(y);
    rawGuideOpacity.set(1);
    rawLineOpacity.set(0.25);
  };

  const handlePointerLeave = () => {
    if (!interactive || shouldReduceMotion) return;
    rawLeftShift.set(0);
    rawRightShift.set(0);
    rawTopShift.set(0);
    rawBottomShift.set(0);
    rawGuideOpacity.set(0);
    rawLineOpacity.set(0.12);
  };

  const a = `${inset}%`, b = `${100 - inset}%`;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("relative overflow-hidden", bg, className)}
    >
      {/* Vertical guideline: left */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-black"
        style={{ left: a, x: leftShift, opacity: lineOpacity }}
      />
      {/* Vertical guideline: right */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-black"
        style={{ left: b, x: rightShift, opacity: lineOpacity }}
      />
      {/* Horizontal guideline: top */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-px bg-black"
        style={{ top: a, y: topShift, opacity: lineOpacity }}
      />
      {/* Horizontal guideline: bottom */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-px bg-black"
        style={{ top: b, y: bottomShift, opacity: lineOpacity }}
      />

      {/* Dynamic interactive cursor crosshairs */}
      {interactive && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-px bg-black/15"
            style={{ left: cursorX, opacity: guideOpacity }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-px bg-black/15"
            style={{ top: cursorY, opacity: guideOpacity }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] leading-none text-black/40"
            style={{ left: cursorX, top: cursorY, opacity: guideOpacity }}
          >
            +
          </motion.span>
        </>
      )}

      {/* 4 Corner Crosshairs */}
      <ScaleIn delay={0.15} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-none text-black/50" style={{ left: a, top: a, x: leftShift, y: topShift }}>+</ScaleIn>
      <ScaleIn delay={0.23} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-none text-black/50" style={{ left: b, top: a, x: rightShift, y: topShift }}>+</ScaleIn>
      <ScaleIn delay={0.31} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-none text-black/50" style={{ left: a, top: b, x: leftShift, y: bottomShift }}>+</ScaleIn>
      <ScaleIn delay={0.39} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-none text-black/50" style={{ left: b, top: b, x: rightShift, y: bottomShift }}>+</ScaleIn>

      <div className="relative">{children}</div>
    </div>
  );
}
