import { describe, expect, it } from "vitest";
import { ease, duration, fadeUp, letterBlur, maskUp, scaleIn } from "@/lib/motion";
import fs from "node:fs";
import path from "node:path";

describe("Animation Configuration & Parameters (A1–A22)", () => {
  it("uses the exact expo-out bezier curve across all motion presets", () => {
    expect(ease).toEqual([0.16, 1, 0.3, 1]);
    expect(duration.fast).toBe(0.5);
    expect(duration.base).toBe(0.6);
    expect(duration.transform).toBe(0.55);
    expect(duration.slow).toBe(1);
  });

  it("variants define matching initial (hidden) and animated (show) states", () => {
    // A7 fade-up
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: 25 });
    expect(fadeUp.show).toMatchObject({ opacity: 1, y: 0 });

    // A1/A2 letterBlur
    expect(letterBlur.hidden).toEqual({ opacity: 0, y: "0.35em", filter: "blur(10px)" });
    expect(letterBlur.show).toMatchObject({ opacity: 1, y: 0, filter: "blur(0px)" });

    // A4 maskUp
    expect(maskUp.hidden).toEqual({ y: "110%" });
    expect(maskUp.show).toMatchObject({ y: 0 });

    // A5 scaleIn
    expect(scaleIn.hidden).toEqual({ scale: 0, opacity: 0 });
    expect(scaleIn.show).toMatchObject({ scale: 1, opacity: 1 });
  });

  it("globals.css contains prefers-reduced-motion rules for marquee and progress", () => {
    const cssPath = path.resolve(import.meta.dirname, "../../app/globals.css");
    const css = fs.readFileSync(cssPath, "utf8");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(".animate-marquee { animation: none !important; }");
    expect(css).toContain(".progress-fill { animation: none !important; transform: scaleX(1); }");
  });

  it("globals.css specifies hardware-accelerated expo easing and breakpoints", () => {
    const cssPath = path.resolve(import.meta.dirname, "../../app/globals.css");
    const css = fs.readFileSync(cssPath, "utf8");
    expect(css).toContain("--ease-expo: cubic-bezier(0.16, 1, 0.3, 1)");
    expect(css).toContain("--breakpoint-md: 810px");
    expect(css).toContain("--breakpoint-xl: 1200px");
  });

  it("canvas loop stops animation frame scheduling when hidden or offscreen", () => {
    const loopPath = path.resolve(import.meta.dirname, "../../components/canvas/useCanvasLoop.ts");
    const code = fs.readFileSync(loopPath, "utf8");
    expect(code).toContain("cancelAnimationFrame");
    expect(code).toContain("visibilitychange");
    expect(code).toContain("IntersectionObserver");
    expect(code).toContain("useReducedMotion");
  });

  it("Marquee includes WebKit vendor prefix for cross-browser mask support", () => {
    const marqueePath = path.resolve(import.meta.dirname, "../../components/ui/Marquee.tsx");
    const code = fs.readFileSync(marqueePath, "utf8");
    expect(code).toContain("WebkitMaskImage");
    expect(code).toContain("maskImage");
  });

  it("SplitText includes role='text' and aria-label for assistive tech", () => {
    const splitPath = path.resolve(import.meta.dirname, "../../components/ui/SplitText.tsx");
    const code = fs.readFileSync(splitPath, "utf8");
    expect(code).toContain('role="text"');
    expect(code).toContain("aria-label={text}");
  });
});
