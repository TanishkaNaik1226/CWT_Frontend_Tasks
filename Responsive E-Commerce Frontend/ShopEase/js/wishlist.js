/**
 * ShopEase - Wishlist Page JavaScript
 * Renders wishlisted products and provides options to add directly to cart.
 */

document.addEventListener("DOMContentLoaded", () => {
  renderWishlistPage();
});

function renderWishlistPage() {
  const container = document.getElementById("wishlistGrid");
  const emptyState = document.getElementById("wishlistEmpty");
  const actionsHeader = document.getElementById("wishlistActions");
  const countSpan = document.getElementById("wishlistTotalCount");

  if (!container) return;

  const wishlistIds = getWishlist();
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (countSpan) {
    countSpan.textContent = wishlistedProducts.length;
  }

  if (wishlistedProducts.length === 0) {
    if (container) container.style.display = "none";
    if (actionsHeader) actionsHeader.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (actionsHeader) actionsHeader.style.display = "flex";
  if (container) container.style.display = "grid";

  container.innerHTML = wishlistedProducts
    .map((product) => createWishlistCard(product))
    .join("");
}

function createWishlistCard(product) {
  const stars = renderStars(product.rating);
  const discountBadge = product.discount
    ? `<span class="discount-badge">-${product.discount}%</span>`
    : "";
  const originalPriceHTML =
    product.originalPrice && product.originalPrice > product.price
      ? `<span class="original-price">₹${product.originalPrice.toLocaleString("en-IN")}</span>`
      : "";

  return `
    <article class="product-card wishlist-card" data-id="${product.id}">
      <div class="product-image-wrapper">
        ${discountBadge}
        <button class="remove-wishlist-btn" onclick="toggleWishlist(${product.id})" title="Remove from wishlist" aria-label="Remove from wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
        <div class="wishlist-card-actions">
          <button class="btn btn-add-cart" onclick="addToCartFromWishlist(${product.id})" aria-label="Add ${product.name} to cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Directly adds an item from Wishlist to Cart, and removes it from Wishlist.
 */
function addToCartFromWishlist(productId) {
  // 1. Add to cart
  addToCart(productId);

  // 2. Remove from wishlist
  let wishlist = getWishlist();
  wishlist = wishlist.filter((id) => id !== productId);
  saveWishlist(wishlist);

  // 3. Update UI & Badges
  updateWishlistCount();
  renderWishlistPage();
}

/**
 * Move all items from wishlist directly to cart and clear wishlist.
 */
function addAllWishlistToCart() {
  const wishlistIds = getWishlist();
  if (wishlistIds.length === 0) return;

  const cart = getCart();

  wishlistIds.forEach((id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      const existing = cart.find((item) => item.id === id);
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
    }
  });

  // Save updated cart
  saveCart(cart);
  updateCartCount();

  // Clear wishlist completely
  saveWishlist([]);
  updateWishlistCount();

  // Re-render wishlist page to show empty state
  renderWishlistPage();

  showToast("All items moved from Wishlist to Cart!", "success");
}
