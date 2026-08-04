/**
 * LuxeMart - Main JavaScript
 */

// --- Data ---
const productsData = [
  { id: 1, image: "1.webp", name: "Acoustic Noise-Cancelling Headphones", category: "Electronics", price: 349.00, rating: 4.9, description: "Immerse yourself in high-fidelity audio with our premium noise-cancelling headphones. Features 30-hour battery life and supreme comfort." },
  { id: 2, image: "2.jpg", name: "Titanium Smart Watch Pro", category: "Electronics", price: 499.00, rating: 4.8, description: "Track your life with precision. Aerospace-grade titanium body, sapphire glass, and advanced health monitoring." },
  { id: 3, image: "3.webp", name: "Portable Bluetooth Speaker", category: "Electronics", price: 129.00, rating: 4.6, description: "360-degree sound in a compact, waterproof design. Perfect for home or outdoor adventures." },
  { id: 4, image: "4.webp", name: "Premium Cashmere Overcoat", category: "Fashion", price: 895.00, rating: 5.0, description: "Hand-stitched from 100% pure cashmere. Timeless elegance meets ultimate warmth." },
  { id: 5, image: "5.jpg", name: "Polarized Aviator Sunglasses", category: "Fashion", price: 185.00, rating: 4.7, description: "Classic design with modern polarized lenses. UV400 protection in a lightweight alloy frame." },
  { id: 6, image: "6.webp", name: "Ceramic Table Lamp", category: "Home", price: 145.00, rating: 4.5, description: "Minimalist ceramic base with a linen shade. Provides a warm, ambient glow to any room." },
  { id: 7, image: "7.webp", name: "Minimalist Wall Clock", category: "Home", price: 85.00, rating: 4.8, description: "Silent sweeping movement with a sleek, numberless face. A modern art piece that tells time." },
  { id: 8, image: "8.webp", name: "Professional Yoga Mat", category: "Sports", price: 110.00, rating: 4.9, description: "Extra-thick, non-slip natural rubber. Engineered for optimal grip and joint support." },
  { id: 9, image: "9.webp", name: "Carbon Fiber Tennis Racquet", category: "Sports", price: 245.00, rating: 4.7, description: "Lightweight and powerful. Designed for competitive players seeking ultimate control." },
  { id: 10, image: "10.webp", name: "Full-Grain Leather Wallet", category: "Accessories", price: 125.00, rating: 4.8, description: "Handcrafted from Italian leather. Slim profile with RFID-blocking technology." },
  { id: 11, image: "11.webp", name: "Mulberry Silk Scarf", category: "Accessories", price: 95.00, rating: 4.9, description: "100% pure mulberry silk. A versatile accessory that adds luxury to any outfit." },
  { id: 12, image: "12.webp", name: "Automatic Watch Winder", category: "Accessories", price: 210.00, rating: 4.6, description: "Keep your automatic watches running perfectly. Silent motor with genuine wood finish." }
];

const categoriesData = [
  { id: 'cat1', name: 'Electronics', count: 24 },
  { id: 'cat2', name: 'Fashion', count: 56 },
  { id: 'cat3', name: 'Home', count: 38 },
  { id: 'cat4', name: 'Sports', count: 19 },
  { id: 'cat5', name: 'Accessories', count: 42 }
];

// --- Utilities ---

// Generate distinct SVG images for products based on category and ID
// generateProductImage function removed - using real images



// Generate hero image
function generateHeroImage() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <defs>
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3730a3" />
        <stop offset="50%" stop-color="#7c3aed" />
        <stop offset="100%" stop-color="#f59e0b" />
      </linearGradient>
    </defs>
    <rect width="600" height="800" fill="url(#heroGrad)" />
    <circle cx="300" cy="400" r="200" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <circle cx="300" cy="400" r="150" fill="rgba(255,255,255,0.1)"/>
    <path d="M200 500 Q300 200 400 500" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="10" stroke-linecap="round"/>
    <circle cx="300" cy="350" r="50" fill="rgba(255,255,255,0.8)"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const formatPrice = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

// --- State ---
let currentCategory = 'All';
let currentSort = 'default';
let searchQuery = '';
let wishlist = JSON.parse(localStorage.getItem('luxemart_wishlist')) || [];
let isDarkMode = localStorage.getItem('luxemart_theme') === 'dark';

// --- Core Functions ---

function init() {
  // 1. Setup Theme
  applyTheme();

  // 2. Hide Loader
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    // Trigger initial animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));
  }, 1500);

  // 3. Set Hero Image
  document.getElementById('hero-img').src = 'images/banner.png';

  // 4. Render Initial Data
  updateWishlistBadge();
  renderCategories();
  renderProducts();

  // 5. Attach Event Listeners
  attachEventListeners();
  initStatsCounter();
}

function attachEventListeners() {
  // Theme Toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Navbar Scroll
  window.addEventListener('scroll', handleScroll);

  // Mobile Menu
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');

  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    mobileMenu.classList.add('open');
    overlay.classList.add('active');
  });

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('active');
  };

  document.getElementById('close-menu-btn').addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Search Overlay
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');

  document.getElementById('search-btn').addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
  });

  document.getElementById('close-search-btn').addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    document.getElementById('search-results').innerHTML = '';
  });

  searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });

  // Filters
  document.getElementById('category-filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        currentCategory = this.dataset.category;
        console.log("Category:", currentCategory);

        renderProducts();
    });
});
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts();
  });

  // Modal Close Events
  const modal = document.getElementById('product-modal');
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Contact Form
  document.getElementById('contact-form').addEventListener('submit', handleContactSubmit);

  // Back to Top
  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Wishlist generic click
  document.getElementById('wishlist-btn').addEventListener('click', () => {
    showToast(`You have ${wishlist.length} items in your wishlist.`, 'info');
  });
}

// --- Theme Logic ---
function applyTheme() {
  const root = document.documentElement;
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  if (isDarkMode) {
    root.setAttribute('data-theme', 'dark');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    root.removeAttribute('data-theme');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('luxemart_theme', isDarkMode ? 'dark' : 'light');
  applyTheme();
}

// --- Scroll Logic ---
function handleScroll() {
  const nav = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active Link Highlighting
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// --- Rendering Logic ---

function renderCategories() {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = categoriesData.map(cat => `
    <div class="category-card" onclick="document.querySelector('[data-category=\\'${cat.name}\\']').click(); document.getElementById('products').scrollIntoView();">
            <img src="images/${(productsData.find(p => p.category === cat.name) || { image: '1.webp' }).image}" alt="${cat.name}">
      <div class="category-overlay">
        <h3 class="category-title">${cat.name}</h3>
        <span class="category-link">Explore ${cat.count} items <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
      </div>
    </div>
  `).join('');
}

function getProcessedProducts() {
  let filtered = productsData;

  if (currentCategory !== 'All') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (currentSort) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      default: return a.id - b.id; // default
    }
  });

  return filtered;
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const products = getProcessedProducts();
  console.log(products);
  document.getElementById('product-count').textContent = `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;

  if (products.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No products found matching your criteria.</div>`;
    return;
  }

  grid.innerHTML = products.map(product => {
    const isWished = wishlist.includes(product.id);
    const starCount = Math.floor(product.rating);
    const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

    return `
      <div class="product-card">
        <div class="product-img-wrapper">
          <img src="images/${product.image}" class="product-img">
          <div class="product-actions-overlay">
            <button class="btn view-btn" onclick="openModal(${product.id})">Quick View</button>
            <button class="icon-btn wishlist-btn ${isWished ? 'active' : ''}" onclick="toggleWishlist(${product.id}, event)" aria-label="Add to Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            <span class="star">${stars}</span>
            <span>${product.rating}</span>
          </div>
          <div class="product-price">${formatPrice(product.price)}</div>
        </div>
      </div>
    `;
  }).join('');
}

// --- Search Logic ---
function handleSearch(query) {
  const resultsContainer = document.getElementById('search-results');
  if (!query.trim()) {
    resultsContainer.innerHTML = '';
    return;
  }

  const q = query.toLowerCase();
  const results = productsData.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 4);

  if (results.length === 0) {
    resultsContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No results found.</p>`;
    return;
  }

  resultsContainer.innerHTML = results.map(product => `
    <div style="display: flex; gap: 1rem; padding: 1rem; background: var(--surface); border-radius: var(--radius-sm); border: 1px solid var(--border-color); cursor: pointer;" onclick="document.getElementById('close-search-btn').click(); openModal(${product.id});">
      <img src="images/${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);">
      <div>
        <div style="font-size: 0.75rem; color: var(--primary); font-weight: bold; text-transform: uppercase;">${product.category}</div>
        <div style="font-weight: 500; margin-bottom: 0.25rem;">${product.name}</div>
        <div style="font-weight: bold;">${formatPrice(product.price)}</div>
      </div>
    </div>
  `).join('');
}

// --- Wishlist Logic ---
function toggleWishlist(id, event) {
  if (event) event.stopPropagation();
  const index = wishlist.indexOf(id);
  const btn = event.currentTarget;

  if (index > -1) {
    wishlist.splice(index, 1);
    btn.classList.remove('active');
    showToast('Removed from wishlist');
  } else {
    wishlist.push(id);
    btn.classList.add('active');
    showToast('Added to wishlist', 'success');
  }

  localStorage.setItem('luxemart_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  badge.textContent = wishlist.length;
  if (wishlist.length > 0) {
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// --- Modal Logic ---
function openModal(id) {
  const product = productsData.find(p => p.id === id);
  if (!product) return;

  const isWished = wishlist.includes(product.id);
  const content = document.getElementById('modal-content');
  const starCount = Math.floor(product.rating);
  const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

  content.innerHTML = `
    <div class="modal-content-grid">
      <div class="modal-img-container">
        <img src="images/${product.image}" alt="${product.name}" class="modal-img">
      </div>
      <div class="modal-details">
        <span class="modal-category">${product.category}</span>
        <h2 class="modal-title">${product.name}</h2>
        <div class="product-rating" style="margin-bottom: 1.5rem;">
          <span class="star" style="font-size: 1.2rem;">${stars}</span>
          <span style="font-size: 1rem;">${product.rating} Reviews</span>
        </div>
        <div class="modal-price">${formatPrice(product.price)}</div>
        <p class="modal-desc">${product.description}</p>
        <div style="margin-bottom: 2rem;">
          <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Features:</div>
          <ul style="list-style: disc; padding-left: 1.5rem; color: var(--text-muted); font-size: 0.875rem;">
            <li>Premium quality materials</li>
            <li>Extended warranty included</li>
            <li>Free shipping worldwide</li>
          </ul>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" style="flex: 2;" onclick="buyNow()">Add to Cart</button>
          <button id="modal-wishlist-btn" class="icon-btn wishlist-btn ${isWished ? 'active' : ''}" style="flex: 1; border: 1px solid var(--border-color); height: auto; border-radius: var(--radius-full);" onclick="toggleModalWishlist(${product.id})" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span style="margin-left: 0.5rem; font-size: 0.875rem;">Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('product-modal').classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Global exposure for inline onclicks in dynamically generated HTML
window.openModal = openModal;
window.toggleWishlist = toggleWishlist;
window.toggleModalWishlist = function (id) {
  const index = wishlist.indexOf(id);
  const btn = document.getElementById('modal-wishlist-btn');
  if (index > -1) {
    wishlist.splice(index, 1);
    btn.classList.remove('active');
    showToast('Removed from wishlist');
  } else {
    wishlist.push(id);
    btn.classList.add('active');
    showToast('Added to wishlist', 'success');
  }
  localStorage.setItem('luxemart_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  renderProducts(); // Update grid behind modal
};
window.buyNow = function () {
  showToast('Item added to your cart!', 'success');
  closeModal();
};

function closeModal() {
  document.getElementById('product-modal').classList.remove('active');
  document.body.style.overflow = '';
}

// --- Stats Counter ---
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const isDecimal = entry.target.getAttribute('data-decimal') === 'true';
        const duration = 2000;
        const steps = 60;
        const stepTime = Math.abs(Math.floor(duration / steps));

        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            entry.target.innerText = target + (target > 10 ? '+' : '');
            clearInterval(timer);
          } else {
            entry.target.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
          }
        }, stepTime);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

// --- Contact Form ---
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const message = form.message.value;

  let isValid = true;
  form.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

  if (!name.trim()) { isValid = false; document.getElementById('name').parentElement.classList.add('error'); }
  if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { isValid = false; document.getElementById('email').parentElement.classList.add('error'); }
  if (!message.trim()) { isValid = false; document.getElementById('message').parentElement.classList.add('error'); }

  if (isValid) {
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      showToast('Thank you! Your message has been sent.', 'success');
      form.reset();
      btn.innerText = originalText;
      btn.disabled = false;
    }, 1500);
  }
}

// --- Toast Notifications ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = '';
  if (type === 'success') icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  else if (type === 'error') icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  else icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger reflow to ensure animation plays
  toast.offsetHeight;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode === container) container.removeChild(toast);
    }, 300);
  }, 3000);
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', init);