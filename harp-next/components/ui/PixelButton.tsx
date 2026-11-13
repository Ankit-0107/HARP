"use client";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "dark" | "light";
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

const CELL = 3;
const hash = (x: number, y: number) => { const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return s - Math.floor(s); };

/** A9 — pill button with a canvas "pixel sweep" on hover/focus (original: 69–74×14 px canvas behind the label). */
export function PixelButton({ children, href, type = "button", disabled, variant = "dark", className, onClick, ...aria }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);
  const reduce = useReducedMotion();

  const play = () => {
    const c = canvas.current; if (!c || reduce || disabled) return;
    if (!window.matchMedia("(hover: hover)").matches && document.activeElement !== c.parentElement) return;
    const { width: w, height: h } = c.getBoundingClientRect(); if (!w) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = w * dpr; c.height = h * dpr;
    const ctx = c.getContext("2d")!; ctx.scale(dpr, dpr);
    const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL);
    const start = performance.now(), dur = 560;
    cancelAnimationFrame(raf.current);
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = variant === "dark" ? "#c8fa00" : "#000";
      for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) {
        const front = t * 1.5 - 0.25;                         // sweep position (0..1 across the button)
        const d = Math.abs(x / cols - front);
        if (d < 0.22 && hash(x, y) < 1 - d / 0.22) ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
      }
      if (t < 1) raf.current = requestAnimationFrame(frame); else ctx.clearRect(0, 0, w, h);
    };
    raf.current = requestAnimationFrame(frame);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const cls = cn(
    "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-7 text-[15px] font-medium tracking-[-0.01em] transition-[background,color,transform] duration-[550ms] ease-expo",
    variant === "dark" ? "bg-ink text-white hover:[@media(hover:hover)]:bg-graphite" : "bg-white text-black",
    "disabled:opacity-50", className,
  );
  const inner = (
    <>
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <span className="relative z-10">{children}</span>
    </>
  );
  const handlers = { onPointerEnter: play, onFocus: play };
  return href ? (
    <Link href={href} className={cls} {...handlers} {...aria}>{inner}</Link>
  ) : (
    <button type={type} disabled={disabled} onClick={onClick} className={cls} {...handlers} {...aria}>{inner}</button>
  );
}
