# HARP UI Cleanup — Implementation Plan

> **Scope**: 11 changes across content, components, and routing.
> **Constraint**: Desktop nav layout must not change. All changes must pass `tsc --noEmit`, `eslint .`, `vitest run`, and `next build`.

---

## Phase 1 — Content & Data Layer (no component changes)

Changes that only touch content files, type definitions, and lib utilities. No JSX edits.

### Task 1 · Swap Careers ↔ Workshops in nav (XS)

**Files**: `content/reference/index.ts` L26-27, `DynamicIslandNav.tsx` L228-234

The nav link order comes from `reference.nav.links` (used by both datasets via `slotImages`). The `DynamicIslandNav` also has a hardcoded `DEFAULT_DYNAMIC_ISLAND_ITEMS` and an `orderMap` that pins position.

**Plan**:
1. In `content/reference/index.ts`, swap the `Workshops` and `Careers` entries in `nav.links` so Workshops comes before Careers.
2. In `DynamicIslandNav.tsx`, update `DEFAULT_DYNAMIC_ISLAND_ITEMS` order and the `orderMap` so `/newsroom/filters/all` (Workshops) is position 3 and `/careers` is position 4.

**Risk**: Desktop Dynamic Island layout has symmetrical L/R split around the logo. After swap, left side = Home, Products, Workshops; right side = Careers, About, Contact. The midIndex split logic is automatic, so this just works.

---

### Task 2 · Change category labels: Article/Case Study → Completed/Ongoing/Upcoming (S)

**Files**: `lib/news.ts` L42, `content/types.ts` L21, `content/harp/index.ts` L76, `content/reference/index.ts` L170

**Plan**:
1. `content/types.ts` L21: Change `NewsEntry.category` union from `"Article" | "Case Study"` to `"Completed" | "Ongoing" | "Upcoming"`.
2. `lib/news.ts` L42: Change `CATEGORY_SLUGS` to `{ all: "All", completed: "Completed", ongoing: "Ongoing", upcoming: "Upcoming" }`.
3. `content/harp/index.ts` L76: Change `categories` array to `["All", "Completed", "Ongoing", "Upcoming"]`.
4. `content/reference/index.ts` L170: Same change to `categories`.
5. Update all `NewsEntry` data: in `reference` entries (L173-180), change each `category: "Article"` or `"Case Study"` to one of the new values. In `harp` entries (L79-90), the entries inherit `e.category` from reference — update the reference source categories.
6. `lib/news.ts` L32: The MDX frontmatter fallback `category ?? "Article"` → change to `category ?? "Completed"`.
7. URL routes change: `/newsroom/filters/article` → `/newsroom/filters/completed`, etc. The `generateStaticParams` reads `CATEGORY_SLUGS` keys, so this is automatic.

**Risk**: Existing MDX files with `category: "Article"` frontmatter will not match the new type. Grep for `.mdx` files and update. Also check `NewsCard` for any hardcoded category display.

---

### Task 3 · Remove TBD eyebrow + intro from products page (XS)

**Files**: `content/harp/index.ts` L56, `app/capabilities/page.tsx` L17-19

**Plan**:
1. `content/harp/index.ts` L56: Set `intro: ""` and `eyebrow: ""` (empty strings, not `[TBD]`).
2. `app/capabilities/page.tsx`: Wrap the intro paragraph (L17) and eyebrow (L19) in conditional rendering — only show if the string is non-empty.

**Why condition instead of delete**: The reference dataset still has real content; conditionals keep both datasets working.

---

### Task 4 · Remove TBD tags from capability rows (XS)

**Files**: `components/sections/capabilities/CapabilityRow.tsx` L16, `app/capabilities/[slug]/page.tsx` L33 + L90

Currently shows `{item.index} — {item.tag}`. When tag is "TBD", only show the number.

**Plan**:
1. `CapabilityRow.tsx` L16: Change to `{item.tag && item.tag !== "TBD" ? `${item.index} — ${item.tag}` : item.index}`.
2. `app/capabilities/[slug]/page.tsx` L33: Same logic for the detail page eyebrow.
3. `app/capabilities/[slug]/page.tsx` L90: Same for the "More products" list items.

---

## Phase 2 — Component Removals & Archival

### Task 5 · Unlink slideshow: remove routing + Learn More button + BG text (S)

**Files**: `components/sections/home/ProductSlider.tsx` L24-29, `content/harp/index.ts` L40

**Plan**:
1. Remove the `PixelButton` and its conditional (L29): delete `{s.href && <PixelButton href={s.href} variant="light">Learn More</PixelButton>}`.
2. Remove the `PixelButton` import if unused elsewhere in this file.
3. The `Img` component renders asset placeholder BG text ("HARP image slot — [TBD]") when no real image is mapped. To suppress: either map real images to these assetIds, or add a prop to `Img`/`AssetPlaceholder` to suppress the label text. Simpler: in `content/harp/index.ts` L40, remove the `href` from every slide so the slider never links anywhere.
4. The `href` on slides already has `href: i === 1 ? "/capabilities/precision-machining" : undefined` — set all to `undefined`.

**Note**: BG text in slides is the asset placeholder rendered by `AssetPlaceholder`. If the user wants to hide the grey text shown when no image exists, we can set `aria-hidden` on the placeholder text or render an empty dark background instead. We'll ask during implementation if needed.

---

### Task 6 · Archive IndustriesIndex from products page (S)

**Files**: `app/capabilities/page.tsx` L7+L24, `components/sections/capabilities/IndustriesIndex.tsx`

**Plan**:
1. Copy `IndustriesIndex.tsx` to `components/archive/IndustriesIndex.tsx` (preserves the component for future use).
2. In `app/capabilities/page.tsx`: comment out or remove the import (L7) and the `<IndustriesIndex>` render (L24). Follow the same pattern used for `ProcessOrbit` and `CapableIndustries` (comment with explanation).
3. Keep the original file at its current location if other pages import it; otherwise delete and archive.

---

### Task 7 · Remove PreFooterCta from contact page (XS)

**Files**: `app/contact/page.tsx` L3+L45

**Plan**:
1. Remove `<PreFooterCta>` from L45.
2. Remove unused import from L3.
3. The contact page CTA heading comes from `c.nav.cta.heading` which is `[TBD] closing call to action` — removing the component removes the entire TBD section.

---

### Task 8 · Remove BG text from footer (XS → S depending on scope)

**Files**: `components/layout/Footer.tsx` L12-13, L33-44

The user said "REMOVE BG TEXT from the LAST PAGE". Two candidates:
- **L12-13**: The `<Img assetId="footer-background">` and overlay — this renders the asset placeholder text "HARP image slot — [TBD] FOOTER-BACKGROUND".
- **L33-44**: The giant "HARP ROBOTICS" Skywall wordmark (added in an earlier task per user request).

**Interpretation**: "BG TEXT" most likely refers to the asset placeholder text from L12 (the grey text reading "HARP image slot — [TBD]" visible behind the footer content), **not** the decorative HARP ROBOTICS wordmark which was specifically requested earlier.

**Plan**:
1. Remove L12 (`<Img assetId="footer-background">`) — it currently renders only placeholder text since no real footer background image is mapped.
2. Keep L13 (the dark overlay `bg-black/60`) or adjust to `bg-black` since there's no background image to show through.
3. Keep the HARP ROBOTICS wordmark (L33-44) untouched.

---

### Task 9 · Clean 404 page placeholder text (XS)

**Files**: `app/not-found.tsx` L14

**Current state**: The 404 page uses `<HeroVideo videoId="notfound-video">`. If no video is mapped, the `HeroVideo` component (or its `Img` fallback) renders placeholder text like "HARP image slot — [TBD]" or "HERO VIDEO SLOT".

**Plan**:
1. Check `HeroVideo` component for placeholder rendering. If it uses `AssetPlaceholder`, suppress the text by either:
   - Mapping a real dark video/image to `notfound-video`, or
   - Adding `className="[&_.tbd]:hidden"` to suppress TBD labels, or
   - Replacing `<HeroVideo>` with a plain black background div.
2. The user specifically mentioned "harp hero video slot" and "hero image slot" — these are `AssetPlaceholder` labels. Remove or hide them.

---

## Phase 3 — Workshop Page Cleanup

### Task 10 · Remove/rename Products/Workshops/3D Printing tiles on workshop page (S)

**Files**: `components/sections/home/NewsroomExpandCards.tsx` L39-43 + L85, `content/harp/index.ts` L79-90

The cards on the **home page** show 3 entries titled "Products", "Workshops", "3D Printing" with `CARD_LINKS` pointing to `/capabilities`, `/newsroom`, `/404`. These same entries also appear on the workshop listing page.

The user wants to:
- Remove tiles that **contain** Products, Workshops, and 3D Printing
- Rename them to 1, 2, 3 or default

**Plan**:
1. In `content/harp/index.ts` L80: Replace `const titles = ["Products", "Workshops", "3D Printing"]` with generic defaults: `const titles = ["01", "02", "03"]` or use the original `t(\`Story title ${i + 1}\`)` placeholder.
2. In `NewsroomExpandCards.tsx`: Remove the `CARD_IMAGES` mapping (L39-43) since those titles no longer match.
3. Update `CARD_LINKS` (L85) to point to generic/valid routes or remove link routing if tiles are purely decorative.

**Note**: This only affects the home page and any page that renders `<NewsroomExpandCards>`. The workshop listing page at `/newsroom/filters/*` uses `NewsCard`, not these expandable cards.

---

### Task 11 · Disconnect timeline, milestones, and categories from workshop page routing (S)

**Current state**: After surveying the codebase:
- **Timeline** (`about/Timeline.tsx`): rendered on `/about`, not linked to workshops.
- **Milestones**: Part of the about page timeline. No direct link to `/newsroom`.
- **Categories**: The filter nav on `/newsroom/filters/[category]` page uses `CATEGORY_SLUGS` — these are the category pills (All, Article, Case Study → now Completed, Ongoing, Upcoming after Task 2).

**Plan**:
1. Verify: grep for any `<Link>` or `href` in Timeline, milestone, or category components that routes to `/newsroom`. 
2. If found, remove those links or change destinations.
3. After Task 2 changes categories, the workshop page filters are already standalone (no connection to timeline/milestones). This task may be **already satisfied** by the category rename in Task 2.

**Risk**: Low. Need to verify no hidden link exists.

---

## Verification Checkpoints

After **each phase**, run:

```bash
npm --prefix harp-next run typecheck   # tsc --noEmit
npm --prefix harp-next run lint        # eslint .
npm --prefix harp-next test            # vitest run
npm --prefix harp-next run build       # next build (requires BypassSandbox on Windows)
```

## Dependency Graph

```
Phase 1: [Task 1] [Task 3] [Task 4] — independent, can run in parallel
         [Task 2] — must complete before Task 11

Phase 2: [Task 5] [Task 6] [Task 7] [Task 8] [Task 9] — all independent

Phase 3: [Task 10] — depends on Task 2 (category names)
         [Task 11] — depends on Task 2

Checkpoint after each phase.
```

## Estimated Effort

| Task | Size | Files touched |
|------|------|---------------|
| 1. Nav order swap | XS | 2 |
| 2. Category labels | S | 5+ |
| 3. TBD eyebrow/intro | XS | 2 |
| 4. TBD capability tags | XS | 2 |
| 5. Unlink slideshow | S | 2 |
| 6. Archive IndustriesIndex | S | 3 |
| 7. Remove contact CTA | XS | 1 |
| 8. Footer BG text | XS–S | 1 |
| 9. Clean 404 page | XS | 1 |
| 10. Rename workshop tiles | S | 2 |
| 11. Disconnect timeline/categories | S | 1–3 |
| **Total** | **~2–3 hrs** | **~15–20 files** |
