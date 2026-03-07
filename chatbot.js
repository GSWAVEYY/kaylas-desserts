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

  const itemsList = chatOrder.items.map(i => `${i.name} (${i.option}) x${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join("\n");

  try {
    if (channel === "email") {
      await emailjs.send("service_leifomr", "template_p969v3g", {
        customer_name: chatOrder.customer.name,
        customer_phone: chatOrder.customer.phone,
        items_list: itemsList,
        delivery_method: chatOrder.delivery.method,
        delivery_fee: `$${chatOrder.delivery.fee.toFixed(2)}`,
        subtotal: `$${chatOrder.subtotal.toFixed(2)}`,
        total: `$${chatOrder.total.toFixed(2)}`,
        order_date: chatOrder.date,
        special_instructions: chatOrder.instructions || "None"
      }, "qId7LYirAJei2KgDK");
      sendBotMessage("Order sent! Kayla will confirm shortly. Thank you! 🎉");
    } else {
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

document.addEventListener("DOMContentLoaded", () => {
  initChatbot();
});
