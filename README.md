# Kayla's Desserts

Homemade treats made with love in the Sacramento area.

**Live site:** [https://gswaveyy.github.io/kaylas-desserts/](https://gswaveyy.github.io/kaylas-desserts/)

## Features

- Interactive menu with category filtering (Cookies, Cakes, Dessert Cups, Treats)
- Shopping cart with quantity controls and delivery fee calculation
- Order form with date validation (24-hour advance notice required)
- Delivery pricing: Pickup (free), Rancho ($10), Sacramento ($15-20), Farther ($20-25)
- Order submissions via EmailJS
- Smooth scroll animations
- Mobile-first responsive design

## Tech Stack

- HTML, CSS, vanilla JavaScript (no frameworks)
- Google Fonts (Pacifico + Nunito)
- EmailJS for order notifications
- GitHub Pages hosting

## Setup EmailJS (Required for Order Notifications)

1. Create a free account at [emailjs.com](https://www.emailjs.com/)
2. Add an email service (Gmail, Outlook, etc.) in the dashboard
3. Create an email template with these variables:
   - `{{customer_name}}`, `{{customer_phone}}`
   - `{{items_list}}`, `{{delivery_method}}`, `{{delivery_fee}}`
   - `{{subtotal}}`, `{{total}}`, `{{order_date}}`
   - `{{special_instructions}}`
4. In `script.js`, replace the three placeholder values:
   - `YOUR_PUBLIC_KEY` — from Account > API Keys
   - `YOUR_SERVICE_ID` — from Email Services
   - `YOUR_TEMPLATE_ID` — from Email Templates

## Updating Menu Items

Edit the `menuItems` array in `script.js`. Each item has:

```js
{ id: 1, name: "Item Name", category: "cookies", price: 3.50, description: "...", emoji: "..." }
```

Categories: `cookies`, `cakes`, `dessert-cups`, `treats`

## Adding Real Photos

Replace the emoji placeholders in menu cards by updating the `renderMenu()` function in `script.js` to use `<img>` tags or background images pointing to files in an `images/` folder.
