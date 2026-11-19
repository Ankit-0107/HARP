"use client";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { DotReveal } from "@/components/canvas/DotReveal";
import { HeroVideo } from "@/components/media/HeroVideo";
import { RevealMask } from "@/components/ui/Reveal";
import type { SiteContent } from "@/content/types";

export function Hero({ c }: { c: SiteContent["home"]["hero"] }) {
  return (
    <section
      className="relative isolate h-svh min-h-[600px] overflow-hidden bg-black text-white md:min-h-[640px]"
      aria-labelledby="hero-title"
    >
      <HeroVideo
        videoId="home-hero-video"
        posterId="hero-poster"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <DotReveal className="-z-10" />

      {/* ── Centred logo ── */}
      <div className="container-x flex h-full flex-col items-center justify-center pb-28 md:pb-24">

        {/* Outer glow ring — fades in behind the logo */}
        <motion.div
          aria-hidden
          className="absolute size-[min(70vw,520px)] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,250,0,0.07) 0%, rgba(200,250,0,0.03) 40%, transparent 70%)",
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease, delay: 0.4 }}
        />

        {/* Logo image — hidden for now; remove "hidden" class to restore */}
        <motion.img
          id="hero-title"
          src="/assets/harp/harp_logo.png"
          alt="HARP Robotics"
          className="hidden relative z-10 w-[min(52vw,320px)] md:w-[min(60vw,750px)] mt-[100px] object-contain drop-shadow-[0_0_60px_rgba(255,255,255,0.12)]"
          /* entrance */
          initial={{ opacity: 0, scale: 5.08, filter: "blur(18px)", y: 24 }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.65 }}
        />


      </div>

      {/* ── Bottom meta strip ── */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-24">
        <dl className="container-x grid grid-cols-2 gap-x-6 gap-y-5 pb-6 font-[family-name:var(--font-space-mono)] text-[12px] uppercase md:grid-cols-4">
          {c.meta.map((m) => (
            <div key={m.label} className="md:last:text-right">
              <dt className="text-white/50">{m.label}</dt>
              <dd><RevealMask delay={1.7}>{m.value}</RevealMask></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

