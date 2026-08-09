# ShopEase - Responsive E-Commerce Store

A professional, fully functional responsive e-commerce frontend built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks, no libraries, no backend — just clean, modern web development.


## 🛠 Technologies Used

| Technology    | Usage                                          |
|---------------|-------------------------------------------------|
| HTML5         | Semantic markup and page structure              |
| CSS3          | Styling, animations, transitions                |
| JavaScript    | DOM manipulation, event handling, logic          |
| Flexbox       | Flexible one-dimensional layouts                |
| CSS Grid      | Responsive two-dimensional layouts              |
| Media Queries | Responsive design for all screen sizes          |
| Local Storage | Persistent shopping cart across page reloads    |

---

## ✨ Features

### 🏠 Homepage
- Hero banner with gradient background and animated decorative shapes
- Category cards linking to filtered product views
- Featured products grid (8 hand-picked items)
- Promotional sale banner
- Full footer with social links and contact info

### 🛍 Products Page
- **20 realistic products** across 5 categories
- **Real-time search** across name, category, and description
- **Category filtering** with pill-shaped buttons
- **Sorting** by price, name, and rating
- **URL query parameter** support (`?category=Electronics`)
- Responsive product grid (4 → 2 → 1 columns)
- "No products found" state when filters return empty

### ❤️ Wishlist
- Heart toggle button on all product cards across Homepage, Products page, and Wishlist page
- Persistent Wishlist storage in **Local Storage** (`shopEaseWishlist`)
- Wishlist item count badge in the header navigation
- Dedicated **`wishlist.html`** view showing all saved items
- **Direct "Add to Cart" option** on each wishlisted item
- **"Add All to Cart"** quick-action button
- Empty wishlist state with "Explore Products" CTA

### 🛒 Shopping Cart
- Cart items with image, details, and quantity controls (+ / −)
- Individual item totals and remove buttons
- Order summary with subtotal, discount, delivery, and grand total
- Free delivery on orders above ₹999
- Empty cart state with "Continue Shopping" link
- Persistent via **Local Storage**

### 💳 Checkout
- Customer information form (name, email, phone)
- Shipping address form (address, city, state, pincode)
- Payment method selection (COD, Card, UPI)
- **Inline form validation** with error messages
- Order summary sidebar
- Order success modal with generated Order ID
- Cart clearing after successful order

### 📱 Responsive Design
- Fully responsive across desktop, tablet, and mobile
- Hamburger menu for mobile navigation
- CSS Grid and Flexbox layouts adapt to all screen sizes
- No horizontal scrolling on any viewport

### 🔔 UX Enhancements
- Toast notifications for cart actions
- Smooth hover animations on product cards
- Sticky header with blur backdrop
- Cart badge showing total item count across all pages
- Image error fallbacks (SVG placeholders)

---

## 📁 Project Structure

```
ShopEase/
│
├── index.html          # Homepage
├── products.html       # Product listing page
├── wishlist.html       # Wishlist page (Direct Add to Cart)
├── cart.html           # Shopping cart page
├── checkout.html       # Checkout page
├── README.md           # This file
│
├── css/
│   ├── style.css       # Global styles, header, footer, hero, cards
│   ├── products.css    # Products page: toolbar, filters, grid
│   ├── wishlist.css    # Wishlist page layout & buttons
│   ├── cart.css        # Cart page: items, summary, empty state
│   ├── checkout.css    # Checkout: form, validation, success modal
│   └── responsive.css  # Media queries for all breakpoints
│
├── js/
│   ├── data.js         # Product data (20 products, 5 categories)
│   ├── main.js         # Shared: cart & wishlist management, toast, nav, badges
│   ├── products.js     # Products page: search, filter, sort, render
│   ├── wishlist.js     # Wishlist page: render, direct add to cart, move all
│   ├── cart.js         # Cart page: render, quantity, remove, summary
│   └── checkout.js     # Checkout: validation, order placement
│
└── images
```


