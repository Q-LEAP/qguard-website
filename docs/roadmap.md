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

### SEO & GEO implementation plan — repository part (2026-09-29)
Plan by Roso SEO Squad (2026-09-25), steps applicable to this repository:
- [x] 1 Demo pages: the static site only has the real pages (demos disappear at the domain switch).
- [x] 2 Home title / description / social tags, keyword H1, hero lead, hero buttons (Book a demo, See how it works).
- [x] 4 `lang="en"` / `en_GB`, Bertrange address on the map and footer "Location", About "Contact us" → /contact/, privacy policy "Q-BOT" → "Q-Guard", stale "end of 2024" SaaS date removed, French UI leftovers on English pages translated.
- [x] 6 JSON-LD Organization + SoftwareApplication on every page.
- [x] 7 `robots.txt`, `sitemap.xml`, `llms.txt`.
- [x] 8 FAQ: h2 categories, h3 questions, answer capsules, FAQPage schema.
- [x] 9 `/how-it-works/`, `/security-and-data/`, `/licence-and-trial/` (content limited to facts already published on the site); unsourced figures replaced (home 90 %, Features 90 %, About counters).
- [x] 10 French homepage `/fr/` with hreflang.

---

## To do

### Open decisions from the SEO plan (need business input)
- [ ] SaaS status/date: the FAQ, `/licence-and-trial/` and the FAQPage JSON-LD say "planned; contact us for its current status".
- [ ] Real proof points (customer, pilot, measured gain) to bring back figures: removed "90 %", "100 % customer satisfaction", "60 %"; "Easy to use. No coding skills required." still has no proof.
- [ ] Security page: "Running without internet access" and "Who can see recorded journeys" sections left out (facts unknown). `operatingSystem` left out of the JSON-LD for the same reason.
- [ ] Privacy policy: registered office still "10 rue Mathias Hardt, L-1717 Luxembourg" (check the trade register before changing it); it also contains the Q-Bot Mobile app policy, copied from q-bot.eu.
- [ ] Comparison page (Q-Guard vs Checksum, step 10): needs competitor facts verified at publication time.
- [ ] Outside this repository: steps 3 (links from q-leap.eu), 5 (form inbox + Search Console), 11 (Chrome Web Store publisher name, G2), 12–13 (outreach, LinkedIn, Reddit, YouTube), 14 (monthly tracking).
- [ ] Remaining Lighthouse items that would change the design: colour contrast (theme colours), heading order in theme widgets (h1 → h5/h6 eyebrows); toggle titles are `<a>` without `href` (Elementor markup).

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
