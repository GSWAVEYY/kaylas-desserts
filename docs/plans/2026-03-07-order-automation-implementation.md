# Order Automation & Chatbot — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add multi-channel order delivery (Email, WhatsApp, Instagram) and a guided chatbot assistant to kaylas-desserts.

**Architecture:** Shared channel selection modal used by both the existing order form and a new chatbot widget. Vercel Edge Function handles Email (via EmailJS REST API) and WhatsApp (via Cloud API) delivery. Instagram uses client-side clipboard + DM link. Chatbot is a vanilla JS state machine with guided button flow.

**Tech Stack:** Vanilla HTML/CSS/JS, Vercel Edge Functions (serverless), EmailJS REST API, WhatsApp Cloud API, no frameworks.

**Design doc:** `docs/plans/2026-03-07-order-automation-design.md`

---

### Task 1: Channel Selection Modal — HTML + CSS

Build the shared modal component that both the form and chatbot will use. It shows an order summary and three channel buttons.

**Files:**
- Modify: `index.html` (add modal markup before closing `</body>`)
- Modify: `styles.css` (add modal styles)

**Step 1: Add modal HTML to index.html**

Before the closing `</body>` tag, add:
```html
<!-- Channel Selection Modal -->
<div class="channel-modal" id="channel-modal" aria-hidden="true">
  <div class="channel-modal-content">
    <button class="channel-modal-close" aria-label="Close">&times;</button>
    <h2>Send Your Order</h2>
    <div class="channel-order-summary" id="channel-order-summary"></div>
    <p class="channel-prompt">How would you like to send your order?</p>
    <div class="channel-options">
      <button class="channel-btn" data-channel="email">
        <span class="channel-icon">📧</span>
        <span class="channel-label">Email</span>
      </button>
      <button class="channel-btn" data-channel="whatsapp">
        <span class="channel-icon">💬</span>
        <span class="channel-label">WhatsApp</span>
      </button>
      <button class="channel-btn" data-channel="instagram">
        <span class="channel-icon">📷</span>
        <span class="channel-label">Instagram</span>
      </button>
    </div>
    <div class="channel-status" id="channel-status"></div>
  </div>
</div>
```

**Step 2: Add modal CSS to styles.css**

Add before the responsive media queries:
```css
/* ===========================
   Channel Selection Modal
   =========================== */
.channel-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.channel-modal.active {
  opacity: 1;
  pointer-events: all;
}

.channel-modal-content {
  background: var(--surface);
  border: 1px solid rgba(212, 168, 83, 0.15);
  border-radius: var(--radius);
  padding: 40px;
  max-width: 440px;
  width: 90%;
  position: relative;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: var(--shadow-lg);
}

.channel-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 1.5rem;
  transition: color 0.2s ease;
  padding: 4px 8px;
}

.channel-modal-close:hover {
  color: var(--cream);
}

.channel-modal-content h2 {
  color: var(--gold);
  font-size: 1.8rem;
  margin: 0 0 20px;
  text-align: center;
}

.channel-order-summary {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.85rem;
  color: var(--cream);
  line-height: 1.6;
}

.channel-order-summary .summary-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.channel-order-summary .summary-total {
  border-top: 1px solid rgba(212, 168, 83, 0.2);
  margin-top: 8px;
  padding-top: 8px;
  color: var(--gold);
  font-weight: 700;
}

.channel-prompt {
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0 0 16px;
}

.channel-options {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.channel-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius);
  color: var(--cream);
  transition: var(--transition);
}

.channel-btn:hover {
  border-color: var(--gold);
  background: rgba(212, 168, 83, 0.08);
  transform: translateY(-2px);
}

.channel-btn:active {
  transform: scale(0.95);
}

.channel-icon {
  font-size: 1.8rem;
}

.channel-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.channel-status {
  text-align: center;
  margin-top: 16px;
  font-size: 0.85rem;
  color: var(--muted);
  min-height: 20px;
}

.channel-status.success {
  color: var(--gold);
}

.channel-status.error {
  color: var(--crimson);
}
```

**Step 3: Commit**
```bash
git add index.html styles.css
git commit -m "feat: channel selection modal — HTML + CSS

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Channel Modal JS + Order Form Integration

Wire up the channel modal logic and integrate it with the existing order form. The form's submit now opens the modal instead of sending directly via EmailJS.

**Files:**
- Modify: `script.js` (rewrite submitOrder, add channel modal logic)

**Step 1: Add channel modal controller**

Add these functions before the DOMContentLoaded handler in script.js:

```js
// ---------- Channel Selection Modal ----------

let pendingOrder = null;

function buildOrderPayload() {
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const deliveryMethod = document.getElementById("delivery-method");
  const deliveryLabel = deliveryMethod.options[deliveryMethod.selectedIndex].text;
  const deliveryKey = deliveryMethod.value;
  const date = document.getElementById("order-date").value;
  const instructions = document.getElementById("special-instructions").value.trim();
  const deliveryFee = deliveryFees[deliveryKey] || 0;
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const total = subtotal + deliveryFee;

  return {
    customer: { name, phone },
    items: cart.map(c => ({
      name: c.name,
      option: c.optionLabel,
      qty: c.qty,
      price: c.price
    })),
    delivery: { method: deliveryLabel, fee: deliveryFee },
    date,
    instructions: instructions || "None",
    subtotal,
    total
  };
}

function showChannelModal(order) {
  pendingOrder = order;
  const modal = document.getElementById("channel-modal");
  const summary = document.getElementById("channel-order-summary");
  const status = document.getElementById("channel-status");

  // Build summary HTML
  const itemsHtml = order.items.map(i =>
    `<div class="summary-item"><span>${i.name} (${i.option}) x${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)}</span></div>`
  ).join("");

  summary.innerHTML = `
    ${itemsHtml}
    <div class="summary-item"><span>Delivery: ${order.delivery.method}</span><span>$${order.delivery.fee.toFixed(2)}</span></div>
    <div class="summary-item summary-total"><span>Total</span><span>$${order.total.toFixed(2)}</span></div>
  `;

  status.textContent = "";
  status.className = "channel-status";
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeChannelModal() {
  const modal = document.getElementById("channel-modal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  pendingOrder = null;
}

function formatOrderText(order) {
  const items = order.items.map(i => `${i.name} (${i.option}) x${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join("\n");
  return `NEW ORDER from ${order.customer.name}\n` +
    `Phone: ${order.customer.phone}\n` +
    `Date: ${order.date}\n\n` +
    `Items:\n${items}\n\n` +
    `Delivery: ${order.delivery.method} — $${order.delivery.fee.toFixed(2)}\n` +
    `Total: $${order.total.toFixed(2)}\n\n` +
    `Special Instructions: ${order.instructions}`;
}

async function sendViaChannel(channel) {
  if (!pendingOrder) return;
  const status = document.getElementById("channel-status");
  const order = pendingOrder;

  if (channel === "instagram") {
    // Copy order to clipboard and open Instagram DM
    const orderText = formatOrderText(order);
    try {
      await navigator.clipboard.writeText(orderText);
      window.open("https://ig.me/m/kaylas_desserts_05", "_blank");
      status.textContent = "Order copied! Paste it in the Instagram DM.";
      status.className = "channel-status success";
      setTimeout(() => {
        closeChannelModal();
        showConfirmation(order.customer.name, order.date, order.delivery.method, order.total);
        cart = [];
        updateCartUI();
        document.getElementById("order-form").reset();
      }, 2000);
    } catch (err) {
      status.textContent = "Couldn't copy to clipboard. Please screenshot your order.";
      status.className = "channel-status error";
    }
    return;
  }

  // Email or WhatsApp — send to Edge Function
  status.textContent = "Sending...";

  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, ...order })
    });

    const data = await res.json();

    if (data.success) {
      status.textContent = "Order sent!";
      status.className = "channel-status success";
      setTimeout(() => {
        closeChannelModal();
        showConfirmation(order.customer.name, order.date, order.delivery.method, order.total);
        cart = [];
        updateCartUI();
        document.getElementById("order-form").reset();
      }, 1500);
    } else {
      throw new Error(data.error || "Failed to send order");
    }
  } catch (err) {
    console.error("Order send error:", err);
    status.textContent = "Something went wrong. Try another method or DM @kaylas_desserts_05.";
    status.className = "channel-status error";
  }
}

function initChannelModal() {
  const modal = document.getElementById("channel-modal");
  if (!modal) return;

  // Close button
  modal.querySelector(".channel-modal-close").addEventListener("click", closeChannelModal);

  // Click outside to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeChannelModal();
  });

  // Channel buttons
  modal.querySelectorAll(".channel-btn").forEach(btn => {
    btn.addEventListener("click", () => sendViaChannel(btn.dataset.channel));
  });
}
```

**Step 2: Rewrite submitOrder function**

Replace the entire `submitOrder()` function with:
```js
function submitOrder() {
  const order = buildOrderPayload();
  showChannelModal(order);
}
```

This removes the direct EmailJS call — the Edge Function handles it now.

**Step 3: Add initChannelModal() to DOMContentLoaded**

Add `initChannelModal();` call in the DOMContentLoaded handler.

**Step 4: Commit**
```bash
git add script.js
git commit -m "feat: channel modal JS + order form integration

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: Vercel Edge Function — Email + WhatsApp

Create the serverless endpoint that handles order delivery via Email and WhatsApp.

**Files:**
- Create: `api/order.js`
- Create: `vercel.json`

**Step 1: Create vercel.json**

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ]
}
```

**Step 2: Create api/order.js**

```js
export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  if (req.method !== "POST") {
    return Response.json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { channel, customer, items, delivery, date, instructions, subtotal, total } = body;

    if (!channel || !customer?.name || !items?.length) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const itemsList = items.map(i => `${i.name} (${i.option}) x${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join("\n");

    if (channel === "email") {
      // Send via EmailJS REST API
      const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          template_params: {
            customer_name: customer.name,
            customer_phone: customer.phone,
            items_list: itemsList,
            delivery_method: delivery.method,
            delivery_fee: `$${delivery.fee.toFixed(2)}`,
            subtotal: `$${subtotal.toFixed(2)}`,
            total: `$${total.toFixed(2)}`,
            order_date: date,
            special_instructions: instructions || "None"
          }
        })
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        throw new Error(`EmailJS failed: ${errText}`);
      }

      return Response.json({ success: true });
    }

    if (channel === "whatsapp") {
      const phoneId = process.env.WHATSAPP_PHONE_ID;
      const token = process.env.WHATSAPP_TOKEN;
      const kaylaNumber = process.env.KAYLA_WHATSAPP_NUMBER;

      if (!phoneId || !token || !kaylaNumber) {
        // Fallback to email if WhatsApp not configured
        return Response.json({ success: false, error: "WhatsApp not configured yet. Try Email." }, { status: 503 });
      }

      const message = `🧁 *NEW ORDER*\n\n` +
        `*Customer:* ${customer.name}\n` +
        `*Phone:* ${customer.phone}\n` +
        `*Date:* ${date}\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Delivery:* ${delivery.method} — $${delivery.fee.toFixed(2)}\n` +
        `*Total:* $${total.toFixed(2)}\n\n` +
        `*Instructions:* ${instructions || "None"}`;

      const waRes = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: kaylaNumber,
          type: "text",
          text: { body: message }
        })
      });

      if (!waRes.ok) {
        const errData = await waRes.json();
        throw new Error(`WhatsApp API error: ${JSON.stringify(errData)}`);
      }

      return Response.json({ success: true });
    }

    return Response.json({ success: false, error: "Unknown channel" }, { status: 400 });

  } catch (err) {
    console.error("Order API error:", err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
```

**Step 3: Commit**
```bash
git add api/order.js vercel.json
git commit -m "feat: Vercel Edge Function for email + WhatsApp order delivery

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

**Step 4: Set Vercel environment variables**

Run these (the EmailJS values are already known from the codebase):
```bash
vercel env add EMAILJS_SERVICE_ID production
# Enter: service_leifomr

vercel env add EMAILJS_TEMPLATE_ID production
# Enter: template_p969v3g

vercel env add EMAILJS_PUBLIC_KEY production
# Enter: qId7LYirAJei2KgDK
```

WhatsApp env vars (WHATSAPP_PHONE_ID, WHATSAPP_TOKEN, KAYLA_WHATSAPP_NUMBER) will be set later when Kayla sets up her Meta Business account. The Edge Function gracefully falls back with a "not configured" message if they're missing.

---

### Task 4: Chatbot Widget — HTML + CSS

Build the floating chat bubble and expandable panel with the Dark Luxe theme.

**Files:**
- Modify: `index.html` (add chatbot markup)
- Modify: `styles.css` (add chatbot styles)

**Step 1: Add chatbot HTML to index.html**

Before the channel modal div, add:
```html
<!-- Chatbot Widget -->
<div class="chatbot" id="chatbot">
  <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open ordering assistant">
    <span class="chatbot-toggle-icon">💬</span>
    <span class="chatbot-toggle-close">&times;</span>
  </button>
  <div class="chatbot-panel" id="chatbot-panel">
    <div class="chatbot-header">
      <h3>Order Assistant</h3>
      <span class="chatbot-header-sub">Kayla's Desserts</span>
    </div>
    <div class="chatbot-messages" id="chatbot-messages"></div>
    <div class="chatbot-input-area" id="chatbot-input-area">
      <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Type a message..." autocomplete="off">
      <button class="chatbot-send" id="chatbot-send" aria-label="Send">→</button>
    </div>
  </div>
</div>
```

**Step 2: Add chatbot CSS to styles.css**

Add before the responsive media queries:
```css
/* ===========================
   Chatbot Widget
   =========================== */
.chatbot {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 900;
}

.chatbot-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), #E8C97A);
  border: none;
  box-shadow: 0 4px 20px var(--glow-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  position: relative;
  z-index: 910;
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px var(--glow-gold);
}

.chatbot-toggle-icon {
  font-size: 1.5rem;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.chatbot-toggle-close {
  position: absolute;
  font-size: 1.8rem;
  color: var(--bg);
  opacity: 0;
  transform: rotate(-90deg);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.chatbot.open .chatbot-toggle-icon {
  opacity: 0;
  transform: rotate(90deg);
}

.chatbot.open .chatbot-toggle-close {
  opacity: 1;
  transform: rotate(0deg);
}

.chatbot-panel {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 350px;
  height: 500px;
  background: var(--surface);
  border: 1px solid rgba(212, 168, 83, 0.15);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: translateY(16px) scale(0.95);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.chatbot.open .chatbot-panel {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}

.chatbot-header {
  padding: 20px;
  border-bottom: 1px solid rgba(212, 168, 83, 0.1);
  text-align: center;
}

.chatbot-header h3 {
  font-family: 'Playfair Display', serif;
  color: var(--gold);
  font-size: 1.2rem;
  margin: 0;
}

.chatbot-header-sub {
  font-size: 0.75rem;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chatbot-messages::-webkit-scrollbar {
  width: 4px;
}

.chatbot-messages::-webkit-scrollbar-thumb {
  background: rgba(212, 168, 83, 0.2);
  border-radius: 4px;
}

.chat-msg {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.88rem;
  line-height: 1.5;
  animation: chatMsgIn 0.3s ease;
}

@keyframes chatMsgIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-msg.bot {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--cream);
}

.chat-msg.user {
  align-self: flex-end;
  background: rgba(212, 168, 83, 0.12);
  border: 1px solid rgba(212, 168, 83, 0.2);
  color: var(--cream);
}

.chat-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.chat-option-btn {
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid rgba(212, 168, 83, 0.3);
  background: transparent;
  color: var(--gold);
  font-size: 0.8rem;
  font-weight: 600;
  transition: var(--transition);
  white-space: nowrap;
}

.chat-option-btn:hover {
  background: rgba(212, 168, 83, 0.1);
  border-color: var(--gold);
}

.chat-option-btn:active {
  transform: scale(0.95);
}

.chatbot-input-area {
  display: flex;
  padding: 12px;
  border-top: 1px solid rgba(212, 168, 83, 0.1);
  gap: 8px;
}

.chatbot-input {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--cream);
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  padding: 8px 0;
  outline: none;
  transition: border-color 0.3s ease;
}

.chatbot-input:focus {
  border-bottom-color: var(--gold);
}

.chatbot-input::placeholder {
  color: var(--muted);
}

.chatbot-send {
  background: none;
  border: none;
  color: var(--gold);
  font-size: 1.2rem;
  padding: 4px 8px;
  transition: var(--transition);
}

.chatbot-send:hover {
  transform: scale(1.1);
}

/* Mobile responsive */
@media (max-width: 400px) {
  .chatbot-panel {
    width: calc(100vw - 32px);
    right: -8px;
    height: 60vh;
  }
}
```

**Step 3: Commit**
```bash
git add index.html styles.css
git commit -m "feat: chatbot widget — HTML + CSS (dark luxe theme)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Chatbot Conversation Engine

Build the state machine that drives the chatbot conversation flow.

**Files:**
- Create: `chatbot.js`
- Modify: `index.html` (add script tag for chatbot.js)

**Step 1: Create chatbot.js**

```js
// ============================================
// Kayla's Desserts — Chatbot Ordering Assistant
// ============================================

const chatStates = {
  GREETING: "greeting",
  CATEGORY: "category",
  ITEM: "item",
  OPTIONS: "options",
  MORE: "more",
  NAME: "name",
  PHONE: "phone",
  DATE: "date",
  INSTRUCTIONS: "instructions",
  DELIVERY: "delivery",
  SUMMARY: "summary",
  CHANNEL: "channel",
  DONE: "done"
};

let chatState = chatStates.GREETING;
let chatOrder = { items: [], customer: {}, delivery: {}, date: "", instructions: "" };
let currentCategory = null;
let currentItem = null;

// Reference the menuItems array from script.js (it's global)

function initChatbot() {
  const toggle = document.getElementById("chatbot-toggle");
  const chatbot = document.getElementById("chatbot");
  const input = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("chatbot-send");

  if (!toggle || !chatbot) return;

  toggle.addEventListener("click", () => {
    chatbot.classList.toggle("open");
    if (chatbot.classList.contains("open") && chatState === chatStates.GREETING) {
      sendBotMessage("Hey! I'm Kayla's ordering assistant. Ready to build your order?", [
        { label: "Start Order", value: "start" },
        { label: "View Menu", value: "menu" }
      ]);
    }
  });

  sendBtn.addEventListener("click", handleUserInput);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleUserInput();
  });
}

function handleUserInput() {
  const input = document.getElementById("chatbot-input");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  sendUserMessage(text);
  processInput(text);
}

function handleOptionClick(value, label) {
  sendUserMessage(label);
  processInput(value);
}

function processInput(input) {
  switch (chatState) {
    case chatStates.GREETING:
      if (input === "start" || input === "menu") {
        chatState = chatStates.CATEGORY;
        showCategories();
      }
      break;

    case chatStates.CATEGORY:
      currentCategory = input;
      chatState = chatStates.ITEM;
      showItems(input);
      break;

    case chatStates.ITEM:
      currentItem = menuItems.find(i => i.id === parseInt(input));
      if (currentItem) {
        if (currentItem.options.length > 1) {
          chatState = chatStates.OPTIONS;
          showItemOptions(currentItem);
        } else {
          addItemToOrder(currentItem, 0);
          chatState = chatStates.MORE;
          showMore();
        }
      }
      break;

    case chatStates.OPTIONS:
      addItemToOrder(currentItem, parseInt(input));
      chatState = chatStates.MORE;
      showMore();
      break;

    case chatStates.MORE:
      if (input === "more") {
        chatState = chatStates.CATEGORY;
        showCategories();
      } else if (input === "done") {
        chatState = chatStates.NAME;
        sendBotMessage("Almost done! What's your name?");
      }
      break;

    case chatStates.NAME:
      chatOrder.customer.name = input;
      chatState = chatStates.PHONE;
      sendBotMessage("Phone number?");
      break;

    case chatStates.PHONE:
      chatOrder.customer.phone = input;
      chatState = chatStates.DATE;
      sendBotMessage("What date would you like your order? (e.g., March 15)");
      break;

    case chatStates.DATE:
      chatOrder.date = input;
      chatState = chatStates.INSTRUCTIONS;
      sendBotMessage("Any special instructions?", [
        { label: "None", value: "none" },
      ]);
      break;

    case chatStates.INSTRUCTIONS:
      chatOrder.instructions = input === "none" ? "None" : input;
      chatState = chatStates.DELIVERY;
      sendBotMessage("How should we get this to you?", [
        { label: "Pickup — Free", value: "pickup" },
        { label: "Rancho — $10", value: "rancho" },
        { label: "Sacramento — $17.50", value: "sacramento" },
        { label: "Farther — $22.50", value: "farther" }
      ]);
      break;

    case chatStates.DELIVERY: {
      const fees = { pickup: 0, rancho: 10, sacramento: 17.50, farther: 22.50 };
      const labels = { pickup: "Pickup — Free", rancho: "Rancho — $10", sacramento: "Sacramento — $17.50", farther: "Farther — $22.50" };
      chatOrder.delivery = { method: labels[input] || input, fee: fees[input] || 0 };
      chatState = chatStates.SUMMARY;
      showSummary();
      break;
    }

    case chatStates.SUMMARY:
      if (input === "confirm") {
        chatState = chatStates.CHANNEL;
        sendBotMessage("How would you like to send your order?", [
          { label: "📧 Email", value: "email" },
          { label: "💬 WhatsApp", value: "whatsapp" },
          { label: "📷 Instagram", value: "instagram" }
        ]);
      } else if (input === "edit") {
        chatOrder.items = [];
        chatState = chatStates.CATEGORY;
        sendBotMessage("No problem! Let's start over.");
        showCategories();
      }
      break;

    case chatStates.CHANNEL:
      sendOrder(input);
      break;
  }
}

function showCategories() {
  const categories = [...new Set(menuItems.map(i => i.category))];
  const options = categories.map(c => ({
    label: c.charAt(0).toUpperCase() + c.slice(1),
    value: c
  }));
  sendBotMessage("What are you in the mood for?", options);
}

function showItems(category) {
  const items = menuItems.filter(i => i.category === category);
  const options = items.map(i => ({
    label: `${i.name} — from $${i.options[0].price}`,
    value: i.id.toString()
  }));
  sendBotMessage(`Here are our ${category}:`, options);
}

function showItemOptions(item) {
  const options = item.options.map((opt, i) => ({
    label: `${opt.label} — $${opt.price}`,
    value: i.toString()
  }));
  sendBotMessage(`Pick a size for ${item.name}:`, options);
}

function addItemToOrder(item, optionIdx) {
  const option = item.options[optionIdx];
  chatOrder.items.push({
    name: item.name,
    option: option.label,
    qty: 1,
    price: option.price
  });
  sendBotMessage(`Added ${item.name} (${option.label}) — $${option.price.toFixed(2)}`);
}

function showMore() {
  sendBotMessage("Want to add anything else?", [
    { label: "Add More", value: "more" },
    { label: "That's Everything", value: "done" }
  ]);
}

function showSummary() {
  const subtotal = chatOrder.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal + chatOrder.delivery.fee;
  chatOrder.subtotal = subtotal;
  chatOrder.total = total;

  const itemLines = chatOrder.items.map(i => `${i.name} (${i.option}) — $${i.price.toFixed(2)}`).join("\n");
  const summaryText =
    `Here's your order:\n\n${itemLines}\n\n` +
    `Delivery: ${chatOrder.delivery.method}\n` +
    `Total: $${total.toFixed(2)}\n\n` +
    `Look good?`;

  sendBotMessage(summaryText, [
    { label: "Confirm", value: "confirm" },
    { label: "Start Over", value: "edit" }
  ]);
}

async function sendOrder(channel) {
  if (channel === "instagram") {
    const orderText = formatOrderText(chatOrder);
    try {
      await navigator.clipboard.writeText(orderText);
      window.open("https://ig.me/m/kaylas_desserts_05", "_blank");
      sendBotMessage("Order copied! Paste it in the Instagram DM to complete your order.");
    } catch {
      sendBotMessage("Couldn't copy automatically. Please screenshot your order and DM @kaylas_desserts_05.");
    }
    chatState = chatStates.DONE;
    return;
  }

  sendBotMessage("Sending your order...");

  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, ...chatOrder })
    });

    const data = await res.json();

    if (data.success) {
      sendBotMessage("Order sent! Kayla will confirm shortly. Thank you! 🎉");
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    console.error("Chatbot order error:", err);
    sendBotMessage("Something went wrong. Try another method, or DM @kaylas_desserts_05 on Instagram.");
    sendBotMessage("How would you like to send your order?", [
      { label: "📧 Email", value: "email" },
      { label: "💬 WhatsApp", value: "whatsapp" },
      { label: "📷 Instagram", value: "instagram" }
    ]);
    return;
  }

  chatState = chatStates.DONE;
}

// ---------- Chat UI Helpers ----------

function sendBotMessage(text, options) {
  const container = document.getElementById("chatbot-messages");
  const msg = document.createElement("div");
  msg.className = "chat-msg bot";
  msg.textContent = text;
  msg.style.whiteSpace = "pre-line";
  container.appendChild(msg);

  if (options && options.length > 0) {
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "chat-options";
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "chat-option-btn";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        // Remove all option buttons after click
        container.querySelectorAll(".chat-options").forEach(el => el.remove());
        handleOptionClick(opt.value, opt.label);
      });
      optionsDiv.appendChild(btn);
    });
    container.appendChild(optionsDiv);
  }

  container.scrollTop = container.scrollHeight;
}

function sendUserMessage(text) {
  const container = document.getElementById("chatbot-messages");
  const msg = document.createElement("div");
  msg.className = "chat-msg user";
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}
```

**Step 2: Add script tag to index.html**

Before the closing `</body>` tag (after script.js, before the chatbot div), add:
```html
<script src="chatbot.js" defer></script>
```

Actually, place it right after the `script.js` tag in `<head>`:
```html
<script src="script.js" defer></script>
<script src="chatbot.js" defer></script>
```

**Step 3: Add initChatbot() call**

In chatbot.js, add at the bottom of the file:
```js
document.addEventListener("DOMContentLoaded", () => {
  initChatbot();
});
```

**Step 4: Commit**
```bash
git add chatbot.js index.html
git commit -m "feat: chatbot conversation engine — state machine + UI

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Vercel Deployment + Environment Setup

Link the project to Vercel and set up environment variables so the Edge Function works.

**Files:**
- No file changes — CLI commands only

**Step 1: Link project to Vercel**

```bash
cd C:/Users/glenn/kaylas-desserts
vercel link
```

Follow prompts to link to existing project or create new one.

**Step 2: Set environment variables**

```bash
vercel env add EMAILJS_SERVICE_ID production <<< "service_leifomr"
vercel env add EMAILJS_TEMPLATE_ID production <<< "template_p969v3g"
vercel env add EMAILJS_PUBLIC_KEY production <<< "qId7LYirAJei2KgDK"
```

**Step 3: Deploy**

```bash
vercel --prod
```

**Step 4: Test the deployment**

Open the Vercel URL and verify:
1. Site loads with Dark Luxe theme
2. Chatbot bubble appears bottom-right
3. Clicking bubble opens chat panel
4. Order form submit shows channel modal

**Step 5: Commit any Vercel config changes**
```bash
git add -A
git commit -m "chore: vercel project link

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push origin main
```

---

### Task 7: Integration Testing + Polish

Test the full flow end-to-end and fix any issues.

**Files:**
- Modify: `script.js` (any fixes)
- Modify: `chatbot.js` (any fixes)
- Modify: `styles.css` (any fixes)

**Step 1: Test order form → channel modal flow**
1. Add items to cart from menu
2. Fill out order form
3. Submit — channel modal should appear with order summary
4. Click Email — should send via Edge Function
5. Verify Kayla receives the email

**Step 2: Test chatbot flow**
1. Click chat bubble
2. Walk through: Start Order → Cakes → Churro Cheesecake → Full Pan → That's Everything
3. Enter name, phone, date
4. Pick delivery
5. Confirm → pick Email
6. Verify order sends

**Step 3: Test Instagram flow**
1. Complete an order (form or chatbot)
2. Pick Instagram channel
3. Verify clipboard has order text
4. Verify Instagram DM link opens

**Step 4: Test mobile responsiveness**
- Chat panel at 375px width
- Channel modal at 375px width
- Ensure buttons are tappable

**Step 5: Final commit + push**
```bash
git add styles.css script.js chatbot.js
git commit -m "fix: integration testing polish

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push origin main
vercel --prod
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Channel selection modal — HTML + CSS | index.html, styles.css |
| 2 | Channel modal JS + order form integration | script.js |
| 3 | Vercel Edge Function — email + WhatsApp | api/order.js, vercel.json |
| 4 | Chatbot widget — HTML + CSS | index.html, styles.css |
| 5 | Chatbot conversation engine | chatbot.js, index.html |
| 6 | Vercel deployment + env setup | CLI only |
| 7 | Integration testing + polish | all files |
