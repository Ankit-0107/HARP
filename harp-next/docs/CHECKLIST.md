# Conversion checklist (living document)

Legend: ✅ done & verified · 🟡 done, with a documented limitation · ☐ not started (requires owner assets)
Verification per page: production build passes (30/30 pages), zero TypeScript errors, zero ESLint warnings, 34 Vitest unit tests pass, static HTML artifact audit passes (zero leaks, semantic HTML verified).

## Foundation
- ✅ Scaffold (Next 16 App Router, React 19, TS strict, Tailwind v4 tokens, ESLint/Prettier, pnpm)
- ✅ Production Build & Single-Worker Stability (`next build --webpack` with `cpus: 1` optimization preventing Windows file-lock race conditions)
- ✅ Fonts: Geist (npm `geist`), PT Mono, Space Mono (`@fontsource`) — self-hosted, zero external requests
- ✅ Asset pipeline: `assets/asset-catalog.json` → `assets/manifest.json`, `scripts/fetch-assets.mjs`, `scripts/build-asset-manifest.mjs`
- ✅ Content separation: `content/reference/` (verbatim original) vs `content/harp/` (placeholders) behind `CONTENT_SOURCE`
- ✅ `lib/motion.ts`, `MotionProvider` (global reduced-motion), `SmoothScroll` (Lenis)
- ✅ Primitives: `SplitText` (with `role="text"` a11y), `Reveal`, `RevealMask`, `DrawLine`, `Marquee` (with Safari WebKit mask prefix), `CountUp`, `FramedPanel`, `HoverLink`, `Img`
- ✅ Slider logic (inline in `ProductSlider`, `CapableIndustries`, `Testimonials`)
- ✅ Error Resilience: `app/global-error.tsx` production root error boundary

## Global
- ✅ SiteNav (glass menu, focus trap, Esc, aria-expanded/aria-controls) · ✅ page label ("/ HOME") · ✅ Footer · ✅ NewsletterForm (UI + `/api/newsletter`)
- ✅ WorldClock (timeZone support, SSR hydration safe) · ✅ PreFooterCta · ✅ PixelButton · ✅ BootCurtain · ✅ not-found (404)
- ✅ Template promo module — **removed by decision**; Flowit.Supply credit — **removed by decision**

## Home — ✅ verified (reference & HARP modes)
- ✅ Hero (letters, meta row, video slot) · ✅ DotReveal (optimized steady-state rendering) · ✅ GridDrift (batched canvas strokes) · ✅ AboutIntro · ✅ ProductSlider · ✅ CapableIndustries
- ✅ ProcessOrbit · ✅ Stats · ✅ Testimonials · ✅ ClientsTicker (4 logos recovered from inline data URIs) · ✅ NewsroomPreview

## About — ✅ verified
- ✅ Header + Parallax image · Timeline · Leadership (12) · Locations picker (hover/focus/tap) · Contact block

## Capabilities — ✅ verified
- ✅ Index (4 rows, industries) · Detail template (published layout) · 3 designed placeholders (HARP: all 4)

## Careers — ✅ verified
- ✅ Header · Scroll statement · Values · Gallery ticker · Positions (static list; positions count uses CountUp with null fallback)

## Contact — ✅ verified
- ✅ Form, Zod validation, `/api/contact`, `/api/newsletter`, Resend client with server-only credentials, honeypots, rate-limiting, CSRF protection, HTML sanitization

## Newsroom — ✅ verified
- ✅ Grid · 3 filter routes (All, Article, Case Study) · Article template (MDX) · 3 published + 5 designed placeholders · Legacy redirects

## Legal / 404 — ✅ verified
- ✅ Privacy policy (designed placeholder for counsel review in HARP mode) · 404 error page with video/canvas background

## Cross-cutting & Phase 3 Audit
- ✅ Metadata/OG per page · ✅ sitemap.xml / robots.txt generation
- ✅ API routes (Resend server-only, rate limit, honeypots, HTML escaping)
- ✅ Unit test suite expanded (34 tests in Vitest across 4 test suites: validators, API routes, content & assets, animations)
- ✅ Static HTML Artifact audit (24 checks passed across 22 HTML pages + metadata routes)
- ✅ Animation refinements: rAF paused off-screen / tab-hidden in `useCanvasLoop`, canvas batching in `DotReveal` & `GridDrift`, WebKit mask prefixes in `Marquee`, `role="text"` in `SplitText`
- ✅ Asset manifest + generated doc (`docs/ASSET-MANIFEST.md`)
- 🟡 Cross-browser: verified via Chromium / Edge on Windows; WebKit vendor prefixes added for Safari compatibility
- ☐ HARP final copy, photographs/videos, brand palette/logo, legal text — **to be supplied by owner**
- ☐ Original media retrieval from `framerusercontent.com` (unreachable from build sandbox; explicit placeholders active)
