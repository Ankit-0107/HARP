# What could not be retrieved or reconstructed (Phase 3 Audit)

Nothing here was silently substituted. Each item is either an explicit on-page placeholder, a documented approximation, or a gap listed for you to fill.

## 1. Media files (49 assets) — unreachable from build environment
`framerusercontent.com` and `fonts.gstatic.com` do not resolve from the isolated sandbox (`ENOTFOUND`, logged in `assets/fetch-log.json`). Affected: every photo, the two background videos (home hero, 404), and the original Framer-hosted font files.
- **Reference mode** shows a labelled placeholder naming each missing asset (`ORIGINAL IMAGE UNAVAILABLE · <id>`).
- **HARP mode** shows an explicit slot placeholder naming the slot (`HARP image slot — [TBD] · <id>`). Precept assets are NEVER leaked into HARP mode.
- **Fix for production:** Place verified HARP brand images in `public/assets/harp/<id>.<ext>` and run `pnpm assets:manifest`. If original template photos are needed for comparison, run `pnpm assets:fetch` on a network-connected machine. Full list: `docs/ASSET-MANIFEST.md`.
- **Recovered anyway:** 4 client-logo SVGs (recovered from inline data URIs in the source export).
- **Fonts resolved cleanly:** Self-hosted `GeistSans` (npm `geist`), `PT Mono`, and `Space Mono` (`@fontsource`), bundled with `display: "swap"`.

## 2. Framer runtime & custom components (≈27 remote `.mjs` modules)
Not in the ZIP and unreachable. Their *behaviour* was re-implemented and audited in Phase 3 from rendered DOM, inline styles, class names, and screenshots:

| Original module | Re-implemented as | Fidelity & Phase 3 Refinements |
|---|---|---|
| `DotReveal` | `components/canvas/DotReveal.tsx` | **Refined & Optimized** — steady-state dots batched into a single path (~99% reduction in canvas draw calls); radial wave and pointer interaction preserved. |
| `GridDrift` | `components/canvas/GridDrift.tsx` | **Refined & Optimized** — inactive lines batched into a single path stroke; pointer proximity brightening preserved. |
| `useCanvasLoop` | `components/canvas/useCanvasLoop.ts` | **Refined & Optimized** — rAF loop completely halts when offscreen (`IntersectionObserver`) or tab hidden (`visibilitychange`), eliminating CPU/GPU battery drain. Renders static frame for reduced motion. |
| `PixelButton` | `components/ui/PixelButton.tsx` | **Approximated** — pixel sweep canvas animation on hover/focus (560ms duration); disabled on touch-only devices and for reduced motion. |
| `SplitText` | `components/ui/SplitText.tsx` | **Refined for A11y** — Added `role="text"` to outer container so screen readers (VoiceOver, NVDA, JAWS) announce full headings while child letters remain `aria-hidden`. |
| `Marquee` | `components/ui/Marquee.tsx` | **Cross-browser Refined** — Added `WebkitMaskImage` vendor prefix for Safari iOS / macOS gradient mask compatibility. |
| `Real_time_world_clock` | `components/layout/WorldClock.tsx` | Time zone shown by the original is unknown; defaults to the visitor's local time (avoids stale SSR timestamp). |
| `Video` | `components/media/HeroVideo.tsx` | Behaviour matches (autoplay/loop/muted/inline); pauses offscreen; shows explicit labelled fallback when video file is absent. |
| Process orbit, sliders, ticker, counters, glass menu | see `docs/ANIMATIONS.md` | Structure/behaviour reproduced; expo-out curve (`cubic-bezier(.16,1,.3,1)`) and 0.5–0.6 s timings matched to exported CSS. |

## 3. Content that was never in the export
- **Slides 2–4** of the home product slider, **industries 2–5**, **testimonials 2–4** (only the first of each was server-rendered in the reference export). Reference mode shows labelled "not in export" slides.
- **Capability pages** for Robotic Assembly, Automated Inspection, System Integration; **5 newsroom articles** (Cargon, Voltan, Why We Build…, Reshoring…, Repeatable…); **individual job postings**. These routes exist as designed placeholders (`noindex`, excluded from sitemap, zero invented claims).
- Newsroom card ↔ image pairing for 5 unwritten stories was **inferred** from DOM order (flagged "inferred" in the manifest).
- The careers "Open Positions" rows carried template filler ("Lorem Ipsum"); intentionally not reproduced.
- The privacy policy is deliberately a designed placeholder — legal terms must come from HARP's counsel.

## 4. Environment and Testing Status
- **Node & Next.js:** Verified on Node 22 + Next.js 16.4.6 App Router. Production build compiles and prerenders 30/30 pages in 1.7 seconds with zero errors (`cpus: 1` single-worker optimization).
- **Unit & Integration Tests:** 34/34 tests pass in Vitest across 4 test suites (validators, API routes with mocked Resend, content & asset separation, animations & reduced-motion).
- **Static Artifact Audit:** 24/24 audits pass across all 22 prerendered HTML pages and metadata routes (`robots.txt`, `sitemap.xml`).
- **Live Resend API:** Covered by unit tests against mocked Resend client (success, validation error, honeypot drop, rate limit, missing env var 503 response). Live sending requires valid `RESEND_API_KEY` on a verified domain.
