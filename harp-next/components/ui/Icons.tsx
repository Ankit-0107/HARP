// Redrawn glyphs — originals (framerusercontent.com SVGs) were unretrievable. See assets/manifest.json (status: redrawn).
import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "square" as const, "aria-hidden": true };

export const ArrowUpRight = (p: P) => (<svg viewBox="0 0 16 16" width="1em" height="1em" {...base} {...p}><path d="M4 12 12 4M5 4h7v7" /></svg>);
export const ArrowRight = (p: P) => (<svg viewBox="0 0 16 16" width="1em" height="1em" {...base} {...p}><path d="M2 8h12M9 3l5 5-5 5" /></svg>);
export const ArrowLeft = (p: P) => (<svg viewBox="0 0 16 16" width="1em" height="1em" {...base} {...p}><path d="M14 8H2M7 3 2 8l5 5" /></svg>);
export const ArrowDown = (p: P) => (<svg viewBox="0 0 16 16" width="1em" height="1em" {...base} {...p}><path d="M8 2v12M3 9l5 5 5-5" /></svg>);
export const Plus = (p: P) => (<svg viewBox="0 0 16 16" width="1em" height="1em" {...base} {...p}><path d="M8 2v12M2 8h12" /></svg>);
export const Chevron = (p: P) => (<svg viewBox="0 0 16 16" width="1em" height="1em" {...base} {...p}><path d="m3 6 5 5 5-5" /></svg>);
export const Close = (p: P) => (<svg viewBox="0 0 16 16" width="1em" height="1em" {...base} {...p}><path d="m3 3 10 10M13 3 3 13" /></svg>);
