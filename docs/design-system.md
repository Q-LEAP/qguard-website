# Q-Guard Design System

> Reference values taken from the live WordPress CSS (Elementor kit #19626 + StratusX theme), now in `assets/css/main.css`.
> The styles themselves live in that file; this page is a map, not a second source of truth.

---

## Colours

Elementor global colours (`.elementor-kit-19626` custom properties):

| Token | Value | Usage |
|---|---|---|
| `--e-global-color-primary` | `#4A3BEB` | Brand violet: hero background, primary buttons, form submit |
| `--e-global-color-secondary` | `#54595F` | Secondary text |
| `--e-global-color-text` | `#7A7A7A` | Kit body text |
| `--e-global-color-accent` | `#FF5264` | Accent |
| `--e-global-color-cfa738a` | `#FCBD01` | Yellow |
| `--e-global-color-d415a4e` | `#38C5AB` | Teal |
| `--e-global-color-a77d72d` | `#FFFFFF` | White |
| `--e-global-color-2e1b932` | `#FCF8F8` | Off-white |
| `--e-global-color-c5d1e27` | `#F8F8F8` | Light grey |

Other recurring values used directly in widget CSS: `#4440DB` (violet, section backgrounds / hovers), `#1D2023` (dark sections), `#3A3B74` (headings navy), `#252B2D` (sticky header background), `#5C5C5C` (theme body text), `#D2D2D2` / `#C6C6C6` (footer text / labels).

---

## Typography

| Role | Family | Source |
|---|---|---|
| Body, navigation, most headings | **Lato** 300 / 400 / 700 | Theme (Customizer); self-hosted `assets/fonts/lato-*.woff2` |
| Elementor kit primary / text / accent | Roboto (600 / 400 / 500) | Kit globals, used where a widget inherits kit typography |
| Elementor kit secondary | Roboto Slab 400 | Kit globals |
| Floating badge accent | Varela Round | Homepage widget |

Icons: Font Awesome 5 (solid / regular / brands) and 4.7 (footer `fa-*` icons), Elementor eicons (carousel arrows, lightbox), Linea and Travelpack (service blocks), themovation-icons (scroll-up arrow).

---

## Breakpoints

Elementor defaults: **mobile ≤ 767px**, **tablet ≤ 1024px**, desktop above. The theme treats a mobile user agent or ≤ 767px as "touch" (no transparent header).

---

## Components (Elementor widgets in use)

heading, text-editor, image, button, spacer, icon, icon-list, video (hosted), image-carousel (Swiper), toggle (FAQ), google_maps, menu-anchor, and the theme widgets themo-header, themo-service-block, themo-call-to-action, themo-testimonial, themo-team, themo-slider (hidden), themo-formidable-form.

Motion: Elementor entrance animations `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight` (keyframes in `main.css`), triggered on scroll by `main.js`.
