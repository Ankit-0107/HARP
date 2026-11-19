"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CountUp } from "@/components/ui/CountUp";
import { SplitText } from "@/components/ui/SplitText";
import { ease } from "@/lib/motion";
import type { SiteContent } from "@/content/types";

/** Thin accent line that draws in from left when card enters view */
function DrawBar({ delay, pct }: { delay: number; pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  return (
    <div ref={ref} className="relative h-px w-full overflow-hidden bg-black/10">
      <motion.div
        className="absolute inset-y-0 left-0 bg-accent"
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: pct / 100 } : { scaleX: 0 }}
        transition={{ duration: 1.4, ease, delay }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

/** Tag badge that pops in */
function TagBadge({ tag, delay }: { tag: string; delay: number }) {
  return (
    <motion.span
      className="inline-block font-mono text-[10px] tracking-[0.14em] uppercase text-mute"
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease, delay }}
    >
      {tag}
    </motion.span>
  );
}

const CARD_COLORS = [
  { bg: "bg-surface",   border: "border-line/60", glow: "" },
  { bg: "bg-surface-2", border: "border-line/60", glow: "" },
  { bg: "bg-surface",   border: "border-line/60", glow: "" },
  { bg: "bg-surface-2", border: "border-line/60", glow: "" },
];

/** Fraction of the bar filled per card — purely decorative, represents relative metric strength */
const BAR_PCTS = [96, 78, 65, 54];

export function Stats({ c }: { c: SiteContent["home"]["stats"] }) {
  return (
    <section className="container-x py-16 md:py-28" aria-labelledby="stats-title">
      {/* ── Header row ── */}
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-4">{c.eyebrow}</p>
          <h2
            id="stats-title"
            className="h-section text-[clamp(2.5rem,4.6vw,4.5rem)]"
          >
            <SplitText text={c.title} by="words" />
          </h2>
        </div>
        {/* subtle accent rule */}
        <motion.div
          className="hidden h-px flex-1 origin-left bg-gradient-to-r from-accent/40 to-transparent md:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
        />
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-2 sm:gap-px sm:grid-cols-2 xl:grid-cols-4">
        {c.items.map((s, i) => {
          const col = CARD_COLORS[i % CARD_COLORS.length]!;
          const barPct = BAR_PCTS[i] ?? 50;
          const baseDelay = i * 0.1;

          return (
            <motion.article
              key={s.tag}
              className={[
                "group relative flex flex-col overflow-hidden border",
                // Desktop: needs height for the absolute hover panel to slide up into
                // Mobile: auto height, flex-col normal flow
                "[@media(hover:hover)]:justify-between",
                "p-5 sm:p-6 md:p-8",
                col.bg, col.border, col.glow,
              ].join(" ")}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -6% 0px" }}
              transition={{ duration: 0.7, ease, delay: baseDelay }}
              tabIndex={0}
            >
              {/* ── Top: tag + number ── */}
              <div className="mb-5 md:mb-8">
                <TagBadge tag={s.tag} delay={baseDelay + 0.15} />

                <p className="mt-3 font-light tracking-[-0.06em] text-ink leading-none text-[clamp(2.5rem,5vw,5.5rem)]">
                  <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </p>

                <p className="mt-2 max-w-[26ch] text-[13px] leading-[1.45] text-soft">
                  {s.label}
                </p>
              </div>

              {/* ── Progress bar ── */}
              <div className="mb-5 md:mb-6">
                <DrawBar delay={baseDelay + 0.3} pct={barPct} />
              </div>

              {/* ── Body text ──
                  Desktop (hover:hover): absolutely positioned panel that slides up from bottom.
                  Mobile  (hover:none):  plain inline text below the bar — no dark background. */}
              <div
                className={[
                  // Shared base layout
                  "p-5 sm:p-6 md:p-8",
                  // ── Desktop hover panel ──
                  "[@media(hover:hover)]:absolute [@media(hover:hover)]:inset-x-0 [@media(hover:hover)]:bottom-0",
                  "[@media(hover:hover)]:bg-gradient-to-t [@media(hover:hover)]:from-graphite [@media(hover:hover)]:via-graphite/95 [@media(hover:hover)]:to-graphite/80",
                  "[@media(hover:hover)]:border-t [@media(hover:hover)]:border-accent/20",
                  "[@media(hover:hover)]:translate-y-full",
                  "[@media(hover:hover)]:transition-transform [@media(hover:hover)]:duration-500 [@media(hover:hover)]:ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "[@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-focus:translate-y-0 [@media(hover:hover)]:group-focus-within:translate-y-0",
                  // ── Mobile inline ──
                  "[@media(hover:none)]:p-0 [@media(hover:none)]:pt-4 [@media(hover:none)]:mt-auto",
                  "[@media(hover:none)]:border-t [@media(hover:none)]:border-black/[0.08]",
                ].join(" ")}
              >
                {/* Accent glow line — desktop only, sits at top of revealed panel */}
                <div
                  aria-hidden
                  className="hidden [@media(hover:hover)]:block [@media(hover:hover)]:absolute [@media(hover:hover)]:inset-x-0 [@media(hover:hover)]:top-0 [@media(hover:hover)]:h-px [@media(hover:hover)]:bg-accent/40"
                />

                {/* Tag: green on dark panel (desktop), muted grey on light (mobile) */}
                <p className="mb-1.5 font-mono text-[10px] tracking-[0.14em] uppercase [@media(hover:hover)]:text-accent [@media(hover:none)]:text-mute">
                  {s.tag}
                </p>
                {/* Body: white on dark (desktop), soft grey on light (mobile) */}
                <p className="text-[13px] leading-[1.5] [@media(hover:hover)]:text-white/70 [@media(hover:none)]:text-soft">
                  {s.body}
                </p>
              </div>

              {/* corner accent dot — desktop only, would crowd mobile */}
              <motion.span
                aria-hidden
                className="absolute right-5 top-5 hidden size-1.5 rounded-full bg-accent/60 [@media(hover:hover)]:block"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: baseDelay + 0.4 }}
              />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
