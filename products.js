/**
 * FASHION FEVER - Product Catalog Dataset
 * High-quality curated fashion collection with realistic details
 */

const PRODUCTS_DATA = [
  {
    id: "FF-001",
    name: "Aura Velvet Silk Blazer",
    category: "women",
    categoryName: "Women's Couture",
    price: 3499,
    originalPrice: 5999,
    discount: "42% OFF",
    rating: 4.9,
    reviewsCount: 148,
    isTrending: true,
    isNew: true,
    badge: "Bestseller",
    description: "Tailored to perfection, this luxurious velvet silk blazer combines structured Parisian silhouette with an opulent finish. Perfect for evening soirees and boardroom luxury.",
    images: [
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Midnight Obsidian", hex: "#1a1a24" },
      { name: "Emerald Royale", hex: "#114232" },
      { name: "Champagne Gold", hex: "#d4af37" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: 12,
    tags: ["Blazer", "Luxury", "Partywear", "Silk", "New Arrival"]
  },
  {
    id: "FF-002",
    name: "Urban Nomad Oversized Hoodie",
    category: "streetwear",
    categoryName: "Streetwear Drops",
    price: 1899,
    originalPrice: 2999,
    discount: "36% OFF",
    rating: 4.8,
    reviewsCount: 230,
    isTrending: true,
    isNew: false,
    badge: "Trending",
    description: "Heavyweight 450 GSM French Terry cotton hoodie with dropped shoulders, minimalist metallic branding, and kangaroo pouch. The definitive modern street aesthetic.",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Charcoal Slate", hex: "#2b2b2b" },
      { name: "Sage Mist", hex: "#7a8b7b" },
      { name: "Sand Beige", hex: "#d8c4b6" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: 18,
    tags: ["Hoodie", "Streetwear", "Oversized", "Winter", "Cotton"]
  },
  {
    id: "FF-003",
    name: "Elysian Pleated Satin Midi Dress",
    category: "women",
    categoryName: "Women's Couture",
    price: 2799,
    originalPrice: 4599,
    discount: "39% OFF",
    rating: 4.95,
    reviewsCount: 312,
    isTrending: true,
    isNew: true,
    badge: "Must Have",
    description: "Flowing knife-pleated satin midi dress with an asymmetric cowl neckline and a waist-cinching gold-accented sash. Radiates effortless romance.",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Dusty Rose", hex: "#c98ca7" },
      { name: "Burgundy Wine", hex: "#5b1924" },
      { name: "Pearl Ivory", hex: "#f0ebe1" }
    ],
    sizes: ["XS", "S", "M", "L"],
    inStock: 8,
    tags: ["Dress", "Satin", "Evening", "Party", "Women"]
  },
  {
    id: "FF-004",
    name: "Milano Structured Linen Suit",
    category: "men",
    categoryName: "Men's Luxury",
    price: 4999,
    originalPrice: 8999,
    discount: "44% OFF",
    rating: 4.85,
    reviewsCount: 94,
    isTrending: false,
    isNew: true,
    badge: "Limited Edition",
    description: "Crafted from Italian flax linen, this two-piece suit delivers breezy sophistication with unconstructed shoulders and horn button details.",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Classic Navy", hex: "#16213e" },
      { name: "Oatmeal Linen", hex: "#dcd6cd" },
      { name: "Olive Moss", hex: "#4a5d4e" }
    ],
    sizes: ["38R", "40R", "42R", "44R"],
    inStock: 6,
    tags: ["Suit", "Formal", "Linen", "Men", "Luxury"]
  },
  {
    id: "FF-005",
    name: "CyberPunk Cargo Joggers V2",
    category: "streetwear",
    categoryName: "Streetwear Drops",
    price: 1699,
    originalPrice: 2499,
    discount: "32% OFF",
    rating: 4.7,
    reviewsCount: 188,
    isTrending: true,
    isNew: false,
    badge: "Popular",
    description: "Futuristic tactical cargos equipped with magnetic buckle straps, waterproof zips, reinforced knee paneling, and an elasticated ankle cuff.",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Pitch Black", hex: "#111111" },
      { name: "Desert Tan", hex: "#c2b280" }
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: 25,
    tags: ["Cargo", "Joggers", "Streetwear", "Pants", "Men"]
  },
  {
    id: "FF-006",
    name: "Monaco Handcrafted Leather Loafers",
    category: "footwear",
    categoryName: "Footwear & Kicks",
    price: 3299,
    originalPrice: 5499,
    discount: "40% OFF",
    rating: 4.9,
    reviewsCount: 167,
    isTrending: false,
    isNew: true,
    badge: "Artisan",
    description: "Full-grain calfskin leather loafers featuring hand-stitched apron toes, horsebit brass hardware, and cushioned memory-foam leather insoles.",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Cognac Brown", hex: "#834333" },
      { name: "Jet Black", hex: "#1c1c1c" }
    ],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    inStock: 14,
    tags: ["Shoes", "Leather", "Loafers", "Formal", "Footwear"]
  },
  {
    id: "FF-007",
    name: "Nebula Chunky Retro Sneakers",
    category: "footwear",
    categoryName: "Footwear & Kicks",
    price: 2499,
    originalPrice: 3999,
    discount: "37% OFF",
    rating: 4.85,
    reviewsCount: 276,
    isTrending: true,
    isNew: true,
    badge: "Hot Drop",
    description: "Layered mesh, suede, and TPU panels atop an ultra-cushioned sculpted EVA outsole. Delivers unbeatable arch support and all-day street swagger.",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Vintage White / Teal", hex: "#e5e9ec" },
      { name: "Cyber Multi / Neon", hex: "#363945" }
    ],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    inStock: 20,
    tags: ["Sneakers", "Kicks", "Shoes", "Streetwear", "Retro"]
  },
  {
    id: "FF-008",
    name: "Solstice 24K Gold Chain Crossbody Bag",
    category: "accessories",
    categoryName: "Luxury Accessories",
    price: 1999,
    originalPrice: 3499,
    discount: "43% OFF",
    rating: 4.92,
    reviewsCount: 154,
    isTrending: true,
    isNew: false,
    badge: "Iconic",
    description: "Quilted vegan nappa leather crossbody bag finished with electroplated 24K gold hardware, magnetic flap closure, and multi-compartment interior.",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Alabaster Cream", hex: "#f5f2eb" },
      { name: "Onyx Black", hex: "#111111" },
      { name: "Forest Green", hex: "#1e392a" }
    ],
    sizes: ["One Size"],
    inStock: 15,
    tags: ["Bags", "Handbag", "Luxury", "Accessories", "Gold"]
  },
  {
    id: "FF-009",
    name: "Riviera Polarized Aviator Sunglasses",
    category: "accessories",
    categoryName: "Luxury Accessories",
    price: 1299,
    originalPrice: 2199,
    discount: "41% OFF",
    rating: 4.75,
    reviewsCount: 89,
    isTrending: false,
    isNew: true,
    badge: "Trending",
    description: "Ultra-lightweight titanium alloy frame with UV400 polarized emerald lenses and custom acetate temple tips for all-day glare protection.",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Gold / Green Tint", hex: "#c5a059" },
      { name: "Gunmetal / Smoke", hex: "#444444" }
    ],
    sizes: ["Universal Fit"],
    inStock: 30,
    tags: ["Sunglasses", "Eyewear", "Summer", "Accessories"]
  },
  {
    id: "FF-010",
    name: "Vanguard Minimalist Leather Watch",
    category: "accessories",
    categoryName: "Luxury Accessories",
    price: 2899,
    originalPrice: 4999,
    discount: "42% OFF",
    rating: 4.88,
    reviewsCount: 112,
    isTrending: true,
    isNew: false,
    badge: "Top Rated",
    description: "Japanese Miyota quartz movement housed in a surgical grade 316L stainless steel case with sapphire crystal glass and interchangeable genuine Italian leather strap.",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Silver & Tan", hex: "#c0c0c0" },
      { name: "Rose Gold & Black", hex: "#b76e79" }
    ],
    sizes: ["40mm Dial"],
    inStock: 11,
    tags: ["Watch", "Timepiece", "Leather", "Accessories", "Men"]
  },
  {
    id: "FF-011",
    name: "Kyoto Embroidered Souvenir Bomber",
    category: "men",
    categoryName: "Men's Luxury",
    price: 3699,
    originalPrice: 6299,
    discount: "41% OFF",
    rating: 4.96,
    reviewsCount: 175,
    isTrending: true,
    isNew: true,
    badge: "Exclusive",
    description: "Dual-tone reversible satin bomber jacket with traditional Japanese dragon embroidery across the back, rib-knit striped trims, and antique copper zip.",
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Navy & Champagne", hex: "#1e293b" },
      { name: "Burgundy & Gold", hex: "#6b1b29" }
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: 9,
    tags: ["Jacket", "Bomber", "Embroidered", "Men", "Streetwear"]
  },
  {
    id: "FF-012",
    name: "Cascade Bohemian Floral Maxi",
    category: "women",
    categoryName: "Women's Couture",
    price: 2199,
    originalPrice: 3899,
    discount: "44% OFF",
    rating: 4.82,
    reviewsCount: 198,
    isTrending: false,
    isNew: false,
    badge: "Sale",
    description: "Breathable georgette chiffon dress adorned with hand-blocked botanical motifs, tiered ruffle hemline, and smocked stretch bodice for flattering contour.",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80"
    ],
    colors: [
      { name: "Floral Sunset", hex: "#e07a5f" },
      { name: "Ocean Breeze", hex: "#3d5a80" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: 22,
    tags: ["Maxi Dress", "Floral", "Summer", "Boho", "Women"]
  }
];

// Coupon Codes configuration
const AVAILABLE_COUPONS = {
  "FEVER20": { discountPercent: 20, description: "20% Off on entire order", minOrder: 999 },
  "WELCOME500": { discountFlat: 500, description: "Flat ₹500 Off for new fever members", minOrder: 1999 },
  "FREESHIP": { freeShipping: true, description: "Free Express Shipping anywhere in India", minOrder: 499 }
};
