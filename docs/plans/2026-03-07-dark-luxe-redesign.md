# Dark Luxe Visual Redesign — Kayla's Desserts

## Vision
Transform from a pastel bakery site into a premium dark-theme experience that reads like a Michelin-starred restaurant brand. Portfolio showstopper with advanced CSS/JS interactions. No photos — the typography, spacing, and motion ARE the design.

## Constraints
- Vanilla HTML/CSS/JS only (no frameworks, no build tools)
- Locally hosted / GitHub Pages
- No product photography available
- Must remain functional (cart, order form, EmailJS integration)

## Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0A0A0A` | Page background |
| `--surface` | `#111111` | Card/section surfaces |
| `--surface-light` | `#1A1A1A` | Elevated surfaces, inputs |
| `--crimson` | `#C41E3A` | Primary accent (CTAs, highlights) |
| `--gold` | `#D4A853` | Secondary accent (borders, icons, prices) |
| `--cream` | `#F5F0E8` | Primary text |
| `--muted` | `#8A8A8A` | Secondary text |
| `--blue-hint` | `#1A2332` | Subtle background gradients |
| `--glow-crimson` | `rgba(196, 30, 58, 0.15)` | Hover glows |
| `--glow-gold` | `rgba(212, 168, 83, 0.12)` | Accent glows |

## Typography
| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headings | Playfair Display | 700, 900 | Serif, editorial, luxury feel |
| Body | Inter | 400, 500, 600 | Clean readability on dark |
| Logo/Accent | Cormorant Garamond | 500 italic | Elegant brand identity |

## Layout Structure (top to bottom)
1. **Nav** — transparent → frosted dark glass on scroll, gold accents
2. **Hero** — full viewport, massive Playfair heading with gold gradient, particle field, radial crimson glow
3. **About** — asymmetric two-column, gold divider monogram, parallax depth
4. **Menu** — dark glass cards, Playfair item names (no emoji), 3D tilt on hover, crimson glow lift
5. **Testimonials** — large gold quote marks, gold left-border accent, staggered grid
6. **Order** — dark glass form card, gold underline inputs, glowing focus states
7. **Payment** — three dark glass cards, gold icon accents, hover lift + gold border
8. **FAQ** — accordion with gold icons, gold left-border on open
9. **Footer** — minimal, gold top border, gold pill Instagram link

## Showstopper Interactions
1. **Gold particle field** — 30-40 CSS-animated gold dots in hero, randomized float paths
2. **Cinematic scroll reveals** — staggered slide-up + blur-to-sharp on viewport entry
3. **Custom cursor** — gold ring on desktop, scales on hover over interactive elements
4. **3D card tilt** — menu cards respond to mouse position (5-8 deg max via CSS perspective)
5. **Magnetic buttons** — CTAs pull toward cursor within ~50px approach radius
6. **Gold scroll progress bar** — thin line across viewport top
7. **Text split animations** — section headings animate word-by-word on scroll entry
8. **Parallax depth layers** — sections at different scroll speeds for depth

## Design Principles (from Godly trends)
- Generous negative space: 140-160px section padding
- Asymmetric layouts with intentional visual weight
- Scroll-driven narrative: sections feel like chapters
- Analog grain texture at 0.03-0.04 opacity for warmth
- Modular grid with strategic padding
- Less is more: let typography and spacing do the work

## Menu Card Strategy (no photos)
Instead of image placeholders, each card gets a solid dark panel with the item name rendered in large Playfair Display serif. This makes the absence of photos feel like a deliberate fine-dining menu aesthetic — not a gap.

## Files Affected
- `styles.css` — full rewrite
- `index.html` — structural updates (class changes, particle elements, cursor div)
- `script.js` — new interactions (tilt, magnetic, cursor, text split, parallax)
