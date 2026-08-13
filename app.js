/**
 * FASHION FEVER - Core Application Engine
 * Handles State, Cart, Wishlist, Checkout, Search, Filtering, Auth & Google Sign-In Integration
 */

// Application State
const state = {
  products: PRODUCTS_DATA,
  filteredProducts: [...PRODUCTS_DATA],
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  priceRange: 10000,
  
  // Shopping Cart & Wishlist (Persisted)
  cart: JSON.parse(localStorage.getItem('fashion_fever_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('fashion_fever_wishlist')) || [],
  appliedCoupon: null,
  
  // User Authentication
  currentUser: JSON.parse(localStorage.getItem('fashion_fever_user')) || null,
  orders: JSON.parse(localStorage.getItem('fashion_fever_orders')) || [],

  // Active Quick-View Product
  activeQuickView: null,
  selectedColor: null,
  selectedSize: null,
  selectedQty: 1,

  // Checkout State
  checkoutStep: 1,
  selectedPaymentMethod: 'upi',
  shippingDetails: {}
};

// ==========================================================================
// Initialization & DOM Setup
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  updateAuthUI();
});

function initApp() {
  // Check if first time user, provide some mock order history if empty
  if (state.orders.length === 0 && state.currentUser) {
    state.orders = [
      {
        orderId: 'FF-84920',
        date: new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [
          { name: 'Aura Velvet Silk Blazer', qty: 1, price: 3499, size: 'M', color: 'Midnight Obsidian', img: PRODUCTS_DATA[0].images[0] }
        ],
        total: 3499,
        status: 'Delivered',
        paymentMethod: 'UPI (Google Pay)'
      }
    ];
    saveOrders();
  }
}

// ==========================================================================
// Event Listeners Configuration
// ==========================================================================
function setupEventListeners() {
  // Sticky Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
    });
  }

  // Category Filter Pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.currentCategory = e.currentTarget.dataset.category;
      applyFilters();
    });
  });

  // Live Search Bar
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Sort Selector
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Newsletter Subscription
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input').value;
      if (email) {
        showToast('🎉 Subscribed! Use code FEVER20 for 20% off.', 'success');
        e.target.reset();
      }
    });
  }

  // Cart Drawer Trigger
  const cartTrigger = document.getElementById('cartTrigger');
  const cartDrawer = document.getElementById('cartDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeCartBtn = document.getElementById('closeCartBtn');

  if (cartTrigger) cartTrigger.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeCartDrawer);

  // Apply Coupon in Cart
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponInput = document.getElementById('cartCouponInput');
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      applyDiscountCoupon(code);
    });
  }

  // Checkout Button from Cart
  const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
  if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', () => {
      closeCartDrawer();
      openCheckoutModal();
    });
  }

  // User Auth Triggers
  const authTrigger = document.getElementById('authTrigger');
  if (authTrigger) {
    authTrigger.addEventListener('click', () => {
      if (state.currentUser) {
        openProfileModal();
      } else {
        openAuthModal();
      }
    });
  }

  // Auth Form Switches
  const loginTabBtn = document.getElementById('loginTabBtn');
  const signupTabBtn = document.getElementById('signupTabBtn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginTabBtn && signupTabBtn) {
    loginTabBtn.addEventListener('click', () => {
      loginTabBtn.classList.add('active');
      signupTabBtn.classList.remove('active');
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    });

    signupTabBtn.addEventListener('click', () => {
      signupTabBtn.classList.add('active');
      loginTabBtn.classList.remove('active');
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
    });
  }

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const name = email.split('@')[0];
      loginUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email: email });
      closeModal('authModal');
    });
  }

  // Handle Sign Up Submit
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      loginUser({ name, email });
      closeModal('authModal');
    });
  }

  // Google Sign-In Simulator & Integration Hook
  const googleAuthBtn = document.getElementById('googleAuthBtn');
  if (googleAuthBtn) {
    googleAuthBtn.addEventListener('click', handleGoogleSignIn);
  }
}

// ==========================================================================
// Filtering, Searching & Sorting Logic
// ==========================================================================
function applyFilters() {
  let list = [...state.products];

  // Category Filter
  if (state.currentCategory !== 'all') {
    list = list.filter(item => item.category === state.currentCategory);
  }

  // Search Filter
  if (state.searchQuery) {
    const q = state.searchQuery;
    list = list.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.categoryName.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (state.sortBy === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === 'popular') {
    list.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  state.filteredProducts = list;
  renderProducts();
}

// Filter by clicking on category cards or navigation
window.filterByCategory = function(category) {
  state.currentCategory = category;
  document.querySelectorAll('.filter-pill').forEach(pill => {
    if (pill.dataset.category === category) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
  
  const shopSection = document.getElementById('shopSection');
  if (shopSection) {
    shopSection.scrollIntoView({ behavior: 'smooth' });
  }
  applyFilters();
};

// ==========================================================================
// Product Rendering
// ==========================================================================
function renderProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  if (state.filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>No matching fashion pieces found</h3>
        <p style="color: var(--text-secondary);">Try changing your search term or category filters.</p>
        <button class="btn-luxury" style="margin-top: 1rem;" onclick="resetFilters()">View All Collections</button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.filteredProducts.map(product => {
    const isWishlisted = state.wishlist.some(item => item.id === product.id);
    let badgeClass = 'badge-bestseller';
    if (product.badge === 'Trending') badgeClass = 'badge-trending';
    if (product.badge === 'Sale' || product.badge === 'Hot Drop') badgeClass = 'badge-sale';
    if (product.badge === 'Limited Edition' || product.badge === 'Exclusive') badgeClass = 'badge-limited';

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-media">
          <span class="card-badge ${badgeClass}">${product.badge}</span>
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy" />
          
          <div class="card-actions">
            <button class="card-action-btn ${isWishlisted ? 'active-wishlist' : ''}" 
                    title="Add to Wishlist" 
                    onclick="toggleWishlist('${product.id}')">
              <svg viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <button class="quick-view-overlay-btn" onclick="openQuickView('${product.id}')">
            Quick View
          </button>
        </div>

        <div class="product-info">
          <span class="product-category-label">${product.categoryName}</span>
          <h3 class="product-title" title="${product.name}">${product.name}</h3>
          
          <div class="product-rating-row">
            <div class="stars-gold">
              ${generateStarRating(product.rating)}
            </div>
            <span>${product.rating} (${product.reviewsCount})</span>
          </div>

          <div class="product-price-row">
            <span class="current-price">₹${product.price.toLocaleString('en-IN')}</span>
            <span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
            <span class="discount-pill">${product.discount}</span>
          </div>

          <div class="product-card-footer">
            <button class="btn-add-cart" onclick="quickAddToCart('${product.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Add to Bag
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function generateStarRating(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    } else {
      stars += `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
  }
  return stars;
}

window.resetFilters = function() {
  state.currentCategory = 'all';
  state.searchQuery = '';
  state.sortBy = 'featured';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.category === 'all');
  });
  applyFilters();
};

// ==========================================================================
// Quick-View Modal Logic
// ==========================================================================
window.openQuickView = function(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  state.activeQuickView = product;
  state.selectedColor = product.colors[0];
  state.selectedSize = product.sizes[0];
  state.selectedQty = 1;

  const modalBody = document.getElementById('quickViewContent');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="quickview-grid">
      <div class="qv-gallery">
        <div class="qv-main-image">
          <img id="qvMainImg" src="${product.images[0]}" alt="${product.name}">
        </div>
        <div class="qv-thumbs">
          ${product.images.map((img, idx) => `
            <div class="qv-thumb ${idx === 0 ? 'active' : ''}" onclick="switchQvImage('${img}', this)">
              <img src="${img}" alt="${product.name} preview ${idx+1}">
            </div>
          `).join('')}
        </div>
      </div>

      <div class="qv-details">
        <span class="qv-category">${product.categoryName}</span>
        <h2 class="qv-title">${product.name}</h2>
        
        <div class="product-rating-row" style="margin-bottom: 1rem;">
          <div class="stars-gold">${generateStarRating(product.rating)}</div>
          <span>${product.rating} (${product.reviewsCount} customer reviews)</span>
        </div>

        <div class="product-price-row" style="margin-bottom: 1.25rem;">
          <span class="current-price" style="font-size: 1.6rem;">₹${product.price.toLocaleString('en-IN')}</span>
          <span class="original-price" style="font-size: 1.1rem;">₹${product.originalPrice.toLocaleString('en-IN')}</span>
          <span class="discount-pill">${product.discount}</span>
        </div>

        <p class="qv-desc">${product.description}</p>

        <!-- Color Selection -->
        <span class="option-label">Color: <strong id="qvSelectedColorText" style="color: var(--text-primary);">${state.selectedColor.name}</strong></span>
        <div class="color-swatches">
          ${product.colors.map((c, idx) => `
            <div class="color-dot ${idx === 0 ? 'active' : ''}" 
                 style="background-color: ${c.hex};" 
                 title="${c.name}" 
                 onclick="selectQvColor(${idx}, this)"></div>
          `).join('')}
        </div>

        <!-- Size Selection -->
        <span class="option-label">Size: <strong id="qvSelectedSizeText" style="color: var(--text-primary);">${state.selectedSize}</strong></span>
        <div class="size-selector">
          ${product.sizes.map((s, idx) => `
            <button class="size-btn ${idx === 0 ? 'active' : ''}" onclick="selectQvSize('${s}', this)">${s}</button>
          `).join('')}
        </div>

        <div class="stock-indicator">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="8"></circle></svg>
          In Stock (${product.inStock} units available)
        </div>

        <!-- Quantity & Add to Cart Action -->
        <div style="display: flex; gap: 1rem; align-items: center; margin-top: 1rem;">
          <div class="qty-control" style="padding: 0.4rem 0.8rem;">
            <button class="qty-btn" onclick="changeQvQty(-1)">-</button>
            <span id="qvQtyDisplay" class="qty-number" style="font-size: 1rem; min-width: 1.5rem;">1</span>
            <button class="qty-btn" onclick="changeQvQty(1)">+</button>
          </div>

          <button class="btn-luxury" style="flex-grow: 1;" onclick="addQvToCart()">
            Add to Bag - ₹<span id="qvTotalPrice">${(product.price).toLocaleString('en-IN')}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  openModal('quickViewModal');
};

window.switchQvImage = function(src, thumbElement) {
  document.getElementById('qvMainImg').src = src;
  document.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active'));
  thumbElement.classList.add('active');
};

window.selectQvColor = function(idx, el) {
  state.selectedColor = state.activeQuickView.colors[idx];
  document.getElementById('qvSelectedColorText').textContent = state.selectedColor.name;
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
};

window.selectQvSize = function(size, el) {
  state.selectedSize = size;
  document.getElementById('qvSelectedSizeText').textContent = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
};

window.changeQvQty = function(delta) {
  let newQty = state.selectedQty + delta;
  if (newQty < 1) newQty = 1;
  if (newQty > state.activeQuickView.inStock) {
    showToast(`Only ${state.activeQuickView.inStock} items in stock`, 'info');
    return;
  }
  state.selectedQty = newQty;
  document.getElementById('qvQtyDisplay').textContent = newQty;
  document.getElementById('qvTotalPrice').textContent = (state.activeQuickView.price * newQty).toLocaleString('en-IN');
};

window.addQvToCart = function() {
  if (!state.activeQuickView) return;
  addToCart(
    state.activeQuickView.id, 
    state.selectedSize, 
    state.selectedColor.name, 
    state.selectedQty
  );
  closeModal('quickViewModal');
  openCartDrawer();
};

// ==========================================================================
// Cart State Management (Add, Remove, Update, Coupon)
// ==========================================================================
window.quickAddToCart = function(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  addToCart(product.id, product.sizes[0], product.colors[0].name, 1);
  showToast(`Added "${product.name}" to your bag`, 'success');
};

function addToCart(productId, size, color, qty = 1) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = state.cart.findIndex(
    item => item.id === productId && item.size === size && item.color === color
  );

  if (existingItemIndex > -1) {
    state.cart[existingItemIndex].qty += qty;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      img: product.images[0],
      size: size,
      color: color,
      qty: qty
    });
  }

  saveCart();
  updateCartUI();
}

window.updateCartQty = function(index, delta) {
  if (!state.cart[index]) return;
  state.cart[index].qty += delta;
  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
    showToast('Item removed from shopping bag', 'info');
  }
  saveCart();
  updateCartUI();
};

window.removeCartItem = function(index) {
  state.cart.splice(index, 1);
  saveCart();
  updateCartUI();
  showToast('Item removed from bag', 'info');
};

function saveCart() {
  localStorage.setItem('fashion_fever_cart', JSON.stringify(state.cart));
}

function calculateCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Shipping calculation (Free shipping above ₹1999)
  const freeShippingThreshold = 1999;
  let shipping = subtotal > 0 ? (subtotal >= freeShippingThreshold ? 0 : 199) : 0;
  
  // Discount
  let discount = 0;
  if (state.appliedCoupon) {
    if (state.appliedCoupon.freeShipping) {
      shipping = 0;
    }
    if (state.appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * state.appliedCoupon.discountPercent) / 100);
    }
    if (state.appliedCoupon.discountFlat) {
      discount = state.appliedCoupon.discountFlat;
    }
  }

  const tax = Math.round(subtotal * 0.05); // 5% GST on Apparel
  const total = Math.max(0, subtotal - discount + shipping + tax);

  return { subtotal, shipping, discount, tax, total, freeShippingThreshold };
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  const container = document.getElementById('cartItemsContainer');
  const emptyView = document.getElementById('cartEmptyView');
  const footer = document.getElementById('cartFooter');
  const shippingProgress = document.getElementById('shippingProgressBox');

  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = '';
    if (emptyView) emptyView.style.display = 'block';
    if (footer) footer.style.display = 'none';
    if (shippingProgress) shippingProgress.style.display = 'none';
    return;
  }

  if (emptyView) emptyView.style.display = 'none';
  if (footer) footer.style.display = 'block';
  if (shippingProgress) shippingProgress.style.display = 'block';

  // Render items
  container.innerHTML = state.cart.map((item, index) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <div class="cart-item-meta">
          <span>Size: <strong>${item.size}</strong></span>
          <span>Color: <strong>${item.color}</strong></span>
        </div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
        <button class="remove-item-btn" onclick="removeCartItem(${index})" title="Remove">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
          <span class="qty-number">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

  // Update Bill summary
  const totals = calculateCartTotals();
  document.getElementById('cartSubtotal').textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;
  document.getElementById('cartTax').textContent = `₹${totals.tax.toLocaleString('en-IN')}`;
  document.getElementById('cartShipping').textContent = totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`;
  document.getElementById('cartTotal').textContent = `₹${totals.total.toLocaleString('en-IN')}`;

  const discountRow = document.getElementById('cartDiscountRow');
  if (totals.discount > 0 && discountRow) {
    discountRow.style.display = 'flex';
    document.getElementById('cartDiscount').textContent = `-₹${totals.discount.toLocaleString('en-IN')}`;
  } else if (discountRow) {
    discountRow.style.display = 'none';
  }

  // Free shipping progress bar
  if (shippingProgress) {
    const progressFill = document.getElementById('shippingProgressFill');
    const progressText = document.getElementById('shippingProgressText');
    const remaining = totals.freeShippingThreshold - totals.subtotal;

    if (remaining <= 0) {
      progressFill.style.width = '100%';
      progressText.innerHTML = `🎉 Congratulations! You unlocked <span class="highlight">FREE Delivery</span>`;
    } else {
      const percentage = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));
      progressFill.style.width = `${percentage}%`;
      progressText.innerHTML = `Add <span class="highlight">₹${remaining.toLocaleString('en-IN')}</span> more for Free Express Delivery!`;
    }
  }
}

function applyDiscountCoupon(code) {
  if (AVAILABLE_COUPONS[code]) {
    const coupon = AVAILABLE_COUPONS[code];
    const totals = calculateCartTotals();
    if (totals.subtotal < coupon.minOrder) {
      showToast(`Coupon valid on orders above ₹${coupon.minOrder}`, 'info');
      return;
    }
    state.appliedCoupon = { code, ...coupon };
    showToast(`Code "${code}" applied: ${coupon.description}`, 'success');
    updateCartUI();
  } else {
    showToast('Invalid promo coupon code', 'error');
  }
}

window.copyCoupon = function(code) {
  navigator.clipboard.writeText(code);
  showToast(`Promo code "${code}" copied!`, 'success');
  const couponInput = document.getElementById('cartCouponInput');
  if (couponInput) couponInput.value = code;
};

// ==========================================================================
// Wishlist State Management
// ==========================================================================
window.toggleWishlist = function(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const index = state.wishlist.findIndex(item => item.id === productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast(`Removed from your wishlist`, 'info');
  } else {
    state.wishlist.push(product);
    showToast(`Saved to your wishlist!`, 'success');
  }

  localStorage.setItem('fashion_fever_wishlist', JSON.stringify(state.wishlist));
  updateWishlistUI();
  renderProducts();
};

function updateWishlistUI() {
  const badge = document.getElementById('wishlistBadge');
  if (badge) {
    const count = state.wishlist.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ==========================================================================
// Checkout & Order Placement Engine
// ==========================================================================
window.openCheckoutModal = function() {
  if (state.cart.length === 0) {
    showToast('Your shopping bag is empty', 'info');
    return;
  }
  state.checkoutStep = 1;
  renderCheckoutStep();
  openModal('checkoutModal');
};

function renderCheckoutStep() {
  const body = document.getElementById('checkoutModalBody');
  const totals = calculateCartTotals();

  // Update step indicators
  document.getElementById('stepIndicator1').classList.toggle('active', state.checkoutStep >= 1);
  document.getElementById('stepIndicator2').classList.toggle('active', state.checkoutStep >= 2);
  document.getElementById('stepIndicator3').classList.toggle('active', state.checkoutStep >= 3);

  if (state.checkoutStep === 1) {
    body.innerHTML = `
      <form id="shippingAddressForm" onsubmit="handleShippingSubmit(event)">
        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 1.2rem;">1. Shipping & Delivery Address</h4>
        
        <div class="form-grid-2">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" class="form-control" id="shipName" required placeholder="e.g. Rahul Sharma" value="${state.currentUser ? state.currentUser.name : ''}">
          </div>
          <div class="form-group">
            <label>Phone Number *</label>
            <input type="tel" class="form-control" id="shipPhone" required placeholder="+91 98765 43210" pattern="[0-9+ -]{10,14}">
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 1.2rem;">
          <label>Email Address for Order Updates *</label>
          <input type="email" class="form-control" id="shipEmail" required placeholder="your.name@example.com" value="${state.currentUser ? state.currentUser.email : ''}">
        </div>

        <div class="form-group" style="margin-bottom: 1.2rem;">
          <label>Complete Street Address & Landmark *</label>
          <textarea class="form-control" id="shipAddress" required rows="2" placeholder="House/Flat No., Tower, Street, Landmark"></textarea>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>City *</label>
            <input type="text" class="form-control" id="shipCity" required placeholder="Mumbai / Delhi / Bengaluru">
          </div>
          <div class="form-group">
            <label>PIN Code *</label>
            <input type="text" class="form-control" id="shipPincode" required placeholder="400001" pattern="[0-9]{6}">
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem;">
          <span style="font-weight: 700; color: var(--text-gold);">Total to Pay: ₹${totals.total.toLocaleString('en-IN')}</span>
          <button type="submit" class="btn-luxury">Proceed to Payment ➔</button>
        </div>
      </form>
    `;
  } else if (state.checkoutStep === 2) {
    body.innerHTML = `
      <div>
        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 1.2rem;">2. Select Payment Method</h4>
        
        <div class="payment-methods-grid">
          <div class="payment-method-card ${state.selectedPaymentMethod === 'upi' ? 'active' : ''}" onclick="selectPaymentMethod('upi')">
            <h5>⚡ Instant UPI & QR</h5>
            <p style="font-size: 0.78rem; color: var(--text-secondary);">Google Pay, PhonePe, Paytm, BHIM</p>
          </div>

          <div class="payment-method-card ${state.selectedPaymentMethod === 'card' ? 'active' : ''}" onclick="selectPaymentMethod('card')">
            <h5>💳 Credit / Debit Card</h5>
            <p style="font-size: 0.78rem; color: var(--text-secondary);">Visa, Mastercard, RuPay, Amex</p>
          </div>

          <div class="payment-method-card ${state.selectedPaymentMethod === 'cod' ? 'active' : ''}" onclick="selectPaymentMethod('cod')">
            <h5>📦 Cash on Delivery</h5>
            <p style="font-size: 0.78rem; color: var(--text-secondary);">Pay in cash at your doorstep</p>
          </div>
        </div>

        <!-- Payment Mode Display Content -->
        <div id="paymentDetailsContainer">
          ${renderPaymentDetailsView()}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; border-top: 1px solid var(--border-subtle); padding-top: 1.5rem;">
          <button class="btn-glass" onclick="setCheckoutStep(1)">⬅ Back to Address</button>
          <button class="btn-luxury" onclick="handlePlaceOrder()">
            Confirm & Place Order (₹${totals.total.toLocaleString('en-IN')})
          </button>
        </div>
      </div>
    `;
  }
}

function renderPaymentDetailsView() {
  const totals = calculateCartTotals();
  if (state.selectedPaymentMethod === 'upi') {
    return `
      <div class="upi-qr-box">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=fashionfever@okaxis&pn=FashionFever&am=${totals.total}&cu=INR" alt="UPI QR Code" />
        <p>Scan with any UPI App (GPay / PhonePe / Paytm)</p>
        <span style="font-size: 0.75rem; color: #666; font-family: monospace;">UPI ID: fashionfever@okaxis</span>
      </div>
    `;
  } else if (state.selectedPaymentMethod === 'card') {
    return `
      <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Card Number</label>
          <input type="text" class="form-control" placeholder="4532 •••• •••• 8892" maxlength="19">
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Expiry Date</label>
            <input type="text" class="form-control" placeholder="MM / YY" maxlength="5">
          </div>
          <div class="form-group">
            <label>CVV / CVC</label>
            <input type="password" class="form-control" placeholder="•••" maxlength="4">
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: center;">
        <p style="font-size: 0.95rem; color: var(--text-primary);">💵 You can pay in Cash or via UPI upon receiving your parcel.</p>
        <span style="font-size: 0.8rem; color: var(--emerald);">Zero Contact & Verified Delivery Available</span>
      </div>
    `;
  }
}

window.selectPaymentMethod = function(method) {
  state.selectedPaymentMethod = method;
  renderCheckoutStep();
};

window.setCheckoutStep = function(step) {
  state.checkoutStep = step;
  renderCheckoutStep();
};

window.handleShippingSubmit = function(e) {
  e.preventDefault();
  state.shippingDetails = {
    name: document.getElementById('shipName').value,
    phone: document.getElementById('shipPhone').value,
    email: document.getElementById('shipEmail').value,
    address: document.getElementById('shipAddress').value,
    city: document.getElementById('shipCity').value,
    pincode: document.getElementById('shipPincode').value
  };
  state.checkoutStep = 2;
  renderCheckoutStep();
};

window.handlePlaceOrder = function() {
  const totals = calculateCartTotals();
  const orderId = 'FF-' + Math.floor(100000 + Math.random() * 900000);
  
  const newOrder = {
    orderId: orderId,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    items: [...state.cart],
    subtotal: totals.subtotal,
    discount: totals.discount,
    tax: totals.tax,
    shipping: totals.shipping,
    total: totals.total,
    shippingDetails: state.shippingDetails,
    paymentMethod: state.selectedPaymentMethod.toUpperCase(),
    status: 'Order Confirmed'
  };

  // Add to order history
  state.orders.unshift(newOrder);
  saveOrders();

  // Clear Cart
  state.cart = [];
  state.appliedCoupon = null;
  saveCart();
  updateCartUI();

  // Show Order Confirmation Modal
  closeModal('checkoutModal');
  showOrderSuccessModal(newOrder);
};

function saveOrders() {
  localStorage.setItem('fashion_fever_orders', JSON.stringify(state.orders));
}

function showOrderSuccessModal(order) {
  const content = document.getElementById('orderSuccessContent');
  if (!content) return;

  content.innerHTML = `
    <div class="order-success-box">
      <div class="success-icon-wrap">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.4rem;">Order Placed Successfully!</h2>
      <p style="color: var(--text-secondary);">Thank you for shopping with Fashion Fever, <strong>${order.shippingDetails?.name || 'Valued Customer'}</strong>.</p>
      
      <div class="order-id-badge">Order ID: ${order.orderId}</div>

      <!-- Live Tracking Status -->
      <div class="order-timeline">
        <div class="timeline-step completed">
          <div class="timeline-dot">✓</div>
          <span>Confirmed</span>
        </div>
        <div class="timeline-step">
          <div class="timeline-dot">2</div>
          <span>Packed</span>
        </div>
        <div class="timeline-step">
          <div class="timeline-dot">3</div>
          <span>Shipped</span>
        </div>
        <div class="timeline-step">
          <div class="timeline-dot">4</div>
          <span>Delivered</span>
        </div>
      </div>

      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; text-align: left; margin: 1.5rem 0;">
        <h5 style="margin-bottom: 0.8rem; font-size: 0.95rem; color: var(--text-gold);">Order Summary</h5>
        ${order.items.map(item => `
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.4rem;">
            <span>${item.qty}x ${item.name} (${item.size})</span>
            <span>₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
          </div>
        `).join('')}
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.6rem; margin-top: 0.6rem; display: flex; justify-content: space-between; font-weight: 800; color: var(--text-primary);">
          <span>Total Paid:</span>
          <span>₹${order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button class="btn-glass" onclick="window.print()">🖨️ Print Invoice</button>
        <button class="btn-luxury" onclick="closeModal('orderSuccessModal')">Continue Shopping</button>
      </div>
    </div>
  `;

  openModal('orderSuccessModal');
}

// ==========================================================================
// User Authentication & Google Sign-In Integration
// ==========================================================================
function loginUser(user) {
  state.currentUser = user;
  localStorage.setItem('fashion_fever_user', JSON.stringify(user));
  updateAuthUI();
  showToast(`Welcome back, ${user.name}!`, 'success');
}

window.logoutUser = function() {
  state.currentUser = null;
  localStorage.removeItem('fashion_fever_user');
  updateAuthUI();
  closeModal('profileModal');
  showToast('You have been logged out safely.', 'info');
};

function updateAuthUI() {
  const userText = document.getElementById('userBtnText');
  if (userText) {
    if (state.currentUser) {
      userText.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
        <span>${state.currentUser.name}</span>
      `;
    } else {
      userText.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>Sign In</span>
      `;
    }
  }
}

/**
 * Google Sign-In Integration Ready Handler
 * Compatible with Google Identity Services (GIS) / OAuth 2.0 Client
 */
function handleGoogleSignIn() {
  // Simulator with realistic Google profile payload
  const mockGoogleUser = {
    name: "Fashion Fever Member",
    email: "member@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    isGoogleConnected: true
  };

  loginUser(mockGoogleUser);
  closeModal('authModal');
  showToast('Signed in seamlessly with Google! ✨', 'success');
}

// ==========================================================================
// Profile & Orders Modal
// ==========================================================================
function openProfileModal() {
  const content = document.getElementById('profileModalContent');
  if (!content || !state.currentUser) return;

  content.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-large">
        ${state.currentUser.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <h3 style="font-family: var(--font-serif); font-size: 1.5rem;">${state.currentUser.name}</h3>
        <p style="color: var(--text-secondary); font-size: 0.88rem;">${state.currentUser.email}</p>
        <span style="font-size: 0.72rem; color: var(--gold); font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">Fashion Fever VIP Member</span>
      </div>
    </div>

    <div class="profile-body">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <h4 style="font-family: var(--font-serif); font-size: 1.25rem;">Recent Orders & History (${state.orders.length})</h4>
        <button class="btn-glass" style="font-size: 0.78rem; padding: 0.4rem 0.9rem;" onclick="logoutUser()">Log Out</button>
      </div>

      <div class="orders-list">
        ${state.orders.length === 0 ? `
          <p style="text-align: center; color: var(--text-muted); padding: 2rem 0;">You have not placed any orders yet.</p>
        ` : state.orders.map(o => `
          <div class="order-history-card">
            <div>
              <div style="display: flex; gap: 0.8rem; align-items: center; margin-bottom: 0.3rem;">
                <span style="font-weight: 800; font-family: monospace; color: var(--text-gold);">${o.orderId}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${o.date}</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">
                ${o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
              </p>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 800; color: var(--text-primary);">₹${o.total.toLocaleString('en-IN')}</div>
              <span style="font-size: 0.75rem; color: var(--emerald); font-weight: 700;">● ${o.status}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  openModal('profileModal');
}

// ==========================================================================
// Modal Helpers & Toast Dispatcher
// ==========================================================================
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
};

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.add('active');
  if (backdrop) backdrop.classList.add('active');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
}

function openAuthModal() {
  openModal('authModal');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '✨';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '✕';

  toast.innerHTML = `<span style="font-weight: 800; color: var(--gold);">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}
