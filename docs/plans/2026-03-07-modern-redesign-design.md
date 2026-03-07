# Kayla's Desserts — Modern Redesign Design

**Goal:** Transform the site from cute/childish to modern food brand aesthetic. Bold typography, high contrast, photography-forward. Fun but credible — a real business that shows value.

**Stack:** Unchanged — vanilla HTML5, CSS3, JavaScript ES6+. Deploys to Vercel/GitHub Pages as static files.

**Reference:** https://godly.website/ for modern design patterns.

---

## Color Palette

| Variable | Old | New | Purpose |
|----------|-----|-----|---------|
| `--dark` | `#2D2D2D` | `#1A1A1A` | Headings, footer, overlays |
| `--pink` | `#FFB6C1` | `#E8587A` | Brand accent — deeper, confident |
| `--cream` | `#FFF8F0` | `#FAFAFA` | Background — cleaner white |
| `--pink-light` | `#FFD6DD` | `#FFF0F3` | Hover states only |
| `--lavender` | `#E6D5F5` | REMOVED | — |
| `--mint` | `#B5EAD7` | REMOVED | — |
| NEW `--gray` | — | `#6B7280` | Subdued text, descriptions |
| NEW `--gray-light` | — | `#F3F4F6` | Card backgrounds, dividers |

One accent (pink), one dark, lots of white space. Food photos provide the color.

## Typography

- **Pacifico:** ONLY on brand name ("Kayla's Desserts" in nav + hero)
- **Headings (h2, h3):** Inter or DM Sans, weight 700-800. Uppercase with letter-spacing.
- **Body:** Nunito stays
- **Prices:** Bold, dark, larger — not pink
- **Section headings:** Uppercase + letter-spacing (e.g., "SWEET REVIEWS", "OUR MENU")

## Menu Cards — Photo-Forward

- Real photo fills top 60% of card via `<img>` tag
- JS menu data gets `image` field — empty = styled placeholder (brand color + item name, no emoji)
- Clean white card body: name, description, price, add to cart
- Border-radius `12px` (less aggressive than current `16px`)
- Subtle shadow, NO glassmorphism blur
- Remove category-colored gradient backgrounds
- All images: `loading="lazy"`, CSS `aspect-ratio: 4/3`

## Image System

```
kaylas-desserts/
  images/
    hero.jpg
    about.jpg
    menu/
      churro-cheesecake.jpg
      mini-cakes.jpg
      mini-flans.jpg
      fresa-con-crema.jpg
      brownies.jpg
      chocolate-covered-fruit.jpg
      cake-pops.jpg
      cookies.jpg
```

- Menu items reference via `image: "images/menu/churro-cheesecake.jpg"`
- Empty image field = styled fallback placeholder (not emoji)
- Glenn manually adds photos as Kayla provides them

## Reviews Section

- CSS star icons (brand pink) replace emoji stars
- White cards on `--gray-light` background
- Larger quote text, bolder author name
- 2-col grid desktop, 1-col mobile
- Glenn manually updates review text as they come in

## Hero

- Prepared for full-bleed background image with dark overlay
- Falls back to clean gradient until real photo arrives
- Remove bouncing cupcake emoji
- Bold CTAs: solid pink button + outlined dark button

## What Stays vs Goes

**Keep:** FAQ accordion, scroll progress bar, cart system + EmailJS, hamburger nav, fade-in animations, toast notifications, dev credit, OG meta tags, Pacifico on brand name, category tabs

**Remove:** Bouncing cupcake, emoji card images, pastel gradient hero, glassmorphism blur on cards, animated gradient text on h1, dot pattern backgrounds, floating blob animations, emoji star ratings, Pacifico on all headings, noise texture overlay, lavender/mint color variables

## Functionality

Zero changes to cart, order form, EmailJS, FAQ accordion, or any JS logic. This is purely a visual redesign.
