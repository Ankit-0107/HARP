"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { resolveMedia } from "@/lib/assets";
import { AssetPlaceholder } from "@/components/media/Img";
import { formatDate } from "@/lib/format";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SplitText } from "@/components/ui/SplitText";
import type { NewsEntry } from "@/content/types";

/*
 * Exact Framer specs (from audienceexpandcards.framer.website):
 *   --aec-duration:       0.64s
 *   --aec-ease:           cubic-bezier(0.22, 1, 0.36, 1)   (easeOutQuart)
 *   --aec-weight:         2.6   (expanded flex-grow)
 *   --aec-desktop-height: 500px
 *   --aec-gap:            12px
 *   --aec-radius:         19px
 *   --aec-mobile-closed:  112px
 *   --aec-mobile-open:    340px
 *
 * Stagger schedule (delay as fraction of 0.64s):
 *   flex-grow:        0s      0.64s ease
 *   icon rotate:      0s      0.64s ease
 *   title scale:      0s      0.64s ease
 *   grid rows:        0.205s  0.46s ease
 *   description:      0.339s  opacity 0.30s / transform 0.42s
 *   CTA button:       0.416s  opacity 0.40s / transform 0.48s
 *   image hover zoom: 1.056s  scale(1.055)
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DURATION = 0.64;

const EXPAND_TRANSITION = { duration: DURATION, ease: EASE } as const;
const DESC_TRANSITION = { duration: 0.42, ease: EASE, delay: DURATION * 0.53 } as const;
const CTA_TRANSITION = { duration: 0.48, ease: EASE, delay: DURATION * 0.65 } as const;

function CardImage({ entry, sizes }: { entry: NewsEntry; sizes: string }) {
  const { src, mode } = resolveMedia(entry.heroAssetId);
  if (src) {
    return (
      <Image
        src={src}
        alt={entry.title}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[1056ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.055]"
        data-asset-id={entry.heroAssetId}
      />
    );
  }
  return <AssetPlaceholder assetId={entry.heroAssetId} alt={entry.title} tone="dark" mode={mode} />;
}

/** Circular + / × indicator icon */
function IndicatorIcon({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      className="grid size-[35px] shrink-0 place-items-center rounded-full border border-white/50"
      animate={{
        rotate: isActive ? 45 : 0,
        backgroundColor: isActive ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0)",
      }}
      transition={{ duration: DURATION, ease: "easeInOut" }}
      aria-hidden
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

const CARD_LINKS = ["/capabilities", "/newsroom", "/404"];

/* ─── Desktop Card ─── */
function ExpandCard({
  entry,
  index,
  isActive,
  onActivate,
  categoryLabel,
  href,
}: {
  entry: NewsEntry;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  categoryLabel: string;
  href: string;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      className="group/card relative cursor-pointer overflow-hidden"
      style={{
        borderRadius: 19,
        height: 500,
        minWidth: 0,
        flexBasis: 0,
      }}
      animate={{ flexGrow: isActive ? 2.6 : 1 }}
      transition={EXPAND_TRANSITION}
      onClick={onActivate}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${isActive ? "Collapse" : "Expand"} ${entry.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <CardImage entry={entry} sizes={isActive ? "55vw" : "22vw"} />
        {/* Multi-stop scrim gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.76] via-black/30 to-black/20" />
      </div>

      {/* Content overlay */}
      <div className="relative flex h-full flex-col justify-between p-6">
        {/* Top row: eyebrow + icon */}
        <div className="flex items-start justify-between">
          <motion.span
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.065em] text-white/80"
            layout
          >
            {isActive ? `${num} / ${categoryLabel}` : num}
          </motion.span>
          <IndicatorIcon isActive={isActive} />
        </div>

        {/* Bottom content */}
        <div className="flex flex-col">
          {/* Title — scales 0.64 → 1.0 */}
          <motion.h3
            className="origin-bottom-left text-[clamp(1.5rem,2.8vw,2.25rem)] font-normal leading-[1.1] tracking-[-0.03em] text-white"
            animate={{ scale: isActive ? 1 : 0.64 }}
            transition={EXPAND_TRANSITION}
          >
            {entry.title}
          </motion.h3>

          {/* Description — staggered reveal */}
          <AnimatePresence>
            {isActive && (
              <motion.p
                className="mt-4 max-w-[330px] text-[14px] leading-[1.45] text-white/70"
                initial={{ opacity: 0, y: 12, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, y: 8, height: 0, marginTop: 0 }}
                transition={DESC_TRANSITION}
              >
                {formatDate(entry.date)} · {entry.category}
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTA button — staggered reveal */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={CTA_TRANSITION}
                className="mt-5"
              >
                <Link
                  href={href}
                  className="group/btn inline-flex min-h-[45px] items-center gap-2 rounded-full bg-white px-[18px] py-[11px] font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-black transition-colors hover:bg-white/90"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read More
                  <span className="transition-transform duration-200 group-hover/btn:translate-x-[3px] group-hover/btn:-translate-y-[3px]">
                    <ArrowUpRight />
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Mobile Accordion Card ─── */
function MobileCard({
  entry,
  index,
  isActive,
  onActivate,
  categoryLabel,
  href,
}: {
  entry: NewsEntry;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  categoryLabel: string;
  href: string;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      className="group/card relative cursor-pointer overflow-hidden"
      style={{ borderRadius: 19, width: "100%" }}
      animate={{ height: isActive ? 340 : 112 }}
      transition={EXPAND_TRANSITION}
      onClick={onActivate}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={entry.title}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <CardImage entry={entry} sizes="95vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.76] via-black/30 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-5">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.065em] text-white/80">
            {isActive ? `${num} / ${categoryLabel}` : num}
          </span>
          <IndicatorIcon isActive={isActive} />
        </div>

        {/* Bottom content */}
        <div className="flex flex-col">
          <h3 className="text-[18px] font-normal leading-[1.15] tracking-[-0.02em] text-white">
            {entry.title}
          </h3>

          <AnimatePresence>
            {isActive && (
              <motion.p
                className="mt-3 text-[13px] leading-[1.45] text-white/60"
                initial={{ opacity: 0, y: 8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 6, height: 0 }}
                transition={DESC_TRANSITION}
              >
                {formatDate(entry.date)} · {entry.category}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={CTA_TRANSITION}
                className="mt-4"
              >
                <Link
                  href={href}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-white px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.04em] text-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read More <ArrowUpRight />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export function NewsroomExpandCards({
  eyebrow = "Explore",
  title = "Categories",
  entries,
}: {
  eyebrow?: string;
  title?: string;
  entries: NewsEntry[];
}) {
  const latest = entries.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const activate = useCallback((i: number) => setActiveIndex(i), []);

  return (
    <section className="py-16 md:py-28" aria-labelledby="news-title">
      <div className="container-x mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 id="news-title" className="h-section text-[clamp(2.5rem,4.6vw,4.5rem)]">
            <SplitText text={title} by="words" />
          </h2>
        </div>
      </div>

      {/* Desktop: horizontal expandable cards */}
      <div className="container-x hidden md:flex" style={{ gap: 12 }}>
        {latest.map((e, i) => (
          <ExpandCard
            key={e.slug}
            entry={e}
            index={i}
            isActive={i === activeIndex}
            onActivate={() => activate(i)}
            categoryLabel={e.category.toUpperCase()}
            href={CARD_LINKS[i] ?? "/404"}
          />
        ))}
      </div>

      {/* Mobile: vertical accordion */}
      <div className="container-x flex flex-col gap-[12px] md:hidden">
        {latest.map((e, i) => (
          <MobileCard
            key={e.slug}
            entry={e}
            index={i}
            isActive={i === activeIndex}
            onActivate={() => activate(i)}
            categoryLabel={e.category.toUpperCase()}
            href={CARD_LINKS[i] ?? "/404"}
          />
        ))}
      </div>
    </section>
  );
}
