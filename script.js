// ============================================
// Kayla's Desserts — Main JavaScript
// ============================================

// ---------- Menu Data ----------

const menuItems = [
  { id: 1, name: "Red Velvet White Chocolate Chip Cookie", category: "cookies", price: 3.50, description: "Rich red velvet dough loaded with white chocolate chips", emoji: "🍪" },
  { id: 2, name: "Chocolate Chip Cookies", category: "cookies", price: 3.00, description: "Classic homemade chocolate chip cookies, warm and gooey", emoji: "🍪" },
  { id: 3, name: "Mini Cakes", category: "cakes", price: 15.00, description: "Perfectly sized mini cakes for any celebration", emoji: "🎂" },
  { id: 4, name: "Churro Cheesecake", category: "cakes", price: 25.00, description: "Creamy cheesecake with a cinnamon churro twist", emoji: "🍰" },
  { id: 5, name: "Fresas con Crema", category: "dessert-cups", price: 8.00, description: "Fresh strawberries with sweet cream — a classic favorite", emoji: "🍓" },
  { id: 6, name: "Choco Flan", category: "dessert-cups", price: 7.00, description: "Rich chocolate cake layered with creamy caramel flan", emoji: "🍮" },
  { id: 7, name: "Cake Pops", category: "treats", price: 3.00, description: "Bite-sized cake balls dipped in colorful chocolate coating", emoji: "🍭" },
  { id: 8, name: "Chocolate Covered Strawberries", category: "treats", price: 12.00, description: "Fresh strawberries hand-dipped in premium chocolate", emoji: "🍫" },
  { id: 9, name: "Brownies", category: "treats", price: 4.00, description: "Dense, fudgy brownies with a crackly top", emoji: "🟫" },
];

const categoryGradients = {
  cookies: "linear-gradient(135deg, #fce4ec, #f8bbd0)",
  cakes: "linear-gradient(135deg, #e8eaf6, #d1c4e9)",
  "dessert-cups": "linear-gradient(135deg, #e0f2f1, #b2dfdb)",
  treats: "linear-gradient(135deg, #fce4ec, #e8eaf6)",
};

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

  grid.innerHTML = items.map(item => `
    <div class="menu-card fade-in">
      <div class="card-image" style="background: ${categoryGradients[item.category]};">
        <span style="font-size:4rem;display:flex;align-items:center;justify-content:center;height:100%">${item.emoji}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${item.name}</h3>
        <p class="card-description">${item.description}</p>
        <p class="card-price">$${item.price.toFixed(2)}</p>
        <button class="card-btn" onclick="addToCart(${item.id})">Add to Cart 🛒</button>
      </div>
    </div>
  `).join("");

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
  const existing = cart.find(c => c.id === itemId);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  showToast(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
  const idx = cart.findIndex(c => c.id === itemId);
  if (idx === -1) return;

  cart[idx].qty--;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);

  updateCartUI();
}

function increaseQty(itemId) {
  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty++;
    updateCartUI();
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
          <span class="cart-item-name">${c.name}</span>
          <div class="cart-item-controls">
            <button onclick="removeFromCart(${c.id})">−</button>
            <span>${c.qty}</span>
            <button onclick="increaseQty(${c.id})">+</button>
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
}

// ---------- Toast Notification ----------

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;
  toast.style.cssText = "position:fixed;bottom:2rem;right:2rem;background:#e91e63;color:#fff;padding:0.75rem 1.5rem;border-radius:8px;font-weight:600;z-index:9999;opacity:0;transition:opacity 0.3s ease;";
  document.body.appendChild(toast);

  requestAnimationFrame(() => { toast.style.opacity = "1"; });

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
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

  const order = {
    customer: { name, phone },
    items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price, total: c.price * c.qty })),
    delivery: { method: deliveryLabel, fee: deliveryFee },
    date,
    instructions,
    subtotal,
    total: subtotal + deliveryFee,
  };

  console.log("Order submitted:", order);

  // Confirmation overlay
  const overlay = document.createElement("div");
  overlay.className = "order-confirmation";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000;";
  overlay.innerHTML = `
    <div class="confirmation-content" style="background:#fff;padding:2.5rem;border-radius:16px;text-align:center;max-width:450px;margin:1rem;">
      <h2>Order Submitted! 🎉</h2>
      <p>Thank you, ${name}! Kayla will confirm your order shortly.</p>
      <p><strong>Order date:</strong> ${date}</p>
      <p><strong>Delivery:</strong> ${deliveryLabel}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <button class="btn btn-primary" onclick="this.closest('.order-confirmation').remove()" style="margin-top:1rem;padding:0.75rem 2rem;background:#e91e63;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">Close</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Reset
  cart = [];
  updateCartUI();
  document.getElementById("order-form").reset();
}

// ---------- Nav Scroll Effect ----------

function initNavScroll() {
  const nav = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  });
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
  document.querySelectorAll("section h2, .hero-content, .about-content").forEach(el => {
    if (!el.classList.contains("fade-in")) {
      el.classList.add("fade-in");
    }
  });
  observeFadeIns();
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  renderMenu("all");
  initTabs();
  initOrderForm();
  initNavScroll();
  initCartButton();
  initSectionAnimations();
});
