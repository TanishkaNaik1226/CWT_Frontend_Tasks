/**
 * ShopEase - Cart Page JavaScript
 * Renders cart items, handles quantity changes, removal, and order summary.
 */

(function () {
  "use strict";

  // ==================== DOM REFERENCES ====================
  const cartItemsContainer = document.getElementById("cartItems");
  const cartSummarySection = document.getElementById("cartSummary");
  const emptyCartSection = document.getElementById("emptyCart");
  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const deliveryEl = document.getElementById("delivery");
  const grandTotalEl = document.getElementById("grandTotal");
  const cartItemCountEl = document.getElementById("cartItemCount");

  // ==================== INITIALISE ====================

  function init() {
    renderCart();
  }

  // ==================== RENDER CART ====================

  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      showEmptyCart();
      return;
    }

    // Show cart content, hide empty state
    if (emptyCartSection) emptyCartSection.style.display = "none";
    if (cartItemsContainer) cartItemsContainer.style.display = "block";
    if (cartSummarySection) cartSummarySection.style.display = "block";

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = cart.map((item) => createCartItemHTML(item)).join("");
    }

    updateSummary();
    bindCartEvents();
  }

  // ==================== CART ITEM HTML ====================

  function createCartItemHTML(item) {
    const itemTotal = item.price * item.quantity;
    const originalPriceHTML =
      item.originalPrice && item.originalPrice > item.price
        ? `<span class="cart-item-original-price">₹${item.originalPrice.toLocaleString("en-IN")}</span>`
        : "";

    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img
            src="${item.image}"
            alt="${item.name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 viewBox=%220 0 120 120%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22120%22 height=%22120%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2212%22 x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E';"
          />
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <div class="cart-item-price">
            <span class="cart-item-current-price">₹${item.price.toLocaleString("en-IN")}</span>
            ${originalPriceHTML}
          </div>
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn qty-decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn qty-increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item-total">
          <span class="item-total-label">Total:</span>
          <span class="item-total-value">₹${itemTotal.toLocaleString("en-IN")}</span>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
    `;
  }

  // ==================== EMPTY CART STATE ====================

  function showEmptyCart() {
    if (cartItemsContainer) cartItemsContainer.style.display = "none";
    if (cartSummarySection) cartSummarySection.style.display = "none";
    if (emptyCartSection) {
      emptyCartSection.style.display = "flex";
      emptyCartSection.innerHTML = `
        <div class="empty-cart-content">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products yet.</p>
          <a href="products.html" class="btn btn-primary">Continue Shopping</a>
        </div>
      `;
    }
  }

  // ==================== UPDATE ORDER SUMMARY ====================

  function updateSummary() {
    const totals = calculateCartTotal();

    if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
    if (discountEl) discountEl.textContent = totals.totalDiscount > 0 ? `- ${formatPrice(totals.totalDiscount)}` : "₹0";
    if (deliveryEl) deliveryEl.textContent = totals.delivery === 0 ? "FREE" : formatPrice(totals.delivery);
    if (grandTotalEl) grandTotalEl.textContent = formatPrice(totals.grandTotal);
    if (cartItemCountEl) cartItemCountEl.textContent = `${totals.itemCount} item${totals.itemCount !== 1 ? "s" : ""}`;
  }

  // ==================== EVENT BINDINGS ====================

  function bindCartEvents() {
    // Quantity increase buttons
    document.querySelectorAll(".qty-increase").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id, 10);
        const cart = getCart();
        const item = cart.find((i) => i.id === id);
        if (item) {
          updateQuantity(id, item.quantity + 1);
          renderCart();
        }
      });
    });

    // Quantity decrease buttons
    document.querySelectorAll(".qty-decrease").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id, 10);
        const cart = getCart();
        const item = cart.find((i) => i.id === id);
        if (item) {
          if (item.quantity <= 1) {
            removeFromCart(id);
          } else {
            updateQuantity(id, item.quantity - 1);
          }
          renderCart();
        }
      });
    });

    // Remove buttons
    document.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id, 10);
        removeFromCart(id);
        showToast("Item removed from cart", "info");
        renderCart();
      });
    });
  }

  // ==================== START ====================
  document.addEventListener("DOMContentLoaded", init);
})();
