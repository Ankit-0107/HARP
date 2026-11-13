"use client";
import { useCanvasLoop } from "./useCanvasLoop";
import { cn } from "@/lib/cn";

/**
 * A10 — DotReveal. Dot lattice that is revealed by a radial wave on load and swells around the pointer.
 * (Original module was a remote Framer component; parameters are visually approximated — see docs/UNRECOVERABLE.md.)
 */
export function DotReveal({ className, gap = 22, color = "255,255,255" }: { className?: string; gap?: number; color?: string }) {
  const ref = useCanvasLoop((ctx, w, h, t, p) => {
    const cx = w / 2, cy = h / 2, maxR = Math.hypot(cx, cy);
    const waveComplete = t * 0.7 - 0.9 >= 1 / 2.2;
    if (waveComplete && !p.active) {
      ctx.fillStyle = `rgba(${color},0.28)`;
      ctx.beginPath();
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          ctx.moveTo(x + 0.9, y);
          ctx.arc(x, y, 0.9, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      return;
    }
    for (let x = gap / 2; x < w; x += gap) for (let y = gap / 2; y < h; y += gap) {
      const d = Math.hypot(x - cx, y - cy) / maxR;
      const reveal = Math.min(1, Math.max(0, (t * 0.7 - d * 0.9) * 2.2));       // outward wave
      let r = 0.9 * reveal, a = 0.28 * reveal;
      if (p.active) { const k = Math.max(0, 1 - Math.hypot(x - p.x, y - p.y) / 160); r += k * 2.2; a += k * 0.6; }
      if (a <= 0.01) continue;
      ctx.fillStyle = `rgba(${color},${a})`; ctx.beginPath(); ctx.arc(x, y, Math.max(0.2, r), 0, Math.PI * 2); ctx.fill();
    }
  });
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
