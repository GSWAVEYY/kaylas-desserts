# Kayla's Desserts — Visual & Feature Upgrade Design

## Goals
1. Elevate the site from functional to portfolio-quality — look like a $500-1000 build at $0 cost
2. Add missing trust/conversion features that help Kayla get more orders
3. Make the site impressive enough to drive development business for Glenn when people ask "who made this?"

## Constraints
- Vanilla HTML/CSS/JS only — no frameworks, no build tools, no dependencies
- Free hosting (GitHub Pages, potentially Vercel later)
- Kayla is non-technical — any content she needs to update must be dead simple HTML copy-paste
- Keep the existing menu, cart, order form, and EmailJS integration untouched

## Brand Identity
- Logo: Text-based — "Kayla's Desserts" in Pacifico font + cupcake emoji
- Palette: Pastel pink/lavender/mint (unchanged)
- Personality: Warm homemade feel + modern social-media-native polish

---

## Feature 1: Open Graph Meta Tags + Share Card (Priority #1)

Social/word-of-mouth is Kayla's growth engine. Every link share must sell before anyone clicks.

**Implementation:**
- OG title: "Kayla's Desserts — Homemade Treats in Sacramento"
- OG description: "Fresh-baked cookies, cakes, dessert cups & more. Order online for pickup or delivery!"
- OG image: Static 1200x630 branded card — pastel gradient + "Kayla's Desserts" in Pacifico + cupcake emoji
- Twitter card meta tags
- Theme-color meta tag (pastel pink for mobile browser chrome)

**OG image approach:** Create as an actual image file (can screenshot a styled HTML card or create a simple SVG/PNG). Needs to be a real hosted image URL for previews to work.

## Feature 2: Consistent Logo Treatment

Unify the cupcake emoji + Pacifico text as her brand mark across:
- Nav bar
- Hero section
- OG share image
- Footer

No changes to the favicon (already cupcake emoji SVG).

## Feature 3: Testimonials Section

**Placement:** After menu, before order form.

**Layout:**
- Heading: "Sweet Reviews" or "What Our Customers Say"
- 4-6 real customer review cards in a responsive grid (1 col mobile, 2 tablet, 3 desktop)
- Each card: quote (italics), customer first name + last initial, what they ordered, 5 star rating
- Static cards, no carousel
- Glassmorphism card style consistent with menu cards
- Placeholder quotes until Glenn collects real reviews

**HTML structure designed for easy copy-paste to add/remove reviews.**

## Feature 4: FAQ Accordion

**Placement:** After payment section, before about section.

**Layout:**
- Heading: "Common Questions"
- Accordion — click to expand, smooth CSS max-height transition
- Only one open at a time
- Subtle +/- icon that rotates on toggle
- Pastel-styled borders and backgrounds

**Questions (6):**
1. How far in advance do I need to order?
2. What areas do you deliver to?
3. Can I customize my order?
4. Do you accommodate allergies or dietary restrictions?
5. Do you take large orders or event/party orders?
6. What's your cancellation policy?

Draft answers included — Kayla personalizes in her voice.

## Feature 5: Developer Credit

**Placement:** Footer, below copyright.

**Format:** "Built by Glenn" — small, tasteful text link. Links to portfolio/business site when available. Standard industry practice, doesn't compete with Kayla's brand.

## Feature 6: Visual Polish (CSS-only)

**Noise texture:**
- Subtle grain overlay on cream background sections via CSS pseudo-element + SVG filter
- Adds handmade warmth, removes flat digital feel

**Typography tightening:**
- Increase heading/body size contrast
- Add letter-spacing on section subtexts
- Bolder price displays on menu cards

**Layered shadows:**
- Dual-layer shadows on cards (tight close shadow + soft spread shadow)
- More realistic depth than single flat shadow

**Button refinements:**
- Gradient transitions on hover
- More pronounced lift on card hover

**Animation timing:**
- Refine staggered fade-in delays on card grids
- Cards animate in sequentially, not all at once

---

## Section Order (final page flow)
1. Nav
2. Hero
3. Menu
4. Testimonials (NEW)
5. Order Form
6. Payment Methods
7. FAQ (NEW)
8. About
9. Footer (with dev credit — NEW)

## What's NOT Changing
- Menu data, cart system, order form logic, EmailJS integration
- Color palette
- Vanilla stack, no dependencies
- Single page, GitHub Pages hosting
