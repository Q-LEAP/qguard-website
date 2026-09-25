# Alternative direction (branch `alternative`)

A proposal that shows visual kinship with [q-bot.eu](https://q-bot.eu/) (repo `Q-LEAP/qbot-website`) while the site stays unmistakably Q-Guard.

## Kept from Q-Guard (identity)
Violet `#4A3BEB` / `#4440DB`, Lato, the wave hero, the midnight `#0E0D2C` dark section, page structure, every word of content, all original entrance animations.

## Borrowed from Q-BOT (component language), mapped teal → violet, black → midnight
| Q-BOT | Q-Guard alternative |
|---|---|
| Dark glass nav with hairline, filled teal CTA | Midnight glass sticky nav + hairline; "Book a demo" filled (white on the hero, violet once sticky, lavender on hover) |
| Two-tone hero title (white + teal) | First part white, "Based on User Behaviors" in lavender `#C9C4FF` |
| Bordered section badges | The existing uppercase labels (Powerful Q-Guard, For all testers, What Q-Guard do, The human element) become bordered pills; none added |
| Product stage with lit grid | The three "What Q-Guard do" sections share one continuous violet grid with a top glow |
| Hairline cards, cursor spotlight | Service cards: 1px lavender hairline, 16px radius, spotlight following the pointer (mouse only, off with reduced motion) |
| Near-black footer, round back-to-top | Midnight footer with hairlines, round glass back-to-top |

Deliberately not borrowed: parallax, magnetic buttons, extra scroll animations (one interactive accent is enough), Roboto (Lato carries Q-Guard's voice).

## Implementation
- `assets/css/alternative.css`, linked after `main.css` on the 6 pages: remove the `<link>` to fall back to the 1:1 site.
- `index.html`: `qg-stage` classes on sections `8493a06`, `d5fb4af`, `6bf96d8`; `<span class="qg-title-tone">` in the hero title (text unchanged).
- `assets/js/main.js` → `initProductStage()`: grid alignment across the stacked sections and the card spotlight.
