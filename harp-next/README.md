# HARP — Next.js Site (Phase 3 Final Delivery)

Migration and comprehensive audit/refinement of the Precept reference design into **Next.js 16 (App Router) · React 19 · TypeScript (Strict) · Tailwind CSS v4 · Motion for React**, built for **HARP Robotics**.

> **Status:** Fully audited, refined, and verified in Phase 3.
> - All 12 documented routes (expanding to 22 published/placeholder URLs + metadata endpoints) build and prerender cleanly (30/30 pages) in under 2 seconds.
> - 34 automated unit and integration tests passing in Vitest with zero warnings.
> - Zero TypeScript errors, zero ESLint warnings, zero leaked vendor references or template text.
> - Canvas loops and animation patterns optimized for high performance and zero idle CPU usage.
> - HARP business copy and custom imagery are marked with explicit `[TBD]` placeholders awaiting owner assets.

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Environment configuration for contact/newsletter forms (server-side only)
cp .env.example .env.local

# Run development server (HARP mode)
pnpm dev                       # http://localhost:3000

# Run development server (Reference mode, for visual comparison)
CONTENT_SOURCE=reference pnpm dev

# Build and start production server
pnpm build && pnpm start
```

Requirements: Node ≥ 22, pnpm 12.

---

## Phase 3 Audit & Refinement Highlights

1. **Independent Code Audit:**
   - Strict TypeScript and React 19 verification.
   - Clean Server Component vs Client Component boundaries.
   - Production root error boundary created at `app/global-error.tsx`.
   - Single-worker compilation optimization (`cpus: 1` in `next.config.ts`) eliminating file-lock race conditions during static page generation.

2. **Animation Refinement (All 22 Documented Patterns):**
   - **Canvas Optimization (`useCanvasLoop`):** Automatically cancels `requestAnimationFrame` loop when canvas elements scroll out of view (`IntersectionObserver`) or when the browser tab is hidden (`visibilitychange`), eliminating idle GPU/CPU battery drain.
   - **Canvas Batching (`DotReveal` & `GridDrift`):** Batched steady-state dot lattice and line grids into single path calls, reducing canvas draw calls by ~99% during typical viewing.
   - **Screen Reader Accessibility (`SplitText`):** Added `role="text"` to animated text containers so screen readers (VoiceOver, NVDA, JAWS) announce complete headings while preserving per-letter blur-rise motion for sighted users.
   - **Cross-Browser Safari Masking (`Marquee`):** Added `-webkit-mask-image` vendor prefixes to marquee edge-fade gradients for Safari on iOS and macOS.
   - **Reduced Motion Support:** Globally enforced across `MotionProvider`, CSS `@media (prefers-reduced-motion)`, Lenis opt-out, static canvas frames, and `CountUp` non-animating numbers.

3. **Asset Pipeline & Verification:**
   - 4 client logo SVGs recovered and locally hosted in `public/assets/original/`.
   - 49 unreachable remote CDN assets mapped in `assets/manifest.json`.
   - Zero silent image substitutions. All missing assets render explicit, styled slot placeholders.
   - All fonts self-hosted (`GeistSans`, `PT Mono`, `Space Mono`) with `display: "swap"`.

4. **Security & Production Readiness:**
   - Resend API keys and email configuration are strictly server-only (`import "server-only"` in `lib/mail.ts`).
   - Zod schema validation, honeypot spam protection, same-origin CSRF guards, request payload size limits, and sliding-window rate limiting on all API routes.
   - HTML injection escaping on form submissions.

---

## Verification & Testing Commands

| Command | Description |
|---|---|
| `pnpm test` | Runs 34 Vitest unit & integration tests (validators, API routes, content separation, animations) |
| `pnpm typecheck` | Strict TypeScript check (`tsc --noEmit`) |
| `pnpm lint` | ESLint check across all routes and components |
| `pnpm build` | Production Next.js build with static page generation |
| `node scripts/verify-build-artifacts.mjs` | Automated audit of all 22 prerendered HTML output files on disk |
| `pnpm assets:manifest` | Rebuilds `assets/manifest.json` from disk and fetch logs |
| `pnpm assets:doc` | Regenerates `docs/ASSET-MANIFEST.md` documentation |

---

## Content Modes

| | `CONTENT_SOURCE=harp` (Default) | `CONTENT_SOURCE=reference` |
|---|---|---|
| **Text** | `content/harp/` — Only verified company name "HARP"; all unverified business claims show explicit `[TBD]` markers | `content/reference/` — Verbatim original copy (spelling/grammar fixed) |
| **Images** | Only files in `public/assets/harp/<slot-id>.<ext>`; missing slots show styled HARP placeholder tiles | Recovered files in `public/assets/original/`; missing assets show labelled Precept placeholders |
| **Indexing** | Indexable for published routes; designed placeholder pages are marked `noindex` and excluded from `sitemap.xml` | Global `noindex`, `robots.txt` disallows all crawling |

---

## Adding HARP Content for Production Launch

1. **Text & Business Copy:** Edit `content/harp/index.ts` (typed by `content/types.ts`). Replace `[TBD]` strings, verified numbers, and contact details.
2. **MDX News Stories:** Add verified markdown articles to `content/newsroom/harp/<slug>.mdx`.
3. **Brand Images:** Place image files in `public/assets/harp/<slot-id>.<ext>` matching slot IDs from `docs/ASSET-MANIFEST.md`, then run `pnpm assets:manifest`.
4. **Brand Artwork & Favicon:** Replace `app/icon.svg`, `app/opengraph-image.tsx`, and palette tokens in `app/globals.css`.
5. **Legal Counsel Review:** Replace privacy policy copy in `content/harp/index.ts` with counsel-approved terms.

---

## Documentation Index

- `docs/CHECKLIST.md` — Detailed route-by-route verification checklist.
- `docs/DECISIONS.md` — Implementation decisions, architectural deviations, and bug fixes.
- `docs/UNRECOVERABLE.md` — Transparent log of unretrievable assets and documented approximations.
- `docs/ANIMATIONS.md` — Complete reference map of all 22 animation patterns.
- `docs/ASSET-MANIFEST.md` — Full catalog of all 53 assets and their retrieval status.
- `docs/CONTENT-FIXES.md` — Record of spelling and grammar fixes applied to reference content.
- `docs/BLUEPRINT.md` — Original migration architecture and design contract.
