# Q-Guard Website Architecture

> Single source of truth for how the site is built. Update it whenever the structure changes.

---

## Overview

- Live site (WordPress, until the domain is switched): https://q-guard.app
- Repository: https://github.com/Q-LEAP/qguard-website
- Hosting: GitHub Pages, served from `main` (root)
- Stack: static HTML, CSS, vanilla JavaScript. No build step is needed to serve or edit the site.

The pages are the **original Elementor/StratusX markup** exported from the live site (2026-09-25), cleaned of every WordPress runtime dependency. Class names, `data-id` and `data-settings` attributes are kept on purpose: the stylesheet and the scripts rely on them, exactly as on WordPress. That is what makes the static site pixel-identical to the original.

---

## Folder structure

```
/
├── index.html                  Home
├── about-us/index.html
├── features/index.html
├── contact/index.html          Contact form + Google Maps embed
├── support-help-faq/index.html FAQ (toggle accordions)
├── privacy-policy/index.html   French privacy policy (theme page title visible)
├── assets/
│   ├── css/main.css            Generated from the live CSS (see below), ~425 KB
│   ├── js/main.js              Vanilla runtime replacing jQuery/Elementor/theme JS
│   ├── images/                 Full-size originals, original WordPress file names
│   ├── fonts/                  Self-hosted web + icon fonts (woff2/woff)
│   ├── videos/                 Homepage hero video
│   └── Ref UI/                 Reference screenshots (not used by the site)
├── tools/verify/               Dev-only regression checks against the live site
├── docs/
├── .nojekyll                   Serve files as-is on GitHub Pages
└── CLAUDE.md
```

Paths inside pages are **relative** (`assets/…` from the root page, `../assets/…` from sub-pages), so the site works both on `q-leap.github.io/qguard-website/` and on the final domain.

---

## CSS — `assets/css/main.css`

Produced once from every stylesheet the live pages loaded (theme `stratusx` + child, Elementor kit #19626 and per-page post CSS, Font Awesome 4/5, eicons, Swiper, Formidable, WP block styles):

1. Merged in cascade order across the 6 pages (first occurrence of each chunk kept).
2. Asset URLs rewritten to `../fonts/` and `../images/`.
3. Unused selectors removed with PurgeCSS against the 6 pages and `main.js`.
4. Exact duplicate rules removed, **keeping the first copy** (a later copy comes from another page's bundle and would flip cascade ties).
5. Font sources reduced to hosted woff2/woff.

Page-specific quirks handled during the merge:

- Elementor's "hide page title" setting is emitted as `:root{--page-title-display:none}` on each page. In a shared stylesheet it is scoped to `body.elementor-page-<id>` so the Privacy Policy title (the only theme `h1.entry-title`) stays visible.
- The Formidable honeypot hiding rule (`#frm_field_56_container`, `#frm_field_57_container`) is injected at runtime on WordPress; it is written statically at the end of the file.
- The lightbox styles (`.qg-lightbox*`) are hand-written at the end of the file (Elementor loaded its lightbox CSS on demand).

Selectors are long and Elementor-specific (`.elementor-19273 .elementor-element.elementor-element-a999b1a …`). When editing, change the existing rule for that `data-id` rather than adding a new one elsewhere.

---

## JavaScript — `assets/js/main.js`

One IIFE, no globals except `window.qgRecaptchaReady` (reCAPTCHA callback). Each feature mirrors the WordPress behaviour it replaces:

| Feature | Replaces | Notes |
|---|---|---|
| `initBodyState` | theme `main.js` | Adds `loaded` (hides preloader) and `th-touch`; disables the transparent header when the theme's rule says "touch": mobile user agent **or** width ≤ 767px, evaluated once at load |
| `initStickyHeader` | Headhesive | Clones the header (`headhesive--clone`), sticks after 125px scroll |
| `initNavigation` | Bootstrap collapse | Same classes/timing (`collapsing`, 350ms), Escape closes |
| `initEntranceAnimations` | Elementor motion effects | Reads `_animation` / `_animation_delay` (+ `_tablet` / `_mobile`) from `data-settings`, IntersectionObserver |
| `initCarousels` | Elementor image carousel | Swiper 8.4.5 (same version as WordPress), settings read from `data-settings` |
| `initToggles` | Elementor toggle | 400ms slide; end state applied by timer (animations pause in background tabs) |
| `initLightbox` | Elementor lightbox | Counter, fullscreen, zoom, share menu, caption; above sticky header |
| `initScrollUp` | jQuery scrollUp | Visible past 300px, 200ms fade |
| `initAnchorScroll` | theme anchor scroll | Offsets for the sticky header, 500ms linear |
| `initRecaptcha` / `initForms` | Formidable + reCAPTCHA | Same markup, client-side validation with Formidable's messages; honeypot filled ⇒ silently ignored |

All motion respects `prefers-reduced-motion`.

External scripts: Swiper (`cdn.jsdelivr.net`), Google reCAPTCHA (only on pages with a form).

### Forms

GitHub Pages cannot process submissions. `submitForm` posts `FormData` to `form.dataset.endpoint` when a `data-endpoint` attribute is set on the `<form>`; without it the form only validates and shows the success message. **A form backend still has to be chosen** (e.g. Formspree, Web3Forms) and its URL set as `data-endpoint` on `#form_2ssykv` (footer, all pages) and `#form_contact3` (contact page).

The reCAPTCHA site key is bound to `q-guard.app`; on the github.io preview Google shows a domain error inside the widget. That is expected.

---

## SEO

Each page keeps its original title, description, Open Graph and Twitter tags, and a canonical URL pointing at `https://q-guard.app/…`. Social images use absolute `https://q-guard.app/assets/images/…` URLs (valid once the domain is switched).

**Staging:** every page currently has `<meta name="robots" content="noindex, nofollow" />` so the GitHub Pages preview is not indexed. When `q-guard.app` points at GitHub Pages, replace it on the 6 pages with the original `<meta name='robots' content='max-image-preview:large' />` and add a `CNAME` file containing `q-guard.app`.

---

## Verification tools — `tools/verify/`

Dev-only (never loaded by the site). Requires Node and Google Chrome; `npm install` inside `tools/verify/`, and serve the repo on `http://localhost:8765/` (`python3 -m http.server 8765`).

- `compare.mjs` — layout/style diff (every Elementor element box + text styles) at 1920 / 1024 / 390px.
- `pixel.mjs` — full-page pixel diff; screenshots and diff images in `tools/verify/shots/`.
- `crop.mjs` — side-by-side crop of a region (live | local | diff).

Status at migration (2026-09-25): all 6 pages × 3 viewports have identical element geometry and computed styles; remaining pixel noise is image resampling (WordPress served CDN-resized copies) and carousel autoplay timing.
