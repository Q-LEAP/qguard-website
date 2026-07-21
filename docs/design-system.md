# Q-GUARD Design System

> This document defines the visual identity and development rules for the Q-Guard website.
> Any contribution must respect these rules.
>
> Source: Elementor kit #19626 CSS variables from the live WordPress site.

---

# Design Philosophy

Q-Guard represents:

- Trust
- Security
- Modernity
- Simplicity
- Professionalism
- Technology

The website should always feel:

- Clean
- Spacious
- Premium
- Minimalistic
- High-end

Avoid unnecessary visual noise.

---

# Brand Identity

The Q-Guard identity is immutable.

Never modify:

- Logo proportions
- Logo colors
- Logo spacing
- Logo composition

Always respect the official exclusion zones defined in the brand guidelines.

Never stretch the logo.

Never rotate the logo.

Never recolor the logo.

Never apply shadows, outlines or effects.

**Logo file:** `assets/images/logo-white.png` (white version, 159×40px)

---

# Colors

All values sourced from Elementor kit #19626 (`post-19626.css` on live site).

## Primary Brand Color

```css
--color-primary: #4A3BEB;
```

Used for: main CTAs, primary gradient, active states, section backgrounds

---

## Action Colors

Teal (buttons, links, hover states)

```css
--color-teal-btn: #48A9A6;
```

Teal (CTA bar background)

```css
--color-teal: #38C5AB;
```

---

## Gradient Colors

Purple dark (gradient start — about page, page heroes)

```css
--color-purple-dark: #2C0EFE;
```

Purple (gradient end)

```css
--color-purple: #8B24FC;
```

---

## Accent Colors

Danger / Hearts

```css
--color-accent: #FF5264;
```

Warning / Highlights

```css
--color-yellow: #FCBD01;
```

---

## Text Colors

Headings

```css
--color-dark: #1d2023;
```

Body text

```css
--color-text: #7A7A7A;
```

Secondary labels

```css
--color-secondary: #54595F;
```

---

## Background Colors

Page background

```css
--color-white: #FFFFFF;
```

Homepage hero background

```css
--color-gray-bg: #F4F4F4;
```

Section alternate background (cards)

```css
--color-gray-card: #F3F3F3;
```

Light background hover states

```css
--color-light-gray: #F8F8F8;
```

Footer background

```css
#1a1a2e
```

---

## Section Gradients

Page hero (inner pages):

```css
background: linear-gradient(135deg, #4A3BEB 0%, #8B24FC 100%);
```

About "Human" section left column:

```css
background: linear-gradient(150deg, #4A3BEB 11%, #4A3BEB 100%);
```

About "Trusted" carousel section:

```css
background: linear-gradient(150deg, #2C0EFE 0%, #8B24FC 100%);
```

CTA green bar:

```css
background: linear-gradient(130deg, #38C5AB 26%, #38C5AB 100%);
```

Never invent new colors unless requested.

---

# Typography

## Fonts

Primary font family

```css
font-family: 'Roboto', sans-serif;
```

Secondary font family (headings alternative)

```css
font-family: 'Roboto Slab', serif;
```

Loaded via `@import` in `assets/css/main.css` from Google Fonts.

Weights used: 300, 400, 500, 600, 700, 900

Never substitute another font.

---

## Type Scale

| Element | Size | Weight | Font |
|---------|------|--------|------|
| H1 — homepage hero | 60px | 700 | Roboto |
| H1 — inner page hero | 44px | 700 | Roboto |
| H2 — section titles | 48px | 700 | Roboto |
| H3 — subsections | 36–38px | 700 | Roboto |
| H4 — card titles | 23px | 700 | Roboto |
| Body | 15–16px | 400 | Roboto |
| Navigation | 14px | 600 | Roboto |
| Buttons | 14px | 700 | Roboto, uppercase |
| Caption / meta | 13px | 400 | Roboto |

---

# Spacing

Container max-width: **1140px**

Standard section padding: **90–120px top/bottom** (desktop), reduced on mobile

Section inner padding (tablet ≤1024px): reduced by ~15–20%

Section inner padding (mobile ≤767px): 20px horizontal, reduced vertical

---

# Buttons

## Primary Button (white outline on dark bg)

```css
border: 2px solid #fff;
color: #fff;
border-radius: 50px;
padding: 14px 32px;
font-size: 14px;
font-weight: 700;
text-transform: uppercase;
```

Hover: background #fff, color becomes section color.

## Teal Button

```css
background: #48A9A6;
color: #fff;
border: 2px solid #48A9A6;
border-radius: 50px;
padding: 14px 32px;
```

Hover: transparent background, teal text.

Buttons should always:

- have generous padding
- smooth transitions (0.3s ease)
- rounded corners (50px border-radius = pill shape)
- preserve existing hover animations

Never redesign buttons.

---

# Cards

Three card variants in use:

**Feature cards** (`.feature-card`):
- box-shadow: 0 0 40px 10px rgba(0,0,0,0.05)
- padding: 50px 40px 40px
- No border-radius (square cards)

**User cards** (`.user-card`):
- Gradient left border (6px) with primary color
- Background: white
- box-shadow: 0 0 40px 10px rgba(0,0,0,0.07)
- padding: 50px 40px 30px

**Value cards** (`.value-card`):
- Same as feature cards

Cards must preserve:

- shadows
- spacing
- hover animations

No redesign.

---

# Icons

Font Awesome 5.15.4 (CDN) — Free tier.

Never mix icon styles (all "solid" `fas` or "regular" `far` — never mix with outline or duotone).

Icon colors per context:

| Class | Color |
|-------|-------|
| `.icon-wrap.primary` | `#4A3BEB` |
| `.icon-wrap.yellow` | `#FCBD01` |
| `.icon-wrap.teal` | `#48A9A6` |
| `.icon-wrap.accent` | `#FF5264` |
| `.icon-wrap.secondary` | `#54595F` |
| `.icon-wrap.textc` | `#7A7A7A` |

---

# Images

Images should:

- remain high quality
- use `loading="lazy"` (except above-the-fold hero images)
- preserve aspect ratio
- have explicit `width` and `height` attributes to prevent layout shift

Never crop important content.

---

# Animations

Animations are part of the product identity.

Never simplify them.

CSS keyframes defined in `assets/css/main.css`:

| Keyframe | Effect |
|----------|--------|
| `fadeIn` | opacity 0→1 |
| `fadeInUp` | opacity 0→1 + translateY(30px→0) |
| `fadeInLeft` | opacity 0→1 + translateX(-30px→0) |

All triggered by IntersectionObserver via `.animate-on-scroll` + `data-animation` + `data-delay`.

Animation duration: **0.8s** (all scroll animations)

Transition duration: **0.3s** (all hover effects)

Prefer CSS animations whenever possible.

Use JavaScript only when necessary (Swiper, IntersectionObserver).

---

# Layout

The design relies heavily on whitespace.

Never reduce spacing just to fit more content.

Keep sections well separated.

Preserve alignment.

Grid system: Flexbox throughout. No CSS Grid used.

---

# Responsiveness

Every component must be tested on:

- Desktop (1440px reference)
- Laptop (1200px)
- Tablet (≤1024px)
- Mobile (≤767px, reference: 375px)

Nothing should overflow.

Nothing should jump unexpectedly.

---

# Accessibility

Every interactive element must:

- have keyboard support
- visible focus outline
- semantic HTML
- proper labels (forms)

---

# Performance

Target: Lighthouse 95+

Images:

- Explicit width/height on all `<img>` tags
- `loading="lazy"` on below-fold images
- `loading="eager"` on hero images

Fonts:

- Loaded via CSS @import with `display=swap`

JavaScript:

- All `<script>` tags placed before `</body>`
- No render-blocking JS

---

# Visual Consistency

Whenever creating a new section, ask:

"Does this look like it was originally designed for Q-Guard?"

If the answer is no:

Redesign it until it naturally fits the rest of the website.

---

# Absolute Rule

The user experience always has priority.

The visitor should never be able to distinguish between:

- the original WordPress version
- the migrated static version

Both should be visually and functionally identical.
