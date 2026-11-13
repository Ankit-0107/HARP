"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "@/lib/motion";

/** Home-only boot curtain: black overlay with spinner, lifts when the page has loaded (hard cap 3s; original capped at 10s). */
export function BootCurtain() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const done = () => setTimeout(() => setShow(false), 700);
    if (document.readyState === "complete") done(); else window.addEventListener("load", done, { once: true });
    const cap = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(cap);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div aria-hidden className="fixed inset-0 z-[100] grid place-items-center bg-black" exit={{ y: "-100%" }} transition={{ duration: 0.9, ease }}>
          <svg viewBox="0 0 40 40" className="size-10 animate-spin text-white" style={{ animationDuration: "1.1s" }}><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="70 100" strokeLinecap="round" /></svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
