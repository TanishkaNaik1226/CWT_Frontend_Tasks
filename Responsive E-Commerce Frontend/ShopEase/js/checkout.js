/**
 * ShopEase - Checkout Page JavaScript
 * Handles form validation, order summary display, and order placement.
 */

(function () {
  "use strict";

  // ==================== DOM REFERENCES ====================
  const checkoutForm = document.getElementById("checkoutForm");
  const orderItemsList = document.getElementById("orderItems");
  const orderSubtotal = document.getElementById("orderSubtotal");
  const orderDelivery = document.getElementById("orderDelivery");
  const orderTotal = document.getElementById("orderTotal");
  const orderSuccessModal = document.getElementById("orderSuccessModal");
  const orderIdDisplay = document.getElementById("orderIdDisplay");
  const emptyCheckout = document.getElementById("emptyCheckout");
  const checkoutContent = document.getElementById("checkoutContent");

  // ==================== VALIDATION RULES ====================
  const validationRules = {
    fullName: {
      required: true,
      minLength: 3,
      message: "Full name must be at least 3 characters.",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address.",
    },
    phone: {
      required: true,
      pattern: /^\d{10}$/,
      message: "Phone number must be exactly 10 digits.",
    },
    address: {
      required: true,
      message: "Address is required.",
    },
    city: {
      required: true,
      message: "City is required.",
    },
    state: {
      required: true,
      message: "State is required.",
    },
    pincode: {
      required: true,
      pattern: /^\d{6}$/,
      message: "Pincode must be exactly 6 digits.",
    },
  };

  // ==================== INITIALISE ====================

  function init() {
    const cart = getCart();

    if (cart.length === 0) {
      // Show empty state
      if (checkoutContent) checkoutContent.style.display = "none";
      if (emptyCheckout) {
        emptyCheckout.style.display = "flex";
        emptyCheckout.innerHTML = `
          <div class="empty-cart-content">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart before checking out.</p>
            <a href="products.html" class="btn btn-primary">Browse Products</a>
          </div>
        `;
      }
      return;
    }

    if (emptyCheckout) emptyCheckout.style.display = "none";
    if (checkoutContent) checkoutContent.style.display = "grid";

    renderOrderSummary();
    bindEvents();
  }

  // ==================== RENDER ORDER SUMMARY ====================

  function renderOrderSummary() {
    const cart = getCart();
    const totals = calculateCartTotal();

    if (orderItemsList) {
      orderItemsList.innerHTML = cart
        .map(
          (item) => `
        <div class="order-item">
          <img
            src="${item.image}"
            alt="${item.name}"
            class="order-item-image"
            onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22 viewBox=%220 0 50 50%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2250%22 height=%2250%22/%3E%3C/svg%3E';"
          />
          <div class="order-item-info">
            <span class="order-item-name">${item.name}</span>
            <span class="order-item-qty">Qty: ${item.quantity}</span>
          </div>
          <span class="order-item-price">₹${(item.price * item.quantity).toLocaleString("en-IN")}</span>
        </div>
      `
        )
        .join("");
    }

    if (orderSubtotal) orderSubtotal.textContent = formatPrice(totals.subtotal);
    if (orderDelivery) orderDelivery.textContent = totals.delivery === 0 ? "FREE" : formatPrice(totals.delivery);
    if (orderTotal) orderTotal.textContent = formatPrice(totals.grandTotal);
  }

  // ==================== EVENT BINDINGS ====================

  function bindEvents() {
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", handleSubmit);

      // Clear error on input for better UX
      checkoutForm.querySelectorAll("input, select, textarea").forEach((field) => {
        field.addEventListener("input", () => {
          clearFieldError(field);
        });
      });
    }
  }

  // ==================== FORM VALIDATION ====================

  function validateForm() {
    let isValid = true;

    // Validate each text field
    Object.keys(validationRules).forEach((fieldName) => {
      const field = document.getElementById(fieldName);
      if (!field) return;

      const rule = validationRules[fieldName];
      const value = field.value.trim();

      clearFieldError(field);

      if (rule.required && !value) {
        showFieldError(field, rule.message);
        isValid = false;
        return;
      }

      if (rule.minLength && value.length < rule.minLength) {
        showFieldError(field, rule.message);
        isValid = false;
        return;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        showFieldError(field, rule.message);
        isValid = false;
      }
    });

    // Validate payment method (radio buttons)
    const paymentSelected = document.querySelector('input[name="payment"]:checked');
    const paymentGroup = document.getElementById("paymentGroup");
    if (paymentGroup) {
      const paymentError = paymentGroup.querySelector(".field-error");
      if (paymentError) paymentError.remove();
    }

    if (!paymentSelected) {
      if (paymentGroup) {
        const errorEl = document.createElement("span");
        errorEl.className = "field-error";
        errorEl.textContent = "Please select a payment method.";
        paymentGroup.appendChild(errorEl);
      }
      isValid = false;
    }

    return isValid;
  }

  function showFieldError(field, message) {
    field.classList.add("input-error");
    // Find or create error element
    let errorEl = field.parentElement.querySelector(".field-error");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "field-error";
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(field) {
    field.classList.remove("input-error");
    const errorEl = field.parentElement.querySelector(".field-error");
    if (errorEl) errorEl.remove();
  }

  // ==================== SUBMIT HANDLER ====================

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector(".input-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Show success modal
    if (orderSuccessModal) {
      if (orderIdDisplay) orderIdDisplay.textContent = orderId;
      orderSuccessModal.style.display = "flex";

      // Animate entrance
      requestAnimationFrame(() => {
        orderSuccessModal.classList.add("visible");
      });
    }

    // Clear cart
    clearCart();
    updateCartCount();
  }

  // ==================== ORDER ID GENERATION ====================

  function generateOrderId() {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `ORD-${year}-${random}`;
  }

  // ==================== START ====================
  document.addEventListener("DOMContentLoaded", init);
})();
