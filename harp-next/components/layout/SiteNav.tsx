"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Link as L } from "@/content/types";
import { cn } from "@/lib/cn";
import {
  DynamicIslandNav,
  HomeIcon,
  WorkIcon,
  LabIcon,
  JournalIcon,
  AboutIcon,
  ContactIcon,
} from "./DynamicIslandNav";

export { DynamicIslandNav } from "./DynamicIslandNav";

interface Props { wordmark: string; menuLabel: string; links: L[]; socials: L[] }

/* -------------------------------------------------------------------------
 * Spring transition matching the Framer Dynamic Island physics
 * ------------------------------------------------------------------------- */
const MOBILE_SPRING = { type: "spring" as const, stiffness: 450, damping: 35, mass: 1 };

/* Panel row stagger base delay for the mobile dropdown items */
const ROW_STAGGER_MS = 0.04;

function MobileNavIcon({ href, label, isActive }: { href: string; label: string; isActive?: boolean }) {
  const norm = `${label} ${href}`.toLowerCase();
  if (href === "/" || norm.includes("home")) return <HomeIcon isActive={isActive} />;
  if (norm.includes("product") || norm.includes("capabilit") || norm.includes("work")) return <WorkIcon isActive={isActive} />;
  if (norm.includes("career") || norm.includes("lab")) return <LabIcon isActive={isActive} />;
  if (norm.includes("workshop") || norm.includes("news") || norm.includes("journal")) return <JournalIcon isActive={isActive} />;
  if (norm.includes("about")) return <AboutIcon isActive={isActive} />;
  if (norm.includes("contact")) return <ContactIcon isActive={isActive} />;
  return <WorkIcon isActive={isActive} />;
}

/**
 * SiteNav – orchestrates Desktop (DynamicIslandNav) and Mobile (Dynamic Island)
 * navigation shells. The desktop view is untouched; mobile replaces the old glass
 * menu with a Framer-faithful dark island that shows the current-page icon + label
 * and expands a vertical panel with all routes on hamburger tap.
 */
export function SiteNav({ wordmark, links, socials }: Props) {
  const pathname = usePathname();

  /* -----------------------------------------------------------------------
   * Mobile Menu State (derived from pathname so route transitions close it automatically)
   * ----------------------------------------------------------------------- */
  const [openFor, setOpenFor] = useState<string | null>(null);
  const mobileOpen = openFor === pathname;
  const setMobileOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenFor((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));

  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape; simple focus trap while open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); menuBtnRef.current?.focus(); }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = [
          menuBtnRef.current,
          ...panelRef.current.querySelectorAll<HTMLElement>("a[href], button"),
        ].filter(Boolean) as HTMLElement[];
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]); // eslint-disable-line react-hooks/exhaustive-deps -- setMobileOpen wraps a stable state setter

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(target) && menuBtnRef.current && !menuBtnRef.current.contains(target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]); // eslint-disable-line react-hooks/exhaustive-deps -- setMobileOpen wraps a stable state setter

  /* -----------------------------------------------------------------------
   * Active route detection (shared)
   * ----------------------------------------------------------------------- */
  const checkIsActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      const cleanHref = (href.split("?")[0] ?? "").replace(/\/filters\/.*$/, "");
      if (cleanHref === "/") return pathname === "/";
      return pathname.startsWith(cleanHref);
    },
    [pathname],
  );

  const currentLink = links.find((l) => checkIsActive(l.href));
  const currentLabel = pathname === "/" ? "HOME" : currentLink ? currentLink.label.toUpperCase() : pathname.startsWith("/privacy") ? "PRIVACY" : "404";

  return (
    <>
      {/* ================================================================
       *  DESKTOP — unchanged
       * ================================================================ */}
      <DynamicIslandNav links={links} className="hidden md:flex" />

      <Link
        href="/"
        className="pointer-events-auto fixed left-6 top-6 z-50 hidden text-[17px] font-medium tracking-[-0.04em] text-white mix-blend-difference hover:opacity-70 transition-opacity md:block"
        aria-label={`${wordmark} — home`}
      >
        {wordmark}
      </Link>

      <p
        aria-hidden
        className="pointer-events-none fixed right-6 top-6 z-50 hidden font-mono text-[12px] uppercase text-white mix-blend-difference md:block"
      >
        / {currentLabel}
      </p>

      {/* ================================================================
       *  MOBILE — Dynamic Island style
       * ================================================================ */}
      <header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center md:hidden"
        style={{ padding: "max(16px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) 16px max(16px, env(safe-area-inset-left, 0px))" }}
      >
        <motion.nav
          ref={panelRef}
          layout
          transition={MOBILE_SPRING}
          aria-label="Main"
          className="pointer-events-auto relative w-full max-w-[400px] rounded-[26px] bg-[#101013]/90 border border-white/[0.08] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.18),0px_14px_34px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.07)] backdrop-blur-[20px] backdrop-saturate-[170%]"
        >
          {/* ── Top bar: active item + HARP logo + hamburger ── */}
          <div className="flex h-[52px] items-center px-1.5">
            {/* Current page icon + label */}
            <Link
              href={currentLink?.href ?? "/"}
              className="relative z-10 flex h-10 items-center rounded-[20px] bg-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09)] text-white select-none"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                <MobileNavIcon href={currentLink?.href ?? "/"} label={currentLink?.label ?? "Home"} isActive />
              </span>
              <span className="pr-3.5 -ml-1 text-[14px] font-medium tracking-[-0.01em] whitespace-nowrap">
                {currentLink?.label ?? "Home"}
              </span>
            </Link>

            {/* Spacer */}
            <span className="flex-1" />

            {/* Center brand emblem */}
            <Link
              href="/"
              aria-label="HARP Home"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] transition-transform duration-200 active:scale-[0.88]"
            >
              <Image
                src="/assets/harp/loading.png"
                alt="HARP"
                width={20}
                height={20}
                className="h-4 w-auto object-contain opacity-80"
                priority
              />
            </Link>

            {/* Spacer */}
            <span className="flex-1" />

            {/* Hamburger / X toggle button */}
            <button
              ref={menuBtnRef}
              type="button"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] text-white outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              {/* Animated hamburger bars → X */}
              <span aria-hidden className="relative block h-[16px] w-[16px]">
                <span
                  className={cn(
                    "absolute left-1/2 top-1/2 block h-[1.75px] w-4 -ml-2 rounded-full bg-current transition-transform duration-[450ms]",
                    mobileOpen
                      ? "[transform:rotate(45deg)]"
                      : "[transform:translateY(-3.5px)]"
                  )}
                  style={{ transitionTimingFunction: "cubic-bezier(0.3, 1.35, 0.5, 1)" }}
                />
                <span
                  className={cn(
                    "absolute left-1/2 top-1/2 block h-[1.75px] w-4 -ml-2 rounded-full bg-current transition-transform duration-[450ms]",
                    mobileOpen
                      ? "[transform:rotate(-45deg)]"
                      : "[transform:translateY(3.5px)]"
                  )}
                  style={{ transitionTimingFunction: "cubic-bezier(0.3, 1.35, 0.5, 1)" }}
                />
              </span>
            </button>
          </div>

          {/* ── Expandable panel ── */}
          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: MOBILE_SPRING,
                  opacity: { duration: 0.2, ease: "easeOut" },
                }}
                className="overflow-hidden"
              >
                <div className="px-1.5 pb-1.5">
                  <ul className="grid gap-1 m-0 p-0 list-none">
                    {links.map((l, i) => {
                      const isActive = checkIsActive(l.href);

                      return (
                        <motion.li
                          key={l.href}
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{
                            opacity: { duration: 0.3, ease: "easeOut", delay: ROW_STAGGER_MS * i },
                            y: { duration: 0.55, ease: [0.2, 0.9, 0.25, 1], delay: ROW_STAGGER_MS * i },
                            scale: { duration: 0.2, ease: "easeOut", delay: ROW_STAGGER_MS * i },
                          }}
                        >
                          <Link
                            href={l.href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "flex items-center gap-2 h-12 px-1.5 rounded-[20px] text-white/56 select-none transition-colors duration-200 active:scale-[0.98]",
                              isActive && "bg-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09)] text-white"
                            )}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                              <MobileNavIcon href={l.href} label={l.label} isActive={isActive} />
                            </span>
                            <span className="text-[14px] font-medium tracking-[-0.01em] text-white whitespace-nowrap overflow-hidden text-ellipsis">
                              {l.label}
                            </span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* Socials row */}
                  {socials.some((s) => s.href) && (
                    <div className="mt-2 border-t border-white/[0.08] px-2 pt-3 pb-2">
                      <p className="mb-1.5 font-mono text-[10px] uppercase text-white/40 tracking-widest">Follow us</p>
                      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/56">
                        {socials.map((s) => (
                          <li key={s.label}>
                            {s.href ? (
                              <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                {s.label}
                              </a>
                            ) : (
                              <span className="opacity-40">{s.label}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>
    </>
  );
}
