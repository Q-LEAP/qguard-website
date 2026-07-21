# Q-Guard Migration Roadmap

> This document tracks the migration phases and upcoming work.
>
> Keep it updated as phases are completed or requirements change.

---

# Migration Phases

## Phase 1 — Crawl & Inventory ✅ Complete

**Goal:** Identify every page, asset, and component on the live site.

**Done:**
- All 6 pages identified and crawled
- All 14 images downloaded to `assets/images/`
- Elementor kit CSS fetched (kit #19626) — design tokens extracted
- Page-specific Elementor CSS fetched (post-19238, post-19250, post-19264)
- External library versions identified (Swiper, Font Awesome, reCAPTCHA)
- Font stack confirmed: Roboto + Roboto Slab

---

## Phase 2 — HTML Structure Rebuild ✅ Complete

**Goal:** Build all 6 pages with correct HTML structure, content, and meta tags.

**Done:**
- `index.html` — homepage (8 sections)
- `about-us/index.html` — about (8 sections)
- `features/index.html` — features (4 sections)
- `contact/index.html` — contact + 5-field form
- `support-help-faq/index.html` — FAQ accordion (14 Q&A, 5 categories)
- `privacy-policy/index.html` — French privacy policy (10 sections)
- `assets/css/main.css` — full stylesheet (~1637 lines)
- `assets/js/main.js` — all interactions (~239 lines)
- Documentation files populated with actual data

---

## Phase 3 — CSS Visual Verification ✅ Done (source-level; browser screenshot pass still pending)

**Goal:** Compare every page section-by-section with the live site, fix any visual discrepancies.

**Done (2026-07-21, via direct live HTML/CSS source diffing, no browser tool available in-session):**
- [x] All 6 pages diffed content/structure against live-fetched HTML
- [x] Elementor kit + page CSS re-fetched and diffed against `assets/css/main.css` tokens
- [x] Fixed: CTA button hover color (`#4440DB` vs `#4A3BEB`), feature-card shadow color (blue-tinted vs black), missing homepage floating badge (Varela Round), missing homepage hero video
- [x] Font rendering confirmed correct (Roboto/Roboto Slab match; Varela Round added for the floating badge)

**Still pending (needs Claude in Chrome connected):**
- [ ] Actual browser-rendered side-by-side visual comparison (this pass was source-level only)
- [ ] Two low-confidence items flagged but NOT applied (need visual confirmation before touching): `.feature-card` permanent border + hover state color-swap to `#4440DB`, and `.reduces-checklist li i` icon color (`--color-teal-btn` vs possible `#4440DB`)

---

## Phase 4 — JavaScript Interactions Verification ✅ Done (code-level review; live interaction testing still pending)

**Goal:** Test every interactive element works as on the live site.

**Done (2026-07-21):**
- [x] Preloader timing reviewed — safe margin confirmed, no premature cut-off
- [x] Sticky header threshold matches CSS
- [x] Mobile menu: added Escape-key close (was missing); outside-click + link-click already worked
- [x] Scroll animations: selectors/classes confirmed aligned with CSS
- [x] Accordion: fixed — added keyboard support (Enter/Space) and live `aria-expanded` sync (both were missing)
- [x] Swiper carousels: removed dead `.trusted-carousel-home` code + inline `<script>` in `index.html` (violated no-inline-JS rule), replaced with a proper `main.js` init matching the original config
- [x] Contact/footer form submit simulation confirmed matching markup
- [x] Active-nav-link highlighting confirmed working (noted as a fragile `endsWith()` substring check — fine for current flat routes)

**Still pending:** manual interaction testing in an actual browser (no Claude in Chrome connection this session).

---

## Phase 5 — Animation Timing Verification ✅ Reviewed at code level

**Done (2026-07-21):** Preloader (0.7s + 0.3s delay, JS hides at 1100ms), scroll fadeIn/fadeInUp/fadeInLeft keyframes, and Swiper transition config all confirmed present and consistent between `main.css`/`main.js`/HTML via source review. Not yet confirmed by eye in a live browser.

---

## Phase 6 — Full Page Validation ✅ Done

**Goal:** Validate HTML, check all links, ensure no broken assets.

**Done (2026-07-21):**
- [x] Internal links checked — all resolve to existing local paths
- [x] Image paths verified working (local `http-server` smoke test, 200 on all 6 pages + CSS/JS/video assets)
- [x] `<title>` and `<meta description>` now preserved verbatim from live on all 6 pages (previously hand-rewritten — reverted per CLAUDE.md's SEO preservation rule)
- [x] `<link rel="canonical">` confirmed correct on all pages
- [x] Open Graph tags completed on all pages (`og:type`, `og:site_name`, `og:locale`, `og:image` — several were missing)
- [x] Twitter Card tags added to the 5 pages that lacked them
- [x] `loading="lazy"` added to the 7 below-fold `about-us` images that were missing it
- [x] `alt` attributes confirmed present/correct on all images
- [ ] W3C HTML validator not run (no network access to validator.w3.org confirmed in this session)

---

## Phase 7 — Screenshot Comparison ⏳ Blocked

**Goal:** Side-by-side screenshots confirm pixel-perfect parity.

**Blocked:** Claude in Chrome is not connected in this environment, so no browser screenshots (desktop/tablet/mobile) could be captured this pass. Source-level fidelity (Phases 3-6) is done; this phase requires either connecting Claude in Chrome or a manual visual pass by the user.

---

## Post-Migration — Future Tasks

These are not part of the initial migration scope but may be requested:

- **Form backend:** Replace simulated form submission with a real endpoint (Formspree, Netlify Forms, or a custom serverless function)
- **Analytics:** Add Google Analytics / Tag Manager if needed
- **Cookie banner:** GDPR cookie consent if needed
- **Sitemap:** Generate `sitemap.xml`
- **Robots.txt:** Add `robots.txt`
- **WebP images:** Convert JPG/PNG to WebP for performance
- **Component system:** Extract repeated footer HTML into a shared include (requires a minimal build step)
- **SaaS version announcement:** Site currently says "SaaS available end of 2024" — update when ready

---

# Changelog

| Date | Phase | Summary |
|------|-------|---------|
| 2026-06-30 | Phase 1 & 2 | All 6 pages built, full CSS + JS written, docs populated |
| 2026-07-21 | Phase 3-6 | Source-level audit vs live q-guard.app; restored full Privacy Policy legal clauses, full FAQ answers, full team bios; fixed homepage hero (added real video + missing Varela Round floating badge), CTA/shadow color mismatches, dead Swiper code + inline-script violation, accordion keyboard/aria-expanded, mobile menu Escape close, SEO meta/OG/Twitter tags on all 6 pages, lazy-loading gaps. Phase 7 (screenshot comparison) blocked — no browser tool connected this session. |
