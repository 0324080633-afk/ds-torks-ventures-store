require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const { createAuthorizationRequest, verifyAuthorization, getPaymentByReference } = require("./server/services/paymentGateway");
const db = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 3000);

const allowedOrigins = new Set([
  "http://localhost:3000", "http://127.0.0.1:3000",
  "http://localhost:5500", "http://127.0.0.1:5500",
]);

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "img-src": ["'self'", "data:", "https:"],
      "connect-src": ["'self'", "http://localhost:3000"],
      "frame-src": ["'self'", "https://pagead2.googlesyndication.com"],
    },
  },
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  return next();
});

app.use(express.json({ limit: "1mb" }));

// Health
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ds-torks-api", provider: (process.env.PAYMENT_GATEWAY_PROVIDER || "mock").toLowerCase(), date: new Date().toISOString() });
});

// Payment endpoints
app.post("/api/payments/authorization/request", async (req, res) => {
  try {
    const { paymentMethod, phone, amount, customer, metadata } = req.body || {};
    if (!paymentMethod || !phone || !amount) return res.status(400).json({ ok: false, error: "paymentMethod, phone, and amount are required." });
    const result = await createAuthorizationRequest({ paymentMethod, phone, amount, customer, metadata, currency: process.env.PAYMENT_CURRENCY || "GHS" });
    return res.status(200).json({ ok: true, ...result });
  } catch (error) { return res.status(400).json({ ok: false, error: error.message || "Failed to create authorization request." }); }
});

app.post("/api/payments/authorization/verify", async (req, res) => {
  try {
    const { reference, authCode } = req.body || {};
    if (!reference) return res.status(400).json({ ok: false, error: "reference is required." });
    const result = await verifyAuthorization({ reference, authCode });
    return res.status(200).json({ ok: true, ...result });
  } catch (error) { return res.status(400).json({ ok: false, error: error.message || "Failed to verify authorization." }); }
});

app.get("/api/payments/:reference", (req, res) => {
  const payment = getPaymentByReference(req.params.reference);
  if (!payment) return res.status(404).json({ ok: false, error: "Payment not found." });
  return res.json({ ok: true, payment });
});

// Customers
app.post("/api/customers", (req, res) => {
  try {
    const { fullName, email, phone, address, business } = req.body || {};
    if (!fullName || !phone) return res.status(400).json({ success: false, error: "fullName and phone are required." });
    const customerId = db.upsertCustomer({ full_name: fullName, email: email || null, phone, address: address || null, business_name: business || null });
    res.json({ success: true, customer: db.getCustomerById.get(customerId) });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get("/api/customers/lookup", (req, res) => {
  const { email, phone } = req.query;
  if (!email && !phone) return res.status(400).json({ success: false, error: "email or phone query parameter is required." });
  let customer = null;
  if (email) customer = db.getCustomerByEmail.get(email);
  if (!customer && phone) customer = db.getCustomerByPhone.get(phone);
  if (!customer) return res.status(404).json({ success: false, error: "Customer not found." });
  res.json({ success: true, customer });
});

// Products
app.get("/api/products", (_req, res) => {
  try { res.json({ success: true, count: db.getAllProducts().length, products: db.getAllProducts() }); }
  catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get("/api/products/:id", (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: "Product not found." });
    res.json({ success: true, product });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post("/api/products/sync", (req, res) => {
  try {
    const { products } = req.body || {};
    if (!Array.isArray(products) || !products.length) return res.status(400).json({ success: false, error: "products array is required." });
    db.syncProducts(products);
    res.json({ success: true, message: `Synced ${products.length} products.`, count: db.getAllProducts().length });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post("/api/products/deduct-stock", (req, res) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items)) return res.status(400).json({ success: false, error: "items array is required." });
    const deductions = [];
    for (const item of items) {
      if (!item.productId || !item.qty) continue;
      const result = db.updateProductStock.run(item.qty, item.productId, item.qty);
      deductions.push({ productId: item.productId, deducted: result.changes > 0 });
    }
    res.json({ success: true, deductions });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// Contact
app.post("/api/contact", (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !message) return res.status(400).json({ success: false, error: "Name and message are required." });
    const saved = db.saveContactMessage({ name, email: email || null, phone: phone || null, message });
    res.json({ success: true, message: "Message received!", id: saved.id });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// Orders
app.post("/api/orders", (req, res) => {
  try {
    const { customer, items, totalAmount, paymentReference, deliveryAddress, paymentMethod } = req.body || {};
    if (!customer || !items || !items.length) return res.status(400).json({ success: false, error: "Customer and items are required." });
    if (!deliveryAddress || !paymentMethod) return res.status(400).json({ success: false, error: "deliveryAddress and paymentMethod are required." });

    const customerId = db.upsertCustomer({ full_name: customer.name || "Guest", email: customer.email || null, phone: customer.phone || "", address: deliveryAddress || null, business_name: customer.business || null });

    const now = new Date();
    const orderNumber = `DSTV-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;

    const order = db.createOrder(
      { orderNumber, customerId, customerName: customer.name || "Guest", customerPhone: customer.phone || "", customerEmail: customer.email || null, deliveryAddress, paymentMethod, paymentReference: paymentReference || null, specialNotes: customer.notes || null, totalAmount: totalAmount || 0 },
      items.map(i => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty || 1 }))
    );

    res.json({ success: true, order, items: db.getOrderItems(order.id) });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get("/api/orders/:orderNumber", (req, res) => {
  try {
    const order = db.getOrderByNumber(req.params.orderNumber);
    if (!order) return res.status(404).json({ success: false, error: "Order not found." });
    res.json({ success: true, order, items: db.getOrderItems(order.id) });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// Admin auth
function adminAuth(req, res, next) {
  const token = req.headers["x-admin-token"] || "";
  const validToken = process.env.ADMIN_SECRET_TOKEN || "dstorks-local-admin";
  if (token !== validToken) return res.status(401).json({ success: false, error: "Unauthorized." });
  return next();
}

app.get("/api/admin/stats", adminAuth, (_req, res) => {
  try {
    const orderStats = db.getOrderStats.get();
    const todayStats = db.getTodayStats() || {};
    const productStats = db.getProductStats() || {};
    const todaySales = db.getTodaySalesByProduct() || [];
    const recentOrders = db.getAllOrders().slice(0, 10);
    const recentMessages = db.getAllContactMessages().slice(0, 10);
    const allProducts = db.getAllProducts();
    res.json({
      success: true,
      stats: {
        totalOrders: orderStats.total_orders || 0,
        totalRevenue: orderStats.total_revenue || 0,
        deliveredOrders: orderStats.delivered_count || 0,
        pendingOrders: orderStats.pending_count || 0,
        cancelledOrders: orderStats.cancelled_count || 0,
        unreadMessages: recentMessages.length,
        activeProducts: allProducts.length,
        todayOrders: todayStats.total_orders || 0,
        todayRevenue: todayStats.total_revenue || 0,
        todayUnitsSold: todaySales.reduce((sum, p) => sum + Number(p.units_sold), 0),
        totalStock: productStats.total_stock || 0,
        lowStockCount: productStats.low_stock_count || 0,
        outOfStockCount: productStats.out_of_stock_count || 0,
      },
      todaySales, recentOrders, recentMessages,
    });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get("/api/admin/orders", adminAuth, (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const orders = db.db.prepare(`SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset);
    res.json({ success: true, page, limit, orders });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.put("/api/admin/orders/:id/status", adminAuth, (req, res) => {
  try {
    const { status } = req.body || {};
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) return res.status(400).json({ success: false, error: "Invalid status." });
    const result = db.updateOrderStatus.run(status, req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: "Order not found." });
    res.json({ success: true, order: db.getOrderById.get(req.params.id) });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get("/api/admin/messages", adminAuth, (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const messages = db.db.prepare(`SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset);
    const total = db.db.prepare(`SELECT COUNT(*) as count FROM contact_messages`).get().count;
    res.json({ success: true, page, limit, total, messages });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get("/api/admin/orders/:id", adminAuth, (req, res) => {
  try {
    const order = db.getOrderById.get(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found." });
    res.json({ success: true, order, items: db.getOrderItems(order.id) });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get("/api/admin/products", adminAuth, (req, res) => {
  try { res.json({ success: true, products: db.getAllProducts(), stats: db.getProductStats() }); }
  catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post("/api/admin/products", adminAuth, (req, res) => {
  try {
    const { name, category, price, stock, description, image_url } = req.body || {};
    if (!name || !price) return res.status(400).json({ success: false, error: "name and price are required." });
    const product = db.addProduct({ name: String(name).trim(), category: String(category || "General").trim(), price: Number(price), stock: Number(stock || 0), description: String(description || "").trim(), image_url: String(image_url || "").trim() });
    res.json({ success: true, product });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.put("/api/admin/products/:id", adminAuth, (req, res) => {
  try {
    const { name, category, price, stock, description, image_url } = req.body || {};
    if (!name || !price) return res.status(400).json({ success: false, error: "name and price are required." });
    const product = db.updateProduct({ id: Number(req.params.id), name: String(name).trim(), category: String(category || "General").trim(), price: Number(price), stock: Number(stock || 0), description: String(description || "").trim(), image_url: String(image_url || "").trim() });
    if (!product) return res.status(404).json({ success: false, error: "Product not found." });
    res.json({ success: true, product });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.delete("/api/admin/products/:id", adminAuth, (req, res) => {
  try {
    const result = db.deactivateProduct.run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: "Product not found." });
    res.json({ success: true, message: "Product removed." });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// Static files
app.use(express.static(path.resolve(__dirname)));

// HTML routes
const HTML_FILES = { "/": "index.html", "/shop": "shop.html", "/about": "about.html", "/contact": "contact.html", "/admin": "admin.html", "/monetize-admin": "monetize-admin.html", "/profile": "profile.html", "/profile.html": "profile.html" };
for (const [route, file] of Object.entries(HTML_FILES)) {
  app.get(route, (_req, res) => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) res.sendFile(filePath);
    else res.status(404).send(`<p>${file} not found.</p>`);
  });
}

// Error handler
app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ ok: false, error: err.message || "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`\nDS TORKS VENTURES running on http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
  console.log(`Payment gateway: ${process.env.PAYMENT_GATEWAY_PROVIDER || "mock"}\n`);
});