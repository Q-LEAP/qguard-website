# Q-Guard Website Architecture

> Single source of truth for how the site is built. Update it whenever the structure changes.

---

## Overview

- Production: https://q-guard.app, still WordPress.com. `main` is served at https://q-leap.github.io/qguard-website/ until the custom domain is set on the day of the switch: see [ovh-switch.md](ovh-switch.md).
- Repository: https://github.com/Q-LEAP/qguard-website
- Hosting: GitHub Pages, deployed by `.github/workflows/pages.yml` on every push to `main` (and only `main`; the `github-pages` environment accepts no other branch). Internal files (`docs/`, `tools/`, `assets/Ref UI/`, `CLAUDE.md`, `README.md`) are not published.
- Remote preview: https://q-leap.github.io/qguard-preview/, `dev` at the root and the `alternative` design proposal under `/alternative/`, always `noindex`. Built by `.github/workflows/preview.yml` (every push to `dev`, nightly, or by hand) and pushed to the `Q-LEAP/qguard-preview` repository with a deploy key (secret `PREVIEW_DEPLOY_KEY`). A second repository is needed because a custom domain makes `q-leap.github.io/qguard-website/` redirect to it.
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
├── how-it-works/index.html     ┐
├── security-and-data/index.html├ Content pages built from the Features template (2026-09-29)
├── licence-and-trial/index.html┘
├── fr/index.html               French homepage (hreflang pair with /)
├── robots.txt, sitemap.xml     Crawl directives (AI answer bots allowed) and the page list
├── llms.txt                    Site summary for AI assistants
├── assets/
│   ├── css/main.css            Generated from the live CSS (see below), ~425 KB
│   ├── js/main.js              Vanilla runtime replacing jQuery/Elementor/theme JS
│   ├── images/                 Full-size originals, original WordPress file names
│   ├── fonts/                  Self-hosted web + icon fonts (woff2/woff)
│   ├── videos/                 Homepage hero video
│   └── Ref UI/                 Reference screenshots (not used by the site)
├── tools/verify/               Dev-only regression checks against the live site
├── tools/check-switch.sh       DNS/hosting checks before and after the OVH switch
├── CNAME                       q-guard.app
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

GitHub Pages cannot process submissions. Both forms (`#form_2ssykv` in the footer of every page, `#form_contact3` on the contact page) post to **FormSubmit**, `data-endpoint="https://formsubmit.co/ajax/contact@q-leap.eu"`, as on q-bot.eu (chosen 2026-10-05). `formPayload` keys each value by its visible label (the Formidable names `item_meta[n]` would be meaningless in the email) and passes the hidden `_subject`, `_captcha` and `_template` FormSubmit options; the honeypot, `frm_state` and the reCAPTCHA token are not sent. Without `data-endpoint` a form only validates and shows the success message.

The first submission triggers a one-time activation email from FormSubmit to `contact@q-leap.eu`; nothing is forwarded until its link is clicked. FormSubmit is a processor outside the EU, named in the privacy policy.

The reCAPTCHA site key is bound to `q-guard.app`; on the github.io preview Google shows a domain error inside the widget. That is expected.

---

## SEO

Each page has a title (≤ 65 characters), a meta description (≤ 160), Open Graph and Twitter tags, and a canonical URL pointing at `https://q-guard.app/…`. Social images use absolute `https://q-guard.app/assets/images/…` URLs (valid once the domain is switched). Titles, descriptions and content were rewritten on 2026-09-29 following the SEO & GEO implementation plan (Roso SEO Squad, 2026-09-25).

- `lang="en"` / `og:locale en_GB` on English pages; `lang="fr"` on the privacy policy and `/fr/`. `main.js` picks the lightbox labels from `<html lang>`.
- Structured data: every page carries the same JSON-LD `@graph` (Q-Leap `Organization` + Q-Guard `SoftwareApplication`, with the Chrome Web Store extension in `sameAs`). The FAQ adds a `FAQPage` whose answers are the exact page text: **when a FAQ answer changes, update the JSON-LD too.** `/security-and-data/` also adds `WebPage` (about the `SoftwareApplication`), `BreadcrumbList` and its own `FAQPage`, same rule. Add LinkedIn / G2 / YouTube profiles to `sameAs` when they exist.
- `/` and `/fr/` declare each other with `hreflang` (+ `x-default`), also in `sitemap.xml`.
- New pages must be added to `sitemap.xml`, `llms.txt`, the footer "Links" menu of every page and, if relevant, the header menu.
- FAQ markup: categories are `h2.qg-faq-category`, questions are `h3.elementor-tab-title` (Elementor's "title tag" option); CSS at the end of `main.css` keeps the original h5/div rendering.
- Content pages reuse the Features page (`elementor-19264`) widgets and CSS; their service block titles are `h2` rendered like the Features `h4`.
- `/security-and-data/` (reworked 2026-10-08) keeps the Features hero and call to action but its body is hand-written semantic HTML (`.qg-security`: "On this page" links, question-led `h2` sections, data-flow `ol`, data `table`, anonymisation `dl`, visible FAQ `h3`/`p`), styled at the end of `main.css`. Every statement repeats a fact already published on the site; unknown facts are left out (see roadmap). UI polish (same day): hero lead + four-fact list, data flow split into "At the source" / "On your servers" zones, sections weighted primary / alt / highlight / compact, Performance and Deployment side by side after GDPR, no entrance animation on these sections. The hero and CTA use page-only classes (`qg-security-hero`, `qg-security-cta`) because their Elementor rules are shared with the other content pages.

**Indexing:** since 2026-10-05 the pages carry the original `<meta name='robots' content='max-image-preview:large' />` (production is ready for the domain switch). The preview workflow replaces it with `noindex, nofollow` on every page and serves a `Disallow: /` robots.txt, so the preview is never indexed.

---

## Verification tools — `tools/verify/`

Dev-only (never loaded by the site). Requires Node and Google Chrome; `npm install` inside `tools/verify/`, and serve the repo on `http://localhost:8765/` (`python3 -m http.server 8765`).

- `compare.mjs` — layout/style diff (every Elementor element box + text styles) at 1920 / 1024 / 390px.
- `pixel.mjs` — full-page pixel diff; screenshots and diff images in `tools/verify/shots/`.
- `crop.mjs` — side-by-side crop of a region (live | local | diff).
- `audit.mjs` — SEO/GEO checks on every page of `sitemap.xml`: status, `lang`, title/description length, single H1, JSON-LD validity, hreflang, empty/broken internal links, unsourced figures, stale content, horizontal overflow at 390 / 1024 / 1920px, console errors.

Status at migration (2026-09-25): all 6 pages × 3 viewports have identical element geometry and computed styles; remaining pixel noise is image resampling (WordPress served CDN-resized copies) and carousel autoplay timing.
