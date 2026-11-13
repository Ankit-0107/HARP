"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Img } from "@/components/media/Img";
import { cn } from "@/lib/cn";

/** A20 — scroll-linked parallax image (About "Fixed Image"): the picture drifts ±12% inside a clipped frame. */
export function ParallaxImage({ assetId, src, alt = "", className }: { assetId?: string; src?: string; alt?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-sm bg-surface-2", className)}>
      <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[14%]"><Img assetId={assetId} src={src} alt={alt} sizes="100vw" /></motion.div>
    </div>
  );
}
