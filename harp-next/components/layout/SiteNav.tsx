"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Link as L } from "@/content/types";
import { Chevron } from "@/components/ui/Icons";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface Props { wordmark: string; menuLabel: string; links: L[]; socials: L[] }

/** A21 — glass menu: collapsed pill that expands, staggered items, Esc / route-change close, focus return. */
export function SiteNav({ wordmark, menuLabel, links, socials }: Props) {
  const pathname = usePathname();
  // "open" is derived from the path it was opened on, so navigating closes the menu without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenFor((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); btn.current?.focus(); }
      if (e.key === "Tab" && panel.current) {           // simple focus trap
        const f = [btn.current, ...panel.current.querySelectorAll<HTMLElement>("a[href]")].filter(Boolean) as HTMLElement[];
        const first = f[0]!, last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- setOpen only wraps a stable state setter

  const current = links.find((l) => (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href.split("/").slice(0, 2).join("/"))));
  // Deterministic for unmatched routes: during SSR of a 404 the pathname is "/_not-found" but the client sees the real URL (hydration mismatch otherwise).
  const label = pathname === "/" ? "HOME" : current ? current.label.toUpperCase() : pathname.startsWith("/privacy") ? "PRIVACY" : "404";

  return (
    <>
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 p-3 md:p-5">
      <div className="flex items-start justify-between">
        <nav aria-label="Primary" className="pointer-events-auto w-[min(260px,calc(100vw-1.5rem))] overflow-hidden rounded-sm border border-black/10 bg-white/70 text-ink backdrop-blur-[24px] backdrop-saturate-[1.8]">
          <div className="flex h-12 items-center justify-between pl-4 pr-2">
            <Link href="/" className="text-[17px] font-medium tracking-[-0.04em]" aria-label={`${wordmark} — home`}>{wordmark}</Link>
            <button ref={btn} type="button" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}
              className="flex h-9 items-center gap-2 rounded-sm px-3 font-mono text-[12px] uppercase hover:bg-black/5">
              Menu <Chevron className={cn("transition-transform duration-500 ease-expo", open && "rotate-180")} />
            </button>
          </div>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div id="site-menu" ref={panel} initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden">
                <ul className="px-4 pb-2 pt-1">
                  {links.map((l, i) => (
                    <motion.li key={l.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1, duration: 0.5, ease }}>
                      <Link href={l.href} aria-current={l === current ? "page" : undefined} className="block py-1.5 text-[22px] font-light tracking-[-0.04em] hover:opacity-60 aria-[current=page]:font-medium">{l.label}</Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="border-t border-black/10 px-4 py-3">
                  <p className="mb-2 font-mono text-[11px] uppercase text-black/50">Follow us</p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
                    {socials.map((s) => (<li key={s.label}>{s.href ? <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-60">{s.label}</a> : <span className="tbd px-1" title="[TBD] profile not verified">{s.label}</span>}</li>))}
                  </ul>
                </div>
                <p className="px-4 pb-3 font-mono text-[11px] uppercase text-black/50">{menuLabel}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
    {/* own fixed layer (outside the header's stacking context) so mix-blend-difference works against the page */}
    <p aria-hidden className="pointer-events-none fixed right-5 top-[30px] z-50 hidden font-mono text-[12px] uppercase text-white mix-blend-difference md:block">/ {label}</p>
    </>
  );
}
