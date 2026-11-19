# HARP UI Cleanup — Task Checklist

> Track progress by checking boxes. Each task has acceptance criteria and verification steps.

---

## Phase 1 — Content & Data Layer

### Task 1 · Swap Careers ↔ Workshops in nav
- [x] `content/reference/index.ts` L26-27: swap Workshops before Careers in `nav.links`
- [x] `DynamicIslandNav.tsx`: swap order in `DEFAULT_DYNAMIC_ISLAND_ITEMS` (Workshops at index 2, Careers at index 3)
- [x] `DynamicIslandNav.tsx`: update `orderMap` — Workshops `/newsroom/filters/completed` = 3, Careers `/careers` = 4

**Acceptance**: Nav shows Home | Products | Workshops | [logo] | Careers | About | Contact on desktop. Mobile menu lists Workshops before Careers.
**Verify**: Visual check on desktop & mobile. `tsc --noEmit` passes.

---

### Task 2 · Category labels → Completed / Ongoing / Upcoming
- [x] `content/types.ts` L21: `category: "Completed" | "Ongoing" | "Upcoming"`
- [x] `lib/news.ts` L42: `CATEGORY_SLUGS = { completed: "Completed", ongoing: "Ongoing", upcoming: "Upcoming" }`
- [x] `lib/news.ts` L32: MDX fallback `category ?? "Completed"`
- [x] `content/harp/index.ts` L76: `categories: ["Completed", "Ongoing", "Upcoming"]`
- [x] `content/reference/index.ts` L170: `categories: ["Completed", "Ongoing", "Upcoming"]`
- [x] `content/reference/index.ts` L173-180: change each entry's `category` to new values
- [x] `content/harp/index.ts` L85: entries inherit from reference — verify new categories propagate
- [x] Grep MDX files in `content/newsroom/` for `category:` frontmatter — verified

**Acceptance**: Workshop filter page shows pills: Completed | Ongoing | Upcoming. URLs are `/newsroom/filters/completed`, `/ongoing`, `/upcoming`. No TypeScript errors.
**Verify**: `tsc --noEmit`, `next build` generates new filter routes.

---

### Task 3 · Remove TBD eyebrow + intro from products page
- [x] `content/harp/index.ts` L56: `intro: ""`, `eyebrow: ""`
- [x] `app/capabilities/page.tsx` L17: wrap intro in `{k.intro ? ... : <div />}`
- [x] `app/capabilities/page.tsx` L19: wrap eyebrow in `{k.eyebrow ? ... : null}`

**Acceptance**: Products page shows no eyebrow and no intro paragraph in HARP mode. Reference mode still shows them.
**Verify**: `tsc --noEmit`, visual check.

---

### Task 4 · Remove TBD tags from capability rows
- [x] `CapabilityRow.tsx` L16: show only `{item.index}` when `item.tag === "TBD"` or empty, otherwise `{item.index} — {item.tag}`
- [x] `app/capabilities/[slug]/page.tsx` L33: same conditional for detail page eyebrow
- [x] `app/capabilities/[slug]/page.tsx` L90: same for "More products" list

**Acceptance**: Capability rows show "01", "02", etc. with no "— TBD" suffix. Reference mode still shows "01 — ASSEMBLY", etc.
**Verify**: `tsc --noEmit`, visual check.

---

### 🔲 Phase 1 Checkpoint
- [x] `npm --prefix harp-next run typecheck` — exit 0
- [x] `npm --prefix harp-next run lint` — exit 0
- [x] `npm --prefix harp-next test` — all pass
- [x] `npm --prefix harp-next run build` — exit 0, all 30 routes generated

---

## Phase 2 — Component Removals & Archival

### Task 5 · Unlink slideshow
- [x] `ProductSlider.tsx` L29: remove `{s.href && <PixelButton ...>}` block
- [x] `ProductSlider.tsx`: remove `PixelButton` import
- [x] `content/harp/index.ts` L40: set all slide `href` to `undefined`
- [x] Asset placeholder BG text in slides suppressed via `Img.tsx showLabel = false`

**Acceptance**: Slideshow cycles through slides with no "Learn More" button, no routing on click/tap, no grey placeholder text.
**Verify**: `tsc --noEmit`, visual check on home page.

---

### Task 6 · Archive IndustriesIndex
- [x] Copy `components/sections/capabilities/IndustriesIndex.tsx` → `components/archive/IndustriesIndex.tsx`
- [x] `app/capabilities/page.tsx` L7: comment out import with explanation
- [x] `app/capabilities/page.tsx` L24: comment out `<IndustriesIndex>` with explanation
- [x] Verify no other page imports `IndustriesIndex`

**Acceptance**: Products page no longer renders the Industries section. Component preserved in `components/archive/`.
**Verify**: `tsc --noEmit`, `next build`.

---

### Task 7 · Remove PreFooterCta from contact page
- [x] `app/contact/page.tsx` L45: remove `<PreFooterCta ...>` line
- [x] `app/contact/page.tsx` L3: remove unused `PreFooterCta` import

**Acceptance**: Contact page ends after the form section — no TBD CTA grid at the bottom.
**Verify**: `tsc --noEmit`, visual check.

---

### Task 8 · Remove footer background placeholder text
- [x] `Footer.tsx` L12: remove `<Img assetId="footer-background" ...>` (renders placeholder text)
- [x] `Footer.tsx`: remove unused `Img` import
- [x] Keep the HARP ROBOTICS Skywall wordmark untouched

**Acceptance**: Footer has solid black background with no grey placeholder text visible. HARP ROBOTICS wordmark still present.
**Verify**: Visual check, `tsc --noEmit`.

---

### Task 9 · Clean 404 page placeholder text
- [x] `HeroVideo.tsx`: remove placeholder text overlay paragraph
- [x] `Img.tsx`: `AssetPlaceholder` defaults `showLabel = false`
- [x] "harp hero video slot" and "hero image slot" removed from 404 page

**Acceptance**: 404 page shows dark background with the 404 message — no grey placeholder text.
**Verify**: Visit `/nonexistent-route`, visual check.

---

### 🔲 Phase 2 Checkpoint
- [x] `npm --prefix harp-next run typecheck` — exit 0
- [x] `npm --prefix harp-next run lint` — exit 0
- [x] `npm --prefix harp-next test` — all pass
- [x] `npm --prefix harp-next run build` — exit 0

---

## Phase 3 — Workshop Page Cleanup

### Task 10 · Categories cards on home page
- [x] Restored titles: "Products", "Workshops", "3D Printing"
- [x] Restored background images: `Products.webp`, `Workshops.webp`, `3D_Printing_Services.webp`
- [x] Restored links: `/capabilities`, `/newsroom`, `/404`

**Acceptance**: Home page Categories section shows Products, Workshops, and 3D Printing expandable cards with background images.
**Verify**: Visual check on home page, `tsc --noEmit`.

---

### Task 11 · Disconnect timeline/milestone/categories from workshop routing
- [x] Checked `Timeline.tsx`: zero links to `/newsroom`
- [x] Checked `milestones`: no links to `/newsroom`
- [x] Workshop categories are standalone filter tabs (Completed, Ongoing, Upcoming)

**Acceptance**: No timeline, milestone, or category component links to any workshop/newsroom page.
**Verify**: Grep audit, `tsc --noEmit`.

---

### 🔲 Phase 3 Checkpoint
- [x] `npm --prefix harp-next run typecheck` — exit 0
- [x] `npm --prefix harp-next run lint` — exit 0
- [x] `npm --prefix harp-next test` — all pass
- [x] `npm --prefix harp-next run build` — exit 0, all routes generated

---

## Final Sign-off
- [x] All 11 tasks completed
- [x] All 3 phase checkpoints green
- [x] Desktop nav layout unchanged
- [x] No new ESLint suppressions or `@ts-ignore`

---

### 🔲 Phase 3 Checkpoint
- [ ] `npm --prefix harp-next run typecheck` — exit 0
- [ ] `npm --prefix harp-next run lint` — exit 0
- [ ] `npm --prefix harp-next test` — all pass
- [ ] `npm --prefix harp-next run build` — exit 0, all routes generated

---

## Final Sign-off
- [ ] All 11 tasks completed
- [ ] All 3 phase checkpoints green
- [ ] Desktop nav layout unchanged
- [ ] No new ESLint suppressions or `@ts-ignore`
