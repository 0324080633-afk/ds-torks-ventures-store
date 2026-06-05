const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.resolve(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "dstorks.db");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT,
    business_name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    customer_id INTEGER REFERENCES customers(id),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    special_notes TEXT,
    total_amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal REAL NOT NULL
  );
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const insertCustomer = db.prepare(`INSERT INTO customers (full_name, email, phone, address, business_name) VALUES (@full_name, @email, @phone, @address, @business_name)`);
const getCustomerByEmail = db.prepare(`SELECT * FROM customers WHERE email = ? LIMIT 1`);
const getCustomerByPhone = db.prepare(`SELECT * FROM customers WHERE phone = ? LIMIT 1`);
const getCustomerById = db.prepare(`SELECT * FROM customers WHERE id = ?`);
const updateCustomer = db.prepare(`UPDATE customers SET full_name=@full_name, email=@email, phone=@phone, address=@address, business_name=@business_name WHERE id=@id`);

function upsertCustomer(data) {
  const existing = getCustomerByEmail.get(data.email) || (data.phone ? getCustomerByPhone.get(data.phone) : null);
  if (existing) { updateCustomer.run({ ...data, id: existing.id }); return existing.id; }
  const result = insertCustomer.run(data);
  return result.lastInsertRowid;
}

const insertOrder = db.prepare(`INSERT INTO orders (order_number, customer_id, customer_name, customer_phone, customer_email, delivery_address, payment_method, payment_reference, special_notes, total_amount) VALUES (@order_number, @customer_id, @customer_name, @customer_phone, @customer_email, @delivery_address, @payment_method, @payment_reference, @special_notes, @total_amount)`);
const insertOrderItem = db.prepare(`INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal) VALUES (@order_id, @product_id, @product_name, @price, @quantity, @subtotal)`);
const getOrderByNumber = db.prepare(`SELECT * FROM orders WHERE order_number = ?`);
const getOrderById = db.prepare(`SELECT * FROM orders WHERE id = ?`);
const getOrderItems = db.prepare(`SELECT * FROM order_items WHERE order_id = ?`);
const getAllOrders = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC`);
const updateOrderStatus = db.prepare(`UPDATE orders SET status = ? WHERE id = ?`);
const getOrderStats = db.prepare(`SELECT COUNT(*) AS total_orders, SUM(total_amount) AS total_revenue, SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) AS delivered_count, SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending_count, SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) AS cancelled_count FROM orders`);

function createOrder(orderData, items) {
  const runTransaction = db.transaction(() => {
    const orderResult = insertOrder.run({ order_number: orderData.orderNumber, customer_id: orderData.customerId || null, customer_name: orderData.customerName, customer_phone: orderData.customerPhone, customer_email: orderData.customerEmail || null, delivery_address: orderData.deliveryAddress, payment_method: orderData.paymentMethod, payment_reference: orderData.paymentReference || null, special_notes: orderData.specialNotes || null, total_amount: orderData.totalAmount });
    const orderId = orderResult.lastInsertRowid;
    for (const item of items) insertOrderItem.run({ order_id: orderId, product_id: item.productId, product_name: item.name, price: item.price, quantity: item.qty, subtotal: item.price * item.qty });
    return getOrderById.get(orderId);
  });
  return runTransaction();
}

const insertContactMessage = db.prepare(`INSERT INTO contact_messages (name, email, phone, message) VALUES (@name, @email, @phone, @message)`);
const getAllContactMessages = db.prepare(`SELECT * FROM contact_messages ORDER BY created_at DESC`);
const getContactMessageById = db.prepare(`SELECT * FROM contact_messages WHERE id = ?`);

function saveContactMessage(data) {
  const result = insertContactMessage.run({ name: data.name, email: data.email || null, phone: data.phone || null, message: data.message });
  return getContactMessageById.get(result.lastInsertRowid);
}

const upsertProduct = db.prepare(`INSERT INTO products (id, name, category, price, stock, description, image_url) VALUES (@id, @name, @category, @price, @stock, @description, @image_url) ON CONFLICT(id) DO UPDATE SET name=excluded.name, category=excluded.category, price=excluded.price, stock=excluded.stock, description=excluded.description, image_url=excluded.image_url`);
const getAllProductsStmt = db.prepare(`SELECT * FROM products WHERE is_active=1 ORDER BY category, name`);
const getProductByIdStmt = db.prepare(`SELECT * FROM products WHERE id=? AND is_active=1`);
const getProductsByCategory = db.prepare(`SELECT * FROM products WHERE category=? AND is_active=1 ORDER BY name`);
const deactivateProduct = db.prepare(`UPDATE products SET is_active=0 WHERE id=?`);
const updateProductStock = db.prepare(`UPDATE products SET stock=stock-? WHERE id=? AND stock>=?`);
const addProductStmt = db.prepare(`INSERT INTO products (name, category, price, stock, description, image_url) VALUES (@name, @category, @price, @stock, @description, @image_url)`);
const updateProductStmt = db.prepare(`UPDATE products SET name=@name, category=@category, price=@price, stock=@stock, description=@description, image_url=@image_url WHERE id=@id`);
const getProductStatsStmt = db.prepare(`SELECT COUNT(*) AS total_products, COALESCE(SUM(stock),0) AS total_stock, COALESCE(SUM(CASE WHEN stock<=5 THEN 1 ELSE 0 END),0) AS low_stock_count, COALESCE(SUM(CASE WHEN stock=0 THEN 1 ELSE 0 END),0) AS out_of_stock_count FROM products WHERE is_active=1`);
const getTodayStatsStmt = db.prepare(`SELECT COUNT(*) AS total_orders, COALESCE(SUM(total_amount),0) AS total_revenue, COALESCE(SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END),0) AS pending_count, COALESCE(SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END),0) AS delivered_count, COALESCE(SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END),0) AS cancelled_count FROM orders WHERE date(created_at)=date('now','localtime')`);
const getProductSalesStmt = db.prepare(`SELECT oi.product_name, SUM(oi.quantity) AS units_sold, SUM(oi.subtotal) AS revenue FROM order_items oi JOIN orders o ON oi.order_id=o.id WHERE date(o.created_at)=date('now','localtime') AND o.status NOT IN ('cancelled') GROUP BY oi.product_name ORDER BY units_sold DESC`);

function syncProducts(productList) {
  db.transaction(() => { for (const p of productList) upsertProduct.run({ id: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock, description: p.description || "", image_url: p.image || "" }); })();
}

function addProduct(data) { const r = addProductStmt.run({ name: data.name, category: data.category || "General", price: data.price || 0, stock: data.stock || 0, description: data.description || "", image_url: data.image_url || "" }); return getProductByIdStmt.get(r.lastInsertRowid); }
function updateProduct(data) { const r = updateProductStmt.run(data); return r.changes > 0 ? getProductByIdStmt.get(data.id) : null; }
function getProductStats() { return getProductStatsStmt.get(); }
function getTodayStats() { return getTodayStatsStmt.get(); }
function getTodaySalesByProduct() { return getProductSalesStmt.all(); }
function getAllProducts() { return getAllProductsStmt.all(); }
function getProductById(id) { return getProductByIdStmt.get(id); }

module.exports = {
  db,
  upsertCustomer, getCustomerByEmail, getCustomerByPhone, getCustomerById, updateCustomer,
  createOrder, getOrderByNumber, getOrderById, getOrderItems, getAllOrders, updateOrderStatus, getOrderStats,
  saveContactMessage, getAllContactMessages,
  syncProducts, getAllProducts, getProductById, getProductsByCategory, deactivateProduct, updateProductStock,
  getTodayStats, getTodaySalesByProduct,
  addProduct, updateProduct, getProductStats,
};