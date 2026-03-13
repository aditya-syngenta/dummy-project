/**
 * ShopEasy – Dummy E-commerce JavaScript
 *
 * Intentional bugs are marked with  // BUG:  comments so they can be
 * spotted and used as test-cases on another project.
 */

// ─── Product catalogue ───────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    description: "Premium sound quality with active noise cancellation. Up to 30-hour battery life, foldable design, and built-in microphone for hands-free calls."
  },
  {
    id: 2,
    name: "Running Sneakers – Ultralight",
    category: "Footwear",
    price: 54.99,
    originalPrice: 89.99,
    rating: 4.2,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    description: "Lightweight mesh upper with responsive cushioning. Ideal for daily runs and gym workouts."
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    category: "Electronics",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 520,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop",
    description: "Track fitness, heart rate, sleep, and more. 7-day battery, water-resistant, 50+ watch faces."
  },
  {
    id: 4,
    name: "Leather Crossbody Bag",
    category: "Accessories",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.0,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
    description: "Genuine leather with adjustable strap and multiple compartments. Perfect for everyday use."
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.3,
    reviews: 265,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
    description: "360° surround sound, 12-hour playtime, IPX7 waterproof rating. Your go-to outdoor companion."
  },
  {
    id: 6,
    name: "Cotton Graphic T-Shirt",
    category: "Clothing",
    price: 19.99,
    originalPrice: 29.99,
    rating: 3.8,
    reviews: 441,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    description: "100% premium combed cotton. Pre-shrunk, double-stitched hem for lasting quality."
  },
  {
    id: 7,
    name: "Stainless Steel Water Bottle",
    category: "Home & Kitchen",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.6,
    reviews: 730,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    description: "Keeps drinks cold 24 hrs or hot 12 hrs. BPA-free, leak-proof lid, 32 oz capacity."
  },
  {
    id: 8,
    name: "Yoga Mat – Non-slip",
    category: "Sports",
    price: 29.99,
    originalPrice: 44.99,
    rating: 4.4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    description: "Extra-thick 6mm cushioning with alignment lines and moisture-resistant surface."
  }
];

// ─── Cart helpers ─────────────────────────────────────────────────────────────

/** Load cart from localStorage (returns array of {id, qty} objects). */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("shopeasy_cart")) || [];
  } catch {
    return [];
  }
}

/** Persist cart to localStorage. */
function saveCart(cart) {
  localStorage.setItem("shopeasy_cart", JSON.stringify(cart));
}

/** Return total number of items (sum of qtys) – used for the badge. */
function cartItemCount() {
  // BUG: counts distinct cart lines, not total quantity
  return loadCart().length;
}

/**
 * Calculate the subtotal of the cart.
 * BUG: uses integer truncation instead of proper rounding, so
 * the displayed subtotal can be a few cents off.
 */
function cartSubtotal() {
  const cart = loadCart();
  let total = 0;
  for (const item of cart) {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) {
      total += product.price * item.qty;
    }
  }
  // BUG: parseInt() truncates decimals → wrong total for fractional prices
  return parseInt(total);
}

/** Add a product to the cart (or increment qty if already present). */
function addToCart(productId, qty = 1) {
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  updateCartBadge();
}

/** Remove an item from the cart by product id. */
function removeFromCart(productId) {
  let cart = loadCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

/** Update the quantity of a cart item. Allows 0 and negative values. */
function updateCartQty(productId, newQty) {
  // BUG: no validation – newQty can be 0 or negative, corrupting the cart
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx > -1) {
    cart[idx].qty = newQty;
  }
  saveCart(cart);
}

/** Update the cart badge count in the header. */
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent = cartItemCount();
    badge.style.display = cartItemCount() === 0 ? "none" : "flex";
  }
}

// ─── Discount / coupon logic ──────────────────────────────────────────────────
const COUPONS = {
  SAVE10: 10,
  SAVE20: 20,
  HALFOFF: 50
};

/**
 * Apply a coupon code and return the discount amount.
 * BUG: coupon comparison is case-sensitive, so "save10" won't match "SAVE10",
 * but the UI hint says codes are case-insensitive.
 */
function applyCoupon(code, subtotal) {
  const percent = COUPONS[code]; // BUG: should be code.toUpperCase()
  if (!percent) return 0;
  return (subtotal * percent) / 100;
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Filter products by a search query.
 * BUG: only checks product name, ignores category and description,
 * so searching "running" won't match the "Running Sneakers" product
 * if the query is "sneakers" typed in a different case – actually it does
 * match for exact same case only because .includes() is used without
 * .toLowerCase() on the name.
 */
function searchProducts(query) {
  if (!query || query.trim() === "") return PRODUCTS;
  // BUG: case-sensitive includes – "headphones" won't match "Headphones"
  return PRODUCTS.filter(p => p.name.includes(query));
}

// ─── Star rating helper ───────────────────────────────────────────────────────
function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

// ─── Discount badge ───────────────────────────────────────────────────────────
function discountPercent(price, original) {
  // BUG: result is floored rather than rounded, making displayed discount
  // slightly lower than the real value (e.g. 38.46% shown as 38%)
  return Math.floor(((original - price) / original) * 100);
}

// ─── Toast notification ───────────────────────────────────────────────────────
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ─── Render helpers ───────────────────────────────────────────────────────────

/** Build a product card element. */
function buildProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  const discount = discountPercent(product.price, product.originalPrice);
  card.innerHTML = `
    <a href="product.html?id=${product.id}">
      <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy">
    </a>
    <div class="product-info">
      <span class="product-category">${product.category}</span>
      <a href="product.html?id=${product.id}">
        <p class="product-name">${product.name}</p>
      </a>
      <div class="product-rating">${starsHTML(product.rating)} <span style="color:#666">(${product.reviews})</span></div>
      <p class="product-price">
        $${product.price.toFixed(2)}
        <span class="original">$${product.originalPrice.toFixed(2)}</span>
        <span class="badge-discount">${discount}% OFF</span>
      </p>
      <button class="btn-add-cart" data-id="${product.id}">Add to Cart</button>
    </div>
  `;
  card.querySelector(".btn-add-cart").addEventListener("click", () => {
    addToCart(product.id);
    showToast(`"${product.name}" added to cart!`);
  });
  return card;
}

// ─── Page: index.html ─────────────────────────────────────────────────────────
function initIndexPage() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  let currentCategory = "All";
  let currentQuery = "";

  function renderGrid() {
    grid.innerHTML = "";
    let list = searchProducts(currentQuery);
    if (currentCategory !== "All") {
      list = list.filter(p => p.category === currentCategory);
    }
    if (list.length === 0) {
      grid.innerHTML = '<p style="color:#888;grid-column:1/-1">No products found.</p>';
      return;
    }
    list.forEach(p => grid.appendChild(buildProductCard(p)));
  }

  // Category chips
  document.querySelectorAll(".category-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".category-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentCategory = chip.dataset.category;
      renderGrid();
    });
  });

  // Search
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      currentQuery = searchInput.value;
      renderGrid();
    });
    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        currentQuery = searchInput.value;
        renderGrid();
      }
    });
  }

  renderGrid();
}

// ─── Page: product.html ───────────────────────────────────────────────────────
function initProductPage() {
  const container = document.getElementById("product-detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    container.innerHTML = '<p style="padding:2rem;color:#888">Product not found.</p>';
    return;
  }

  const discount = discountPercent(product.price, product.originalPrice);

  container.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="detail-info">
      <span class="product-category">${product.category}</span>
      <h1>${product.name}</h1>
      <div class="product-rating">${starsHTML(product.rating)} <span style="color:#666;font-size:.9rem">${product.reviews} reviews</span></div>
      <p class="detail-price">
        $${product.price.toFixed(2)}
        <span class="detail-original">$${product.originalPrice.toFixed(2)}</span>
        <span class="badge-discount">${discount}% OFF</span>
      </p>
      <p class="detail-desc">${product.description}</p>
      <div class="qty-row">
        <label for="qty">Quantity:</label>
        <input type="number" id="qty" class="qty-input" value="1" min="1" max="10">
      </div>
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <button class="btn-primary" id="add-to-cart-btn">🛒 Add to Cart</button>
        <a href="cart.html" class="btn-secondary">View Cart</a>
      </div>
    </div>
  `;

  document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    const qty = parseInt(document.getElementById("qty").value);
    // BUG: no validation that qty > 0 before adding
    addToCart(product.id, qty);
    showToast(`Added ${qty}× "${product.name}" to cart!`);
  });
}

// ─── Page: cart.html ──────────────────────────────────────────────────────────
function initCartPage() {
  const cartContainer = document.getElementById("cart-items-container");
  const summaryEl = document.getElementById("cart-summary");
  if (!cartContainer) return;

  let appliedDiscount = 0;

  function renderCart() {
    const cart = loadCart();
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <div class="icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <a href="index.html" class="btn-primary" style="margin-top:1rem">Shop Now</a>
        </div>`;
      renderSummary(0, 0);
      return;
    }

    cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}">
        </a>
        <div class="cart-item-info">
          <p class="cart-item-name">${product.name}</p>
          <p class="cart-item-price">$${product.price.toFixed(2)} each</p>
          <div class="cart-item-qty">
            <button class="qty-btn dec" data-id="${product.id}">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn inc" data-id="${product.id}">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <p style="font-weight:700">$${(product.price * item.qty).toFixed(2)}</p>
          <button class="remove-btn" data-id="${product.id}" title="Remove">✕</button>
        </div>
      `;

      div.querySelector(".dec").addEventListener("click", () => {
        // BUG: decrement goes to 0 and below (no lower bound check)
        updateCartQty(product.id, item.qty - 1);
        renderCart();
      });
      div.querySelector(".inc").addEventListener("click", () => {
        updateCartQty(product.id, item.qty + 1);
        renderCart();
      });
      div.querySelector(".remove-btn").addEventListener("click", () => {
        removeFromCart(product.id);
        renderCart();
      });

      cartContainer.appendChild(div);
    });

    renderSummary(cartSubtotal(), appliedDiscount);
  }

  function renderSummary(subtotal, discount) {
    const shipping = subtotal > 50 ? 0 : 5.99;
    // BUG: tax is calculated on (subtotal - discount) but then added to
    // (subtotal + shipping), double-counting the base
    const tax = ((subtotal - discount) * 0.08).toFixed(2);
    const total = (subtotal - discount + shipping + parseFloat(tax)).toFixed(2);

    if (summaryEl) {
      summaryEl.querySelector(".subtotal-val").textContent = `$${subtotal.toFixed(2)}`;
      summaryEl.querySelector(".discount-val").textContent = discount > 0 ? `-$${discount.toFixed(2)}` : "$0.00";
      summaryEl.querySelector(".shipping-val").textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
      summaryEl.querySelector(".tax-val").textContent = `$${tax}`;
      summaryEl.querySelector(".total-val").textContent = `$${total}`;
    }
  }

  // Coupon
  const couponBtn = document.getElementById("apply-coupon-btn");
  if (couponBtn) {
    couponBtn.addEventListener("click", () => {
      const code = document.getElementById("coupon-input").value.trim();
      const subtotal = cartSubtotal();
      const discount = applyCoupon(code, subtotal);
      if (discount > 0) {
        appliedDiscount = discount;
        showToast(`Coupon applied! You saved $${discount.toFixed(2)}`);
        renderSummary(subtotal, appliedDiscount);
      } else {
        showToast("Invalid coupon code. Try SAVE10, SAVE20, or HALFOFF.");
      }
    });
  }

  renderCart();
}

// ─── Page: checkout.html ──────────────────────────────────────────────────────
function initCheckoutPage() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  // Populate order summary
  const summaryList = document.getElementById("order-items-list");
  const cart = loadCart();
  let subtotal = 0;

  if (summaryList) {
    cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return;
      const lineTotal = product.price * item.qty;
      subtotal += lineTotal;
      const el = document.createElement("div");
      el.className = "order-item";
      el.innerHTML = `<span>${product.name} × ${item.qty}</span><span>$${lineTotal.toFixed(2)}</span>`;
      summaryList.appendChild(el);
    });
  }

  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal * 0.08).toFixed(2);
  const total = (subtotal + shipping + parseFloat(tax)).toFixed(2);

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl("order-subtotal", `$${subtotal.toFixed(2)}`);
  setEl("order-shipping", shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`);
  setEl("order-tax", `$${tax}`);
  setEl("order-total", `$${total}`);

  // ── Form validation ──────────────────────────────────────────────────────
  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    // Helper: show/hide inline error
    function validate(fieldId, condition, msgId) {
      const msg = document.getElementById(msgId);
      if (!condition) {
        if (msg) msg.classList.add("visible");
        valid = false;
      } else {
        if (msg) msg.classList.remove("visible");
      }
    }

    const name = document.getElementById("full-name").value.trim();
    validate("full-name", name.length >= 2, "err-name");

    const email = document.getElementById("email").value.trim();
    // BUG: email regex is too permissive – accepts "user@" or "a@b" as valid
    validate("email", /\S+@\S+/.test(email), "err-email");

    const phone = document.getElementById("phone").value.trim();
    // BUG: phone regex only checks for 10+ digits, doesn't handle +country codes
    validate("phone", /^\d{10,}$/.test(phone), "err-phone");

    const address = document.getElementById("address").value.trim();
    validate("address", address.length >= 5, "err-address");

    const city = document.getElementById("city").value.trim();
    validate("city", city.length >= 2, "err-city");

    const zip = document.getElementById("zip").value.trim();
    // BUG: ZIP validation only checks US format, rejects valid international codes
    validate("zip", /^\d{5}(-\d{4})?$/.test(zip), "err-zip");

    const cardNumber = document.getElementById("card-number").value.replace(/\s/g, "");
    // BUG: only checks length == 16, doesn't run Luhn algorithm
    validate("card-number", cardNumber.length === 16, "err-card");

    const expiry = document.getElementById("card-expiry").value.trim();
    validate("card-expiry", /^\d{2}\/\d{2}$/.test(expiry), "err-expiry");

    const cvv = document.getElementById("card-cvv").value.trim();
    validate("card-cvv", /^\d{3,4}$/.test(cvv), "err-cvv");

    if (valid) {
      // Clear cart and redirect to success
      saveCart([]);
      window.location.href = "success.html";
    }
  });

  // Card number formatting (add spaces every 4 digits)
  const cardInput = document.getElementById("card-number");
  if (cardInput) {
    cardInput.addEventListener("input", () => {
      let v = cardInput.value.replace(/\D/g, "").substring(0, 16);
      cardInput.value = v.replace(/(.{4})/g, "$1 ").trim();
    });
  }
}

// ─── Global init ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initIndexPage();
  initProductPage();
  initCartPage();
  initCheckoutPage();
});
