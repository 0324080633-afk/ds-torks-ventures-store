const products = [
  { id: 1, name: "LAYER 1", category: "Poultry Feed", price: 393, stock: 42, description: "High-quality layer feed for continuous egg production. Formulated with essential minerals and vitamins for strong shell formation.", image: "https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/microsoftteams-image.png?format=webp&mode=max&width=750&height=680" },
  { id: 2, name: "LAYER 2", category: "Poultry Feed", price: 388, stock: 35, description: "Premium layer mash providing balanced nutrition for peak egg production and optimal bird health.", image: "https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/microsoftteams-image.png?format=webp&mode=max&width=750&height=680" },
  { id: 3, name: "GROWER MASH", category: "Poultry Feed", price: 401, stock: 23, description: "Nutrient-dense feed for growing birds. Supports rapid growth and development in pullets and young birds.", image: "https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/microsoftteams-image.png?format=webp&mode=max&width=750&height=680" },
  { id: 4, name: "CHICK STARTER CRUMBLE", category: "Poultry Feed", price: 443, stock: 18, description: "Specially formulated crumble for day-old chicks. Enhanced with probiotics for digestive health and strong immune development.", image: "https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/small-bags_poultry_broiler_complete_koudijs_ghana.jpg?format=webp&mode=max&width=750&height=680" },
  { id: 5, name: "BROILER STARTER", category: "Poultry Feed", price: 467, stock: 28, description: "High-protein starter designed for broilers from day 1 to 10 days. Promotes fast, uniform growth.", image: "https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/small-bags_poultry_broiler_complete_koudijs_ghana.jpg?format=webp&mode=max&width=750&height=680" },
  { id: 6, name: "BROILER FINISHER", category: "Poultry Feed", price: 456, stock: 20, description: "Complete finisher ration for broilers aged 4-7 weeks. Maximum meat yield and optimal feed conversion ratio.", image: "https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/small-bags_poultry_broiler_complete_koudijs_ghana.jpg?format=webp&mode=max&width=750&height=680" },
  { id: 7, name: "BROILER GROWER", category: "Poultry Feed", price: 461, stock: 14, description: "Mid-stage broiler feed (2-4 weeks). Balanced nutrition for steady growth and muscle development.", image: "https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/small-bags_poultry_broiler_complete_koudijs_ghana.jpg?format=webp&mode=max&width=750&height=680" },
  { id: 8, name: "CATFISH 6MM", category: "Fish Feed", price: 258, stock: 33, description: "Floating pellets for large catfish. 6mm size suitable for fingerlings and juveniles. High protein content.", image: "https://www.deheus.com.gh/siteassets/products-and-services/fish/bags_koudijs_ghana_catfish.jpg?format=webp&mode=max&width=890&height=1000" },
  { id: 9, name: "CATFISH 8MM", category: "Fish Feed", price: 250, stock: 26, description: "Premium sinking pellets for adult catfish. 8mm size optimized for mature fish. Enhanced digestibility.", image: "https://www.deheus.com.gh/siteassets/products-and-services/fish/bags_koudijs_ghana_catfish.jpg?format=webp&mode=max&width=890&height=1000" },
  { id: 10, name: "KBCS 35%", category: "Special Feed", price: 580, stock: 12, description: "High protein concentrate for poultry. Mix with local grains to create complete rations at lower cost.", image: "https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/broiler-bag-for-concentrate.jpg?format=webp&mode=max&width=2048&height=1200" },
  { id: 11, name: "KLC 5%", category: "Special Feed", price: 755, stock: 8, description: "Mineral premix supplement. Essential micronutrients and vitamins for all poultry types.", image:"https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/broiler-bag-for-concentrate.jpg?format=webp&mode=max&width=2048&height=1200" },
  { id: 12, name: "PIGLET STARTER", category: "Pig Feed", price: 442, stock: 21, description: "Creep feed for piglets from 2-8 weeks. High digestibility and early weaning support.", image: "https://www.deheus.com.gh/siteassets/products-and-services/pigs/all-purpose-pig-concentrate-de-heus-ghana.png?format=webp&mode=max&width=890&height=1000" },
  { id: 13, name: "PIG GROWER", category: "Pig Feed", price: 418, stock: 17, description: "Growth ration for pigs aged 8-16 weeks. Balanced protein and energy for optimal weight gain.", image: "https://www.deheus.com.gh/siteassets/products-and-services/pigs/all-purpose-pig-concentrate-de-heus-ghana.png?format=webp&mode=max&width=890&height=1000" },
  { id: 14, name: "PIG FINISHER", category: "Pig Feed", price: 388, stock: 16, description: "Final stage feed for market-ready pigs. Promotes lean meat development and excellent feed conversion.", image: "https://www.deheus.com.gh/siteassets/products-and-services/pigs/all-purpose-pig-concentrate-de-heus-ghana.png?format=webp&mode=max&width=890&height=1000" },
  { id: 15, name: "DEVELOPER MASH", category: "Poultry Feed", price: 387, stock: 22, description: "Transitional feed for growing pullets before layer production phase. Supports skeletal development.", image:"https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/microsoftteams-image.png?format=webp&mode=max&width=2048&height=1200" },
  { id: 16, name: "PRE-LAYER", category: "Poultry Feed", price: 369, stock: 19, description: "Preparation feed for pullets 14-18 weeks old. Conditions birds for transition to layer production.", image: "https://www.koudijs.com.gh/siteassets/animal-nutrition/poultry/microsoftteams-image.png?format=webp&mode=max&width=2048&height=1200" },
  { id: 17, name: "CATFISH 4MM", category: "Fish Feed", price: 272, stock: 31, description: "Sinking pellets for young catfish. 4mm size for fry and small fingerlings. Complete nutrition.", image: "https://www.deheus.com.gh/siteassets/products-and-services/fish/bags_koudijs_ghana_catfish.jpg?format=webp&mode=max&width=890&height=1000" },
  { id: 18, name: "SANKOFA", category: "Special Feed", price: 372, stock: 13, description: "Multi-species supplement feed. Supports growth in various poultry and livestock types.", image: "images/hero-bg.svg" },
  { id: 19, name: "GALDUS", category: "Special Feed", price: 397, stock: 15, description: "Specialized nutrient booster. Enhances performance and immune response across animal types.", image: "https://www.koudijs.com.gh/siteassets/products/large-bags_pigs_koudijs_romelko-general_gaszak.jpg?format=webp&mode=max&width=2048&height=1200" }
];

const cart = [];

const categoryFallbackImages = {
  "Poultry Feed": "images/poultry-feed-bg.svg",
  "Fish Feed":    "images/fish-feed-bg.svg",
  "Pig Feed":     "images/pig-feed-bg.svg",
  "Special Feed": "images/hero-bg.svg",
};

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const whatsappOrder = document.getElementById("whatsappOrder");
const cartWhatsappOrder = document.getElementById("cartWhatsappOrder");
const cashierItems = document.getElementById("cashierItems");
const cashierTotal = document.getElementById("cashierTotal");
const adminProductCount = document.getElementById("adminProductCount");
const adminLowStock = document.getElementById("adminLowStock");

const businessPhone = "233537840502";
let currentFilter = null; // Track current category filter

// Payment details
const paymentDetails = {
  momo: {
    network: "MTN",
    number: "0543682525",
    accountName: "DS TORKS VENTURES"
  },
  bank: {
    name: "Zenith Bank",
    accountName: "Sylvia Akorsua Lagble",
    accountNumber: "6010625165"
  }
};

function formatGHS(value) {
  return `GHS ${value.toFixed(2)}`;
}

function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `DSTV-${date}-${random}`;
}

function buildWhatsAppMessage() {
  if (cart.length === 0) {
    return "Hello DS TORKS VENTURES, I want to place an order for animal feed.";
  }

  const lines = cart.map((item) => `${item.name} x ${item.qty} = ${formatGHS(item.price * item.qty)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return `Hello DS TORKS VENTURES, I want to place this order:%0A${lines.join("%0A")}%0A%0ATotal: ${formatGHS(total)}`;
}

function updateWhatsAppLinks() {
  const url = `https://wa.me/${businessPhone}?text=${buildWhatsAppMessage()}`;
  whatsappOrder.href = url;
  cartWhatsappOrder.href = url;
}

function renderOpsPanel() {
  const lowStockCount = products.filter((product) => product.stock <= 12).length;
  if (adminProductCount) {
    adminProductCount.textContent = String(products.length);
  }
  if (adminLowStock) {
    adminLowStock.textContent = String(lowStockCount);
  }
}

function renderProducts() {
  let productsToRender = products;
  
  // Filter by category if one is selected
  if (currentFilter) {
    productsToRender = products.filter((product) => product.category === currentFilter);
  }
  
  productGrid.innerHTML = productsToRender
    .map(
      (product) => `
      <article class="product-card" data-id="${product.id}" role="button" tabindex="0" aria-label="Click to view ${product.name}">
        <img class="product-thumb" src="${product.image}" alt="${product.name}" loading="lazy"
             onerror="this.onerror=null;this.src='${categoryFallbackImages[product.category] || "images/hero-bg.svg"}'" />
        <h3>${product.name}</h3>
        <div class="product-meta">
          <span>${product.category}</span>
          <strong>${formatGHS(product.price)}</strong>
        </div>
        <button type="button" class="add-to-cart-btn" data-id="${product.id}" aria-label="Add ${product.name} to cart">Add to Cart</button>
      </article>
    `
    )
    .join("");
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "GHS 0.00";
    cartCount.textContent = "0";
    if (cashierItems) {
      cashierItems.textContent = "0";
    }
    if (cashierTotal) {
      cashierTotal.textContent = "GHS 0.00";
    }
    updateWhatsAppLinks();
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <p>${formatGHS(item.price)} x ${item.qty}</p>
        </div>
        <button class="icon-btn" type="button" data-remove="${item.id}">-</button>
      </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  cartTotal.textContent = formatGHS(total);
  cartCount.textContent = String(count);
  if (cashierItems) {
    cashierItems.textContent = String(count);
  }
  if (cashierTotal) {
    cashierTotal.textContent = formatGHS(total);
  }
  updateWhatsAppLinks();
}

function addToCart(productId) {
  const found = products.find((product) => product.id === productId);
  if (!found) {
    return;
  }

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...found, qty: 1 });
  }

  renderCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index === -1) {
    return;
  }

  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }

  renderCart();
}

productGrid.addEventListener("click", (event) => {
  const target = event.target;
  const productCard = target.closest(".product-card");
  
  if (!productCard) return;
  
  // If clicking the "Add to Cart" button, add to cart
  if (target.classList.contains("add-to-cart-btn")) {
    const id = Number(target.dataset.id);
    if (!Number.isNaN(id)) {
      addToCart(id);
    }
  } 
  // Otherwise, open product details
  else {
    const id = Number(productCard.dataset.id);
    if (!Number.isNaN(id)) {
      showProductDetails(id);
    }
  }
});

cartItems.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = Number(target.dataset.remove);
  if (!Number.isNaN(id)) {
    removeFromCart(id);
  }
});

document.getElementById("cartButton").addEventListener("click", () => {
  cartPanel.classList.add("open");
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

document.getElementById("clearCart").addEventListener("click", () => {
  cart.length = 0;
  renderCart();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty. Add items before checking out.");
    return;
  }
  cartPanel.classList.remove("open");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const cashTotal = document.getElementById("cashTotal");
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  checkoutTotal.textContent = formatGHS(total);
  cashTotal.textContent = formatGHS(total);
  
  // Reset payment method and hide all payment sections
  document.getElementById("paymentMethod").value = "";
  document.getElementById("momoSection").classList.add("hidden");
  document.getElementById("bankSection").classList.add("hidden");
  document.getElementById("cashSection").classList.add("hidden");
  
  checkoutModal.classList.add("open");
});

document.getElementById("closeCheckout").addEventListener("click", () => {
  document.getElementById("checkoutModal").classList.remove("open");
});

// Payment Method Selection Handler
document.getElementById("paymentMethod").addEventListener("change", (e) => {
  const payment = e.target.value;
  const momoSection = document.getElementById("momoSection");
  const bankSection = document.getElementById("bankSection");
  const cashSection = document.getElementById("cashSection");

  // Hide all sections
  momoSection.classList.add("hidden");
  bankSection.classList.add("hidden");
  cashSection.classList.add("hidden");

  // Clear payment-specific fields
  document.getElementById("momoRef").value = "";
  document.getElementById("momoPIN").value = "";
  document.getElementById("bankReceipt").value = "";

  // Show selected section
  if (payment === "Mobile Money") {
    momoSection.classList.remove("hidden");
  } else if (payment === "Bank Transfer") {
    bankSection.classList.remove("hidden");
  } else if (payment === "Cash on Delivery") {
    cashSection.classList.remove("hidden");
  }
});

document.getElementById("checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const payment = document.getElementById("paymentMethod").value.trim();
  const notes = document.getElementById("specialNotes").value.trim();

  if (!name || !phone || !address || !payment) {
    alert("Please fill in all required fields.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // Validate payment-specific fields
  if (payment === "Mobile Money") {
    const momoRef = document.getElementById("momoRef").value.trim();
    const momoPIN = document.getElementById("momoPIN").value.trim();
    if (!momoRef || !momoPIN) {
      alert("Please enter your MoMo reference and PIN.");
      return;
    }
    if (momoPIN.length !== 4 || isNaN(momoPIN)) {
      alert("MoMo PIN must be 4 digits.");
      return;
    }
  } else if (payment === "Bank Transfer") {
    const bankReceipt = document.getElementById("bankReceipt").value.trim();
    if (!bankReceipt) {
      alert("Please enter your bank receipt reference.");
      return;
    }
  }

  const orderId = generateOrderId();
  const lines = cart.map((item) => `${item.name} x ${item.qty} = ${formatGHS(item.price * item.qty)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  let paymentInfo = `Payment Method: ${payment}`;
  if (payment === "Mobile Money") {
    const momoRef = document.getElementById("momoRef").value.trim();
    paymentInfo += `%0AMTN Number: ${paymentDetails.momo.number}%0AMoMo Reference: ${momoRef}`;
  } else if (payment === "Bank Transfer") {
    const bankReceipt = document.getElementById("bankReceipt").value.trim();
    paymentInfo += `%0A${paymentDetails.bank.name}: ${paymentDetails.bank.accountNumber}%0AReceipt Reference: ${bankReceipt}`;
  }
  
  const message = `*NEW ORDER - DS TORKS VENTURES*%0AOrder ID: ${orderId}%0A%0A*Customer Details:*%0AName: ${name}%0APhone: ${phone}%0AAddress: ${address}%0A%0A*Payment:*%0A${paymentInfo}%0A${notes ? `%0A*Special Notes:*%0A${notes}` : ""}%0A%0A*Order Items:*%0A${lines.join("%0A")}%0A%0A*Order Total: ${formatGHS(total)}*`;

  const url = `https://wa.me/${businessPhone}?text=${message}`;
  window.open(url, "_blank");

  cart.length = 0;
  renderCart();
  document.getElementById("checkoutModal").classList.remove("open");
  document.getElementById("checkoutForm").reset();
  alert(`Order ${orderId} sent! Please wait for confirmation from DS TORKS VENTURES.`);
});

document.getElementById("checkoutModal").addEventListener("click", (event) => {
  if (event.target.id === "checkoutModal") {
    document.getElementById("checkoutModal").classList.remove("open");
  }
});

// Product Details Functions
function showProductDetails(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const stockStatus = product.stock > 20 ? "available" : product.stock > 0 ? "low" : "unavailable";
  const stockClass = `stock-${stockStatus}`;
  const stockText = 
    product.stock > 20 ? `${product.stock} in stock` : 
    product.stock > 0 ? `Only ${product.stock} left!` : 
    "Out of stock";

  document.getElementById("productModalTitle").textContent = product.name;
  document.getElementById("productModalBody").innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-detail-image"
         onerror="this.onerror=null;this.src='${categoryFallbackImages[product.category] || "images/hero-bg.svg"}'" />
    <div class="product-detail-info">
      <h3>${product.name}</h3>
      <p class="product-detail-category">${product.category}</p>
      <p class="product-detail-price">${formatGHS(product.price)}</p>
      <div class="${stockClass} product-detail-stock">${stockText}</div>
    </div>
    <div>
      <h4>Product Details</h4>
      <p>${product.description}</p>
    </div>
    <div class="quantity-selector">
      <button type="button" class="qty-decrease" data-id="${product.id}">−</button>
      <input type="number" id="qty-input-${product.id}" min="1" max="${product.stock}" value="1" readonly />
      <button type="button" class="qty-increase" data-id="${product.id}">+</button>
    </div>
    <button class="checkout-btn" type="button" id="addToCartBtn" data-id="${product.id}" ${product.stock === 0 ? "disabled" : ""}>
      ${product.stock === 0 ? "Out of Stock" : "Add to Cart"}
    </button>
  `;

  // Add event listeners for quantity buttons
  const qtyInput = document.getElementById(`qty-input-${product.id}`);
  const qtyDecreaseBtn = document.querySelector(`.qty-decrease[data-id="${product.id}"]`);
  const qtyIncreaseBtn = document.querySelector(`.qty-increase[data-id="${product.id}"]`);
  
  if (qtyDecreaseBtn && qtyIncreaseBtn) {
    qtyDecreaseBtn.addEventListener("click", () => {
      if (qtyInput.value > 1) qtyInput.value = Number(qtyInput.value) - 1;
    });
    qtyIncreaseBtn.addEventListener("click", () => {
      if (qtyInput.value < product.stock) qtyInput.value = Number(qtyInput.value) + 1;
    });
  }

  // Add to cart button
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const qty = Number(qtyInput.value);
    for (let i = 0; i < qty; i++) {
      addToCart(product.id);
    }
    document.getElementById("productModal").classList.remove("open");
  });

  document.getElementById("productModal").classList.add("open");
}

// Registration Functions
function loadCustomerProfile() {
  const saved = localStorage.getItem("customerProfile");
  return saved ? JSON.parse(saved) : null;
}

function saveCustomerProfile(profile) {
  localStorage.setItem("customerProfile", JSON.stringify(profile));
}

document.getElementById("registerBtn").addEventListener("click", () => {
  const profile = loadCustomerProfile();
  if (profile) {
    alert(`Welcome back, ${profile.fullName}! Your profile is loaded.`);
    autofillCheckout(profile);
  } else {
    document.getElementById("registrationModal").classList.add("open");
  }
});

document.getElementById("closeRegistration").addEventListener("click", () => {
  document.getElementById("registrationModal").classList.remove("open");
});

document.getElementById("registrationForm").addEventListener("submit", (event) => {
  event.preventDefault();
  
  const profile = {
    fullName: document.getElementById("regFullName").value,
    email: document.getElementById("regEmail").value,
    phone: document.getElementById("regPhone").value,
    address: document.getElementById("regAddress").value,
    business: document.getElementById("regBusiness").value,
  };

  if (!profile.fullName || !profile.email || !profile.phone) {
    alert("Please fill in all required fields.");
    return;
  }

  saveCustomerProfile(profile);
  document.getElementById("registrationModal").classList.remove("open");
  alert(`Welcome, ${profile.fullName}! Your account has been created successfully.`);
  autofillCheckout(profile);
  document.getElementById("registrationForm").reset();
});

function autofillCheckout(profile) {
  document.getElementById("customerName").value = profile.fullName || "";
  document.getElementById("customerPhone").value = profile.phone || "";
  document.getElementById("customerAddress").value = profile.address || "";
}

document.getElementById("closeProduct").addEventListener("click", () => {
  document.getElementById("productModal").classList.remove("open");
});

document.getElementById("productModal").addEventListener("click", (event) => {
  if (event.target.id === "productModal") {
    document.getElementById("productModal").classList.remove("open");
  }
});

document.getElementById("registrationModal").addEventListener("click", (event) => {
  if (event.target.id === "registrationModal") {
    document.getElementById("registrationModal").classList.remove("open");
  }
});

// Payment Details Modal
const paymentDetailsBtn = document.getElementById("paymentDetailsBtn");
const paymentDetailsModal = document.getElementById("paymentDetailsModal");
const closePaymentDetails = document.getElementById("closePaymentDetails");

if (paymentDetailsBtn && paymentDetailsModal && closePaymentDetails) {
  paymentDetailsBtn.addEventListener("click", () => {
    paymentDetailsModal.classList.add("open");
    paymentDetailsModal.setAttribute("aria-hidden", "false");
  });

  closePaymentDetails.addEventListener("click", () => {
    paymentDetailsModal.classList.remove("open");
    paymentDetailsModal.setAttribute("aria-hidden", "true");
  });

  paymentDetailsModal.addEventListener("click", (event) => {
    if (event.target === paymentDetailsModal) {
      paymentDetailsModal.classList.remove("open");
      paymentDetailsModal.setAttribute("aria-hidden", "true");
    }
  });
}

// Escape key to close modals
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.getElementById("checkoutModal")?.classList.remove("open");
    document.getElementById("productModal")?.classList.remove("open");
    document.getElementById("registrationModal")?.classList.remove("open");
    if (paymentDetailsModal) {
      paymentDetailsModal.classList.remove("open");
      paymentDetailsModal.setAttribute("aria-hidden", "true");
    }
  }
});

// Category Filtering
function filterByCategory(category) {
  currentFilter = category;
  renderProducts();
  
  // Update category buttons active state
  document.querySelectorAll(".category").forEach((cat) => {
    if (cat.textContent.trim() === category) {
      cat.classList.add("active");
    } else {
      cat.classList.remove("active");
    }
  });
  
  // Scroll to shop section
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

function clearCategoryFilter() {
  currentFilter = null;
  renderProducts();
  
  // Remove active state from all categories
  document.querySelectorAll(".category").forEach((cat) => {
    cat.classList.remove("active");
  });
}

// Add click handlers to category cards
document.querySelectorAll(".category").forEach((category) => {
  category.addEventListener("click", () => {
    filterByCategory(category.textContent.trim());
  });
  
  category.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      filterByCategory(category.textContent.trim());
    }
  });
});

// Update Clear Cart button to also clear filter
const clearCartBtn = document.getElementById("clearCart");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    clearCategoryFilter();
  });
}

renderProducts();
renderCart();
renderOpsPanel();
updateWhatsAppLinks();

// Load customer profile if exists
const savedProfile = loadCustomerProfile();
if (savedProfile) {
  autofillCheckout(savedProfile);
}
