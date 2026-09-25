# Q-Guard Roadmap

> Keep this updated as work is completed or priorities change.

---

## Done

### Phase 1 — First static rebuild (2026-06-30 → 2026-07-21)
Hand-written HTML/CSS reproduction. Superseded: it drifted from the live site (Roboto instead of Lato, different hero and section layout, homepage ~815px shorter).

### Phase 1b — Exact rebuild from the live markup (2026-09-25)
- All 6 pages regenerated from the live Elementor output; WordPress, jQuery, Jetpack and trackers removed.
- CSS generated from the live stylesheets (3 MB → ~425 KB), fonts and images self-hosted.
- `main.js` rewritten in vanilla JS for every runtime behaviour (see `architecture.md`).
- Verified in headless Chrome against q-guard.app at 1920 / 1024 / 390px: identical element geometry and computed styles on all 6 pages; pixel diff limited to image resampling and carousel timing.
- Interactions checked in Chrome: sticky header, mobile menu, entrance animations, carousels, FAQ toggles, lightbox, scroll-up, form validation.
- Published on GitHub Pages (`noindex`).

---

## To do

### Before switching the domain
- [ ] Choose a form backend (Formspree, Web3Forms…) and set `data-endpoint` on `#form_2ssykv` (footer) and `#form_contact3` (contact).
- [ ] Remove `noindex` on the 6 pages, restore `max-image-preview:large`, add `CNAME` (`q-guard.app`), point DNS at GitHub Pages.
- [ ] Check the reCAPTCHA widget on the real domain (site key is bound to q-guard.app).

### Content issues inherited from the live site — fixed 2026-09-25
- [x] ThemeForest "Book a Demo" link: it was in a duplicate homepage CTA section hidden on every breakpoint (the visible CTA already used the Outlook booking link); emptied with the other hidden sections below.
- [x] Footer "Follow us" LinkedIn → Q-Leap company page (`linkedin.com/company/3037496/`, as on q-leap.eu).
- [x] Homepage meta description started with the video URL; Twitter title read "Home G-Guard".
- [x] StratusX demo content (client logos, iPhone mockups, flexslider, two team photos) sat in Elementor sections hidden on every breakpoint. Their content is emptied and the images removed; the empty wrappers stay because Elementor's `:not(:last-child)` margins depend on them. No visual change (re-verified).
- [ ] Still a theme illustration: `authentication_isometric-2.svg` in the homepage "for all testers" section — visible, replace if a Q-Guard visual exists.

### Later
- [ ] Phase 2 "premium evolution" work: parked in `git stash` (`phase-2-premium WIP`), written against the old Phase 1 markup, so it has to be re-applied on the new markup.
- [ ] Performance pass: responsive image sizes (WordPress used CDN-resized copies), trim unused Roboto subsets.
