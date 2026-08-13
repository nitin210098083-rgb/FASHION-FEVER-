# 🔥 FASHION FEVER - Luxury E-Commerce Web Store

Welcome to **FASHION FEVER**, a modern, high-fashion e-commerce web application featuring luxury aesthetics, live search, dynamic filters, persistent shopping cart & wishlist, multi-step checkout with simulated UPI/Card payment, instant order placement with tracking receipts, and Google-ready authentication & SEO.

---

## 🚀 How to Run & View Website

### Option 1: Direct File Launch (No installation required)
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari):
```
C:\Users\nitin\.gemini\antigravity\scratch\fashion-fever\index.html
```

### Option 2: Run with Local Web Server (Recommended)
You can serve it with Python, Node, or VS Code Live Server:
```bash
# Using Python
python -m http.server 3000

# Or using npx
npx serve .
```
Then visit: `http://localhost:3000`

---

## ✨ Features Included

1. **Editorial Luxury Design System**:
   - Champagne gold & obsidian aesthetic gradients (`--gradient-luxury`, `--gradient-rose-gold`, `--gradient-btn`).
   - Glassmorphic backdrops, smooth micro-interactions, responsive fluid design for mobile, tablet, and desktop.
   - Curated typography: *Playfair Display* (Serif Couture), *Cinzel* (Brand mark), and *Plus Jakarta Sans* (Editorial UI).

2. **Live Search & Filter Engine**:
   - Real-time search across titles, categories, tags, and product descriptions.
   - Category filter pills (*All Styles, Women's Couture, Men's Luxury, Streetwear, Footwear, Accessories*).
   - Sorting by Price (Low to High, High to Low), Customer Rating, and Popularity.

3. **Interactive Product Quick-View**:
   - HD gallery with image switcher.
   - Size selector (*XS, S, M, L, XL, XXL*), color dots picker, dynamic quantity calculator, and stock counter.

4. **Persistent Shopping Cart & Wishlist (`localStorage`)**:
   - Slide-over drawer with items, size/color retention, quantity modifiers, and item removal.
   - Free Express Shipping Progress Goal meter (Unlock free delivery on orders > ₹1,999).
   - Discount Promo Code engine:
     - `FEVER20` : 20% discount on order.
     - `WELCOME500` : Flat ₹500 discount on orders > ₹1,999.
     - `FREESHIP` : Free shipping.

5. **Multi-Step Checkout & Order Placement**:
   - **Step 1**: Shipping & Contact details form with validation.
   - **Step 2**: Payment selection:
     - **⚡ Instant UPI & QR**: Generates dynamic QR code for PhonePe, Google Pay, Paytm, BHIM.
     - **💳 Credit / Debit Card**: Formatted card details.
     - **📦 Cash on Delivery (COD)**.
   - **Step 3**: Instant Order Confirmation screen with unique Order ID (e.g. `#FF-89421`), live interactive progress tracker (*Confirmed ➜ Packed ➜ Shipped ➜ Delivered*), and printable receipt invoice.

6. **User Authentication & Profile History**:
   - Sign In / Sign Up modal.
   - **Google Sign-In Ready Button** with Google Identity Services structure.
   - User Profile Dashboard showing VIP membership status, active orders history with status indicators.

---

## 🌐 Connecting to Google (Google Search & Google Sign-In Guide)

### 1. Google Search Console & SEO Verification:
In `index.html` (line 16):
```html
<meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE_HERE" />
```
- Go to [Google Search Console](https://search.google.com/search-console).
- Add your domain and copy the verification token into the `content=""` attribute.
- The website already includes pre-configured **Schema.org JSON-LD Structured Data** (`OnlineStore` and `SearchAction`) for Google Rich Snippets!

### 2. Google OAuth / Sign-In Integration:
In `index.html`, you can load the Google Identity Services SDK:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```
In `js/app.js`, replace `handleGoogleSignIn` with your Google Client ID:
```javascript
google.accounts.id.initialize({
  client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  callback: handleCredentialResponse
});
```

---

## 📁 File Structure
```
fashion-fever/
│
├── index.html          # Main HTML5 semantic template with SEO & Google metadata
├── README.md           # Documentation & setup guide
├── css/
│   └── style.css       # Luxury aesthetic stylesheet with custom CSS variables
└── js/
    ├── products.js     # Curated fashion products catalog & coupon codes
    └── app.js          # Core JavaScript application controller & state engine
```
