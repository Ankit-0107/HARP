import type { Variants } from "motion/react";

/** The single easing curve used across the original site (expo-out). */
export const ease = [0.16, 1, 0.3, 1] as const;
export const duration = { fast: 0.5, base: 0.6, transform: 0.55, slow: 1 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease } },
};

export const letterBlur: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
};

export const maskUp: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.9, ease } },
};

export const scaleIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.7, ease } },
};

export const imageBlur: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.9,
      ease,
    },
  },
};