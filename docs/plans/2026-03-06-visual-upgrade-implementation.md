# Kayla's Desserts Visual Upgrade — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate the site from functional to portfolio-quality with OG tags, testimonials, FAQ, dev credit, and visual polish.

**Architecture:** All changes are additions to the existing single-page static site. New HTML sections slot into index.html, new CSS appends to styles.css, new JS appends to script.js. No structural rewrites.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript ES6+. No dependencies.

---

### Task 1: Open Graph Meta Tags + Theme Color

**Files:**
- Modify: `index.html:1-15` (head section)

**Step 1: Add OG and Twitter meta tags after the existing meta description (line 7)**

Insert after `<meta name="description" ...>`:

```html
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Kayla's Desserts — Homemade Treats in Sacramento">
  <meta property="og:description" content="Fresh-baked cookies, cakes, dessert cups & more. Order online for pickup or delivery in the Sacramento area!">
  <meta property="og:image" content="https://gswaveyy.github.io/kaylas-desserts/og-image.png">
  <meta property="og:url" content="https://gswaveyy.github.io/kaylas-desserts/">
  <meta property="og:site_name" content="Kayla's Desserts">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Kayla's Desserts — Homemade Treats in Sacramento">
  <meta name="twitter:description" content="Fresh-baked cookies, cakes, dessert cups & more. Order online for pickup or delivery!">
  <meta name="twitter:image" content="https://gswaveyy.github.io/kaylas-desserts/og-image.png">

  <!-- Mobile browser theme -->
  <meta name="theme-color" content="#FFB6C1">
```

**Step 2: Create the OG share image**

Create `og-image.html` — a temporary styled page we screenshot to produce `og-image.png`:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Nunito:wght@700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      width: 1200px;
      height: 630px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(-45deg, #FFD6DD, #F0E6FA, #D4F5E9, #FFB6C1);
      font-family: 'Nunito', sans-serif;
      text-align: center;
      overflow: hidden;
    }
    .content {
      z-index: 1;
      position: relative;
    }
    .emoji { font-size: 80px; margin-bottom: 10px; }
    h1 {
      font-family: 'Pacifico', cursive;
      font-size: 72px;
      color: white;
      margin: 0;
      text-shadow: 0 2px 15px rgba(0,0,0,0.1);
    }
    p {
      font-size: 28px;
      color: rgba(255,255,255,0.9);
      margin: 12px 0 0;
      font-weight: 700;
    }
    .dot1, .dot2 {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.4;
    }
    .dot1 { width: 300px; height: 300px; background: rgba(255,182,193,0.6); top: -50px; right: -50px; }
    .dot2 { width: 250px; height: 250px; background: rgba(181,234,215,0.6); bottom: -40px; left: -40px; }
  </style>
</head>
<body>
  <div class="dot1"></div>
  <div class="dot2"></div>
  <div class="content">
    <div class="emoji">🧁</div>
    <h1>Kayla's Desserts</h1>
    <p>Homemade Treats in Sacramento</p>
  </div>
</body>
</html>
```

After creating, open in browser at 1200x630 and screenshot to `og-image.png`. Then delete `og-image.html`.

**Step 3: Commit**

```bash
git add index.html og-image.png
git commit -m "feat: add OG meta tags, Twitter card, and share image"
```

---

### Task 2: Logo Treatment Consistency

**Files:**
- Modify: `index.html:24` (nav logo)
- Modify: `index.html:43` (hero h1)
- Modify: `styles.css:139-144` (logo styles)

**Step 1: Update nav logo to include emoji**

Change line 24 from:
```html
<a href="#" class="logo">Kayla's Desserts</a>
```
To:
```html
<a href="#" class="logo">🧁 Kayla's Desserts</a>
```

**Step 2: Update hero h1 to include emoji**

Change line 43 from:
```html
<h1>Kayla's Desserts</h1>
```
To:
```html
<h1>🧁 Kayla's Desserts</h1>
```

**Step 3: Update logo CSS for better emoji alignment**

In styles.css, update the `.logo` rule (around line 139):

```css
.logo {
  font-family: 'Pacifico', cursive;
  color: var(--pink);
  font-size: 1.5rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

**Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: unify logo treatment with cupcake emoji across nav and hero"
```

---

### Task 3: Testimonials Section — HTML + CSS

**Files:**
- Modify: `index.html` (insert new section after menu, before the SVG divider at line 68)
- Modify: `styles.css` (append testimonial styles)

**Step 1: Add testimonials HTML**

Insert after the closing `</section>` of menu (line 65) and before the SVG divider (line 68):

```html
  <!-- Testimonials -->
  <section id="testimonials">
    <div class="container">
      <h2>Sweet Reviews</h2>
      <div class="testimonials-grid">
        <!-- KAYLA: To add a new review, copy one <div class="testimonial-card"> block and change the text -->
        <div class="testimonial-card fade-in">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-quote">"The churro cheesecake was absolutely incredible! Best dessert I've ever had. Will be ordering again for every family event."</p>
          <div class="testimonial-author">
            <span class="author-name">Maria R.</span>
            <span class="author-order">Churro Cheesecake</span>
          </div>
        </div>
        <div class="testimonial-card fade-in">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-quote">"Ordered chocolate covered strawberries for Valentine's Day and they were gorgeous! Tasted amazing and the delivery was right on time."</p>
          <div class="testimonial-author">
            <span class="author-name">Jessica T.</span>
            <span class="author-order">Chocolate Covered Strawberries</span>
          </div>
        </div>
        <div class="testimonial-card fade-in">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-quote">"I order cake pops for my daughter's birthday party and all the kids went crazy! So cute and delicious. Kayla is so talented!"</p>
          <div class="testimonial-author">
            <span class="author-name">Daniel S.</span>
            <span class="author-order">Cake Pops</span>
          </div>
        </div>
        <div class="testimonial-card fade-in">
          <div class="stars">⭐⭐⭐⭐⭐</div>
          <p class="testimonial-quote">"The mini flan is to die for. Creamy, smooth, perfect sweetness. I've tried every flavor and honestly can't pick a favorite."</p>
          <div class="testimonial-author">
            <span class="author-name">Sophia M.</span>
            <span class="author-order">Mini Flans</span>
          </div>
        </div>
      </div>
    </div>
  </section>
```

**Step 2: Add testimonial CSS**

Append to `styles.css`:

```css
/* ===========================
   Testimonials Section
   =========================== */
#testimonials {
  background: linear-gradient(180deg, white, var(--cream));
  position: relative;
  overflow: hidden;
}

#testimonials h2 {
  color: var(--pink);
  font-size: 2.2rem;
  margin: 0 0 40px;
  position: relative;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
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
  font-family: 'Pacifico', cursive;
  color: var(--pink-light);
  opacity: 0.4;
  line-height: 1;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(255, 182, 193, 0.2);
}

.stars {
  font-size: 0.9rem;
  letter-spacing: 2px;
  margin-bottom: 12px;
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

.testimonial-author {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--dark);
}

.author-order {
  font-size: 0.8rem;
  color: var(--pink);
  font-weight: 600;
}

@media (min-width: 768px) {
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

**Step 3: Verify**

Refresh browser. Testimonial cards should appear in a grid after the menu. Check mobile stacking.

**Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: add testimonials section with 4 placeholder reviews"
```

---

### Task 4: FAQ Accordion — HTML + CSS + JS

**Files:**
- Modify: `index.html` (insert FAQ section after payment, before about)
- Modify: `styles.css` (append FAQ styles)
- Modify: `script.js` (add accordion init function + call in DOMContentLoaded)

**Step 1: Add FAQ HTML**

Insert after the closing `</section>` of payment and before `<!-- About -->`:

```html
  <!-- FAQ -->
  <section id="faq">
    <div class="container">
      <h2>Common Questions</h2>
      <div class="faq-list">
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>How far in advance do I need to order?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            <p>All orders require at least 24 hours advance notice so everything is made fresh just for you. For larger orders, custom cakes, or event orders, please reach out at least 3-5 days ahead so we can make sure everything is perfect!</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>What areas do you deliver to?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            <p>We offer delivery throughout the Sacramento area! Pickup is free from Rancho Cordova. Delivery fees: Rancho area — $10, Sacramento area — $15-20, farther locations — $20-25. Not sure if we deliver to you? Just ask!</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>Can I customize my order?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            <p>Absolutely! We love custom orders. Whether it's specific colors, flavors, decorations, or themed treats for a party — just let us know in the special instructions when you order, or DM us on Instagram to discuss your ideas.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>Do you accommodate allergies or dietary restrictions?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            <p>Please let us know about any allergies or dietary needs when you place your order. We'll do our best to accommodate! Note that all items are prepared in a home kitchen that handles common allergens including nuts, dairy, eggs, and gluten.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>Do you take large orders or event orders?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            <p>Yes! We do birthday parties, baby showers, graduations, and any celebration. For large orders, please reach out at least 5 days in advance so we can plan accordingly. DM us on Instagram or mention it in your order notes!</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>What is your cancellation policy?</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            <p>We understand plans change! Cancellations made at least 24 hours before your order date will receive a full refund. Cancellations less than 24 hours out may not be refundable since ingredients are already purchased and prep has begun.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
```

**Step 2: Add FAQ CSS**

Append to `styles.css`:

```css
/* ===========================
   FAQ Section
   =========================== */
#faq {
  background: var(--cream);
  position: relative;
}

#faq h2 {
  color: var(--pink);
  font-size: 2.2rem;
  margin: 0 0 40px;
  position: relative;
}

.faq-list {
  max-width: 700px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: var(--transition);
}

.faq-item:hover {
  box-shadow: var(--shadow);
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: none;
  border: none;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--dark);
  cursor: pointer;
  text-align: left;
  gap: 12px;
  transition: var(--transition);
}

.faq-question:hover {
  color: var(--pink);
}

.faq-icon {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--pink);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.faq-item.open .faq-icon {
  transform: rotate(45deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.35s ease;
  padding: 0 20px;
}

.faq-item.open .faq-answer {
  max-height: 300px;
  padding: 0 20px 18px;
}

.faq-answer p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.7;
  opacity: 0.75;
}
```

**Step 3: Add FAQ accordion JS**

Add to `script.js` before the `// ---------- Init ----------` section:

```js
// ---------- FAQ Accordion ----------

function initFAQ() {
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      // Close all
      document.querySelectorAll(".faq-item.open").forEach(openItem => {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      // Toggle clicked (if it wasn't already open)
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}
```

**Step 4: Add `initFAQ()` call to DOMContentLoaded**

In the `DOMContentLoaded` handler (around line 538), add `initFAQ();` after `initRipples();`.

**Step 5: Verify**

Refresh browser. Click FAQ questions — answers slide open, previous closes. Check the +/- rotates. Test mobile.

**Step 6: Commit**

```bash
git add index.html styles.css script.js
git commit -m "feat: add FAQ accordion section with 6 questions"
```

---

### Task 5: Developer Credit in Footer

**Files:**
- Modify: `index.html` (footer section, before closing `</div>`)
- Modify: `styles.css` (append credit styles)

**Step 1: Add credit HTML**

In the footer (around line 161), after the copyright `<p>` and before `</div>`:

```html
      <p class="dev-credit">Built with love by <a href="#" target="_blank" rel="noopener noreferrer">Glenn</a></p>
```

**Step 2: Add credit CSS**

Append to `styles.css`:

```css
/* Developer Credit */
.dev-credit {
  margin: 16px 0 0;
  font-size: 0.7rem;
  opacity: 0.35;
  transition: opacity 0.3s ease;
}

.dev-credit:hover {
  opacity: 0.7;
}

.dev-credit a {
  color: var(--pink-light);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.dev-credit a:hover {
  color: var(--pink);
}
```

**Step 3: Commit**

```bash
git add index.html styles.css
git commit -m "feat: add developer credit in footer"
```

---

### Task 6: Visual Polish — CSS Upgrades

**Files:**
- Modify: `styles.css` (multiple sections)

**Step 1: Add noise texture overlay**

Add after the `:root` block:

```css
/* Noise texture overlay for warmth */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}
```

**Step 2: Enhance card shadows to dual-layer**

Update `.menu-card` box-shadow (around line 574):

```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04);
```

Update `.menu-card:hover` box-shadow (around line 581):

```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 20px 48px rgba(0, 0, 0, 0.1);
```

**Step 3: Tighten typography**

Update `.card-price` (around line 633):

```css
.card-price {
  font-weight: 800;
  color: var(--pink);
  font-size: 1.15rem;
  letter-spacing: -0.01em;
}
```

Update `.tagline` (around line 373):

```css
.tagline {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.2rem;
  margin: 0 0 36px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
  text-transform: uppercase;
  font-size: 1.05rem;
}
```

**Step 4: Refine staggered card animation timing**

The menu cards already have `--delay` set via JS. Update the `.fade-in` transition (around line 1189):

```css
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: var(--delay, 0s);
}
```

**Step 5: Add gradient transition to buttons on hover**

Update `.card-btn` (around line 660):

```css
.card-btn {
  background: linear-gradient(135deg, var(--mint), #8fd9be);
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
  background-size: 200% 200%;
  background-position: 0% 50%;
}

.card-btn:hover {
  background-position: 100% 50%;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(181, 234, 215, 0.4);
}
```

**Step 6: Verify**

Full page scroll-through. Check:
- Subtle grain texture visible over cream backgrounds
- Cards have richer shadow depth
- Prices are bolder
- Tagline has letter spacing
- Button gradients shift on hover
- Fade-in animations feel smoother

**Step 7: Commit**

```bash
git add styles.css
git commit -m "feat: add visual polish — noise texture, layered shadows, typography, animations"
```

---

### Task 7: Final Verification + Section Order Check

**Step 1: Verify final page section order**

Confirm `index.html` sections flow in this order:
1. Nav
2. Hero
3. Menu
4. Testimonials (NEW)
5. SVG Divider
6. Order Form
7. Payment
8. FAQ (NEW)
9. About
10. Wave Divider
11. Footer (with dev credit — NEW)

**Step 2: Add fade-in classes to new sections**

In `script.js`, update `initSectionAnimations` to include new sections. The current selector `"section h2"` should already catch the new section headings. Verify testimonial cards and FAQ items get `fade-in` applied.

If FAQ items need fade-in, update `initSectionAnimations`:

```js
function initSectionAnimations() {
  document.querySelectorAll("section h2, .hero-content, .about-content, .testimonial-card, .faq-item").forEach(el => {
    if (!el.classList.contains("fade-in")) {
      el.classList.add("fade-in");
    }
  });
  observeFadeIns();
}
```

**Step 3: Full browser test**

- Desktop (1200px+): 3-col menu, 2-col testimonials, centered FAQ
- Tablet (768px): 2-col menu, 2-col testimonials
- Mobile (375px): single column everything, hamburger nav
- Click all FAQ items
- Add items to cart, submit order flow still works
- Check OG tags with browser dev tools (Elements > head)

**Step 4: Final commit**

```bash
git add index.html styles.css script.js
git commit -m "feat: finalize section order, scroll animations for new sections"
```
