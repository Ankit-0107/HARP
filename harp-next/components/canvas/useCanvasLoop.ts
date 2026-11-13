"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

export interface Pointer { x: number; y: number; active: boolean }
type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, pointer: Pointer) => void;

/**
 * Shared rAF loop for decorative canvases: DPR-capped, paused when off-screen or tab hidden,
 * and rendered once (static frame) for reduced-motion users.
 */
export function useCanvasLoop(draw: Draw) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const drawRef = useRef(draw);
  useEffect(() => { drawRef.current = draw; });

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pointer: Pointer = { x: 0, y: 0, active: false };
    const start = performance.now();
    let w = 0, h = 0, raf = 0, visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) { ctx.clearRect(0, 0, w, h); drawRef.current(ctx, w, h, 99, pointer); }
    };
    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; return; }
      ctx.clearRect(0, 0, w, h);
      drawRef.current(ctx, w, h, (now - start) / 1000, pointer);
      raf = requestAnimationFrame(loop);
    };
    const ensureLoop = () => {
      if (!reduce && visible && !document.hidden && !raf) {
        raf = requestAnimationFrame(loop);
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
    };
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) ensureLoop();
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(canvas);
    const onVisibility = () => {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
      else if (!document.hidden && visible) ensureLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    if (!reduce) { window.addEventListener("pointermove", onMove, { passive: true }); ensureLoop(); }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return ref;
}
