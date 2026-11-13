"use client";
import { useCanvasLoop } from "./useCanvasLoop";
import { cn } from "@/lib/cn";

/**
 * A10 — GridDrift. Fine line grid drifting slowly on a diagonal, brightening near the pointer.
 * (Original module was a remote Framer component; parameters are visually approximated — see docs/UNRECOVERABLE.md.)
 */
export function GridDrift({ className, cell = 64, color = "255,255,255" }: { className?: string; cell?: number; color?: string }) {
  const ref = useCanvasLoop((ctx, w, h, t, p) => {
    const ox = (t * 6) % cell, oy = (t * 4) % cell;
    ctx.lineWidth = 1;
    if (!p.active) {
      ctx.strokeStyle = `rgba(${color},0.07)`;
      ctx.beginPath();
      for (let x = -cell + ox; x < w + cell; x += cell) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
      for (let y = -cell + oy; y < h + cell; y += cell) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
      ctx.stroke();
      return;
    }
    for (let x = -cell + ox; x < w + cell; x += cell) {
      const k = Math.max(0, 1 - Math.abs(x - p.x) / 220);
      ctx.strokeStyle = `rgba(${color},${0.07 + k * 0.18})`; ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke();
    }
    for (let y = -cell + oy; y < h + cell; y += cell) {
      const k = Math.max(0, 1 - Math.abs(y - p.y) / 220);
      ctx.strokeStyle = `rgba(${color},${0.07 + k * 0.18})`; ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke();
    }
  });
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
