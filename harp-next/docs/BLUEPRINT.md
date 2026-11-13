# Precept: Framer → Next.js Migration Blueprint (Phase 1)

Status: **DRAFT FOR REVIEW. No implementation code exists yet.**
Source: `precept_framer_website-framer-full-20261027143000.zip` (467 KB zipped, 3.27 MB unzipped, 12 files)
Target: Next.js (App Router) · React · TypeScript · Node.js · Tailwind CSS · Motion for React

---

## 0. Critical findings (read first)

1. **The ZIP is rendered output only.** It contains 12 `index.html` files (Framer SSR snapshots). There are **no** separate CSS, JS, image, font, or video files.
2. **All behaviour lives in remote Framer bundles** (`framerusercontent.com/sites/5ZcZIpAPaPd2C3xDpf6sTv/*.mjs`, ~27 modules including `motion`, `framer`, `react`, `DotReveal`, `GridDrift`, `PixelButton`, `Real_time_world_clock`, `Video`, and ~15 hashed component modules). They are not in the ZIP and were not reachable from my sandbox. Interactive logic (orbit scroll, sliders, canvas effects, counters) therefore has to be **reconstructed from rendered DOM, inline styles, and observed behaviour**, not copied.
3. **Assets are hot-linked** (160 `framerusercontent.com` references, 21 `<img>` + 1 `<video>` on the home page alone). They must be downloaded and self-hosted. I need network access to that host, or you supply an asset export.
4. **5 article pages and 2 category pages are linked but missing from the ZIP** (see §2.2).
5. **This is a Framer template** (footer credit "by Flowit.Supply", "Precept™ from $99 / Buy Now" promo module linking to polar.sh). Please confirm you hold a licence that permits re-implementation, and that the template promo module should be **dropped** (my default).

---

## 1. Inventory

### 1.1 Pages in ZIP

| # | Source file | Route | Title | HTML size | Canvas | Video | Notes |
|---|---|---|---|---|---|---|---|
| 1 | `index.html` | `/` | Precept — Robotics-Driven Manufacturing | 484 KB | 5 | 1 | Hero, About, slider, orbit, stats, testimonials, ticker, newsroom, CTA |
| 2 | `about/index.html` | `/about` | About | 334 KB | 14 | 0 | Timeline, leadership (12 people), 5 locations, contact block |
| 3 | `capabilities/index.html` | `/capabilities` | Capabilities | 242 KB | 2 | 0 | 4 capability rows, industries list |
| 4 | `capabilities/precision-machining/index.html` | `/capabilities/precision-machining` | Precision Machining | 250 KB | 3 | 0 | Detail template (only 1 of 4 exists) |
| 5 | `careers/index.html` | `/careers` | Careers | 337 KB | 3 | 0 | Scroll section, cards, photo ticker, open positions |
| 6 | `contact/index.html` | `/contact` | Contact | 224 KB | 2 | 0 | Contact form + emails + HQ |
| 7 | `newsroom/filters/all/index.html` | `/newsroom/filters/all` | All — Newsroom | 251 KB | 2 | 0 | 8-item grid with category filter |
| 8 | `newsroom/axlon-two-platforms-one-line/` | `/newsroom/[slug]` | How Axlon Brought Two Platforms… | 238 KB | 3 | 0 | CMS article |
| 9 | `newsroom/aerix-every-part-inspection/` | `/newsroom/[slug]` | Every-Part Inspection… Aerix | 239 KB | 3 | 0 | CMS article |
| 10 | `newsroom/automation-should-fit-your-line/` | `/newsroom/[slug]` | Automation Should Fit Your Line… | 238 KB | 3 | 0 | CMS article |
| 11 | `privacy/index.html` | `/privacy` | Privacy Policy | 216 KB | 1 | 0 | Sticky two-column legal |
| 12 | `404/index.html` | `not-found` | Page Not Found | 212 KB | 2 | 1 | Also linked in footer nav as a normal page |

### 1.2 Referenced but missing

| Link target | Evidence | Plan |
|---|---|---|
| `/newsroom/cargon-automated-floor-peak` | Newsroom grid: "How Cargon Automated Its Floor Before Peak Season" (Jan 22 2026) | Create route + **placeholder body, awaiting your copy** |
| `/newsroom/voltan-robotic-field-inspection` | "Taking People Off the Turbine at Voltan" (Dec 5 2025) | same |
| `/newsroom/why-we-build-our-own-lines` | Article, Nov 14 2025 | same |
| `/newsroom/reshoring-only-works-if-you-automate` | Article, Oct 9 2025 | same |
| `/newsroom/repeatable-to-the-millimeter` | Article, Sep 3 2025 | same |
| `/newsroom/filters/article`, `/newsroom/filters/case-study` | Filter links in grid | Implement via dynamic `[category]` route |
| 3 other capability pages (Robotic Assembly, Automated Inspection, System Integration) | `/capabilities` rows 01/02/04 | Data-driven template; **content needed** |
| Individual job postings | Careers "Open Positions" | Confirm: link out, or static list only |

### 1.3 Assets

- **Fonts:** Geist (weights 300–900 incl. italic 400, Google/gstatic woff2, 5 unicode subsets), PT Mono, SF Mono (system fallback). → `next/font` (Geist + PT Mono), self-hosted.
- **Images:** raster `.jpg/.webp` (e.g. 2969×1670 hero, 2324×3486 portrait, 1600×2400, 2400×1800), small `.svg` icons, favicon PNG, OG image PNG. → download to `public/images/`, rendered with `next/image`.
- **Video:** one looping muted autoplay MP4 with WebP poster (home hero). → `public/video/`, poster preload.
- **Inline SVG:** 23–24 per page, mostly client logos as `data:image/svg+xml` backgrounds (Logo 1/2/5/6) and arrow/icon glyphs. → extract to `components/icons/*.tsx` and `components/logos/*.tsx`.
- **Third-party:** Framer search index JSON (drop), Framer editor-bar CSS (drop).

### 1.4 Dependencies detected

Framer runtime (React, Framer Motion/`motion`, Framer components), **Lenis** (`html.lenis`). No analytics, no tracking scripts, no CMS API calls. Forms have no `action`/endpoint (Framer client handler), so backend wiring is needed.

---

## 2. Design system (extracted)

**Breakpoints** (Framer): Desktop ≥1200 · Tablet 810–1199 · Mobile ≤809 · extra orbit break ≤639. Content max-width 1800 px.
→ Tailwind v4 `@theme`: `--breakpoint-md: 810px; --breakpoint-xl: 1200px;` plus custom `xs: 640px`. Mobile-first.

**Colour tokens (most used):** `#000`, `#fff`, `#111`, `#171717`, `#1e1e1f`, `#1f1f1f`, `#333`, `#424242`, `#474747`, `#595959`, `#858585`, `#aaa`, `#c9c9c9`, `#e4e4e4`, `#f3f3f1`, accent **`#c8fa00`** (lime), `#09f` (focus/accent, 4 uses). ~60 Framer `--token-*` variables in total, mostly duplicates. → consolidate to a semantic palette in `globals.css`.

**Typography:** Geist 300/400/500/600/700/900; PT Mono for labels/numbers. Hero H1: 5rem, weight 500, letter-spacing −0.07em, line-height 0.8. Orbit step number 64 px / title 32 px (38.4 / 19.2 px on ≤639).

**Motion tokens:** one dominant easing `cubic-bezier(0.16, 1, 0.3, 1)` ("expo-out"), 0.5–0.6 s for background/colour/border/shadow, 0.55 s for transforms, 0.5 s for opacity+transform. → `lib/motion.ts` (`ease`, `durations`, reusable variants).

---

## 3. Global systems

| System | Observed behaviour | React/TS equivalent |
|---|---|---|
| **Curtain boot** | Black fixed overlay (`z-index:2147483600`), **home only**, removed on load, 10 s safety timeout | `components/layout/BootCurtain.tsx` (client) + AnimatePresence exit; also respects reduced motion |
| **Smooth scroll** | Lenis on `<html>` | `components/providers/SmoothScroll.tsx` (Lenis, disabled on reduced motion) |
| **Navigation / menu** | Glass panel: `blur(24px) saturate(1.8)`, 1px translucent border, 2 px radius, collapsed header + expanding panel, chevron animation, staggered reveal items (Home, About, Capabilities, Newsroom, Careers, Contact), "Precept Industrial" label, FOLLOW US (Instagram, Facebook, LinkedIn, X), breadcrumb-style "/ HOME" page label; pointer-events carefully managed | `components/layout/SiteNav.tsx` (client; Motion `layout`/height animation; focus trap, Esc, aria-expanded) |
| **Footer** | Menu list, Socials, Newsletter (email + honeypot inputs), Flowit.Supply credit, ©2026, Privacy link, live **world clock** | `Footer.tsx`, `NewsletterForm.tsx`, `WorldClock.tsx` |
| **Template promo ("Buy Template Module")** | "Precept™ from $99 · Buy Now" | **Drop** (pending approval) |
| **Pre-footer CTA** | "Let's build it right." + "Get in touch" pixel button | `PreFooterCta.tsx` |
| **Page-link current state** | `data-framer-page-link-current` | `usePathname()` active state |
| **SSR dual variants** | Desktop/Mobile variants both in DOM, toggled by `hidden-*` classes (e.g. the newsroom marquee and process orbit) | Single responsive component; no duplicated DOM |

---

## 4. Animation / interaction catalogue

Confirmed from markup and CSS:

| # | Effect | Evidence | Implementation |
|---|---|---|---|
| A1 | **Per-letter hero headline** ("BUILD / BETTER"): letters are `inline-block` with opacity + `filter: blur()` + transform | Hero `<h1>` spans | `SplitText` util + Motion `stagger` variants |
| A2 | Per-letter reveal on page headings ("Built For Tomorrow", "Our Capabilities", "Careers", etc.) | Char-split H1 on About/Capabilities/Careers/Precision Machining/articles | Same `SplitText` |
| A3 | Word-by-word testimonial quote reveal | Words split into spans with spaces | `SplitText mode="words"` |
| A4 | Mask-slide reveals (`translateY(110%)`/`100%` inside overflow clip) | 20 occurrences | `RevealMask` |
| A5 | Scale-in (`scale(0)`) for dots/markers | 13 occurrences | Motion variants |
| A6 | `scaleX(0)` underline/line draws | 5 occurrences + 11 "Underline" layers | `HoverUnderline`, `DrawLine` |
| A7 | Fade-up on scroll/appear (`opacity:0; translateY(25px)`), e.g. forms | 59 `opacity:0` initial states | `Reveal` (`whileInView`, once) |
| A8 | Button/hover transitions (bg 0.6 s, transform 0.55 s; 65 `:hover` rules, guarded by `@media (hover:hover)`) | CSS | Tailwind `hover:` + `[@media(hover:hover)]` |
| A9 | **PixelButton** (canvas, 69–74 × 14 px sized) | `<canvas aria-hidden>` per CTA | `PixelButton.tsx` canvas component |
| A10 | **DotReveal** + **GridDrift** canvas backgrounds (800×600 / 800×995) | module names + canvases | `DotReveal.tsx`, `GridDrift.tsx` (rAF, DPR-aware, paused off-screen) |
| A11 | **Process Orbit**: 500 svh tall sticky scroller, `role="region" aria-label="Process steps"`, 5 steps, number+title+body, progress-driven | inline structure | `ProcessOrbit.tsx` using `useScroll` + `useTransform` |
| A12 | Product/Capability slider ("1 / 5" counter) | hero-slider | `ProductSlider.tsx` (drag + buttons + keyboard) |
| A13 | Testimonial slider ("1 / 4") | Testimonials | `TestimonialSlider.tsx` |
| A14 | Stats with count-up (99.6 %, 3.2×, 40M+, 11) | Stats | `CountUp` using `useInView` + `animate` |
| A15 | Client logo ticker: edge mask `0 → 3.5 % … 96.5 % → 100 %`, gap 5 px, translateX loop | inline style | `Marquee.tsx` (pause on hover, reduced-motion → static) |
| A16 | Newsroom marquee (items repeated 4× in DOM) | Newsroom (Mobile) | `Marquee` with deduped data |
| A17 | Hero video autoplay/loop/muted/playsInline with poster | `<video>` | `HeroVideo.tsx` (pause when hidden/reduced motion) |
| A18 | Sticky sections (`position:sticky; top:0`) on article/privacy left column, careers scroll section | CSS | Tailwind `sticky top-0` |
| A19 | Photo gallery ticker (careers) | "Gallery Ticker" | `Marquee` |
| A20 | Fixed image parallax (about "Fixed Image") | name only | `useScroll` parallax (to verify visually) |
| A21 | Glass menu transitions + chevron | `.gnR7dqop` CSS | Motion |
| A22 | Reduced motion | Only the nav honours `prefers-reduced-motion` | **Improve:** global `MotionConfig reducedMotion="user"` |

**Not recoverable from the export:** exact stagger delays, spring parameters, scroll ranges for the orbit, canvas algorithm details (dot density, drift speed, pixel pattern). I will match them visually against the live site; **please share a screen recording or the live URL / `.mjs` files** for pixel-accurate timings.

---

## 5. Page content map (high level)

- **Home:** Hero (BUILD BETTER, 4 meta items: Made in USA · Facilities 06 · Deployed 40+ countries · Operating since 2012, video) → About Us ("What we are" / "Why it matters", Learn More) → Product slider (Precision Machining, Aerospace & Defense, … 5 slides) → Capable Industries → Process Orbit (Understand, Plan, Build, Integrate, Support) → Stats (Reliability 99.6 %, Throughput 3.2×, Scale 40M+, Reach 11) → Testimonials (Axlon, 4 items) → Clients ticker → Newsroom (3 latest) → Pre-footer CTA → Footer.
- **About:** Header "Built For Tomorrow", Timeline (2017, 2020, 2022, 2024, …), Leadership (12), Locations (New York, London, Los Angeles, Copenhagen, Austin with emails), Contact (General / Media / IR).
- **Capabilities:** 4 rows (Assembly, Inspection, Machining, Integration), Industries list (Automotive: body welding, assembly cells, part inspection; Aerospace; …).
- **Precision Machining:** Overview, 4 numbered services, systems list (CNC machining center, Robotic load/unload, Tool management, In-process metrology).
- **Careers:** Hero, values cards 01–04, team photos, gallery ticker, open positions.
- **Contact:** Emails (General, IR), form (Name, Email, Message) + honeypots, HQ: 1 Bush Terminal, Building 21, Brooklyn, NY 11232.
- **Newsroom:** 8 entries, category filter (All / Case Study / Article); 3 article bodies exist; authors David Reyes, Sarah Collins; sticky author column.
- **Privacy / 404:** static content.

---

## 6. Content defects found in source (will be corrected unless you object)

- `LND@precpet.com` (typo, About locations) → `precept.com`
- "Investor Realtions" → "Investor Relations"
- Canonical tag is `href="index.html"` (relative, wrong) → absolute canonical per page
- Footer nav lists **"404"** as a menu item → remove
- Stale SSR timestamps in world clock (`10:30:07 AM`) → live client clock, hydration-safe
- Contact form includes 9–11 honeypot-like hidden fields (`website, company, subject, …`) → one honeypot + server-side validation
- No form backend, no privacy-consent link on newsletter

---

## 7. Proposed architecture

```
precept-next/
├─ app/
│  ├─ layout.tsx                  # fonts, providers, nav, footer, metadata base
│  ├─ globals.css                 # Tailwind v4 @theme tokens
│  ├─ page.tsx                    # Home
│  ├─ not-found.tsx
│  ├─ sitemap.ts · robots.ts
│  ├─ about/page.tsx
│  ├─ capabilities/
│  │  ├─ page.tsx
│  │  └─ [slug]/page.tsx          # precision-machining + 3 more (generateStaticParams)
│  ├─ careers/page.tsx
│  ├─ contact/page.tsx
│  ├─ privacy/page.tsx
│  ├─ newsroom/
│  │  ├─ page.tsx                 # redirects/aliases to /newsroom/filters/all
│  │  ├─ filters/[category]/page.tsx   # all | article | case-study
│  │  └─ [slug]/page.tsx
│  └─ api/
│     ├─ contact/route.ts         # zod validation, honeypot, rate limit, email provider
│     └─ newsletter/route.ts
├─ components/
│  ├─ layout/    SiteNav, Footer, PreFooterCta, BootCurtain, PageLabel
│  ├─ sections/  home/(Hero, AboutIntro, ProductSlider, CapableIndustries,
│  │             ProcessOrbit, Stats, Testimonials, ClientsTicker, NewsroomPreview)
│  │             about/(Timeline, Leadership, Locations) capabilities/… careers/… news/…
│  ├─ ui/        Button, PixelButton, Marquee, Reveal, RevealMask, SplitText,
│  │             CountUp, Slider, Counter, Input, Textarea, FormField
│  ├─ canvas/    DotReveal, GridDrift
│  ├─ media/     HeroVideo, Img (next/image wrapper)
│  ├─ icons/ · logos/
│  └─ providers/ SmoothScroll, MotionProvider
├─ content/                       # typed data (no CMS dependency)
│  ├─ site.ts · nav.ts · stats.ts · timeline.ts · team.ts · locations.ts
│  ├─ capabilities.ts · industries.ts · testimonials.ts · jobs.ts
│  └─ newsroom/*.mdx  (frontmatter: title, date, category, author, summary)
├─ lib/  motion.ts · cn.ts · seo.ts · env.ts · validators.ts · rate-limit.ts
├─ hooks/  useReducedMotion, useInViewOnce, useMediaQuery
├─ public/  images/ video/ fonts/ og/
├─ tests/  unit/ (vitest) · e2e/ (playwright)
└─ docs/  BLUEPRINT.md · CHECKLIST.md
```

**Key strategies**
- **Server Components by default**; `"use client"` only for nav, sliders, orbit, canvas, marquee, forms, Lenis.
- **Content as typed data / MDX** for newsroom (SSG with `generateStaticParams`), preserving current URLs.
- **Image pipeline:** downloaded originals → `next/image` with explicit sizes; WebP/AVIF; LCP image priority.
- **SEO:** per-page `generateMetadata`, absolute canonicals, OG/Twitter, JSON-LD (Organization, Article), sitemap/robots.
- **Accessibility:** semantic landmarks, focus-visible, nav focus trap, `aria-hidden` on decorative canvases, global reduced-motion.
- **Performance:** dynamic-import canvas + orbit, pause rAF off-screen, Lenis disabled on touch if needed.
- **Forms:** Zod + Route Handlers; provider-agnostic mail adapter (Resend/SMTP) behind env vars.
- **URL parity:** keep `/newsroom/filters/all` and trailing-slash-less equivalents; add redirects for old `*/index.html`.

## 8. Dependencies (versions pinned at implementation time to latest stable)

`next`, `react`, `react-dom`, `typescript`, `tailwindcss` (v4) + `@tailwindcss/postcss`, **`motion`** (import from `motion/react`), `lenis`, `geist` or `next/font/google`, `clsx`, `tailwind-merge`, `zod`, `react-hook-form` + `@hookform/resolvers`, `@next/mdx` (or `next-mdx-remote`), `gray-matter`, `eslint` + `eslint-config-next`, `prettier`, `vitest` + `@testing-library/react`, `@playwright/test`. Optional: `resend`, `@upstash/ratelimit`.
Node: current LTS.

---

## 9. Component conversion checklist

Legend: ☐ todo. Each item = port markup → typed props → responsive → animation → a11y → visual QA vs source.

**Foundation**
- ☐ Project scaffold, TS strict, ESLint/Prettier, Tailwind v4 theme tokens
- ☐ Fonts (Geist, PT Mono) via `next/font`
- ☐ Asset download script → `public/` + manifest of original→local paths
- ☐ `lib/motion.ts`, `MotionProvider` (reducedMotion), `SmoothScroll`
- ☐ Primitives: `SplitText`, `Reveal`, `RevealMask`, `Marquee`, `CountUp`, `Slider`

**Global**
- ☐ SiteNav (glass menu) · ☐ PageLabel · ☐ Footer · ☐ NewsletterForm · ☐ WorldClock
- ☐ PreFooterCta · ☐ PixelButton · ☐ BootCurtain · ☐ not-found
- ☐ (Dropped) Template promo module

**Home**
- ☐ Hero (letters, meta row, video) · ☐ DotReveal · ☐ GridDrift · ☐ AboutIntro
- ☐ ProductSlider · ☐ CapableIndustries · ☐ ProcessOrbit · ☐ Stats
- ☐ Testimonials · ☐ ClientsTicker (+ 4–6 logo SVGs) · ☐ NewsroomPreview

**About**: ☐ Header · ☐ Fixed image · ☐ Timeline · ☐ Leadership grid · ☐ Locations · ☐ Contact block
**Capabilities**: ☐ Index (4 rows) · ☐ Industries · ☐ Detail template (Overview, Services, Systems) · ☐ 3 extra pages (content TBD)
**Careers**: ☐ Header · ☐ Scroll section · ☐ Value cards · ☐ Team photos · ☐ Gallery ticker · ☐ Open positions
**Contact**: ☐ Form + API route + spam protection · ☐ Details/HQ
**Newsroom**: ☐ Grid · ☐ Category filters (3 routes) · ☐ Article template (sticky author column) · ☐ 3 existing articles · ☐ 5 placeholder articles
**Legal**: ☐ Privacy
**Cross-cutting**: ☐ Metadata/OG per page · ☐ sitemap/robots · ☐ redirects · ☐ a11y audit · ☐ Lighthouse · ☐ unit + e2e tests · ☐ visual comparison at 1440 / 1024 / 390 px · ☐ README + env docs

---

## 10. Risks and open questions

| Risk | Impact | Mitigation |
|---|---|---|
| Framer JS not in ZIP | Animation timings, canvas visuals, slider/orbit behaviour approximated | Provide live URL, screen recordings or `.mjs` files |
| Hot-linked assets | Cannot self-host without download | Grant network access to `framerusercontent.com` or send asset folder |
| Template licence / branding | Legal exposure | Confirm licence; drop promo module and Flowit.Supply credit if required |
| Missing pages/content (5 articles, 3 capabilities, jobs) | Broken links | Placeholders now, real copy later |
| Framer layout uses absolute/percent constraints | Pixel drift | Rebuild with flex/grid, verify via screenshots |
| Duplicate desktop/mobile DOM | Doubled content, SEO noise | Single responsive tree |
| Forms have no backend | Non-functional submit | Route Handlers + email provider (needs your choice) |
| Lenis + sticky/orbit interplay | Scroll jank | Test; fallback to native scroll |
| Canvas effects on low-end devices | Performance | rAF throttling, DPR cap, off-screen pause |
| Hydration mismatch (clock, random canvas) | Console errors | Client-only mount for time/canvas |

**Decisions needed from you**
1. Drop the "Buy Template" promo module and Flowit.Supply credit? (default: drop promo, keep or replace credit per licence)
2. Newsroom: static MDX in repo (default) or a headless CMS?
3. Email provider for contact/newsletter (Resend / SMTP / other)?
4. Placeholders for missing articles/capabilities, or will you supply copy?
5. Can you provide the live URL / `.mjs` bundles / recordings for animation fidelity, and network access for asset download?
6. Fix the typos listed in §6?
7. Package manager preference (pnpm default)?

## 11. Phases

- **Phase 2 (after approval):** scaffold → tokens/fonts/assets → primitives → global layout → pages in order Home → About → Capabilities → Careers → Contact → Newsroom → Legal/404.
- **Phase 3:** QA (visual diff, a11y, Lighthouse, tests), SEO, perf tuning, deployment notes.
