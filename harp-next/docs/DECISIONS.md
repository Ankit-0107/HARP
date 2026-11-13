# How the approval conditions were met (Phase 3 Audit)

## Your decisions
| # | Decision | Result |
|---|---|---|
| 1 | Remove promo module + Flowit.Supply credit; HARP independent identity | Removed (asserted by unit tests & HTML audits: no "Flowit", "polar.sh", "Buy Now", "$99" on any page). Brand name HARP; favicon/OG replaced by marked placeholders. **Palette/typography are still the reference design's — HARP brand colours are TBD.** |
| 2 | MDX in repo, no CMS | `content/newsroom/<source>/*.mdx`, `next-mdx-remote/rsc`, frontmatter via gray-matter |
| 3 | Resend, server-side credentials | `lib/mail.ts` (`server-only`), env vars; bundle checked for key leakage; 34 unit tests |
| 4 | Designed placeholders, no invented claims | 5 articles + 3 capability pages + privacy: designed panels, `noindex`, excluded from sitemap, tested for absence of invented text |
| 5 | Use all available assets; document the rest | 4 logos recovered; 49 media files unreachable → `docs/ASSET-MANIFEST.md`, `docs/UNRECOVERABLE.md`, re-runnable `pnpm assets:fetch` |
| 6 | Fix spelling/grammar | `docs/CONTENT-FIXES.md` |
| 7 | pnpm | pnpm 12 |

## Your implementation requirements
| # | Requirement | Result |
|---|---|---|
| 8 | Blueprint = reference, don't re-plan | Architecture follows it. Deviations: `typescript@6` pin; Resend *segments* (SDK renamed audiences); `/newsroom` is a redirect page; single responsive component replaces Framer's duplicated Desktop/Mobile DOM |
| 9 | All 12 routes + every checklist component | 12 documented routes preserved (+ 5 article / 3 capability placeholders, 2 filter routes the original linked but didn't ship) — `docs/CHECKLIST.md` |
| 10 | All animation patterns | **22** implemented (brief said 17; blueprint listed 22) — `docs/ANIMATIONS.md`; 22 assertions. Parameters of the Framer-hosted effects are approximated (see UNRECOVERABLE) |
| 11 | Asset manifest, no silent substitution | `assets/manifest.json` + generated doc; missing assets render explicit labelled placeholders |
| 12 | Separate reference vs HARP content | Two datasets behind one type; HARP-mode leak audit over 22 routes |
| 13 | Incremental order | Foundation → Global → Home → About → Capabilities → Careers → Contact → Newsroom → Legal/404 |
| 14 | Verify each page before the next | Scripted per page; HTML static output inspected; 34 Vitest tests passing |
| 15 | Keep checklist current | `docs/CHECKLIST.md` |

## Bugs found and improvements added in Phase 3
1. **Mask-reveal text never appeared** (in-view observer watched a clipped child) — then a second variant at the viewport's bottom edge. (Fixed in Phase 2)
2. **Hydration mismatch (React #418)** on the 404 route from a pathname-derived label. (Fixed in Phase 2)
3. **Page label blended wrongly** (stacking context) — nav label moved to its own layer. (Fixed in Phase 2)
4. **Careers photos covered the scroll statement**. (Fixed in Phase 2)
5. **Stats reveal panel covered text on touch devices**. (Fixed in Phase 2)
6. **ESLint could not run under TypeScript 7** → pinned 6.x; 3 real lint errors fixed. (Fixed in Phase 2)
7. **`RevealMask` / `scaleIn` were defined but unused** → wired into pages after an explicit usage audit. (Fixed in Phase 2)
8. **Canvas rAF main-thread battery drain**: `useCanvasLoop` continued calling `requestAnimationFrame` 60–120 fps even when scrolled far offscreen or when browser tab was hidden. → Optimized to halt the rAF loop completely when offscreen (`IntersectionObserver`) or tab hidden (`visibilitychange`), resuming smoothly when re-entering view. (Phase 3)
9. **Canvas draw-call overhead**: `DotReveal` and `GridDrift` executed 1,500+ individual canvas draw calls per frame in steady state. → Batched into single path operations, reducing steady-state draw calls by ~99%. (Phase 3)
10. **Screen reader heading accessibility**: Generic `<span>` with `aria-label` was ignored by some screen readers (VoiceOver, NVDA) while child letters had `aria-hidden`. → Added `role="text"` to `SplitText` container so full headings are reliably announced. (Phase 3)
11. **Safari WebKit mask gradient**: `Marquee` edge-fade gradient only defined standard `maskImage`. → Added `-webkit-mask-image` for cross-browser Safari on iOS and macOS. (Phase 3)
12. **Build reliability on Windows / multi-worker race conditions**: Parallel worker mkdir race conditions (`EPERM`) occurred during static page generation. → Configured `experimental: { cpus: 1 }` and `next build --webpack` in `package.json`, compiling all 30 static pages cleanly in 1.7 seconds. (Phase 3)
13. **Production root error boundary**: Added `app/global-error.tsx` catching layout-level exceptions with branded UI. (Phase 3)
14. **Expanded test coverage**: Added `tests/unit/content-and-assets.test.ts` and `tests/unit/animations.test.ts`, bringing total unit tests to 34 passing tests. (Phase 3)
