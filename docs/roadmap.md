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

### Security & data page rework (2026-10-08)
- [x] Question-led sections (data flow, data captured, anonymisation, storage, performance, GDPR, deployment, FAQ), H1 with "security", "data privacy", "on-premise" and "test automation".
- [x] Claims softened to what is published: "no impact on performance" → "designed to …, check it during a trial"; "GDPR compliance is a priority" → "designed with GDPR requirements in mind" + the four mechanisms.
- [x] JSON-LD `WebPage` + `BreadcrumbList` + `FAQPage`; security CTA ("Book a security-focused demo" + "Read the FAQ"); `llms.txt` security section; visible focus on the page's links and CTA buttons.

### Open decisions from the SEO plan (need business input)
- [ ] SaaS status/date: the FAQ, `/licence-and-trial/` and the FAQPage JSON-LD say "planned; contact us for its current status".
- [ ] Real proof points (customer, pilot, measured gain) to bring back figures: removed "90 %", "100 % customer satisfaction", "60 %"; "Easy to use. No coding skills required." still has no proof.
- [ ] Security page: "Running without internet access" and "Who can see recorded journeys" sections left out (facts unknown). `operatingSystem` left out of the JSON-LD for the same reason.
- [ ] Security page, facts still missing (2026-10-08): field-level inventory of a session (URLs, element selectors, timestamps, IP/user agent, user identifiers?), where the data collector runs, retention and deletion, access control/roles in Q-Guard, network flows to Q-Leap (licence, updates, support access), system requirements, measured performance overhead, any certification or pentest. The "less than one day" installation figure is a Q-Leap statement with no published evidence.
- [ ] Privacy policy: registered office still "10 rue Mathias Hardt, L-1717 Luxembourg" (check the trade register before changing it); it also contains the Q-Bot Mobile app policy, copied from q-bot.eu.
- [ ] Comparison page (Q-Guard vs Checksum, step 10): needs competitor facts verified at publication time.
- [ ] Outside this repository: steps 3 (links from q-leap.eu), 5 (form inbox + Search Console), 11 (Chrome Web Store publisher name, G2), 12–13 (outreach, LinkedIn, Reddit, YouTube), 14 (monthly tracking).
- [ ] Remaining Lighthouse items that would change the design: colour contrast (theme colours), heading order in theme widgets (h1 → h5/h6 eyebrows); toggle titles are `<a>` without `href` (Elementor markup).

### Domain switch (see `ovh-switch.md`)
- [x] Form backend: FormSubmit → `contact@q-leap.eu` on both forms, privacy policy updated (2026-10-05).
- [x] `noindex` lifted on every page, `max-image-preview:large` restored, `CNAME` added, `dev` merged into `main` (2026-10-05).
- [x] Remote preview that survives the custom domain: `q-leap.github.io/qguard-preview/` (2026-10-05).
- [ ] Set the custom domain `q-guard.app` on GitHub Pages and redeploy, on the day of the switch (set then removed on 2026-10-05 so `q-leap.github.io/qguard-website/` stays usable for demos).
- [ ] OVH: fill the DNS zone (site + Microsoft 365 mail records), then switch the name servers away from WordPress.com.
- [ ] After the switch: HTTPS certificate + enforce HTTPS, FormSubmit activation email, reCAPTCHA on the real domain, mail in/out.
- [ ] Renew the domain: it expires on 2026-11-07 (registrar OVH).
- [ ] Privacy policy still says the hosting servers are "exclusively within the EU": GitHub Pages and FormSubmit are not (decision for Q-Leap).

### Content issues inherited from the live site — fixed 2026-09-25
- [x] ThemeForest "Book a Demo" link: it was in a duplicate homepage CTA section hidden on every breakpoint (the visible CTA already used the Outlook booking link); emptied with the other hidden sections below.
- [x] Footer "Follow us" LinkedIn → Q-Leap company page (`linkedin.com/company/3037496/`, as on q-leap.eu).
- [x] Homepage meta description started with the video URL; Twitter title read "Home G-Guard".
- [x] StratusX demo content (client logos, iPhone mockups, flexslider, two team photos) sat in Elementor sections hidden on every breakpoint. Their content is emptied and the images removed; the empty wrappers stay because Elementor's `:not(:last-child)` margins depend on them. No visual change (re-verified).
- [ ] Still a theme illustration: `authentication_isometric-2.svg` in the homepage "for all testers" section — visible, replace if a Q-Guard visual exists.

### Later
- [ ] Phase 2 "premium evolution" work: parked in `git stash` (`phase-2-premium WIP`), written against the old Phase 1 markup, so it has to be re-applied on the new markup.
- [ ] Performance pass: responsive image sizes (WordPress used CDN-resized copies), trim unused Roboto subsets.
