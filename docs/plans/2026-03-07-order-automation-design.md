# Order Automation & Chatbot — Design Document

## Vision
Add multi-channel order delivery (Email, WhatsApp, Instagram) and a guided chatbot assistant to kaylas-desserts. Both the existing order form and the chatbot feed into the same submission pipeline.

## Constraints
- Free tier only (no monthly costs)
- Static site on GitHub Pages + Vercel Edge Function for serverless backend
- Vanilla HTML/CSS/JS (no frameworks)
- Must match Dark Luxe visual theme

## Architecture

```
Customer (Form or Chatbot)
  → Builds order
  → Picks channel: Email | WhatsApp | Instagram
  → JS sends order JSON to Vercel Edge Function (/api/order)
      ├─ Email: calls EmailJS REST API → Kayla gets email
      ├─ WhatsApp: calls WhatsApp Cloud API → Kayla gets WhatsApp message
      └─ Instagram: client-side only → copies order to clipboard + opens IG DM link
  → Customer sees confirmation
```

## Component 1: Channel Selection (shared by form + chatbot)

After order is built (from either the form or chatbot), a modal appears:

- Order summary (items, delivery, total)
- "How would you like to send your order?"
- Three buttons: Email | WhatsApp | Instagram
- Email + WhatsApp trigger the Edge Function
- Instagram copies order text to clipboard, opens `https://ig.me/m/kaylas_desserts_05`, shows toast: "Order copied! Paste it in the DM"

## Component 2: Chatbot Widget

### UX Flow (state machine)
1. **greeting** — "Hey! I'm Kayla's ordering assistant. Ready to build your order?" → [Start Order] [View Menu]
2. **category** — "What are you in the mood for?" → [Cakes] [Desserts] [Treats]
3. **item** — Shows items in selected category as buttons
4. **options** — Size/quantity selection if item has multiple options
5. **more** — "Added! Want to add anything else?" → [Add More] [That's Everything]
6. **name** — "Almost done! What's your name?" (free text)
7. **phone** — "Phone number?" (free text)
8. **date** — "Preferred date?" (free text or date picker)
9. **instructions** — "Any special instructions?" → [None] or free text
10. **delivery** — "How should we get this to you?" → [Pickup - Free] [Rancho - $10] [Sacramento - $17.50] [Farther - $22.50]
11. **summary** — Shows full order with total → [Confirm] [Edit Order]
12. **channel** — "How would you like to send your order?" → [Email] [WhatsApp] [Instagram]
13. **done** — Confirmation message

### Free Text Input
Always available at bottom. If user types something like "add 6 cookies" mid-flow, attempt to match against menu items and handle gracefully. If no match, respond with "I didn't catch that — try picking from the options above!"

### Visual Design
- Floating gold-bordered circle (bottom-right, 56px) with chat icon
- Expands to ~350px wide, ~500px tall dark glass panel
- Dark surface background with gold accents
- Bot messages: left-aligned, dark glass bubbles
- User messages: right-aligned, gold-tinted bubbles
- Quick-reply buttons: gold-bordered pills
- Input: bottom-fixed, gold underline style
- Close button top-right
- Matches Dark Luxe theme (Playfair Display for bot name, Inter for messages)

## Component 3: Updated Order Form Flow

Current flow: fill form → submit → EmailJS sends → confirmation modal

New flow:
1. Fill form (name, phone, date, delivery, instructions) — unchanged
2. Hit "Submit Order"
3. Channel selection modal appears (same component as chatbot uses)
4. Pick Email, WhatsApp, or Instagram
5. Routes through Edge Function (or clipboard for IG)
6. Confirmation shown

## Component 4: Vercel Edge Function

### Endpoint: POST /api/order

**Request body:**
```json
{
  "channel": "email" | "whatsapp",
  "customer": {
    "name": "string",
    "phone": "string"
  },
  "items": [
    { "name": "string", "option": "string", "qty": 1, "price": 5.00 }
  ],
  "delivery": { "method": "string", "fee": 0.00 },
  "date": "2026-03-15",
  "instructions": "string",
  "subtotal": 25.00,
  "total": 35.00
}
```

**Email channel:**
- Calls EmailJS REST API with existing service/template IDs
- Template params match current format

**WhatsApp channel:**
- Calls WhatsApp Cloud API: `POST https://graph.facebook.com/v18.0/{phone_id}/messages`
- Sends formatted text message to Kayla's WhatsApp number
- API token stored as Vercel env var

**Response:**
```json
{ "success": true }
```
or
```json
{ "success": false, "error": "message" }
```

## Component 5: WhatsApp Cloud API Setup

Requirements (one-time setup by Kayla):
1. Create Meta Business account at business.facebook.com
2. Set up WhatsApp Business app in Meta Developer portal
3. Register a WhatsApp Business phone number
4. Generate permanent API token
5. Store token + phone ID as Vercel environment variables

Free tier: 1,000 business-initiated conversations/month.

## Files

| File | Action | Purpose |
|------|--------|---------|
| `chatbot.js` | Create | Chat widget state machine, UI rendering, order building |
| `styles.css` | Modify | Chat widget styles, channel modal styles |
| `index.html` | Modify | Chat bubble markup, channel modal markup |
| `script.js` | Modify | Update form submission to show channel modal instead of direct EmailJS |
| `api/order.js` | Create | Vercel Edge Function for Email + WhatsApp delivery |
| `vercel.json` | Create | Vercel routing config |

## Order of Implementation
1. Channel selection modal (shared UI component)
2. Update existing order form to use channel modal
3. Vercel Edge Function (email + WhatsApp routes)
4. WhatsApp Cloud API integration
5. Chatbot widget UI (bubble + panel)
6. Chatbot conversation engine (state machine)
7. Connect chatbot to channel modal + Edge Function
8. Instagram clipboard flow
9. Polish + responsive testing
