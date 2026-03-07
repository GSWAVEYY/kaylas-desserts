// ============================================
// Kayla's Desserts — Main JavaScript
// ============================================

// ---------- Menu Data (from Kayla's actual menu) ----------

const menuItems = [
  {
    id: 1, name: "Churro Cheesecake", category: "cakes", emoji: "🍰",
    description: "Creamy cheesecake with a cinnamon churro twist",
    options: [
      { label: "Mini Bites (2 bars)", price: 6 },
      { label: "Mini (1)", price: 8 },
      { label: "Mini (3)", price: 16 },
      { label: "Full Pan", price: 25 },
    ]
  },
  {
    id: 2, name: "Mini Cakes", category: "cakes", emoji: "🎂",
    description: "Strawberry, Red Velvet, Chocolate, Strawberry Crunch, S'mores, Ferrero Rocher, Tres Leches & more",
    options: [
      { label: "Mini Cake", price: 8 },
    ]
  },
  {
    id: 3, name: "Mini Flans", category: "desserts", emoji: "🍮",
    description: "Chocolate, Classic, Strawberry & more flavors",
    options: [
      { label: "2 Pack", price: 5 },
      { label: "4 Pack", price: 10 },
    ]
  },
  {
    id: 4, name: "Fresa Con Crema", category: "desserts", emoji: "🍓",
    description: "Fresh strawberries with sweet cream — also available with apple or other fruits",
    options: [
      { label: "Single", price: 5 },
      { label: "2 Pack", price: 10 },
    ]
  },
  {
    id: 5, name: "Brownies", category: "desserts", emoji: "🟫",
    description: "Double Chocolate, S'mores, Strawberry & more",
    options: [
      { label: "Single", price: 5 },
      { label: "2 Pack", price: 10 },
    ]
  },
  {
    id: 6, name: "Chocolate Covered Fruit", category: "treats", emoji: "🍫",
    description: "Strawberries, Bananas, Pineapple, Rice Krispies",
    options: [
      { label: "5 Pieces", price: 8 },
      { label: "10 Pieces", price: 15 },
      { label: "Dozen", price: 18 },
      { label: "Larger Platter", price: 25 },
    ]
  },
  {
    id: 7, name: "Cake Pops", category: "treats", emoji: "🍭",
    description: "Chocolate, Red Velvet, Yellow, Birthday Cake & more",
    options: [
      { label: "Single", price: 3 },
      { label: "2 Pack", price: 5 },
    ]
  },
  {
    id: 8, name: "Cookies", category: "treats", emoji: "🍪",
    description: "Chocolate Chip, Red Velvet, Cookie Monster, White Chocolate & more",
    options: [
      { label: "3 Pack", price: 5 },
      { label: "6 Pack", price: 10 },
    ]
  },
];

const deliveryFees = { pickup: 0, rancho: 10, sacramento: 17.50, farther: 22.50 };

let cart = [];

// ---------- Intersection Observer ----------

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

function observeFadeIns() {
  document.querySelectorAll(".fade-in:not(.visible)").forEach(el => observer.observe(el));
}

// ---------- Menu Rendering ----------

function renderMenu(category) {
  const grid = document.querySelector(".menu-grid");
  const items = category === "all" ? menuItems : menuItems.filter(i => i.category === category);

  grid.innerHTML = items.map((item, index) => {
    const optionsHtml = item.options.length > 1
      ? `<select class="card-select" id="option-${item.id}">
          ${item.options.map((opt, i) => `<option value="${i}">${opt.label} — $${opt.price.toFixed(2)}</option>`).join("")}
        </select>`
      : `<p class="card-price">$${item.options[0].price.toFixed(2)}</p>`;

    const priceDisplay = item.options.length > 1
      ? `<p class="card-price">From $${item.options[0].price.toFixed(2)}</p>`
      : "";

    return `
      <div class="menu-card fade-in" data-category="${item.category}" style="--delay: ${index * 0.1}s">
        <div class="card-image">
          <span class="card-image-text">${item.name}</span>
        </div>
        <div class="card-body">
          <h3 class="card-name">${item.name}</h3>
          <p class="card-description">${item.description}</p>
          ${priceDisplay}
          ${optionsHtml}
          <button class="card-btn" onclick="addToCart(${item.id})">Add to Cart 🛒</button>
        </div>
      </div>
    `;
  }).join("");

  observeFadeIns();
}

// ---------- Tab Handlers ----------

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderMenu(btn.dataset.category);
    });
  });
}

// ---------- Cart System ----------

function addToCart(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  const selectEl = document.getElementById(`option-${itemId}`);
  const optionIdx = selectEl ? parseInt(selectEl.value) : 0;
  const option = item.options[optionIdx];

  // Unique key: item id + option label
  const cartKey = `${itemId}-${optionIdx}`;
  const existing = cart.find(c => c.cartKey === cartKey);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      cartKey,
      id: itemId,
      name: item.name,
      optionLabel: option.label,
      price: option.price,
      qty: 1,
    });
  }

  updateCartUI();
  showToast(`${item.name} (${option.label}) added!`);
  pulseBadge();
}

function removeFromCart(cartKey) {
  const idx = cart.findIndex(c => c.cartKey === cartKey);
  if (idx === -1) return;

  cart[idx].qty--;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);

  updateCartUI();
}

function increaseQty(cartKey) {
  const existing = cart.find(c => c.cartKey === cartKey);
  if (existing) {
    existing.qty++;
    updateCartUI();
    pulseBadge();
  }
}

function updateCartUI() {
  const summary = document.getElementById("cart-summary");
  const badge = document.querySelector(".cart-badge");
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);

  // Update badge
  badge.textContent = totalItems;

  if (cart.length === 0) {
    summary.innerHTML = '<p class="empty-cart-message">Your cart is empty. Add some desserts! 🧁</p>';
    return;
  }

  const deliverySelect = document.getElementById("delivery-method");
  const deliveryKey = deliverySelect ? deliverySelect.value : "pickup";
  const deliveryFee = deliveryFees[deliveryKey] || 0;
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const total = subtotal + deliveryFee;

  summary.innerHTML = `
    <div class="cart-items">
      ${cart.map(c => `
        <div class="cart-item">
          <span class="cart-item-name">${c.name} <small>(${c.optionLabel})</small></span>
          <div class="cart-item-controls">
            <button onclick="removeFromCart('${c.cartKey}')">−</button>
            <span>${c.qty}</span>
            <button onclick="increaseQty('${c.cartKey}')">+</button>
          </div>
          <span class="cart-item-total">$${(c.price * c.qty).toFixed(2)}</span>
        </div>
      `).join("")}
    </div>
    <div class="cart-total">
      <div class="cart-total-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="cart-total-row"><span>Delivery Fee</span><span>$${deliveryFee.toFixed(2)}</span></div>
      <div class="cart-total-row cart-grand-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
    </div>
  `;

  // Slide animation on cart update
  summary.classList.remove("cart-updated");
  void summary.offsetWidth; // force reflow
  summary.classList.add("cart-updated");
}

// ---------- Badge Pulse Animation ----------

function pulseBadge() {
  const badge = document.querySelector(".cart-badge");
  badge.classList.remove("pulse");
  void badge.offsetWidth;
  badge.classList.add("pulse");
}

// ---------- Toast Notification ----------

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("visible");
  });

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ---------- Ripple Effect ----------

function createRipple(e) {
  const button = e.currentTarget;
  const existing = button.querySelector(".ripple");
  if (existing) existing.remove();

  const ripple = document.createElement("span");
  ripple.className = "ripple";

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
  ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function initRipples() {
  // Add ripple to all buttons with card-btn class (uses event delegation for dynamic content)
  document.addEventListener("click", (e) => {
    const cardBtn = e.target.closest(".card-btn");
    if (cardBtn) {
      createRipple({ currentTarget: cardBtn, clientX: e.clientX, clientY: e.clientY });
    }
    const btn = e.target.closest(".btn");
    if (btn) {
      createRipple({ currentTarget: btn, clientX: e.clientX, clientY: e.clientY });
    }
  });
}

// ---------- Scroll Progress Bar ----------

function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + "%";
  }, { passive: true });
}

// ---------- Hamburger Menu ----------

function initHamburger() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("mobile-open");
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("mobile-open");
    });
  });
}

// ---------- Order Form Validation + Submission ----------

function initOrderForm() {
  const form = document.getElementById("order-form");
  const dateInput = document.getElementById("order-date");

  // Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split("T")[0];

  // Clear errors on focus
  form.querySelectorAll("input, select, textarea").forEach(input => {
    input.addEventListener("focus", () => {
      input.classList.remove("error");
      const msg = input.parentElement.querySelector(".error-message");
      if (msg) msg.remove();
    });
  });

  // Delivery method change updates cart totals
  document.getElementById("delivery-method").addEventListener("change", updateCartUI);

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
    form.querySelectorAll(".error-message").forEach(el => el.remove());

    // Cart check
    if (cart.length === 0) {
      showFieldError(document.getElementById("cart-summary"), "Please add items to your cart before ordering.");
      valid = false;
    }

    // Name
    const name = document.getElementById("customer-name");
    if (!name.value.trim()) {
      showFieldError(name, "Please enter your name.");
      valid = false;
    }

    // Phone
    const phone = document.getElementById("customer-phone");
    if (!phone.value.trim()) {
      showFieldError(phone, "Please enter your phone number.");
      valid = false;
    }

    // Date
    const date = document.getElementById("order-date");
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    minDate.setHours(0, 0, 0, 0);

    if (!date.value) {
      showFieldError(date, "Please select a date.");
      valid = false;
    } else if (new Date(date.value + "T00:00:00") < minDate) {
      showFieldError(date, "Order date must be at least tomorrow.");
      valid = false;
    }

    if (valid) submitOrder();
  });
}

function showFieldError(input, message) {
  input.classList.add("error");
  const msg = document.createElement("div");
  msg.className = "error-message";
  msg.textContent = message;
  msg.style.cssText = "color:#d32f2f;font-size:0.85rem;margin-top:0.25rem;";
  input.parentElement.appendChild(msg);
}

function submitOrder() {
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const deliveryMethod = document.getElementById("delivery-method");
  const deliveryLabel = deliveryMethod.options[deliveryMethod.selectedIndex].text;
  const date = document.getElementById("order-date").value;
  const instructions = document.getElementById("special-instructions").value.trim();
  const deliveryFee = deliveryFees[deliveryMethod.value] || 0;
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const total = subtotal + deliveryFee;

  const itemsList = cart.map(c => `${c.name} x${c.qty} — $${(c.price * c.qty).toFixed(2)}`).join("\n");

  const submitBtn = document.querySelector('#order-form button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  submitBtn.textContent = "Sending...";

  // EmailJS integration
  const EMAILJS_PUBLIC_KEY = "qId7LYirAJei2KgDK";
  const EMAILJS_SERVICE_ID = "service_leifomr";
  const EMAILJS_TEMPLATE_ID = "template_p969v3g";

  const templateParams = {
    customer_name: name,
    customer_phone: phone,
    items_list: itemsList,
    delivery_method: deliveryLabel,
    delivery_fee: `$${deliveryFee.toFixed(2)}`,
    subtotal: `$${subtotal.toFixed(2)}`,
    total: `$${total.toFixed(2)}`,
    order_date: date,
    special_instructions: instructions || "None",
  };

  // If EmailJS is not configured yet, skip the API call and show confirmation
  if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    console.log("EmailJS not configured yet. Order details:", templateParams);
    // Simulate a brief loading state
    setTimeout(() => {
      showConfirmation(name, date, deliveryLabel, total);
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      submitBtn.textContent = "Submit Order";
    }, 800);
    return;
  }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      showConfirmation(name, date, deliveryLabel, total);
    })
    .catch((err) => {
      console.error("EmailJS error:", err);
      console.error("EmailJS error status:", err.status);
      console.error("EmailJS error text:", err.text);
      showToast("Something went wrong. Please DM @kaylas_desserts_05 on Instagram to place your order.");
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      submitBtn.textContent = "Submit Order";
    });
}

function showConfirmation(name, date, deliveryLabel, total) {
  const overlay = document.createElement("div");
  overlay.className = "order-confirmation";
  overlay.innerHTML = `
    <div class="confirmation-content">
      <h2 style="font-family:'Playfair Display',serif;font-weight:700;color:#D4A853;">Order Submitted!</h2>
      <p style="font-size:3rem;margin:0.5rem 0;">🎉</p>
      <p>Thank you, <strong>${name}</strong>! Kayla will confirm your order shortly.</p>
      <p><strong>Order date:</strong> ${date}</p>
      <p><strong>Delivery:</strong> ${deliveryLabel}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <button class="btn btn-primary" onclick="this.closest('.order-confirmation').remove()">Close</button>
    </div>
  `;
  document.body.appendChild(overlay);

  cart = [];
  updateCartUI();
  document.getElementById("order-form").reset();
}

// ---------- Nav Scroll Effect ----------

function initNavScroll() {
  const nav = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });
}

// ---------- Cart Button → Scroll to Order ----------

function initCartButton() {
  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      document.getElementById("order").scrollIntoView({ behavior: "smooth" });
    });
  }
}

// ---------- Add fade-in to section headings ----------

function initSectionAnimations() {
  document.querySelectorAll("section h2, .hero-content, .about-content, .testimonial-card, .faq-item").forEach(el => {
    if (!el.classList.contains("fade-in")) {
      el.classList.add("fade-in");
    }
  });
  observeFadeIns();
}

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

// ---------- Particle Field ----------

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

// ---------- Custom Cursor ----------

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

  const interactives = 'a, button, .tab-btn, .card-btn, .btn, .faq-question, input, select, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) cursor.classList.add('hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) cursor.classList.remove('hovering');
  });
}

// ---------- Text Split Animations ----------

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

// ---------- 3D Card Tilt ----------

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

// ---------- Magnetic Buttons ----------

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

// ---------- Parallax Depth ----------

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  // Initialize EmailJS at page load
  if (typeof emailjs !== "undefined") {
    emailjs.init("qId7LYirAJei2KgDK");
  }

  initTextSplit();
  renderMenu("all");
  initTabs();
  initOrderForm();
  initNavScroll();
  initCartButton();
  initSectionAnimations();
  initScrollProgress();
  initHamburger();
  initParticles();
  initRipples();
  initFAQ();
  initCustomCursor();
  initCardTilt();
  initMagneticButtons();
  initParallax();
});
