# Kayla's Desserts Modern Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the site from cute/pastel to a bold modern food brand aesthetic — dark/white/pink, photo-forward, professional typography.

**Architecture:** Pure CSS + HTML + minor JS changes. No functionality changes. Same cart, order form, EmailJS. Swap color variables, replace fonts, restructure card markup for real images, clean up decorative elements.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript ES6+. Google Fonts (Inter). No dependencies.

---

### Task 1: Color Palette + Font Swap

**Files:**
- Modify: `styles.css:1-18` (`:root` custom properties)
- Modify: `index.html:29` (Google Fonts link)

**Step 1: Update Google Fonts link in index.html**

Change line 29 from:
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Pacifico&display=swap" rel="stylesheet">
```
To:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@400;600;700&family=Pacifico&display=swap" rel="stylesheet">
```

**Step 2: Replace `:root` variables in styles.css**

Replace the entire `:root` block (lines 4-18) with:
```css
:root {
  --pink: #E8587A;
  --pink-light: #FFF0F3;
  --cream: #FAFAFA;
  --dark: #1A1A1A;
  --gray: #6B7280;
  --gray-light: #F3F4F6;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.1);
  --radius: 12px;
  --transition: all 0.3s ease;
  --transition-slow: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

**Step 3: Update heading font-family rule**

Change `h1, h2, h3` rule (line 55-57) from:
```css
h1, h2, h3 {
  font-family: 'Pacifico', cursive;
}
```
To:
```css
h1, h2, h3 {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
}
```

**Step 4: Commit**

```bash
git add styles.css index.html
git commit -m "feat: swap to modern palette and Inter heading font"
```

---

### Task 2: Remove Decorative Noise

**Files:**
- Modify: `styles.css` (multiple sections)

**Step 1: Remove noise texture overlay**

Delete the `body::after` block (lines 20-31):
```css
/* Noise texture overlay for warmth */
body::after { ... }
```

**Step 2: Remove dot pattern from menu section**

Delete `#menu::before` block (lines 517-524):
```css
#menu::before { ... }
```

**Step 3: Remove hero floating blobs**

Delete `#hero::before, #hero::after` and their individual rules (lines 328-353):
```css
#hero::before,
#hero::after { ... }
#hero::before { ... }
#hero::after { ... }
```

Delete `@keyframes blobFloat` (lines 355-360).

**Step 4: Remove animated gradient text on hero h1**

Replace `.hero-content h1` (lines 369-381) with:
```css
.hero-content h1 {
  font-family: 'Pacifico', cursive;
  font-size: 3rem;
  color: white;
  margin: 0 0 16px;
  line-height: 1.2;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
}
```

Delete `@keyframes textGradient` (lines 383-387).

**Step 5: Remove bouncing cupcake**

Delete `.hero-decoration` and `@keyframes gentleBob` (lines 462-473).

**Step 6: Remove diagonal split from about section**

Delete `#about::before` (lines 1256-1262).

**Step 7: Remove payment radial gradients**

Delete `#payment::before` (lines 1069-1076).

**Step 8: Commit**

```bash
git add styles.css
git commit -m "feat: strip decorative noise — blobs, grain, dot patterns, animated text"
```

---

### Task 3: Hero Section — Modern Bold

**Files:**
- Modify: `styles.css` (hero section)
- Modify: `index.html:58-69` (hero markup)

**Step 1: Update hero HTML**

Replace lines 58-69 with:
```html
  <!-- Hero / Header -->
  <header id="hero">
    <div class="hero-overlay"></div>
    <div class="container hero-content">
      <h1>Kayla's Desserts</h1>
      <p class="tagline">Homemade Treats in Sacramento</p>
      <div class="hero-ctas">
        <a href="#menu" class="btn btn-primary">View Menu</a>
        <a href="#order" class="btn btn-secondary">Place Order</a>
      </div>
    </div>
  </header>
```

**Step 2: Update hero CSS**

Replace the hero section CSS with:
```css
#hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
  background-size: cover;
  background-position: center;
  text-align: center;
  padding: 120px 20px 80px;
  position: relative;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
}
```

Note: When a real hero photo arrives, add `background-image: url('images/hero.jpg');` to `#hero` and the overlay darkens it for text readability. Until then, the dark gradient looks clean.

**Step 3: Update tagline CSS**

```css
.tagline {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0 0 36px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
}
```

**Step 4: Update hero buttons**

```css
.btn-primary {
  background: var(--pink);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 10px 30px rgba(232, 88, 122, 0.35);
}

.btn-secondary {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.6);
  color: white;
}

.btn-secondary:hover {
  background: white;
  color: var(--dark);
  transform: translateY(-2px);
}
```

**Step 5: Commit**

```bash
git add styles.css index.html
git commit -m "feat: modern dark hero section with bold typography"
```

---

### Task 4: Section Headings — Uppercase Modern

**Files:**
- Modify: `styles.css` (section h2 styles)

**Step 1: Update section heading base styles**

Replace `section h2` and `section h2::after` (lines 478-505) with:
```css
section h2 {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 2rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--dark);
  position: relative;
  display: inline-block;
  padding-bottom: 12px;
}

section h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: var(--pink);
  border-radius: 3px;
}
```

**Step 2: Remove per-section h2 color overrides**

Remove `color: var(--pink)` from `#menu h2`, `#order h2`, `#payment h2`, `#about h2`, `#testimonials h2`, `#faq h2`. The headings are now `--dark` by default. Keep the centering rules.

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: uppercase Inter headings with pink underline accent"
```

---

### Task 5: Menu Cards — Photo-Ready

**Files:**
- Modify: `script.js:7-75` (menu data — add image field)
- Modify: `script.js:103-135` (renderMenu — use `<img>` tag)
- Modify: `styles.css` (card styles)

**Step 1: Add image field to menu data**

Add `image: ""` to each menu item in the `menuItems` array. Example:
```js
{
  id: 1, name: "Churro Cheesecake", category: "cakes", emoji: "cake",
  image: "",
  description: "Creamy cheesecake with a cinnamon churro twist",
  options: [ ... ]
},
```

When Glenn has real photos, he sets `image: "images/menu/churro-cheesecake.jpg"`.

**Step 2: Update renderMenu to use image or fallback**

Replace the card-image section in the template string:
```js
const imageHtml = item.image
  ? `<img src="${item.image}" alt="${item.name}" loading="lazy">`
  : `<div class="card-placeholder"><span>${item.name}</span></div>`;

return `
  <div class="menu-card fade-in" data-category="${item.category}" style="--delay: ${index * 0.08}s">
    <div class="card-image">${imageHtml}</div>
    <div class="card-body">
      <h3 class="card-name">${item.name}</h3>
      <p class="card-description">${item.description}</p>
      ${priceDisplay}
      ${optionsHtml}
      <button class="card-btn" onclick="addToCart(${item.id})">Add to Cart</button>
    </div>
  </div>
`;
```

**Step 3: Update card CSS**

Replace menu card styles with:
```css
.menu-card {
  background: white;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition-slow);
  transition-delay: var(--delay, 0s);
}

.menu-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.card-image {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  position: relative;
  background: var(--gray-light);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.menu-card:hover .card-image img {
  transform: scale(1.05);
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--pink-light), var(--gray-light));
  padding: 20px;
  text-align: center;
}

.card-placeholder span {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--gray);
}
```

Remove category-specific hover shadows (`.menu-card[data-category="cakes"]:hover` etc).
Remove old `.card-image > span` zoom rules.

**Step 4: Update card body styles**

```css
.card-price {
  font-weight: 800;
  color: var(--dark);
  font-size: 1.15rem;
}

.card-btn {
  background: var(--pink);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  width: 100%;
  margin-top: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.card-btn:hover {
  background: #D4456A;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(232, 88, 122, 0.3);
}
```

**Step 5: Commit**

```bash
git add script.js styles.css
git commit -m "feat: photo-ready menu cards with fallback placeholders"
```

---

### Task 6: Testimonials — Clean Modern

**Files:**
- Modify: `styles.css` (testimonials section)
- Modify: `index.html:86-125` (update star markup)

**Step 1: Replace emoji stars in HTML**

In each testimonial card, change:
```html
<div class="stars">star star star star star</div>
```
To:
```html
<div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
```

**Step 2: Update testimonials CSS**

```css
#testimonials {
  background: var(--gray-light);
  position: relative;
}

.testimonial-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: var(--shadow);
  transition: var(--transition-slow);
  position: relative;
}

.testimonial-card::before {
  content: '\201C';
  position: absolute;
  top: 12px;
  left: 16px;
  font-size: 4rem;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  color: var(--pink);
  opacity: 0.15;
  line-height: 1;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stars {
  font-size: 0.95rem;
  letter-spacing: 2px;
  margin-bottom: 12px;
  color: var(--pink);
}

.testimonial-quote {
  font-style: italic;
  line-height: 1.7;
  color: var(--dark);
  margin: 0 0 16px;
  font-size: 0.95rem;
  position: relative;
  z-index: 1;
}

.author-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--dark);
}

.author-order {
  font-size: 0.8rem;
  color: var(--gray);
  font-weight: 600;
}
```

**Step 3: Commit**

```bash
git add styles.css index.html
git commit -m "feat: clean modern testimonials with CSS stars"
```

---

### Task 7: Navigation — Sharper

**Files:**
- Modify: `styles.css` (nav section)

**Step 1: Update nav styles**

```css
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: var(--transition);
  border-bottom: 1px solid transparent;
}

nav.scrolled {
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid var(--gray-light);
}
```

Remove `nav.scrolled::after` (the gradient line — too playful).

**Step 2: Update logo**

```css
.logo {
  font-family: 'Pacifico', cursive;
  color: var(--dark);
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

**Step 3: Update nav link underline**

```css
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--pink);
  transition: var(--transition);
  border-radius: 2px;
}
```

**Step 4: Update scroll progress bar**

```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--pink);
  z-index: 1000;
  transition: width 0.1s linear;
}
```

Remove `background-size`, `animation`, and `@keyframes progressGradient`.

**Step 5: Commit**

```bash
git add styles.css
git commit -m "feat: sharp minimal navigation and progress bar"
```

---

### Task 8: FAQ, Payment, Footer, About — Modernize

**Files:**
- Modify: `styles.css` (multiple sections)
- Modify: `index.html` (footer, hero emoji removal)

**Step 1: FAQ styles update**

```css
#faq {
  background: white;
}

.faq-item {
  margin-bottom: 8px;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--gray-light);
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: none;
  transition: var(--transition);
}

.faq-item:hover {
  background: #EDEEF0;
}

.faq-question:hover {
  color: var(--pink);
}

.faq-icon {
  color: var(--pink);
}
```

Remove backdrop-filter/glassmorphism from FAQ items.

**Step 2: Payment cards update**

```css
.payment-card {
  text-align: center;
  padding: 36px 24px;
  border-radius: var(--radius);
  transition: var(--transition-slow);
  background: var(--gray-light);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.payment-card:nth-child(1),
.payment-card:nth-child(2),
.payment-card:nth-child(3) {
  background: var(--gray-light);
}

.payment-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}
```

Remove per-card colored backgrounds and colored hover shadows. Remove backdrop-filter.

**Step 3: About section update**

```css
#about {
  background: var(--gray-light);
  position: relative;
}

.image-placeholder {
  height: 300px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--pink-light), var(--gray-light));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--gray);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  box-shadow: var(--shadow);
}
```

**Step 4: Footer update**

```css
footer {
  background: var(--dark);
  color: white;
  text-align: center;
  padding: 50px 20px;
}

.social-link {
  display: inline-block;
  padding: 12px 28px;
  background: var(--pink);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  margin-bottom: 16px;
  transition: var(--transition);
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(232, 88, 122, 0.4);
}
```

Remove `.social-link::before` glow animation and `@keyframes socialGlow`.

**Step 5: Remove cupcake emoji from hero h1 in index.html**

Line 61, change:
```html
<h1>Kayla's Desserts</h1>
```
(Already done in Task 3 hero markup update — verify it's clean.)

**Step 6: Update order section background**

```css
#order {
  background: white;
  position: relative;
}
```

Remove glassmorphism from cart summary and form inputs — use clean white + border instead:
```css
#cart-summary {
  background: var(--gray-light);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: none;
  margin-bottom: 36px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  font-size: 1rem;
  font-family: inherit;
  background: white;
  transition: var(--transition);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--pink);
  outline: none;
  box-shadow: 0 0 0 3px rgba(232, 88, 122, 0.12);
  background: white;
}
```

Update submit button:
```css
#order-form .btn-primary {
  width: 100%;
  font-size: 1.1rem;
  padding: 16px;
  background: var(--pink);
  color: white;
  border: none;
}

#order-form .btn-primary:hover {
  background: #D4456A;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(232, 88, 122, 0.35);
}
```

**Step 7: Commit**

```bash
git add styles.css index.html
git commit -m "feat: modernize FAQ, payment, footer, about, and order sections"
```

---

### Task 9: SVG Divider + Responsive Cleanup

**Files:**
- Modify: `index.html` (SVG divider fill colors)
- Modify: `styles.css` (responsive breakpoints)

**Step 1: Update SVG divider fill colors**

Menu-to-Order divider (line 128): change `fill="#FFF8F0"` to `fill="#FFFFFF"` (order section is now white).

Wave divider above footer: keep as-is (`fill="#2D2D2D"` for dark footer — close enough to `#1A1A1A`, or update to `fill="#1A1A1A"`).

**Step 2: Responsive — update tagline tablet size**

In the 768px breakpoint, update:
```css
.tagline {
  font-size: 1.2rem;
}
```

**Step 3: Verify mobile nav overlay uses new colors**

Update `.nav-links.mobile-open`:
```css
.nav-links.mobile-open {
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```

**Step 4: Create images directory**

```bash
mkdir -p images/menu
```

**Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "feat: update dividers, responsive tweaks, create image directories"
```

---

### Task 10: Final Cleanup + Verify + Push

**Step 1: Remove unused CSS**

Search for and remove any remaining references to:
- `--lavender`, `--lavender-light`, `--mint`, `--mint-light`
- `categoryGradients` lavender/mint references in script.js
- Any remaining `backdrop-filter` on cards (keep on nav only)
- `@keyframes progressGradient`

Update `categoryGradients` in script.js to use new palette:
```js
const categoryGradients = {
  cakes: "linear-gradient(135deg, #FFF0F3, #FFE4E9)",
  desserts: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
  treats: "linear-gradient(135deg, #FFF0F3, #F3F4F6)",
};
```

Note: These gradients are only used as fallback card backgrounds when no photo exists.

**Step 2: Full browser scroll-through verification**

- Desktop (1200px+): 3-col menu, 2-col testimonials, centered FAQ
- Tablet (768px): 2-col menu, 2-col testimonials
- Mobile (375px): single column, hamburger nav
- Click all FAQ items — accordion works
- Add items to cart — order flow works
- Dark hero looks clean
- No pastel colors visible anywhere except brand pink
- Cards are clean white with subtle shadows
- Headings are uppercase Inter, not Pacifico

**Step 3: Final commit + push**

```bash
git add -A
git commit -m "feat: final cleanup — remove unused palette, update gradients"
git push origin main
```
