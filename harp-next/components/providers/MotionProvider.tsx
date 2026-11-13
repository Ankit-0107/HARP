"use client";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Honour prefers-reduced-motion globally (the original only did so inside the menu). */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
