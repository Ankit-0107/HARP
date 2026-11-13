import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  /** seconds for one full loop */
  duration?: number;
  reverse?: boolean;
  gap?: string;
  className?: string;
  /** soft fade at both edges (original ticker: 0 → 3.5% … 96.5% → 100%) */
  fade?: boolean;
  label?: string;
}

/** A15/A16/A19 — seamless marquee (CSS keyframes). Pauses on hover; static for reduced-motion (see globals.css). */
export function Marquee({ children, duration = 40, reverse, gap = "1.25rem", className, fade = true, label }: Props) {
  const style = { "--marquee-duration": `${duration}s`, "--gap": gap, animationDirection: reverse ? "reverse" : "normal" } as CSSProperties;
  return (
    <div role="group" aria-label={label} className={cn("overflow-hidden", className)}
      style={fade ? { maskImage: "linear-gradient(to right, transparent 0%, #000 3.5%, #000 96.5%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 3.5%, #000 96.5%, transparent 100%)" } : undefined}>
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]" style={style}>
        <div className="flex shrink-0 items-center pr-(--gap)" style={{ gap }}>{children}</div>
        <div className="flex shrink-0 items-center pr-(--gap)" style={{ gap }} aria-hidden>{children}</div>
      </div>
    </div>
  );
}
