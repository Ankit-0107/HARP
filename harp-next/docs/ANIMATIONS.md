# Animation & interaction map

**Count note:** the brief says "17 animation and interaction patterns"; the approved blueprint catalogued **22** (A1–A22). All 22 are implemented. The extra five (A18–A22: sticky, gallery ticker, parallax, glass menu, global reduced-motion) are listed below.

Evidence = an assertion in `scripts/verify-animations.py` (computed-style sampling before/after the trigger) or the named script. ✅ = verified in headless Chromium.

| # | Pattern | Implementation | Used on | Evidence |
|---|---|---|---|---|
| A1 | Per-letter blur + rise | `ui/SplitText` (chars) | hero H1, every page H1 | ✅ animations (opacity 0→1, 11 letters) |
| A2 | Per-letter page headings | `ui/SplitText` | About, Capabilities, Careers, Contact, Newsroom, 404 | ✅ about (aria-label exposes full text) |
| A3 | Word-by-word reveal | `ui/SplitText by="words"` | testimonials, section titles | ✅ home-interactions |
| A4 | Mask-slide reveal (translateY 110%→0) | `ui/RevealMask` | hero meta, timeline years, capability labels, value titles | ✅ animations (starts 52px, settles 0) — *two real bugs found & fixed* |
| A5 | Scale-in markers | `ui/ScaleIn` | grid "+" markers, stat/leadership chips | ✅ animations (scale 0 → 1) |
| A6 | Line draw / underline (scaleX) | `ui/DrawLine`, `ui/HoverLink` | lists, rows, links | ✅ animations (0 → 1) |
| A7 | Fade-up on scroll | `ui/Reveal` | everywhere | ✅ animations |
| A8 | Hover transitions (expo-out, 0.5–0.6 s, hover-capable only) | Tailwind `[@media(hover:hover)]` | cards, buttons, images | ✅ animations (timing fn) |
| A9 | PixelButton canvas | `ui/PixelButton` | all CTAs | ✅ animations (pixels painted on hover) · *approximated* |
| A10 | DotReveal / GridDrift | `canvas/*` | hero, footer, capability detail, 404 | ✅ animations (paints; frames differ) · *approximated* |
| A11 | Process orbit (500svh sticky, rotating ring) | `home/ProcessOrbit` | home | ✅ home (steps 1→5 by scroll) · *degrees/scroll range estimated* |
| A12 | Sliders (auto-progress, drag, arrows, keys) | `ProductSlider`, `CapableIndustries` | home | ✅ home-interactions |
| A13 | Testimonial slider | `home/Testimonials` | home | ✅ home-interactions |
| A14 | Count-up | `ui/CountUp` | stats, open-positions count | ✅ home, careers |
| A15 | Client ticker (edge mask, pause on hover) | `ui/Marquee` | home | ✅ animations |
| A16 | Newsroom marquee (mobile) / grid (desktop) — single responsive component | `home/NewsroomPreview` | home | ✅ animations (both breakpoints) |
| A17 | Hero video (autoplay/loop/muted/inline, pause off-screen) | `media/HeroVideo` | home, 404 | 🟡 fallback verified; **no video file available** |
| A18 | Sticky columns/stages | Tailwind `sticky` | article aside, privacy title, careers statement | ✅ newsroom, legal-404, careers |
| A19 | Gallery ticker | `ui/Marquee` | careers | ✅ animations |
| A20 | Parallax / scroll-linked images | `ui/ParallaxImage`, `ScrollStatement` | about, capability detail, careers | ✅ about (transform changes), careers |
| A21 | Glass menu (expand, stagger, Esc, focus trap/return) | `layout/SiteNav` | all pages | ✅ home-interactions |
| A22 | Reduced motion (global) | `MotionProvider`, CSS, Lenis opt-out | all | ✅ animations + home-interactions |
| — | Boot curtain (home only) | `layout/BootCurtain` | home | ✅ visual (spinner → lift) |
| — | Lenis smooth scroll | `providers/SmoothScroll` | all | ✅ animations |
