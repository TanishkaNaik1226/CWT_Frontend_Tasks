/**
 * ShopEase - Products Page JavaScript
 * Handles product rendering, search, category filtering, and sorting.
 */

(function () {
  "use strict";

  // ==================== STATE ====================
  let currentCategory = "All";
  let currentSearch = "";
  let currentSort = "default";

  // ==================== DOM REFERENCES ====================
  const productGrid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const categoryBtns = document.querySelectorAll(".filter-btn");
  const sortSelect = document.getElementById("sortSelect");
  const resultsCount = document.getElementById("resultsCount");

  // ==================== INITIALISE ====================

  function init() {
    // Read category from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get("category");
    if (urlCategory && categories.includes(urlCategory)) {
      currentCategory = urlCategory;
      // Highlight the correct filter button
      categoryBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === urlCategory);
      });
    }

    bindEvents();
    renderProducts();
  }

  // ==================== EVENT BINDINGS ====================

  function bindEvents() {
    // Live search on input
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        currentSearch = searchInput.value.trim();
        renderProducts();
      });
    }

    // Search button click
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        currentSearch = searchInput ? searchInput.value.trim() : "";
        renderProducts();
      });
    }

    // Category filter buttons
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category || "All";
        renderProducts();
      });
    });

    // Sort dropdown
    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        currentSort = sortSelect.value;
        renderProducts();
      });
    }
  }

  // ==================== FILTER, SEARCH, SORT ====================

  function getFilteredProducts() {
    let filtered = [...products];

    // Category filter
    if (currentCategory && currentCategory !== "All") {
      filtered = filtered.filter((p) => p.category === currentCategory);
    }

    // Search filter (case-insensitive across name, category, description)
    if (currentSearch) {
      const query = currentSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (currentSort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }

  // ==================== RENDER ====================

  function renderProducts() {
    if (!productGrid) return;

    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div class="no-results">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;
    } else {
      productGrid.innerHTML = filtered.map((p) => createProductCard(p)).join("");
    }

    // Update results count
    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} of ${products.length} products`;
    }
  }

  // ==================== START ====================
  document.addEventListener("DOMContentLoaded", init);
})();
