# Q-Guard Website Architecture

> This document is the single source of truth for the website architecture.
>
> Every time the project evolves, this file must be updated.
>
> Never let this document become outdated.

---

# Project Overview

Project Name: Q-Guard

Current Website: https://q-guard.app

Stack:

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

Project Goals:

- Complete migration from WordPress/Elementor
- Pixel-perfect reproduction
- Zero dependency on WordPress
- Maintainable architecture
- High performance
- Easy long-term maintenance with Git and Claude Code

---

# Claude Responsibilities

Claude is responsible for:

- keeping the codebase consistent
- avoiding regressions
- maintaining this architecture document
- documenting every major addition
- preserving visual consistency

Whenever a new component, page or feature is created, this document MUST be updated.

---

# Folder Structure

Current structure:

```
/
│
├── index.html                    ← Homepage
│
├── about-us/
│   └── index.html                ← About page
│
├── features/
│   └── index.html                ← Features page
│
├── contact/
│   └── index.html                ← Contact page
│
├── support-help-faq/
│   └── index.html                ← FAQ / Support page
│
├── privacy-policy/
│   └── index.html                ← Privacy Policy (French)
│
├── assets/
│   ├── css/
│   │   └── main.css              ← Single stylesheet (~1637 lines)
│   ├── js/
│   │   └── main.js               ← Single JS module (~239 lines)
│   └── images/
│       ├── logo-white.png
│       ├── bg-hero-v4.png
│       ├── mockup-q-guard.png
│       ├── imac-mockup-1.png through imac-mockup-4.png
│       ├── web-app-screenshot.png
│       ├── authentication-isometric.svg
│       ├── iphone-app1.jpg
│       ├── iphone-app-full1.png
│       ├── team-bg.jpeg
│       ├── team-sylvain.png / team-sylvain-full.png
│       ├── team-jonathan.png
│       ├── team-ritabrata.png / team-rit-photo.png
│       ├── about-bg-photo.jpeg
│       ├── logo-komodo.png
│       ├── logo-las-santos.png
│       ├── logo-tech-reviews.png
│       └── logo-info-daily.png
│
├── docs/
│   ├── architecture.md           ← This file
│   ├── design-system.md
│   ├── development-rules.md
│   └── roadmap.md
│
├── README.md
└── CLAUDE.md
```

---

# Pages

## Home (`index.html`)

**Purpose:** Main landing page.

**Sections:**
1. Hero — H1 + mockup image, bg #F4F4F4
2. Section Reduces — split: gradient left / features right
3. Section Users — 3 user-type cards (Manual Tester, Automation Engineer, Test Lead)
4. Section Create — split: iMac screenshot left / text right
5. Section Features — 2×3 feature cards with icons
6. Section Trusted — logo carousel (Swiper, dark arrows)
7. Section Testimonials — 2 quote blocks with photos
8. Section CTA Teal — full-width teal banner

**JavaScript:** Preloader, sticky header, scroll animations, Swiper carousel

**Animations:** fadeIn, fadeInUp, fadeInLeft on all sections via IntersectionObserver

**SEO:** Title "Q-Guard", description set, OG tags, canonical

---

## About (`about-us/index.html`)

**Purpose:** Company presentation page.

**Sections:**
1. Page Hero — gradient + bg-hero-v4.png overlay
2. Section About Intro — text + isometric illustration
3. Section Stats — 4 counters (100% satisfaction, 8h operational, 100% GDPR, 60% reduction)
4. Section Human — gradient left + photo right split
5. Section Values — 2×3 value cards
6. Section Trusted Purple — logo carousel (Swiper, white arrows, purple gradient bg)
7. Section Team — 3 member cards (Sylvain, Jonathan, Ritabrata)
8. Section CTA Green — teal-green gradient banner

**JavaScript:** Same as homepage, second Swiper instance (`.trusted-carousel-about`)

---

## Features (`features/index.html`)

**Purpose:** Product features showcase.

**Sections:**
1. Page Hero — gradient + bg-hero-v4.png overlay
2. Section Feature Intro — iMac mockup (imac-mockup-2.png) + text
3. Section Features List — 3 rows × 2 features with colored icons
4. Section CTA Green — teal-green gradient banner

---

## Contact (`contact/index.html`)

**Purpose:** Contact form + office details.

**Sections:**
1. Page Hero — gradient + bg-hero-v4.png overlay
2. Section Contact Info — 2 columns: details (phone/email/address/booking) + 5-field form

**Form fields:** Name*, Email*, Phone, Subject*, Message*, reCAPTCHA v2, honeypot

**Contact details:**
- Phone: +352 20 21 17
- Email: demo@q-guard.app
- Address: 10B, Rue des Merovingiens, 8070 Bertrange, Luxembourg

---

## Support / FAQ (`support-help-faq/index.html`)

**Purpose:** FAQ accordion with 14 Q&A pairs.

**Sections:**
1. Support Hero — gradient bg, H1 + subtitle + 2 buttons
2. Section FAQ — 5 categories, 14 accordion items

**FAQ categories:** General Information (3), Pricing & Licensing (3), Deployment & Integration (2), Support & Training (2), Features & Functionality (5)

**JavaScript:** Accordion (open/close, one-at-a-time)

---

## Privacy Policy (`privacy-policy/index.html`)

**Purpose:** GDPR/legal privacy policy (in French).

**Sections:**
1. Page Hero — gradient
2. Section Privacy — prose text, 10 sections, last updated 2024-06-11

---

# Components

## Preloader

**Purpose:** Full-screen overlay that splits left/right on page load.

**Files:** `assets/css/main.css` (`.loader-section`), `assets/js/main.js` (preloader IIFE)

**Behavior:** Panels slide out when `body.loaded` class is added. Hidden after 1100ms.

---

## Header / Navbar

**Purpose:** Sticky transparent-to-solid navigation bar.

**Behavior:**
- Transparent at top, adds `.scrolled` class (white bg + shadow) after scrollY > 60px
- Mobile: hamburger toggle shows dropdown overlay (`.navbar-collapse.open`)
- Logo: logo-white.png, 159×40px

**Files:** `assets/css/main.css` (`.banner`), `assets/js/main.js` (sticky + mobile menu IIFEs)

---

## Footer

**Purpose:** 4-column footer, identical across all pages.

**Columns:** About Q-Guard text / Links + Social / Contact info / Demo form (3-field + reCAPTCHA)

**Colors:** Background #1a1a2e, bottom bar rgba(0,0,0,0.3)

---

## Scroll Animations

**Purpose:** Elements fade in as they enter the viewport.

**Trigger:** `IntersectionObserver`, threshold 0.1, rootMargin 0px 0px -50px 0px

**Classes:** `.animate-on-scroll` with `data-animation` (fadeIn / fadeInUp / fadeInLeft) and optional `data-delay` (ms)

---

## Swiper Carousels

Two instances:
- `.trusted-carousel-home` — homepage, dark arrows
- `.trusted-carousel-about` — about page, white arrows (filter: brightness(10) on logos)

Both: 4 slides/view desktop, 3 tablet, 2 mobile, 1 small mobile, autoplay 5s, loop

---

## Accordion / FAQ

**Behavior:** Click header opens body, closes all others. `.open` class toggled.

**Files:** `assets/css/main.css` (`.accordion-item`), `assets/js/main.js` (accordion IIFE)

---

## Forms

Three form variants:
1. `.contact-form` — contact page, 5 fields + reCAPTCHA
2. `.demo-form.footer-form` — footer, 3 fields + reCAPTCHA (dark theme)

**Submission:** Simulated client-side only (1.5s delay → success message). No backend.

---

# JavaScript Modules (`assets/js/main.js`)

All code is wrapped in IIFEs to avoid global scope pollution.

| Module | Responsibility |
|--------|---------------|
| Preloader | Adds `body.loaded` on `window.load`, hides after 1100ms |
| Sticky Header | Adds `.scrolled` at scrollY > 60 |
| Mobile Menu | Toggle `.navbar-collapse.open` + close on outside click |
| Scroll Animations | IntersectionObserver, adds `.animated.{animation}` classes |
| Accordion | One-at-a-time open/close |
| Swiper | Two carousel instances |
| Honeypot | Hides `.frm-verify` inputs |
| Forms | Simulated submit (1.5s) with success message |
| Active Nav | Marks current page nav item as `.current-menu-item` |

---

# CSS Architecture (`assets/css/main.css`)

Single file, organized in sections with clear comments.

| Section | Lines (approx) |
|---------|---------------|
| Google Fonts @import | 1 |
| CSS Variables (:root) | ~40 |
| CSS Reset & Base | ~50 |
| Typography base | ~30 |
| Preloader | ~40 |
| Header / Navbar | ~100 |
| Page Hero (inner pages) | ~30 |
| Homepage — Hero | ~80 |
| Homepage — Section Reduces | ~60 |
| Homepage — User Cards | ~70 |
| Homepage — Create Split | ~60 |
| Homepage — Features | ~50 |
| Homepage — Trusted / Swiper | ~30 |
| Homepage — Testimonials | ~60 |
| Homepage — CTA sections | ~50 |
| About page | ~230 |
| Features page | ~60 |
| Contact page | ~60 |
| Support / FAQ page | ~70 |
| Privacy Policy page | ~40 |
| Footer | ~120 |
| Utility spacers | ~10 |
| Responsive @1024px | ~60 |
| Responsive @767px | ~130 |

---

# CSS Variables

All defined in `:root` in `assets/css/main.css`.

See `docs/design-system.md` for full list.

---

# Breakpoints

| Name | Max-width |
|------|-----------|
| Desktop | no max (default) |
| Tablet | 1024px |
| Mobile | 767px |

Container max-width: 1140px (desktop), full-width with 20px padding on mobile.

---

# Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| H1 homepage | Roboto | 700 | 60px |
| H1 inner pages | Roboto | 700 | 44px |
| H2 sections | Roboto | 700 | 48px |
| H3 subsections | Roboto | 700 | 36–38px |
| Body text | Roboto | 400 | 15–16px |
| Navigation | Roboto | 600 | 14px |
| Buttons | Roboto | 700 | 14px, uppercase |

---

# Animations

| Name | Trigger | Easing | Duration |
|------|---------|--------|----------|
| Preloader panels slide | page load | ease | 0.8s |
| Header become solid | scroll > 60px | ease | 0.3s |
| Mobile menu open | click | ease | 0.3s |
| fadeIn | scroll (IntersectionObserver) | ease | 0.8s |
| fadeInUp | scroll | ease | 0.8s + translateY |
| fadeInLeft | scroll | ease | 0.8s + translateX |
| Accordion open | click | ease | CSS display toggle |
| Swiper slide | autoplay / drag | ease | 500ms |
| Button hover | hover | ease | 0.3s |
| Service block hover | hover | ease | 0.3s |

---

# Assets

## Images (`assets/images/`)

| File | Used in |
|------|---------|
| logo-white.png | All pages header + footer |
| bg-hero-v4.png | All inner page heroes, support hero |
| mockup-q-guard.png | Homepage hero |
| imac-mockup-1.png | About page section |
| imac-mockup-2.png | Features page intro |
| imac-mockup-3.png | About page section |
| imac-mockup-4.png | About page section |
| web-app-screenshot.png | About page |
| authentication-isometric.svg | About intro section |
| iphone-app1.jpg | Homepage section reduces |
| iphone-app-full1.png | Homepage section reduces |
| team-bg.jpeg | About team section background |
| team-sylvain.png | About team card |
| team-sylvain-full.png | About team card (alternate) |
| team-jonathan.png | About team card |
| team-ritabrata.png | About team card |
| team-rit-photo.png | About team card (alternate) |
| about-bg-photo.jpeg | About human section background |
| logo-komodo.png | Trusted carousel (both pages) |
| logo-las-santos.png | Trusted carousel (both pages) |
| logo-tech-reviews.png | Trusted carousel (both pages) |
| logo-info-daily.png | Trusted carousel (both pages) |

## External CDN

| Library | Version | Usage |
|---------|---------|-------|
| Font Awesome | 5.15.4 | Icons (all pages) |
| Swiper | 10 | Logo carousels |
| Google reCAPTCHA | v2 | Contact + footer forms |
| Google Fonts | — | Roboto + Roboto Slab (via @import in CSS) |

---

# Accessibility

- All images have descriptive `alt` attributes
- All forms have associated `<label>` elements
- Navigation has `aria-label="Main navigation"`
- Mobile toggle has `aria-controls` + `aria-expanded`
- Accordion headers have `role="button"` + `tabindex="0"` + `aria-expanded`
- Footer nav has `aria-label`
- Decorative icons have `aria-hidden="true"`
- Honeypot inputs have `aria-hidden="true"` and `tabindex="-1"`

---

# Performance

Target Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95

Current optimizations:
- Images have explicit `width`/`height` attributes (reduce CLS)
- Hero image: `loading="eager"`, all others: `loading="lazy"` (to be added in Phase 3)
- Single CSS file, single JS file (no render-blocking resources beyond CDNs)
- CSS animations prefer `transform` / `opacity` (GPU-composited)
- JS deferred via placement before `</body>`

---

# SEO

Each page has:
- `<title>` — unique per page
- `<meta name="description">` — unique per page
- `<link rel="canonical">` — pointing to live URL
- `<meta property="og:title">`, `og:description>`, `og:type>`, `og:url>`
- `lang` attribute on `<html>`

---

# Third-Party Services

| Service | Usage | Key |
|---------|-------|-----|
| Google reCAPTCHA v2 | Form spam protection | `6LdvlHwqAAAAAGcoGEBUJCWIgnOwrMpUjiHdtK4B` |
| Google Fonts | Roboto + Roboto Slab | Via @import in CSS |
| Font Awesome CDN | Icons | cdnjs.cloudflare.com |
| Swiper CDN | Carousels | cdn.jsdelivr.net |
| Outlook Booking | Demo scheduling | URL in all CTAs |

---

# Known Issues

None currently documented.

---

# Technical Debt

- Footer HTML is duplicated across all 6 pages. Could be componentized with a JS include or build step, but that would require a build tool — deferred for now to keep zero-dependency constraint.
- reCAPTCHA v2 forms have no real backend — submission is simulated client-side. A serverless function or form service (e.g. Formspree) will be needed for production.

---

# Changelog

## 2026-06-30

Phase 2 complete: All 6 HTML pages written from scratch (index, about-us, features, contact, support-help-faq, privacy-policy).

Full CSS stylesheet (main.css, ~1637 lines) written with all variables, sections, components and responsive breakpoints.

Full JS module (main.js, ~239 lines) written with all interactions.

All 14 images downloaded from live WordPress site.

Stray WordPress export HTML files removed from project root.

Documentation files populated with actual project data.

---

# Maintenance Rules

Whenever a component changes: update this document.

Whenever a page changes: update this document.

Whenever a dependency changes: update this document.

Whenever an animation changes: update this document.

---

# Golden Rule

This document must always reflect the current state of the project.

If the code and this document disagree, update the documentation immediately.

Documentation is considered part of the project, not an optional extra.
