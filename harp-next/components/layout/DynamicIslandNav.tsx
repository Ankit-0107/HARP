"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------
 * SVG Glyphs extracted from Dynamic Island Nav (Framer)
 * Each glyph supports an active fill tint (fillOpacity: 0.2) when selected.
 * ------------------------------------------------------------------------- */

interface IconProps {
  className?: string;
  isActive?: boolean;
}

export function HomeIcon({ className = "w-5 h-5", isActive = false }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn("w-5 h-5 overflow-visible", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M4.5 10.2 12 4.25l7.5 5.95v8.3a1.5 1.5 0 0 1-1.5 1.5h-3.25v-5.25h-5.5V20H6a1.5 1.5 0 0 1-1.5-1.5z"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
    </svg>
  );
}

export function WorkIcon({ className = "w-5 h-5", isActive = false }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn("w-5 h-5 overflow-visible", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="4"
        y="4"
        width="6.5"
        height="6.5"
        rx="1.75"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
      <rect
        x="13.5"
        y="4"
        width="6.5"
        height="6.5"
        rx="1.75"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
      <rect
        x="4"
        y="13.5"
        width="6.5"
        height="6.5"
        rx="1.75"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
      <rect
        x="13.5"
        y="13.5"
        width="6.5"
        height="6.5"
        rx="1.75"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
    </svg>
  );
}

export function LabIcon({ className = "w-5 h-5", isActive = false }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn("w-5 h-5 overflow-visible", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M12 4.5c.6 4.1 3.4 6.9 7.5 7.5-4.1.6-6.9 3.4-7.5 7.5-.6-4.1-3.4-6.9-7.5-7.5 4.1-.6 6.9-3.4 7.5-7.5z"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
    </svg>
  );
}

export function JournalIcon({ className = "w-5 h-5", isActive = false }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn("w-5 h-5 overflow-visible", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M14.5 5.5 18.5 9.5 9.5 18.5H5.5V14.5z"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
      <path d="m12.5 7.5 4 4" />
    </svg>
  );
}

export function AboutIcon({ className = "w-5 h-5", isActive = false }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn("w-5 h-5 overflow-visible", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="8.5"
        r="3.75"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
      <path
        d="M5 19.5c.9-3.4 3.6-5.25 7-5.25s6.1 1.85 7 5.25"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
    </svg>
  );
}

export function ContactIcon({ className = "w-5 h-5", isActive = false }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn("w-5 h-5 overflow-visible", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3.75"
        y="5.5"
        width="16.5"
        height="13"
        rx="2.75"
        fill="currentColor"
        fillOpacity={isActive ? 0.2 : 0}
        className="transition-[fill-opacity] duration-300"
      />
      <path d="m4.75 7.75 6.2 4.6a1.75 1.75 0 0 0 2.1 0l6.2-4.6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * Types & Nav Configuration
 * ------------------------------------------------------------------------- */

export interface DynamicIslandItem {
  id: string;
  label: string;
  href: string;
  icon: (props: IconProps) => React.ReactNode;
}

export function resolveNavIcon(href: string, label: string) {
  const norm = `${label} ${href}`.toLowerCase();
  if (href === "/" || norm.includes("home")) return HomeIcon;
  if (norm.includes("product") || norm.includes("capabilit") || norm.includes("work")) return WorkIcon;
  if (norm.includes("career") || norm.includes("lab")) return LabIcon;
  if (norm.includes("workshop") || norm.includes("news") || norm.includes("journal")) return JournalIcon;
  if (norm.includes("about")) return AboutIcon;
  if (norm.includes("contact")) return ContactIcon;
  return WorkIcon;
}

export const DEFAULT_DYNAMIC_ISLAND_ITEMS: DynamicIslandItem[] = [
  { id: "home", label: "Home", href: "/", icon: HomeIcon },
  { id: "capabilities", label: "Products", href: "/capabilities", icon: WorkIcon },
  { id: "newsroom", label: "Workshops", href: "/newsroom/filters/completed", icon: JournalIcon },
  { id: "careers", label: "Careers", href: "/careers", icon: LabIcon },
  { id: "about", label: "About", href: "/about", icon: AboutIcon },
  { id: "contact", label: "Contact", href: "/contact", icon: ContactIcon },
];

export interface DynamicIslandNavProps {
  items?: DynamicIslandItem[];
  links?: Array<{ label: string; href: string }>;
  className?: string;
}

/* Spring transition curve matching Framer physics */
const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 450,
  damping: 35,
  mass: 1,
};

/**
 * DynamicIslandNav
 * Desktop floating Dynamic Island navigation bar converted from Framer.
 * Features dark glassmorphism, active indicator sliding pill with spring physics,
 * expandable active/hovered labels, and tactile press response.
 */
export function DynamicIslandNav({ items: propItems, links, className }: DynamicIslandNavProps) {
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Normalize items from either `items` or `links` prop, or fallback to default
  const items: DynamicIslandItem[] = React.useMemo(() => {
    if (propItems && propItems.length > 0) return propItems;
    if (links && links.length > 0) {
      const mapped = links.map((l) => ({
        id: l.href.replace(/[^a-zA-Z0-9_-]/g, "-") || "home",
        label: l.label,
        href: l.href,
        icon: resolveNavIcon(l.href, l.label),
      }));

      // Symmetrical ordering around center logo:
      // Left: Home, Products, Workshops
      // Right: Careers, About, Contact
      const orderMap: Record<string, number> = {
        "/": 1,
        "/capabilities": 2,
        "/newsroom/filters/completed": 3,
        "/newsroom/filters/all": 3,
        "/newsroom": 3,
        "/careers": 4,
        "/about": 5,
        "/contact": 6,
      };

      return [...mapped].sort((a, b) => {
        const orderA = orderMap[a.href] ?? 99;
        const orderB = orderMap[b.href] ?? 99;
        return orderA - orderB;
      });
    }
    return DEFAULT_DYNAMIC_ISLAND_ITEMS;
  }, [propItems, links]);

  // Determine active route
  const checkIsActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const cleanHref = (href.split("?")[0] ?? "").replace(/\/filters\/.*$/, "");
    if (cleanHref === "/") return pathname === "/";
    return pathname.startsWith(cleanHref);
  };

  const activeItem = items.find((item) => checkIsActive(item.href)) ?? items[0];
  const expandedId = hoveredId ?? activeItem?.id ?? "";

  // Split items symmetrically around the center brand emblem
  const midIndex = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, midIndex);
  const rightItems = items.slice(midIndex);

  const renderNavItem = (item: DynamicIslandItem) => {
    const isExpanded = expandedId === item.id;
    const isActive = checkIsActive(item.href);
    const Icon = item.icon;

    return (
      <motion.li
        key={item.id}
        layout
        transition={SPRING_TRANSITION}
        className="relative flex items-center"
      >
        {/* Active / Hovered Sliding Pill Indicator */}
        {isExpanded && (
          <motion.div
            layoutId="dynamic-island-active-pill"
            transition={SPRING_TRANSITION}
            className="absolute inset-0 rounded-[20px] bg-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09)] pointer-events-none"
          />
        )}

        <Link
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          onMouseEnter={() => setHoveredId(item.id)}
          onFocus={() => setHoveredId(item.id)}
          onBlur={() => setHoveredId(null)}
          className={cn(
            "relative z-10 flex h-10 items-center rounded-[20px] outline-none select-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/80",
            isExpanded ? "text-white" : "text-white/56 hover:text-white"
          )}
        >
          {/* Icon box */}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-150 active:scale-[0.88]">
            <Icon isActive={isActive} />
          </span>

          {/* Expandable Label */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0, x: -6 }}
                animate={{ opacity: 1, width: "auto", x: 0 }}
                exit={{ opacity: 0, width: 0, x: -6 }}
                transition={{
                  width: SPRING_TRANSITION,
                  opacity: { duration: 0.16, ease: "easeOut" },
                  x: SPRING_TRANSITION,
                }}
                className="overflow-hidden whitespace-nowrap pr-3.5 -ml-1 text-[14px] font-medium tracking-[-0.01em] text-white"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          <span className="sr-only">{item.label}</span>
        </Link>
      </motion.li>
    );
  };

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center p-4",
        className
      )}
    >
      <motion.nav
        layout
        transition={SPRING_TRANSITION}
        aria-label="Main"
        onMouseLeave={() => setHoveredId(null)}
        className="pointer-events-auto relative flex h-[52px] items-center rounded-[26px] bg-[#101013]/90 p-[6px] backdrop-blur-[20px] backdrop-saturate-[170%] border border-white/[0.08] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.18),0px_14px_34px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.07)]"
      >
        <ul className="flex items-center gap-1 m-0 p-0 list-none">
          {leftItems.map(renderNavItem)}

          {/* Center Brand Emblem (HARP Logo) */}
          <li className="relative flex items-center shrink-0 mx-0.5">
            <span className="h-4 w-[1px] bg-white/[0.08] rounded-full mr-1.5" aria-hidden="true" />
            <Link
              href="/"
              aria-label="HARP Home"
              className="group relative flex h-10 w-10 items-center justify-center rounded-[20px] outline-none transition-transform duration-200 hover:scale-110 active:scale-[0.88] focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <Image
                src="/assets/harp/loading.png"
                alt="HARP Robotics"
                width={24}
                height={24}
                className="h-5 w-auto object-contain opacity-90 transition-all duration-200 group-hover:opacity-100 group-hover:brightness-125"
                priority
              />
            </Link>
            <span className="h-4 w-[1px] bg-white/[0.08] rounded-full ml-1.5" aria-hidden="true" />
          </li>

          {rightItems.map(renderNavItem)}
        </ul>
      </motion.nav>
    </header>
  );
}
