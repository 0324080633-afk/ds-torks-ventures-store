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
  { id: 18, name: "SANKOFA", category: "Special Feed", price: 372, stock: 13, description: "Multi-species supplement feed. Supports growth in various poultry and livestock types.", image: "https://www.facebook.com/groups/351437262561935/posts/1473393707032946/" },
  { id: 19, name: "GALDUS", category: "Special Feed", price: 397, stock: 15, description: "Specialized nutrient booster. Enhances performance and immune response across animal types.", image: "https://www.koudijs.com.gh/siteassets/products/large-bags_pigs_koudijs_romelko-general_gaszak.jpg?format=webp&mode=max&width=2048&height=1200" }
];

const cart = [];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartWhatsappOrder = document.getElementById("cartWhatsappOrder");

const businessPhone = "233537840502";
let currentFilter = null; // Track current category filter

const feedingGuides = {
  1: {
    target: "Layer chickens",
    ageStage: "18 weeks and above (early laying)",
    schedule: "Feed 2 times daily with clean water all day",
    rate: "Approx. 110-120g per bird per day",
    tips: "Best for birds just entering lay. Keep calcium supplements available.",
  },
  2: {
    target: "Layer chickens",
    ageStage: "Peak laying phase",
    schedule: "Feed morning and evening consistently",
    rate: "Approx. 115-125g per bird per day",
    tips: "Use during stable production period for shell quality and egg volume.",
  },
  3: {
    target: "Growing pullets",
    ageStage: "8-14 weeks",
    schedule: "2-3 feedings per day",
    rate: "Approx. 70-95g per bird per day",
    tips: "Do not mix with layer feed too early to avoid premature laying.",
  },
  4: {
    target: "Day-old chicks",
    ageStage: "0-4 weeks",
    schedule: "Small frequent feedings throughout the day",
    rate: "Approx. 20-55g per chick per day",
    tips: "Spread feed on clean paper trays in first days to encourage intake.",
  },
  5: {
    target: "Broiler chicks",
    ageStage: "0-2 weeks",
    schedule: "Ad-lib feeding (always available)",
    rate: "Approx. 25-70g per bird per day",
    tips: "Keep brooder warm and dry for best starter response.",
  },
  6: {
    target: "Broilers",
    ageStage: "4 weeks to market",
    schedule: "Ad-lib feeding until sale",
    rate: "Approx. 130-180g per bird per day",
    tips: "Use in final growth stage for weight gain before market.",
  },
  7: {
    target: "Broilers",
    ageStage: "2-4 weeks",
    schedule: "Ad-lib feeding",
    rate: "Approx. 70-130g per bird per day",
    tips: "Transition gradually from starter to grower over 2-3 days.",
  },
  8: {
    target: "Catfish",
    ageStage: "Juvenile to grow-out",
    schedule: "Feed 2-3 times daily",
    rate: "2-4% of total biomass per day",
    tips: "Use where fish can consume within 10-15 minutes to reduce waste.",
  },
  9: {
    target: "Catfish",
    ageStage: "Large growers and adults",
    schedule: "Feed 2 times daily",
    rate: "1.5-3% of total biomass per day",
    tips: "Prefer evening feeding in hot weather for better feed response.",
  },
  10: {
    target: "Poultry (concentrate mix)",
    ageStage: "As formulation requires",
    schedule: "Mix with maize or local grains before feeding",
    rate: "Use according to formulated ration percentage",
    tips: "Do not feed straight. Must be diluted in a complete ration mix.",
  },
  11: {
    target: "Poultry (premix)",
    ageStage: "All growth stages with proper formulation",
    schedule: "Add to feed during ration preparation",
    rate: "Low inclusion only, based on mixing guide",
    tips: "Do not over-dose. Use precise weighing for premix safety.",
  },
  12: {
    target: "Piglets",
    ageStage: "2-8 weeks",
    schedule: "Feed 3-4 small meals daily",
    rate: "Start low then increase gradually",
    tips: "Introduce from creep area while piglets still suckling.",
  },
  13: {
    target: "Growing pigs",
    ageStage: "8-16 weeks",
    schedule: "Feed 2-3 times daily",
    rate: "Approx. 1.2-2.0kg per pig per day",
    tips: "Adjust quantity to body condition and growth target.",
  },
  14: {
    target: "Finishing pigs",
    ageStage: "16 weeks to market",
    schedule: "Feed 2 times daily",
    rate: "Approx. 2.0-3.0kg per pig per day",
    tips: "Use in final phase to improve market weight and carcass quality.",
  },
  15: {
    target: "Pullets",
    ageStage: "14-18 weeks",
    schedule: "Feed 2 times daily",
    rate: "Approx. 95-105g per bird per day",
    tips: "Supports frame development before moving to layer feed.",
  },
  16: {
    target: "Pullets",
    ageStage: "2-4 weeks before lay",
    schedule: "Feed 2 times daily",
    rate: "Approx. 100-110g per bird per day",
    tips: "Shift to layer ration once first eggs appear.",
  },
  17: {
    target: "Catfish",
    ageStage: "Fry and small fingerlings",
    schedule: "Feed 3-4 times daily in small amounts",
    rate: "4-8% of total biomass per day",
    tips: "Frequent feeding supports early survival and uniform growth.",
  },
  18: {
    target: "Multi-species supplement",
    ageStage: "Use as advised for target species",
    schedule: "Blend with base ration",
    rate: "Follow farm nutritionist or label guide",
    tips: "Works best as supportive supplement, not sole feed.",
  },
  19: {
    target: "Multi-species performance booster",
    ageStage: "Performance or recovery periods",
    schedule: "Use with balanced base feed",
    rate: "Follow product inclusion guideline",
    tips: "Combine with good water management and hygiene for best results.",
  },
};

function getFeedingGuide(productId) {
  return feedingGuides[productId] || {
    target: "Livestock",
    ageStage: "Follow stage-appropriate feeding",
    schedule: "Feed regularly with clean water available",
    rate: "Adjust by body weight and farm practice",
    tips: "Contact support for a custom farm feeding plan.",
  };
}

function getApiBase() {
  const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const isBackendPort = window.location.port === "3000";

  if (isLocalHost && !isBackendPort) {
    return "http://localhost:3000";
  }

  return "";
}

function buildApiUrl(path) {
  return `${getApiBase()}${path}`;
}

async function parseApiResponse(response) {
  const raw = await response.text();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    throw new Error("Payment service returned an invalid response. Ensure backend server is running on port 3000.");
  }
}

function normalizeGhanaPhoneInput(raw) {
  const input = String(raw || "").trim();
  if (!input) {
    return null;
  }

  const compact = input.replace(/[\s()-]/g, "");

  if (/^\+233\d{9}$/.test(compact)) {
    return compact;
  }
  if (/^233\d{9}$/.test(compact)) {
    return `+${compact}`;
  }
  if (/^0\d{9}$/.test(compact)) {
    return `+233${compact.slice(1)}`;
  }
  if (/^\d{9}$/.test(compact)) {
    return `+233${compact}`;
  }

  return null;
}

function updateMomoOtpDestinationPreview() {
  const preview = document.getElementById("momoOtpDestination");
  if (!preview) {
    return;
  }

  const payment = document.getElementById("paymentMethod")?.value || "";
  if (payment !== "Mobile Money") {
    preview.textContent = "Authorization code is sent to the payer's phone for digital payments.";
    return;
  }

  const momoRaw = document.getElementById("momoPhone")?.value || "";
  const customerRaw = document.getElementById("customerPhone")?.value || "";
  const normalized = normalizeGhanaPhoneInput(momoRaw || customerRaw);

  if (!normalized) {
    preview.textContent = "Enter a valid MoMo number (for example: +233531234567).";
    return;
  }

  preview.textContent = `Authorization code will be sent to: ${normalized}`;
}


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
  cartWhatsappOrder.href = url;
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
        <img class="product-thumb" src="${product.image}" alt="${product.name}" loading="lazy" />
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
  const momoEl = document.getElementById("momoPhone");
  const customerPhoneInput = document.getElementById("customerPhone");

  // Hide all sections
  momoSection.classList.add("hidden");
  bankSection.classList.add("hidden");
  cashSection.classList.add("hidden");

  // Clear payment-specific fields
  document.getElementById("bankReceipt").value = "";

  // Show selected section
  if (payment === "Mobile Money") {
    if (momoEl && !momoEl.value.trim() && customerPhoneInput?.value.trim()) {
      momoEl.value = customerPhoneInput.value.trim();
    }
    momoSection.classList.remove("hidden");
  } else if (payment === "Bank Transfer") {
    bankSection.classList.remove("hidden");
  } else if (payment === "Cash on Delivery") {
    cashSection.classList.remove("hidden");
  }

  updateMomoOtpDestinationPreview();
});

document.getElementById("customerPhone")?.addEventListener("input", () => {
  const payment = document.getElementById("paymentMethod")?.value || "";
  const momoEl = document.getElementById("momoPhone");
  const customerPhoneInput = document.getElementById("customerPhone");

  if (payment === "Mobile Money" && momoEl && !momoEl.value.trim() && customerPhoneInput?.value.trim()) {
    momoEl.value = customerPhoneInput.value.trim();
  }

  updateMomoOtpDestinationPreview();
});

document.getElementById("momoPhone")?.addEventListener("input", () => {
  updateMomoOtpDestinationPreview();
});

let pendingPaymentReference = null;

document.getElementById("checkoutForm").addEventListener("submit", async (event) => {
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

  const normalizedCustomerPhone = normalizeGhanaPhoneInput(phone);
  if (!normalizedCustomerPhone) {
    alert("Enter a valid customer phone number in Ghana format (for example: +233531234567).");
    return;
  }
  document.getElementById("customerPhone").value = normalizedCustomerPhone;

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let finalPhone = normalizedCustomerPhone;
  if (payment === "Mobile Money") {
    const momoPhone = document.getElementById("momoPhone")?.value.trim();
    if (!momoPhone) {
      alert("Please enter your MoMo Phone number.");
      return;
    }
    const normalizedMomoPhone = normalizeGhanaPhoneInput(momoPhone);
    if (!normalizedMomoPhone) {
      alert("Enter a valid MoMo phone number in Ghana format (for example: +233531234567).");
      return;
    }
    document.getElementById("momoPhone").value = normalizedMomoPhone;
    finalPhone = normalizedMomoPhone;
  } else if (payment === "Bank Transfer") {
    const bankReceipt = document.getElementById("bankReceipt").value.trim();
    if (!bankReceipt) {
      alert("Please enter your bank receipt reference.");
      return;
    }
  }

if (payment === "Cash on Delivery") {
    const order = await saveOrderToDatabase(`COD-${generateOrderId()}`);
    if (order) {
      alert(`✅ Payment Successful!\n\nOrder Number: ${order.order_number}\n\nWe will contact you shortly to confirm delivery. Thank you for shopping with DS TORKS VENTURES!`);
    } else {
      alert("⚠️ Order placed but could not be saved to the system. Please contact us directly via WhatsApp.");
    }
    resetCartAndCheckout();
    return;
  }

  const orderId = generateOrderId();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const payload = {
    paymentMethod: payment,
    phone: finalPhone,
    amount: total,
    customer: { name, email: `guest-${orderId.toLowerCase()}@dstorks.local`, phone: normalizedCustomerPhone, address, notes },
    metadata: { items: cart.map(i => i.id) }
  };

  try {
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.textContent = "Processing...";
    submitBtn.disabled = true;

    const response = await fetch(buildApiUrl("/api/payments/authorization/request"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await parseApiResponse(response);

    if (!data || !data.ok) {
      throw new Error((data && data.error) || "Failed to initiate payment. Confirm backend is running on http://localhost:3000.");
    }

    if (data.requiresCode) {
       pendingPaymentReference = data.reference;
       document.getElementById("checkoutModal").classList.remove("open");
       document.getElementById("otpModal").classList.add("open");
    } else if (data.requiresRedirect) {
       window.location.href = data.authorizationUrl;
    } else {
       alert("Payment Successful! Your order has been placed.");
       resetCartAndCheckout();
    }
  } catch (err) {
    alert("Payment Error: " + err.message);
  } finally {
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = "Complete Payment & Order";
      submitBtn.disabled = false;
    }
  }
});

async function saveOrderToDatabase(paymentReference) {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const payment = document.getElementById("paymentMethod").value.trim();
  const notes = document.getElementById("specialNotes").value.trim();
  const email = document.getElementById("regEmail")?.value?.trim() || null;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    // 1. Create order in SQLite
    const orderRes = await fetch(buildApiUrl("/api/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name,
          email,
          phone,
          business: null,
          notes,
        },
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        totalAmount: total,
        paymentReference,
        deliveryAddress: address,
        paymentMethod: payment,
      }),
    });

    const orderData = await orderRes.json();

    if (!orderData.success) {
      throw new Error(orderData.error || "Failed to save order.");
    }

    // 2. Deduct stock for each item
    await fetch(buildApiUrl("/api/products/deduct-stock"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map(i => ({ productId: i.id, qty: i.qty })),
      }),
    });

    return orderData.order;
  } catch (err) {
    console.error("Failed to save order to database:", err.message);
    return null;
  }
}

function resetCartAndCheckout() {
  cart.length = 0;
  renderCart();
  document.getElementById("checkoutModal").classList.remove("open");
  document.getElementById("otpModal")?.classList.remove("open");
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) checkoutForm.reset();
}

const customOtpForm = document.getElementById("otpForm");
if (customOtpForm) {
  customOtpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = document.getElementById("otpCode").value.trim();
    if (!code || !pendingPaymentReference) return;

    try {
      const verifyBtn = document.getElementById("verifyOtpBtn");
      verifyBtn.textContent = "Verifying...";
      verifyBtn.disabled = true;

      const res = await fetch(buildApiUrl("/api/payments/authorization/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: pendingPaymentReference,
          authCode: code
        })
      });

      const data = await parseApiResponse(res);

      if (!data || !data.ok) {
        throw new Error((data && data.error) || "Failed to verify OTP. Confirm backend is reachable.");
      }

if (data.authorized) {
        document.getElementById("otpModal").classList.remove("open");
        const order = await saveOrderToDatabase(pendingPaymentReference);
        if (order) {
          alert(`✅ Payment Successful!\n\nOrder Number: ${order.order_number}\n\nWe will begin processing your order right away. Thank you for choosing DS TORKS VENTURES!`);
        } else {
          alert("⚠️ Payment confirmed but order could not be saved. Please contact us via WhatsApp with your payment reference.");
        }
        resetCartAndCheckout();
      } else {
        alert("Payment not authorized: " + data.message);
      }
    } catch (err) {
      alert("Verification Error: " + err.message);
    } finally {
      const verifyBtn = document.getElementById("verifyOtpBtn");
      if (verifyBtn) {
        verifyBtn.textContent = "Verify Payment";
        verifyBtn.disabled = false;
      }
    }
  });
}

document.getElementById("closeOtp")?.addEventListener("click", () => {
    document.getElementById("otpModal").classList.remove("open");
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
  const guide = getFeedingGuide(product.id);

  const stockStatus = product.stock > 20 ? "available" : product.stock > 0 ? "low" : "unavailable";
  const stockClass = `stock-${stockStatus}`;
  const stockText = 
    product.stock > 20 ? `${product.stock} in stock` : 
    product.stock > 0 ? `Only ${product.stock} left!` : 
    "Out of stock";

  document.getElementById("productModalTitle").textContent = product.name;
  document.getElementById("productModalBody").innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-detail-image" />
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
    <div class="feeding-guide" aria-label="Feeding guide">
      <h4>When and How To Feed</h4>
      <div class="feeding-guide-grid">
        <p><strong>Best For:</strong> ${guide.target}</p>
        <p><strong>Age/Stage:</strong> ${guide.ageStage}</p>
        <p><strong>Feeding Schedule:</strong> ${guide.schedule}</p>
        <p><strong>Recommended Rate:</strong> ${guide.rate}</p>
      </div>
      <p class="feeding-guide-tip"><strong>Practical Tip:</strong> ${guide.tips}</p>
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

// ── Registration & Profile Functions ─────────────────────────────────────────
function loadCustomerProfile() {
  const saved = localStorage.getItem("customerProfile");
  return saved ? JSON.parse(saved) : null;
}

function saveCustomerProfile(profile) {
  localStorage.setItem("customerProfile", JSON.stringify(profile));
}

function updateAccountButton() {
  const profile = loadCustomerProfile();
  const accountBtn = document.getElementById("accountBtn");
  if (!accountBtn) return;
  if (profile) {
    accountBtn.textContent = "My Account";
    accountBtn.style.background = "var(--accent)";
    accountBtn.style.color = "#fff";
  }
}

// My Account button — redirect to profile page
document.getElementById("accountBtn")?.addEventListener("click", () => {
  const profile = loadCustomerProfile();
  if (profile) {
    window.location.href = "profile.html";
  } else {
    window.location.href = "profile.html";
  }
});

document.getElementById("registerBtn").addEventListener("click", () => {
  const profile = loadCustomerProfile();
  if (profile) {
    window.location.href = "profile.html";
  } else {
    document.getElementById("registrationModal").classList.add("open");
  }
});

document.getElementById("closeRegistration").addEventListener("click", () => {
  document.getElementById("registrationModal").classList.remove("open");
});

document.getElementById("registrationForm").addEventListener("submit", async (event) => {
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

  // Save to localStorage for fast UX
  saveCustomerProfile(profile);

  // Also save to SQLite database
  try {
    const normalizedPhone = normalizeGhanaPhoneInput(profile.phone);
    const response = await fetch(buildApiUrl("/api/customers"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: profile.fullName,
        email: profile.email,
        phone: normalizedPhone || profile.phone,
        address: profile.address,
        business: profile.business,
      }),
    });
    const data = await response.json();
    if (!data.success) {
      console.warn("Could not save customer to database:", data.error);
    }
  } catch (_err) {
    console.warn("Could not reach server to save customer profile.");
  }

  document.getElementById("registrationModal").classList.remove("open");
  alert(`✅ Account created for ${profile.fullName}!\n\nYour profile is saved. Click "My Account" to manage your details and view orders.`);
  autofillCheckout(profile);
  document.getElementById("registrationForm").reset();
  updateAccountButton();
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

// Escape key to close modals
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.getElementById("checkoutModal")?.classList.remove("open");
    document.getElementById("productModal")?.classList.remove("open");
    document.getElementById("registrationModal")?.classList.remove("open");
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

// Sync products to SQLite database on page load
async function syncProductsToDatabase() {
  try {
    const response = await fetch(buildApiUrl("/api/products/sync"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    });
    const data = await response.json();
    if (data.success) {
      console.log(`[DB] Synced ${data.count} products to SQLite database.`);
    }
  } catch (_err) {
    // Non-critical — products render from JS array regardless
    console.warn("[DB] Could not sync products to database.");
  }
}

renderProducts();
renderCart();
updateWhatsAppLinks();

// Load customer profile if exists
const savedProfile = loadCustomerProfile();
if (savedProfile) {
  autofillCheckout(savedProfile);
}

// Sync products to database (runs in background, doesn't block rendering)
syncProductsToDatabase();

// Update account button appearance based on saved profile
updateAccountButton();
