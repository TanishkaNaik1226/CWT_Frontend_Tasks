/**
 * ShopEase - Product Data
 * Contains all product information used across the application.
 * Each product has: id, name, category, price, originalPrice, rating, description, image, featured, discount
 */

const products = [
  // ==================== ELECTRONICS ====================
  {
    id: 1,
    name: "Ultra Slim Laptop Pro",
    category: "Electronics",
    price: 62999,
    originalPrice: 79999,
    rating: 4.7,
    description: "Powerful 15.6-inch laptop with Intel i7 processor, 16GB RAM, 512GB SSD, and stunning Full HD display. Perfect for professionals and creators.",
    image: "images/image1.jpg",
    featured: true,
    discount: 21
  },
  {
    id: 2,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 3499,
    originalPrice: 5999,
    rating: 4.5,
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and hi-res audio. Foldable design for easy portability.",
    image: "images/image2.jpg",
    featured: true,
    discount: 42
  },
  {
    id: 3,
    name: "Smart Watch Series X",
    category: "Electronics",
    price: 8999,
    originalPrice: 12999,
    rating: 4.3,
    description: "Feature-packed smartwatch with AMOLED display, heart-rate monitor, SpO2 tracking, GPS, and 7-day battery life. Water-resistant up to 50m.",
    image: "images/image3.jpg",
    featured: true,
    discount: 31
  },
  {
    id: 4,
    name: "Flagship Smartphone 256GB",
    category: "Electronics",
    price: 44999,
    originalPrice: 54999,
    rating: 4.6,
    description: "Premium smartphone with 6.7-inch AMOLED display, 108MP camera, Snapdragon 8 Gen 3 processor, and 5000mAh battery with fast charging.",
    image: "images/image4.jpg",
    featured: true,
    discount: 18
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 2499,
    originalPrice: 3999,
    rating: 4.2,
    description: "Waterproof portable speaker with 360-degree sound, deep bass, 20-hour playtime, and built-in microphone for hands-free calls.",
    image: "images/image5.jpg",
    featured: false,
    discount: 38
  },

  // ==================== FASHION ====================
  {
    id: 6,
    name: "Men's Premium Cotton T-Shirt",
    category: "Fashion",
    price: 799,
    originalPrice: 1499,
    rating: 4.4,
    description: "Soft-touch 100% organic cotton t-shirt with a relaxed fit. Available in multiple colours. Machine washable and wrinkle-resistant.",
    image: "images/image6.jpg",
    featured: true,
    discount: 47
  },
  {
    id: 7,
    name: "Women's Floral Maxi Dress",
    category: "Fashion",
    price: 1899,
    originalPrice: 3499,
    rating: 4.6,
    description: "Elegant floral-print maxi dress in flowing georgette fabric. Features a flattering V-neckline and adjustable waist tie. Perfect for brunches and outings.",
    image: "images/image7.jpg",
    featured: true,
    discount: 46
  },
  {
    id: 8,
    name: "Classic Running Shoes",
    category: "Fashion",
    price: 3299,
    originalPrice: 4999,
    rating: 4.5,
    description: "Lightweight running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole. Ideal for daily runs and gym workouts.",
    image: "images/image8.jpg",
    featured: true,
    discount: 34
  },
  {
    id: 9,
    name: "Urban Travel Backpack",
    category: "Fashion",
    price: 1599,
    originalPrice: 2499,
    rating: 4.3,
    description: "Stylish and functional backpack with laptop compartment, multiple organiser pockets, USB charging port, and water-resistant fabric.",
    image: "images/image9.jpg",
    featured: false,
    discount: 36
  },
  {
    id: 10,
    name: "Slim Fit Denim Jeans",
    category: "Fashion",
    price: 1299,
    originalPrice: 2199,
    rating: 4.1,
    description: "Modern slim-fit jeans crafted from premium stretch denim. Features a mid-rise waist and classic five-pocket styling.",
    image: "images/image10.jpg",
    featured: false,
    discount: 41
  },

  // ==================== HOME & LIVING ====================
  {
    id: 11,
    name: "Modern L-Shape Sofa",
    category: "Home & Living",
    price: 28999,
    originalPrice: 39999,
    rating: 4.4,
    description: "Contemporary L-shaped sofa in premium leatherette upholstery. High-density foam cushions with solid wood frame for lasting comfort.",
    image: "images/image11.jpg",
    featured: false,
    discount: 28
  },
  {
    id: 12,
    name: "Adjustable LED Desk Lamp",
    category: "Home & Living",
    price: 1299,
    originalPrice: 1999,
    rating: 4.2,
    description: "Touch-controlled LED desk lamp with 5 brightness levels, 3 colour temperatures, USB charging port, and flexible gooseneck design.",
    image: "images/image12.jpg",
    featured: false,
    discount: 35
  },
  {
    id: 13,
    name: "Programmable Coffee Maker",
    category: "Home & Living",
    price: 4599,
    originalPrice: 6999,
    rating: 4.5,
    description: "12-cup programmable drip coffee maker with built-in grinder, thermal carafe, auto-brew timer, and strength control. Brew café-quality coffee at home.",
    image: "images/image13.jpg",
    featured: true,
    discount: 34
  },
  {
    id: 14,
    name: "Ergonomic Office Chair",
    category: "Home & Living",
    price: 9999,
    originalPrice: 14999,
    rating: 4.6,
    description: "High-back mesh office chair with lumbar support, adjustable armrests, headrest, and 360° swivel. Designed for all-day comfort.",
    image: "images/image14.jpg",
    featured: true,
    discount: 33
  },

  // ==================== SPORTS ====================
  {
    id: 15,
    name: "Professional Match Football",
    category: "Sports",
    price: 1499,
    originalPrice: 2499,
    rating: 4.3,
    description: "FIFA-quality match football with thermal-bonded panels, textured surface for superior grip, and durable TPU casing. Size 5.",
    image: "images/image15.jpg",
    featured: false,
    discount: 40
  },
  {
    id: 16,
    name: "Pro Kashmir Willow Cricket Bat",
    category: "Sports",
    price: 2799,
    originalPrice: 4499,
    rating: 4.4,
    description: "Hand-crafted Kashmir willow cricket bat with thick edges, premium cane handle, and full-length rubber grip. Lightweight and well-balanced.",
    image: "images/image16.jpg",
    featured: false,
    discount: 38
  },
  {
    id: 17,
    name: "Premium Non-Slip Yoga Mat",
    category: "Sports",
    price: 999,
    originalPrice: 1799,
    rating: 4.5,
    description: "Extra-thick 6mm TPE yoga mat with alignment lines, non-slip texture on both sides, and carrying strap. Eco-friendly and odour-free.",
    image: "images/image17.jpg",
    featured: false,
    discount: 44
  },

  // ==================== BEAUTY ====================
  {
    id: 18,
    name: "Vitamin C Brightening Face Serum",
    category: "Beauty",
    price: 599,
    originalPrice: 999,
    rating: 4.6,
    description: "Concentrated 20% Vitamin C serum with hyaluronic acid and niacinamide. Brightens skin, fades dark spots, and boosts collagen production.",
    image: "images/image18.jpg",
    featured: false,
    discount: 40
  },
  {
    id: 19,
    name: "Hydrating Daily Moisturizer SPF 30",
    category: "Beauty",
    price: 449,
    originalPrice: 799,
    rating: 4.3,
    description: "Lightweight gel-cream moisturizer with SPF 30, ceramides, and aloe vera. Provides 24-hour hydration without clogging pores. Suitable for all skin types.",
    image: "images/image19.jpg",
    featured: false,
    discount: 44
  },
  {
    id: 20,
    name: "Luxury Eau De Parfum 100ml",
    category: "Beauty",
    price: 2199,
    originalPrice: 3499,
    rating: 4.7,
    description: "Long-lasting luxury fragrance with top notes of bergamot and pink pepper, heart of jasmine and iris, and a warm base of sandalwood and vanilla.",
    image: "images/image20.jpg",
    featured: true,
    discount: 37
  }
];

/** All available product categories */
const categories = ["Electronics", "Fashion", "Home & Living", "Sports", "Beauty"];
