# Dark Luxe Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform kaylas-desserts from a pastel bakery site into a dark premium showstopper with advanced interactions.

**Architecture:** Full rewrite of styles.css (new palette + layout), targeted edits to index.html (structure + new elements), and new interaction systems in script.js (cursor, tilt, magnetic, particles, text animations). Each task is visually verifiable — open the site after each commit.

**Tech Stack:** Vanilla HTML/CSS/JS, Google Fonts, CSS custom properties, CSS @keyframes, JS IntersectionObserver, JS mousemove events.

**Design doc:** `docs/plans/2026-03-07-dark-luxe-redesign.md`

---

### Task 1: Foundation — CSS Custom Properties + Google Fonts + Base Reset

Swap the entire color system and font stack. After this task, the site will be dark with correct typography but broken layouts (that's fine — we fix those next).

**Files:**
- Modify: `index.html` (lines 23, 29 — theme-color meta + Google Fonts link)
- Modify: `styles.css` (lines 1-66 — custom properties + base reset)

**Step 1: Update index.html fonts and meta**

Replace the Google Fonts link with:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
```

Update theme-color to `#0A0A0A`.

Remove the Nunito and Pacifico font imports (no longer needed).

**Step 2: Rewrite CSS custom properties**

Replace `:root` block with:
```css
:root {
  --bg: #0A0A0A;
  --surface: #111111;
  --surface-light: #1A1A1A;
  --crimson: #C41E3A;
  --gold: #D4A853;
  --cream: #F5F0E8;
  --muted: #8A8A8A;
  --blue-hint: #1A2332;
  --glow-crimson: rgba(196, 30, 58, 0.15);
  --glow-gold: rgba(212, 168, 83, 0.12);
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.5);
  --radius: 12px;
  --transition: all 0.3s ease;
  --transition-slow: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

**Step 3: Update base styles**

```css
body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg);
  color: var(--cream);
  margin: 0;
  line-height: 1.6;
  overflow-x: hidden;
}

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
}
```

Update the grain texture overlay to `opacity: 0.035`.

**Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: dark luxe foundation — new palette, fonts, base reset"
```

---

### Task 2: Navigation — Transparent to Frosted Dark Glass

**Files:**
- Modify: `styles.css` (nav section, ~lines 109-300)

**Step 1: Rewrite nav styles**

```css
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: transparent;
  transition: background 0.4s ease, border-color 0.4s ease;
  border-bottom: 1px solid transparent;
}

nav.scrolled {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(212, 168, 83, 0.15);
}
```

Remove `nav.scrolled::after` (the old gradient underline).

**Step 2: Update logo**

```css
.logo {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  color: var(--gold);
  font-size: 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

**Step 3: Update nav links**

```css
.nav-links a {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--cream);
  transition: color 0.3s ease;
  position: relative;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--gold);
  transition: width 0.3s ease;
}

.nav-links a:hover {
  color: var(--gold);
}

.nav-links a:hover::after {
  width: 100%;
}
```

**Step 4: Update hamburger + mobile overlay for dark**

```css
.hamburger span {
  background: var(--cream);
}

.nav-links.mobile-open {
  background: rgba(10, 10, 10, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-links.mobile-open a {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: var(--cream);
}
```

**Step 5: Update cart button + badge**

```css
.cart-btn {
  color: var(--cream);
}

.cart-badge {
  background: var(--crimson);
}
```

**Step 6: Commit**

```bash
git add styles.css
git commit -m "feat: dark glass navigation with gold accents"
```

---

### Task 3: Hero — Gold Gradient Title + Radial Glow + Particles

**Files:**
- Modify: `styles.css` (hero section)
- Modify: `index.html` (add particle container to hero)

**Step 1: Add particle container to HTML**

Inside `<header id="hero">`, before `.hero-content`, add:
```html
<div class="hero-particles" aria-hidden="true"></div>
```

**Step 2: Rewrite hero CSS**

```css
#hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  text-align: center;
  padding: 120px 20px 80px;
  position: relative;
  overflow: hidden;
}

/* Radial crimson glow behind heading */
#hero::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--glow-crimson) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* Remove the old #hero::after blob */
```

**Step 3: Gold gradient heading**

```css
.hero-content h1 {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 4rem;
  background: linear-gradient(135deg, var(--gold), #E8C97A, var(--gold));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: goldShimmer 6s ease infinite;
  margin: 0 0 16px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

@keyframes goldShimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

**Step 4: Update tagline + CTAs**

```css
.tagline {
  color: var(--muted);
  font-size: 1rem;
  margin: 0 0 40px;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.btn-primary {
  background: linear-gradient(135deg, var(--gold), #E8C97A);
  color: var(--bg);
  font-weight: 700;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 10px 30px var(--glow-gold);
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
}

.btn-secondary:hover {
  background: var(--gold);
  color: var(--bg);
  transform: translateY(-2px);
}
```

**Step 5: CSS-only gold particles**

```css
.hero-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: var(--gold);
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat var(--duration) var(--delay) ease-in-out infinite;
}

@keyframes particleFloat {
  0% { opacity: 0; transform: translateY(100vh) scale(0); }
  10% { opacity: var(--opacity); }
  90% { opacity: var(--opacity); }
  100% { opacity: 0; transform: translateY(-20vh) scale(0); }
}
```

**Step 6: Generate particles in JS**

In `script.js`, add an `initParticles()` function:
```js
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.setProperty('--duration', (8 + Math.random() * 12) + 's');
    p.style.setProperty('--delay', (Math.random() * 10) + 's');
    p.style.setProperty('--opacity', (0.15 + Math.random() * 0.35).toString());
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    container.appendChild(p);
  }
}
```

Call `initParticles()` in the DOMContentLoaded handler.

Remove the old `hero-decoration` cupcake emoji div from HTML.

**Step 7: Responsive hero heading sizes**

```css
@media (min-width: 768px) {
  .hero-content h1 { font-size: 5.5rem; }
}
@media (min-width: 1024px) {
  .hero-content h1 { font-size: 7rem; }
}
```

**Step 8: Commit**

```bash
git add styles.css index.html script.js
git commit -m "feat: hero — gold gradient title, crimson glow, particle field"
```

---

### Task 4: About Section — Asymmetric Layout + Gold Divider

**Files:**
- Modify: `styles.css` (about section)
- Modify: `index.html` (replace image placeholder with gold monogram divider)

**Step 1: Replace photo placeholder in HTML**

Replace the `<div class="image-placeholder">📸</div>` with:
```html
<div class="about-monogram">
  <span class="monogram-letter">K</span>
  <div class="monogram-line"></div>
</div>
```

**Step 2: Restyle about section**

```css
#about {
  position: relative;
  overflow: hidden;
  background: var(--bg);
  padding: 160px 20px;
}

#about::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 20% 50%, rgba(26, 35, 50, 0.4) 0%, transparent 60%);
  pointer-events: none;
}

#about h2 {
  color: var(--gold);
  font-size: 2.5rem;
  margin: 0 0 60px;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.about-monogram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.monogram-letter {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 8rem;
  color: var(--gold);
  opacity: 0.2;
  line-height: 1;
}

.monogram-line {
  width: 60px;
  height: 1px;
  background: var(--gold);
  opacity: 0.3;
}

.about-text p {
  color: var(--cream);
  margin: 0 0 24px;
  line-height: 1.9;
  font-size: 1.05rem;
}

@media (min-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr 1.5fr;
    gap: 80px;
  }
}
```

**Step 3: Commit**

```bash
git add styles.css index.html
git commit -m "feat: about section — asymmetric layout with gold monogram"
```

---

### Task 5: Menu Section — Dark Glass Cards + Fine Dining Typography

**Files:**
- Modify: `styles.css` (menu section)
- Modify: `script.js` (update card rendering — remove emoji, use Playfair name panels)

**Step 1: Update JS card rendering**

Replace the card-image div in `renderMenu()` to use a dark panel with large serif name instead of emoji:

```js
// Replace the card-image section in the template:
<div class="card-image" style="background: var(--surface);">
  <span class="card-image-text">${item.name}</span>
</div>
```

Remove the `categoryGradients` object (no longer needed).

**Step 2: Restyle menu section**

```css
#menu {
  background: var(--bg);
  position: relative;
  overflow: hidden;
  padding: 160px 20px;
}

#menu::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(212, 168, 83, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

#menu h2 {
  color: var(--gold);
  font-size: 2.5rem;
  margin: 0 0 48px;
}
```

**Step 3: Dark glass cards**

```css
.menu-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius);
  overflow: hidden;
  transition: var(--transition-slow);
  transition-delay: var(--delay, 0s);
}

.menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(196, 30, 58, 0.12);
  border-color: rgba(212, 168, 83, 0.15);
}

.card-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface) !important;
  position: relative;
  overflow: hidden;
}

.card-image-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(245, 240, 232, 0.08);
  text-align: center;
  padding: 0 20px;
  transition: color 0.5s ease;
}

.menu-card:hover .card-image-text {
  color: rgba(245, 240, 232, 0.15);
}
```

**Step 4: Update card body elements**

```css
.card-body {
  padding: 24px;
}

.card-name {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--cream);
  margin: 0 0 4px;
}

.card-description {
  font-size: 0.85rem;
  color: var(--muted);
  margin: 8px 0;
  line-height: 1.6;
}

.card-price {
  font-weight: 700;
  color: var(--gold);
  font-size: 1.15rem;
}

.card-select {
  background: var(--surface-light);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--cream);
  border-radius: 8px;
}

.card-select:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px var(--glow-gold);
}

.card-btn {
  background: linear-gradient(135deg, var(--crimson), #D4243F);
  color: var(--cream);
  border: none;
  border-radius: 50px;
  font-weight: 600;
}

.card-btn:hover {
  box-shadow: 0 6px 20px var(--glow-crimson);
  transform: translateY(-2px);
}
```

**Step 5: Update category tabs for dark**

```css
.tab-btn {
  border: 1px solid rgba(212, 168, 83, 0.3);
  background: transparent;
  color: var(--gold);
  border-radius: 50px;
  padding: 10px 24px;
  font-weight: 500;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: var(--transition);
}

.tab-btn.active {
  background: var(--gold);
  color: var(--bg);
  border-color: var(--gold);
  box-shadow: 0 4px 15px var(--glow-gold);
}

.tab-btn:hover {
  background: rgba(212, 168, 83, 0.1);
  transform: translateY(-1px);
}

.tab-btn.active:hover {
  background: var(--gold);
}
```

**Step 6: Remove old category-specific hover shadows (data-category rules)**

Delete the `.menu-card[data-category="cakes"]:hover`, `[data-category="desserts"]:hover`, and `[data-category="treats"]:hover` rules — replaced by the unified crimson glow.

**Step 7: Commit**

```bash
git add styles.css script.js
git commit -m "feat: menu — dark glass cards with fine dining typography"
```

---

### Task 6: Testimonials, Order Form, Payment, FAQ, Footer — Dark Theme Pass

This is the bulk cleanup task — restyle all remaining sections for the dark theme.

**Files:**
- Modify: `styles.css` (testimonials, order, payment, FAQ, footer sections)
- Modify: `index.html` (update SVG divider fills to match dark, remove section-divider if needed)

**Step 1: Testimonials**

```css
#testimonials {
  background: var(--surface);
  padding: 160px 20px;
}

#testimonials h2 {
  color: var(--gold);
  font-size: 2.5rem;
  margin: 0 0 48px;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 2px solid var(--gold);
  border-radius: var(--radius);
  padding: 32px;
  transition: var(--transition-slow);
}

.testimonial-card::before {
  font-family: 'Playfair Display', serif;
  color: var(--gold);
  opacity: 0.15;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.testimonial-quote {
  color: var(--cream);
}

.author-name {
  color: var(--cream);
}

.author-order {
  color: var(--gold);
}
```

**Step 2: Order section**

```css
#order {
  background: var(--bg);
  padding: 160px 20px;
}

#order h2 {
  color: var(--gold);
  font-size: 2.5rem;
  margin: 0 0 48px;
}

#cart-summary {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius);
  padding: 24px;
}

.empty-cart-message {
  color: var(--muted);
}

.cart-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.cart-item-name { color: var(--cream); }
.cart-item-total { color: var(--cream); }
.cart-total-row { color: var(--cream); }
.cart-grand-total { color: var(--gold); border-top-color: rgba(212, 168, 83, 0.2); }

.cart-item-controls button {
  background: var(--surface-light);
  color: var(--cream);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-item-controls button:hover {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
}

.form-group label {
  color: var(--cream);
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0;
  color: var(--cream);
  padding: 14px 0;
  backdrop-filter: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-bottom-color: var(--gold);
  outline: none;
  box-shadow: 0 2px 8px var(--glow-gold);
  background: transparent;
}

#order-form .btn-primary {
  background: linear-gradient(135deg, var(--gold), #E8C97A);
  color: var(--bg);
  font-weight: 700;
}

#order-form .btn-primary:hover {
  box-shadow: 0 8px 25px var(--glow-gold);
}
```

**Step 3: Payment**

```css
#payment {
  background: var(--surface);
  padding: 160px 20px;
}

#payment::before {
  background: radial-gradient(ellipse at 30% 20%, rgba(26, 35, 50, 0.3) 0%, transparent 50%);
}

#payment h2 {
  color: var(--gold);
  font-size: 2.5rem;
  margin: 0 0 48px;
}

.payment-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius);
  padding: 40px 24px;
  transition: var(--transition-slow);
}

.payment-card:hover {
  transform: translateY(-8px);
  border-color: rgba(212, 168, 83, 0.2);
  box-shadow: var(--shadow-lg);
}

/* Remove all nth-child color overrides — unified dark glass */

.payment-card h3 {
  font-family: 'Playfair Display', serif;
  color: var(--cream);
  font-size: 1.3rem;
}

.payment-card p {
  color: var(--muted);
}

.payment-icon {
  font-size: 2.5rem;
}
```

**Step 4: FAQ**

```css
#faq {
  background: var(--bg);
  padding: 160px 20px;
}

#faq h2 {
  color: var(--gold);
  font-size: 2.5rem;
  margin: 0 0 48px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  margin-bottom: 12px;
  transition: var(--transition);
}

.faq-item.open {
  border-left: 2px solid var(--gold);
}

.faq-question {
  font-family: 'Inter', sans-serif;
  color: var(--cream);
  background: none;
  border: none;
}

.faq-question:hover {
  color: var(--gold);
}

.faq-icon {
  color: var(--gold);
}

.faq-answer p {
  color: var(--muted);
}
```

**Step 5: Footer**

```css
footer {
  background: var(--surface);
  color: var(--cream);
  padding: 60px 20px;
  border-top: 1px solid rgba(212, 168, 83, 0.1);
}

footer h2 {
  color: var(--gold);
}

.social-link {
  background: linear-gradient(135deg, var(--gold), #E8C97A);
  color: var(--bg);
  font-weight: 700;
}

.social-link:hover {
  box-shadow: 0 6px 20px var(--glow-gold);
}

/* Remove the old social-link::before glow animation */

.footer-notice { color: var(--muted); }
.copyright { color: var(--muted); opacity: 0.5; }
.dev-credit a { color: var(--gold); }
.dev-credit a:hover { color: #E8C97A; }
```

**Step 6: Update SVG dividers**

In `index.html`, update the SVG section-divider fill to `var(--bg)` or `#0A0A0A`, and the wave-divider footer fill to `#111111`.

**Step 7: Update toast notification**

```css
.toast-notification {
  background: linear-gradient(135deg, var(--crimson), #D4243F);
  box-shadow: 0 6px 20px var(--glow-crimson);
}
```

**Step 8: Update scroll progress bar**

```css
.scroll-progress {
  background: linear-gradient(90deg, var(--gold), var(--crimson), var(--gold));
  background-size: 300% 100%;
  height: 2px;
}
```

**Step 9: Update order confirmation overlay**

```css
.order-confirmation {
  background: rgba(0, 0, 0, 0.7);
}

.confirmation-content {
  background: var(--surface);
  border: 1px solid rgba(212, 168, 83, 0.15);
  color: var(--cream);
}

.confirmation-content h2 {
  color: var(--gold);
}

.confirmation-content .btn {
  background: linear-gradient(135deg, var(--gold), #E8C97A);
  color: var(--bg);
}
```

Also update the inline style in `script.js` `showConfirmation()` to match:
```js
<h2 style="font-family:'Playfair Display',serif;font-weight:700;color:#D4A853;">Order Submitted!</h2>
```

**Step 10: Commit**

```bash
git add styles.css index.html script.js
git commit -m "feat: dark theme pass — testimonials, order, payment, FAQ, footer"
```

---

### Task 7: Scroll Reveal System — Cinematic Blur-to-Sharp + Stagger

Replace the basic fade-in with a cinematic reveal: elements slide up with a blur-to-sharp effect.

**Files:**
- Modify: `styles.css` (scroll animation classes)
- Modify: `script.js` (update IntersectionObserver, add stagger logic)

**Step 1: Update CSS animations**

```css
.fade-in {
  opacity: 0;
  transform: translateY(32px);
  filter: blur(6px);
  transition:
    opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    filter 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: var(--delay, 0s);
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
```

**Step 2: Commit**

```bash
git add styles.css
git commit -m "feat: cinematic scroll reveals with blur-to-sharp transition"
```

---

### Task 8: Custom Cursor — Gold Ring

**Files:**
- Modify: `index.html` (add cursor element)
- Modify: `styles.css` (cursor styles)
- Modify: `script.js` (cursor tracking + hover scaling)

**Step 1: Add cursor div to HTML**

At the top of `<body>`, add:
```html
<div class="custom-cursor" aria-hidden="true"></div>
```

**Step 2: CSS**

```css
.custom-cursor {
  position: fixed;
  width: 32px;
  height: 32px;
  border: 1.5px solid var(--gold);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.15s ease, opacity 0.15s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
  transform: translate(-50%, -50%);
  opacity: 0;
  mix-blend-mode: difference;
}

.custom-cursor.visible {
  opacity: 1;
}

.custom-cursor.hovering {
  width: 48px;
  height: 48px;
  border-color: var(--crimson);
}

/* Hide on touch devices */
@media (hover: none) {
  .custom-cursor { display: none; }
}

/* Hide default cursor on desktop */
@media (hover: hover) {
  * { cursor: none !important; }
}
```

**Step 3: JS cursor tracking**

```js
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor || window.matchMedia('(hover: none)').matches) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    if (!cursor.classList.contains('visible')) cursor.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
  document.addEventListener('mouseenter', () => cursor.classList.add('visible'));

  // Scale up on interactive elements
  const interactives = 'a, button, .tab-btn, .card-btn, .btn, .faq-question, input, select, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) cursor.classList.add('hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) cursor.classList.remove('hovering');
  });
}
```

Call `initCustomCursor()` in DOMContentLoaded.

**Step 4: Commit**

```bash
git add index.html styles.css script.js
git commit -m "feat: custom gold ring cursor with hover scaling"
```

---

### Task 9: 3D Card Tilt + Magnetic Buttons

**Files:**
- Modify: `script.js` (tilt + magnetic functions)
- Modify: `styles.css` (perspective rules)

**Step 1: CSS perspective**

```css
.menu-card {
  transform-style: preserve-3d;
  perspective: 1000px;
}
```

**Step 2: 3D tilt on menu cards**

```js
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.menu-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        card.style.transform = '';
        return;
      }

      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
  });
}
```

**Step 3: Magnetic buttons**

```js
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  const magneticEls = document.querySelectorAll('.btn, .social-link');
  const strength = 0.3;

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s ease';
      setTimeout(() => el.style.transition = '', 400);
    });
  });
}
```

Call both in DOMContentLoaded.

**Step 4: Commit**

```bash
git add styles.css script.js
git commit -m "feat: 3D card tilt and magnetic button effects"
```

---

### Task 10: Text Split Animations — Word-by-Word Heading Reveals

**Files:**
- Modify: `script.js` (text split + observer)
- Modify: `styles.css` (split word styles)

**Step 1: CSS for split words**

```css
.split-heading .word {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  filter: blur(4px);
  transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease;
  transition-delay: var(--word-delay);
}

.split-heading.visible .word {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
```

**Step 2: JS text splitter**

```js
function initTextSplit() {
  document.querySelectorAll('section h2').forEach(h2 => {
    const text = h2.textContent.trim();
    h2.classList.add('split-heading');
    h2.innerHTML = text.split(' ').map((word, i) =>
      `<span class="word" style="--word-delay: ${i * 0.08}s">${word}</span>`
    ).join(' ');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.split-heading').forEach(el => observer.observe(el));
}
```

Call `initTextSplit()` in DOMContentLoaded (before other observers so headings get split first).

**Step 3: Commit**

```bash
git add styles.css script.js
git commit -m "feat: word-by-word heading reveal animations"
```

---

### Task 11: Parallax Depth Layers

**Files:**
- Modify: `script.js` (scroll-driven parallax)
- Modify: `styles.css` (parallax-ready classes)

**Step 1: Add parallax to sections via JS**

```js
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const parallaxEls = [
    { selector: '#hero::before', speed: 0.3 },
    { selector: '.about-monogram', speed: 0.15 },
    { selector: '.hero-particles', speed: 0.1 },
  ];

  // Simpler approach: parallax on specific elements
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    const monogram = document.querySelector('.about-monogram');
    if (monogram) {
      const rect = monogram.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.1;
      monogram.style.transform = `translateY(${offset}px)`;
    }

    const particles = document.querySelector('.hero-particles');
    if (particles) {
      particles.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }, { passive: true });
}
```

Call `initParallax()` in DOMContentLoaded.

**Step 2: Commit**

```bash
git add script.js
git commit -m "feat: parallax depth on hero particles and about monogram"
```

---

### Task 12: Final Polish — Spacing, Responsiveness, Cleanup

**Files:**
- Modify: `styles.css` (section padding, responsive tweaks)
- Modify: `index.html` (remove any leftover old elements)
- Modify: `script.js` (cleanup any dead code)

**Step 1: Increase section padding for luxury spacing**

Update the section base and desktop breakpoint:
```css
section {
  padding: 140px 20px;
  position: relative;
}

@media (min-width: 1024px) {
  section {
    padding: 180px 20px;
  }
}
```

**Step 2: Remove dead CSS**

- Delete all old color references that survived (search for `--lavender`, `--mint`, `--pink-light`, `Pacifico`)
- Delete `.hero-decoration` styles
- Delete `.image-placeholder` styles
- Delete old payment nth-child color overrides if still present

**Step 3: Remove dead HTML**

- Delete the `<div class="hero-decoration">🧁</div>` from hero
- Clean up any remaining emoji in nav logo — replace with just text: `Kayla's Desserts`
- Remove old SVG section dividers (the curved ones between sections) — dark theme doesn't need them, sections have enough contrast

**Step 4: Remove dead JS**

- Remove `categoryGradients` if still present
- Remove any references to old Pacifico/emoji in JS

**Step 5: Test all breakpoints**

Open site and verify at:
- Mobile (375px)
- Tablet (768px)
- Desktop (1024px+)

**Step 6: Commit + push**

```bash
git add styles.css index.html script.js
git commit -m "feat: final polish — luxury spacing, cleanup, responsive verification"
git push origin main
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Foundation — palette, fonts, reset | HTML, CSS |
| 2 | Navigation — frosted dark glass | CSS |
| 3 | Hero — gold title, glow, particles | HTML, CSS, JS |
| 4 | About — asymmetric + gold monogram | HTML, CSS |
| 5 | Menu — dark glass cards, fine dining type | CSS, JS |
| 6 | All remaining sections — dark theme pass | HTML, CSS, JS |
| 7 | Cinematic scroll reveals | CSS |
| 8 | Custom cursor — gold ring | HTML, CSS, JS |
| 9 | 3D card tilt + magnetic buttons | CSS, JS |
| 10 | Text split heading animations | CSS, JS |
| 11 | Parallax depth layers | JS |
| 12 | Final polish + cleanup | HTML, CSS, JS |
