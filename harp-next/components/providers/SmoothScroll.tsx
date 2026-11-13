"use client";
import { useEffect } from "react";
import Lenis from "lenis";

/** A11 — Lenis smooth scrolling (original: <html class="lenis">). Disabled for reduced-motion users. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
