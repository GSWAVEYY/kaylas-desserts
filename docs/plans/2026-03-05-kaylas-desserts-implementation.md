# Kayla's Desserts Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a professional, playful single-page dessert ordering website with menu, cart, order form, and EmailJS integration.

**Architecture:** Single-page static site (index.html + styles.css + script.js). No build tools. Menu data lives in JS. Cart state in memory. Orders submitted via EmailJS to Kayla's email. Deployed on GitHub Pages.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), vanilla JS (ES6+), Google Fonts, EmailJS SDK, GitHub Pages.

---

### Task 1: HTML Structure + Google Fonts

**Files:**
- Create: `index.html`

**Step 1: Create the full HTML skeleton**

Build `index.html` with:
- DOCTYPE, meta viewport, charset
- Google Fonts link (Pacifico for headings, Nunito for body)
- EmailJS SDK script tag (cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js)
- Link to `styles.css`
- Script tag for `script.js` (defer)
- All 6 sections with semantic HTML:
  - `<header id="hero">` - nav + logo + tagline + 2 CTA buttons
  - `<section id="menu">` - heading + category tab buttons + grid container for cards
  - `<section id="order">` - heading + cart summary div + order form (date, delivery dropdown, special instructions, submit)
  - `<section id="payment">` - heading + 3 payment method cards (Zelle, Cash App, Cash)
  - `<section id="about">` - heading + image placeholder + bio text
  - `<footer>` - Instagram link, contact, copyright

Menu cards should be empty containers — JS will populate them.

**Step 2: Verify**

Open `index.html` in browser. Should see raw unstyled content with all sections visible.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add HTML structure with all sections"
```

---

### Task 2: CSS Foundation + Custom Properties

**Files:**
- Create: `styles.css`

**Step 1: Define CSS custom properties and base styles**

```css
:root {
  --pink: #FFB6C1;
  --lavender: #E6D5F5;
  --mint: #B5EAD7;
  --cream: #FFF8F0;
  --dark: #2D2D2D;
  --pink-light: #FFD6DD;
  --lavender-light: #F0E6FA;
  --mint-light: #D4F5E9;
  --shadow: 0 4px 15px rgba(0,0,0,0.08);
  --radius: 16px;
  --transition: all 0.3s ease;
}
```

Build mobile-first base styles:
- Box-sizing border-box reset
- Body: Nunito font, cream background, dark text, smooth scroll behavior
- All headings: Pacifico font
- Container utility class: max-width 1200px, centered, padding
- Section spacing: generous padding (80px vertical)
- Smooth scroll: `html { scroll-behavior: smooth; }`

**Step 2: Verify**

Refresh browser. Fonts should load, cream background visible, proper spacing.

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add CSS foundation with custom properties and base styles"
```

---

### Task 3: Hero Section Styling

**Files:**
- Modify: `styles.css`

**Step 1: Style the hero section**

- Full viewport height (min-height: 100vh), centered content
- Pastel gradient background: linear-gradient from pink-light through lavender-light to mint-light
- Logo text styled large with Pacifico
- Tagline with Nunito, slightly transparent
- Two CTA buttons: pill-shaped (border-radius 50px), one pink fill, one outline
- Button hover: gentle scale(1.05) + shadow increase
- Subtle floating animation on a decorative element (CSS keyframes, gentle up/down bob)

**Step 2: Verify**

Refresh. Hero should fill the screen with gradient, centered text, two buttons. Check mobile width (375px).

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: style hero section with gradient and CTAs"
```

---

### Task 4: Menu Section Styling

**Files:**
- Modify: `styles.css`

**Step 1: Style menu tabs and card grid**

Category tabs:
- Horizontal row of pill buttons, scrollable on mobile
- Active tab: filled pastel color, inactive: outline
- Smooth color transition on hover/active

Menu cards:
- CSS Grid: 1 column mobile, 2 tablet, 3 desktop
- Each card: white background, rounded corners (var(--radius)), soft shadow
- Image area: 200px height, rounded top corners, object-fit cover, placeholder bg color
- Card body: name (bold), description (small, muted), price (pink, bold)
- "Add to Cart" button: mint background, white text, pill shape
- Hover: card lifts (translateY(-4px) + shadow increase), button darkens

**Step 2: Verify**

Refresh. Cards should show as a grid (empty images for now). Test responsive breakpoints.

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: style menu section with card grid and tabs"
```

---

### Task 5: Order Form + Payment + About + Footer Styling

**Files:**
- Modify: `styles.css`

**Step 1: Style remaining sections**

Order section:
- Cart summary: bordered box with item list, quantities, subtotal
- Form inputs: rounded borders, pastel focus rings, generous padding
- Delivery dropdown styled to match
- Date picker styled
- Submit button: large, pink gradient, white text, hover scale
- Empty cart state message

Payment section:
- 3 cards in a row (stack on mobile): icon/emoji + name + details
- Soft pastel backgrounds (one pink, one lavender, one mint)

About section:
- Two-column layout (stack on mobile): image left, text right
- Image placeholder: rounded, pastel border
- Warm, inviting text styling

Footer:
- Dark background (var(--dark)), light text
- Instagram link styled with hover effect
- Simple centered layout

**Step 2: Verify**

Full page scroll. All sections styled. Mobile responsive.

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: style order form, payment, about, and footer sections"
```

---

### Task 6: JavaScript — Menu Data + Rendering

**Files:**
- Create: `script.js`

**Step 1: Define menu data and render functions**

Menu data array with objects:
```js
const menuItems = [
  { id: 1, name: "Red Velvet White Chocolate Chip Cookie", category: "cookies", price: 0, description: "Rich red velvet dough loaded with white chocolate chips", image: "" },
  // ... all 9 items
];
```

Note: Prices set to 0 as placeholders — Kayla will provide real prices.

Functions:
- `renderMenu(category)` — filters items, creates card HTML, injects into grid container
- Category tab click handlers — call renderMenu with selected category, update active tab
- `renderMenu('all')` on page load to show everything

**Step 2: Verify**

Refresh. Menu cards should appear with names, descriptions, placeholder images, "Add to Cart" buttons.

**Step 3: Commit**

```bash
git add script.js
git commit -m "feat: add menu data and rendering logic"
```

---

### Task 7: JavaScript — Cart System

**Files:**
- Modify: `script.js`

**Step 1: Build cart logic**

```js
let cart = [];
```

Functions:
- `addToCart(itemId)` — find item, add to cart array (or increment quantity if exists)
- `removeFromCart(itemId)` — remove item or decrement quantity
- `updateCartUI()` — render cart summary in order section (item names, quantities, +/- buttons, subtotal)
- `getCartTotal()` — sum prices * quantities + delivery fee
- Cart badge on nav showing item count
- "Add to Cart" buttons call `addToCart()`, show brief toast/animation confirming add

Delivery fee logic:
- Read delivery dropdown value
- Pickup: $0, Rancho: $10, Sacramento: $17.50, Farther: $22.50
- Recalculate on dropdown change

**Step 2: Verify**

Click "Add to Cart" on items. Cart summary updates. Change delivery zone, total updates. Remove items works.

**Step 3: Commit**

```bash
git add script.js
git commit -m "feat: add cart system with delivery pricing"
```

---

### Task 8: JavaScript — Order Form + Date Validation

**Files:**
- Modify: `script.js`

**Step 1: Add form handling**

Date picker:
- Set min date to tomorrow (24hr advance requirement)
- Disable past dates

Form validation:
- Cart not empty
- Date selected and >= 24hrs from now
- Delivery zone selected
- Show inline error messages (styled in CSS already)

Form submit handler:
- Prevent default
- Validate all fields
- If valid, proceed to EmailJS send (Task 9)
- If invalid, highlight errors with pastel red border + message

**Step 2: Verify**

Try submitting empty form — errors appear. Add items, fill form correctly — validation passes (submit won't send yet).

**Step 3: Commit**

```bash
git add script.js
git commit -m "feat: add order form validation with date logic"
```

---

### Task 9: JavaScript — EmailJS Integration

**Files:**
- Modify: `script.js`

**Step 1: Wire up EmailJS**

At top of script:
```js
emailjs.init("PUBLIC_KEY_HERE"); // Kayla will need to create EmailJS account
```

On valid form submit:
- Build template params object with: items list, quantities, total, delivery zone, delivery fee, pickup/delivery choice, date, special instructions, customer name (add name field to form)
- Call `emailjs.send(serviceId, templateId, templateParams)`
- On success: show confirmation overlay/modal ("Order submitted! Kayla will confirm shortly.")
- On error: show error message ("Something went wrong, please try again or DM @kaylas_desserts_05")
- Disable submit button during send to prevent double-submit
- Clear cart after successful send

Note: EmailJS requires account setup. Add placeholder IDs with comments explaining setup steps.

**Step 2: Verify**

Submit order — should attempt EmailJS call (will fail with placeholder keys, that's expected). Confirmation/error UI should appear.

**Step 3: Commit**

```bash
git add script.js index.html
git commit -m "feat: add EmailJS integration for order submissions"
```

---

### Task 10: Scroll Animations

**Files:**
- Modify: `script.js`
- Modify: `styles.css`

**Step 1: Add Intersection Observer scroll animations**

CSS:
```css
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

JS — IntersectionObserver:
- Select all sections and cards with `.fade-in` class
- Observe each, add `.visible` when intersecting (threshold 0.1)
- Add `.fade-in` class to all section headings, cards, and content blocks in HTML

**Step 2: Add smooth nav scroll**

Nav links use `href="#section-id"` — CSS `scroll-behavior: smooth` handles it. Add active nav state on scroll.

**Step 3: Verify**

Scroll down the page. Sections fade in as they enter viewport.

**Step 4: Commit**

```bash
git add styles.css script.js index.html
git commit -m "feat: add scroll animations and smooth navigation"
```

---

### Task 11: Placeholder Images + Final Polish

**Files:**
- Create: `images/` directory
- Modify: `index.html`
- Modify: `styles.css`

**Step 1: Add placeholder system for images**

- Create `images/` directory
- Use CSS gradient placeholders for menu item images (each category gets a different pastel gradient)
- Add a placeholder for the about section photo
- Add emoji overlays on placeholders (cookie emoji for cookies, cake for cakes, etc.)
- Add a comment in HTML noting where to replace with real photos

**Step 2: Add favicon**

- Use an emoji favicon via SVG data URI in the head:
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧁</text></svg>">
```

**Step 3: Final CSS polish**

- Ensure all breakpoints work (375px, 768px, 1024px, 1200px)
- Add loading state for order submission
- Add print styles (hide nav, show order details)
- Check contrast ratios for accessibility

**Step 4: Verify**

Full scroll-through on mobile and desktop widths. Everything looks polished.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add placeholder images, favicon, and responsive polish"
```

---

### Task 12: GitHub Pages Setup + README

**Files:**
- Modify: `README.md`

**Step 1: Update README**

Add:
- Project name and description
- Live site link (https://gswaveyy.github.io/kaylas-desserts/)
- EmailJS setup instructions for Kayla
- How to update menu items (edit the array in script.js)
- How to add real photos (replace files in images/)

**Step 2: Push and enable GitHub Pages**

```bash
git push origin main
gh api repos/GSWAVEYY/kaylas-desserts/pages -X POST -f source.branch=main -f source.path=/
```

**Step 3: Verify**

Visit https://gswaveyy.github.io/kaylas-desserts/ — site should be live.

**Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup instructions"
git push origin main
```
