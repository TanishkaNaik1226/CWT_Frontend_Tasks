/**
 * ShopEase - Main JavaScript
 * Shared utilities: cart management, navigation, toast notifications, and cart badge updates.
 * Loaded on every page.
 */

// ==================== CONSTANTS ====================
const CART_KEY = "shopEaseCart";
const WISHLIST_KEY = "shopEaseWishlist";

// ==================== WISHLIST MANAGEMENT (Local Storage) ====================

function getWishlist() {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(WISHLIST_KEY);
      return [];
    }
    return parsed.filter((id) => typeof id === "number");
  } catch (e) {
    console.warn("ShopEase: Invalid wishlist data detected.", e);
    localStorage.removeItem(WISHLIST_KEY);
    return [];
  }
}

function saveWishlist(wishlist) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  } catch (e) {
    console.error("ShopEase: Failed to save wishlist.", e);
  }
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const product = products.find((p) => p.id === productId);
  const index = wishlist.indexOf(productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`${product ? product.name : "Item"} removed from Wishlist`, "info");
  } else {
    wishlist.push(productId);
    showToast(`${product ? product.name : "Item"} added to Wishlist!`, "success");
  }

  saveWishlist(wishlist);
  updateWishlistCount();

  // Re-render heart buttons across the page
  document.querySelectorAll(`.wishlist-btn[data-id="${productId}"]`).forEach((btn) => {
    const active = wishlist.includes(productId);
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-label", active ? "Remove from wishlist" : "Add to wishlist");
    btn.innerHTML = active
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  });

  // If on wishlist page, re-render if function exists
  if (typeof renderWishlistPage === "function") {
    renderWishlistPage();
  }
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  const badges = document.querySelectorAll(".wishlist-count");
  badges.forEach((badge) => {
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length > 0 ? "flex" : "none";
  });
}

// ==================== CART MANAGEMENT (Local Storage) ====================

/**
 * Retrieves cart from Local Storage.
 * Returns an empty array if data is missing or corrupt.
 */
function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(CART_KEY);
      return [];
    }
    // Validate each item
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
  } catch (e) {
    console.warn("ShopEase: Invalid cart data detected, resetting cart.", e);
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

/** Saves cart array to Local Storage. */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("ShopEase: Failed to save cart.", e);
  }
}

/** Clears the entire cart. */
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

/**
 * Adds a product to cart.
 * If product already exists, increments its quantity.
 */
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    console.error("ShopEase: Product not found with id", productId);
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`${product.name} added to cart!`);
}

/** Removes a product entirely from cart. */
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartCount();
}

/** Updates the quantity of a product in cart. Removes if quantity <= 0. */
function updateQuantity(productId, newQuantity) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = newQuantity;
  saveCart(cart);
  updateCartCount();
}

/** Calculates and returns cart totals. */
function calculateCartTotal() {
  const cart = getCart();
  let subtotal = 0;
  let totalDiscount = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    if (item.originalPrice && item.originalPrice > item.price) {
      totalDiscount += (item.originalPrice - item.price) * item.quantity;
    }
  });

  const delivery = subtotal > 0 && subtotal < 999 ? 99 : 0;
  const grandTotal = subtotal + delivery;

  return { subtotal, totalDiscount, delivery, grandTotal, itemCount: cart.length };
}

// ==================== CART BADGE ====================

/** Updates cart badge count on every page. */
function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll(".cart-count");
  badges.forEach((badge) => {
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? "flex" : "none";
  });
}

// ==================== TOAST NOTIFICATION ====================

/**
 * Displays a professional, auto-dismissing toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - "success" | "error" | "info"
 */
function showToast(message, type = "success") {
  // Remove existing toast if any
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${type}`;

  const icons = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.success}</span>
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  // Trigger entrance animation
  requestAnimationFrame(() => toast.classList.add("toast-visible"));

  // Auto-dismiss after 2.5 seconds
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
    // Fallback removal
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 400);
  }, 2500);
}

// ==================== MOBILE NAVIGATION ====================

function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
}

// ==================== PRODUCT CARD RENDERING ====================

/**
 * Creates an HTML product card string.
 * @param {Object} product - Product data object.
 * @returns {string} HTML string.
 */
function createProductCard(product) {
  const stars = renderStars(product.rating);
  const discountBadge = product.discount
    ? `<span class="discount-badge">-${product.discount}%</span>`
    : "";
  const originalPriceHTML =
    product.originalPrice && product.originalPrice > product.price
      ? `<span class="original-price">₹${product.originalPrice.toLocaleString("en-IN")}</span>`
      : "";

  const isWishlisted = isInWishlist(product.id);
  const heartIcon = isWishlisted
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

  return `
    <article class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-image-wrapper">
        ${discountBadge}
        <button class="wishlist-btn ${isWishlisted ? "active" : ""}" data-id="${product.id}" onclick="toggleWishlist(${product.id})" aria-label="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}">
          ${heartIcon}
        </button>
        <img
          src="${product.image}"
          alt="${product.name}"
          class="product-image"
          loading="lazy"
          onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22400%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2218%22 x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22%3EImage Unavailable%3C/text%3E%3C/svg%3E';"
        />
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">${stars} <span class="rating-value">${product.rating}</span></div>
        <div class="product-pricing">
          <span class="current-price">₹${product.price.toLocaleString("en-IN")}</span>
          ${originalPriceHTML}
        </div>
        <button class="btn btn-add-cart" onclick="addToCart(${product.id})" aria-label="Add ${product.name} to cart">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Add to Cart
        </button>
      </div>
    </article>
  `;
}

/**
 * Renders star rating HTML.
 * @param {number} rating - Rating value (0-5).
 * @returns {string} HTML string of stars.
 */
function renderStars(rating) {
  let html = '<span class="stars" aria-label="Rating: ' + rating + ' out of 5">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += '<span class="star filled">★</span>';
    } else if (i - rating < 1 && i - rating > 0) {
      html += '<span class="star half">★</span>';
    } else {
      html += '<span class="star">★</span>';
    }
  }
  html += "</span>";
  return html;
}

// ==================== CURRENCY FORMATTING ====================

function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// ==================== INITIALISE ON EVERY PAGE ====================

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  updateCartCount();
  updateWishlistCount();
});
