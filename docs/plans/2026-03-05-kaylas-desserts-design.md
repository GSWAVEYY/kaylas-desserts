# Kayla's Desserts - Website Design

## Tech Stack
- Single `index.html` + `styles.css` + `script.js`
- GitHub Pages hosting (free)
- EmailJS for order form submissions (free tier, 200 emails/month)
- No frameworks, no build tools

## Visual Design
- **Palette:** Pastel pink (#FFB6C1), lavender (#E6D5F5), mint (#B5EAD7), cream (#FFF8F0) bg, dark (#2D2D2D) text
- **Typography:** Playful display font for headings, Poppins/Nunito for body (Google Fonts)
- **Style:** Rounded corners, soft shadows, pastel gradient accents, candy-shop energy
- **Hover:** Gentle scale-up on cards, color shifts on buttons
- **Scroll:** Fade-in-up animations as sections enter viewport
- **Mobile-first** design

## Page Sections (single page, smooth scroll)
1. **Hero** - Pastel gradient bg, logo, tagline, CTA buttons (View Menu / Place Order)
2. **Menu** - Category tabs (Cookies, Cakes, Dessert Cups, Treats), card grid with photo/name/description/price
3. **Order Form** - Item selection + quantities, pickup/delivery toggle, date picker (24hr min), special instructions, delivery zone pricing
4. **Payment Info** - Accepted methods: Zelle, Cash App, Cash
5. **About** - Short bio, photo placeholder
6. **Footer** - Instagram (@kaylas_desserts_05), contact info

## Menu Items
### Cookies
- Red Velvet White Chocolate Chip Cookie
- Chocolate Chip Cookies

### Cakes
- Mini Cakes
- Churro Cheesecake

### Dessert Cups
- Fresas con Crema
- Choco Flan

### Treats
- Cake Pops
- Chocolate Covered Strawberries
- Brownies

## Order Flow
1. Customer browses menu, adds items to cart (JS array, no backend)
2. Cart summary in order form section
3. Customer fills: date, pickup/delivery, special instructions
4. Submit sends formatted order to Kayla's email via EmailJS
5. Customer sees confirmation message

## Delivery Pricing
- Pickup: Free
- Rancho area: $10
- Sacramento area: $15-20
- Farther: $20-25
