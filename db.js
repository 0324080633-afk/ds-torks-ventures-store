require('dotenv').config();
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'store.db');
const isPg = !!process.env.DATABASE_URL;

let db;
let pool;

if (isPg) {
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });
}

// Helper: execute run query (INSERT, UPDATE, DELETE)
async function runQuery(sql, params = []) {
  if (isPg) {
    let index = 1;
    const pgSql = sql.replace(/\?/g, () => `$${index++}`);
    let finalSql = pgSql;
    if (pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
      finalSql = `${pgSql} RETURNING id`;
    }
    const res = await pool.query(finalSql, params);
    return {
      changes: res.rowCount,
      lastInsertRowid: res.rows[0]?.id || null
    };
  } else {
    const result = db.prepare(sql).run(...params);
    return {
      changes: result.changes,
      lastInsertRowid: result.lastInsertRowid
    };
  }
}

// Helper: get one row (SELECT)
async function getQuery(sql, params = []) {
  if (isPg) {
    let index = 1;
    const pgSql = sql.replace(/\?/g, () => `$${index++}`);
    const res = await pool.query(pgSql, params);
    return res.rows[0] || null;
  } else {
    return db.prepare(sql).get(...params);
  }
}

// Helper: get all rows (SELECT)
async function allQuery(sql, params = []) {
  if (isPg) {
    let index = 1;
    const pgSql = sql.replace(/\?/g, () => `$${index++}`);
    const res = await pool.query(pgSql, params);
    return res.rows;
  } else {
    return db.prepare(sql).all(...params);
  }
}

// Initialize database
async function initializeDatabase() {
  if (isPg) {
    // Create PostgreSQL tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES customers(id),
        items TEXT NOT NULL,
        total REAL NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        transaction_id VARCHAR(255),
        delivery_address TEXT,
        payment_method VARCHAR(50) DEFAULT 'mtn',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        category VARCHAR(255),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    const countRes = await pool.query('SELECT COUNT(*) as count FROM products');
    const count = parseInt(countRes.rows[0].count);
    if (count === 0) {
      await seedProducts();
    }
    console.log('Database (PostgreSQL) initialized.');
  } else {
    // SQLite initialization
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    db = new DatabaseSync(dbPath);
    db.exec('PRAGMA journal_mode = WAL');
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        items TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_status TEXT DEFAULT 'pending',
        transaction_id TEXT,
        delivery_address TEXT,
        payment_method TEXT DEFAULT 'mtn',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );
      
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER DEFAULT 0,
        category TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
    if (count.count === 0) {
      await seedProducts();
    }
    console.log('Database (SQLite) initialized at:', dbPath);
  }
}

// Seed initial products
async function seedProducts() {
  const products = [
    { name: 'LAYER 1', description: 'Complete layer crumbled feed designed for laying hens from week 19 to 40. Contains optimal calcium levels and essential minerals for peak egg production and solid shell structures.', price: 361, stock: 50, category: 'Layers Feed' },
    { name: 'LAYER 2', description: 'High-quality complete feed for hens from week 41 onwards. Formulated to maintain steady egg production rates and protect eggshell quality during the late laying phase.', price: 356, stock: 45, category: 'Layers Feed' },
    { name: 'GROWER MASH', description: 'Optimal grower feed for pullets from ages 9 to 18 weeks. Promotes uniform skeletal development, robust immunity, and prepares pullets for a successful laying cycle.', price: 381, stock: 40, category: 'Grower Feed' },
    { name: 'CHICK STARTER CRUMBLE', description: 'Premium crumble starter feed for day-old chicks up to 4 weeks. Easy to digest and rich in vitamins to boost early gut health and immunity.', price: 421, stock: 35, category: 'Broiler Feed' },
    { name: 'BROILER STARTER', description: 'Complete broiler starter feed designed for chicks up to 3 weeks. High protein concentration supports rapid early bone development and weight gain.', price: 448, stock: 30, category: 'Broiler Feed' },
    { name: 'BROILER FINISHER', description: 'High-performance finisher feed for broilers from week 5 to market age. Promotes maximum final weight gain, gut health, and excellent meat yield quality.', price: 437, stock: 30, category: 'Broiler Feed' },
    { name: 'BROILER GROWER', description: 'Optimized broiler grower crumble for chickens aged 3 to 5 weeks. Supports efficient feed conversion ratios and muscle tissue development.', price: 442, stock: 35, category: 'Broiler Feed' },
    { name: 'CATFISH 6MM', description: 'Floating catfish feed pellets (6mm size) with 42% crude protein. Specifically balanced amino acids and fats to yield maximum growth and prevent feed waste.', price: 242, stock: 25, category: 'Fish Feed' },
    { name: 'CATFISH 8MM', description: 'High-protein floating feed pellets (8mm size) for adult catfish. Adjusted feed composition ensures rapid growth and high water quality preservation.', price: 241, stock: 20, category: 'Fish Feed' },
    { name: 'CATFISH 2MM', description: 'Premium floating starter feed (2mm size) for fingerling catfish. Promotes high survival rates, rapid early growth, and easy ingestion.', price: 318, stock: 20, category: 'Fish Feed' },
    { name: 'CATFISH 3MM', description: 'Floating grower feed pellets (3mm size) designed for juvenile catfish. Balanced nutrition maximizes feed intake and minimizes growth disparity.', price: 315, stock: 25, category: 'Fish Feed' },
    { name: 'KBCS 35%', description: 'Koudijs Broiler Crumble Concentrate (35% protein mix). A highly concentrated nutrient formula with excellent particle size; mixes well with maize only to reduce feed costs.', price: 580, stock: 15, category: 'Supplements' },
    { name: 'KLC 5%', description: 'Koudijs Layer Concentrate (5% feed mix). Premium premix delivering high lay persistence, deep yellow yolks, and sturdy eggshells when mixed with local maize and bran.', price: 765, stock: 15, category: 'Supplements' },
    { name: 'PIGLET STARTER', description: 'Highly palatable starter crumble formulated for early-weaned piglets. Eases the transition to solid feed while supporting digestion and intestinal health.', price: 422, stock: 20, category: 'Pig Feed' },
    { name: 'PIG GROWER', description: 'Complete grow-finish feed enriched with essential amino acids (lysine) and energy. Promotes rapid weight gain and high lean meat yield.', price: 398, stock: 20, category: 'Pig Feed' },
    { name: 'PIG FINISHER', description: 'High-quality finisher feed for market-bound pigs. Promotes optimal muscle-to-fat ratios, excellent pork flavor, and superior carcass quality.', price: 373, stock: 20, category: 'Pig Feed' },
    { name: 'DEVELOPER MASH', description: 'Developer mash designed for pullets approaching laying age. Regulates weight gain and prevents excessive fat accumulation for a long, productive lay life.', price: 367, stock: 30, category: 'Grower Feed' },
    { name: 'PRE-LAYER', description: 'Specialized transitional feed rich in calcium, designed for pullets 2 weeks prior to laying. Prepares the bone structure for eggshell production demands.', price: 346, stock: 30, category: 'Layers Feed' },
    { name: 'CATFISH 4MM', description: 'Floating catfish feed pellets (4mm size) with optimized protein-to-energy ratios. Supports rapid muscle growth and feed conversion efficiency.', price: 263, stock: 25, category: 'Fish Feed' },
    { name: 'SANKOFA', description: 'Sankofa brand premium local compound feed. Formulated to offer a cost-effective, high-nutrient alternative for poultry farms under local climatic conditions.', price: 362, stock: 25, category: 'Specialty Feed' },
    { name: 'GALDUS', description: 'Galdus brand specialty animal feed. Enriched with probiotics and digestive enzymes to guarantee safety, feed safety, and high production yield.', price: 397, stock: 25, category: 'Specialty Feed' }
  ];
  
  for (const p of products) {
    await runQuery(
      'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [p.name, p.description, p.price, p.stock, p.category, p.imageUrl || '']
    );
  }
  console.log('Seeded ' + products.length + ' initial products');
}

// Customer functions
async function createCustomer({ name, email, phone, address }) {
  const sql = 'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)';
  const result = await runQuery(sql, [name, email, phone, address || '']);
  return { id: result.lastInsertRowid, name, email, phone, address };
}

async function getCustomer(id) {
  const sql = 'SELECT * FROM customers WHERE id = ?';
  return await getQuery(sql, [id]);
}

async function getCustomerByEmail(email) {
  const sql = 'SELECT * FROM customers WHERE email = ?';
  return await getQuery(sql, [email]);
}

async function getAllCustomers() {
  const sql = 'SELECT * FROM customers ORDER BY created_at DESC';
  return await allQuery(sql);
}

async function updateCustomer(id, { name, phone, address }) {
  const sql = 'UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?';
  const result = await runQuery(sql, [name, phone, address, id]);
  return result.changes > 0;
}

// Order functions
async function createOrder({ customerId, items, total, deliveryAddress, paymentMethod }) {
  const sql = 'INSERT INTO orders (customer_id, items, total, delivery_address, payment_method) VALUES (?, ?, ?, ?, ?)';
  const result = await runQuery(sql, [customerId, items, total, deliveryAddress || '', paymentMethod || 'mtn']);
  return { id: result.lastInsertRowid, customer_id: customerId, items, total, status: 'pending', payment_status: 'pending' };
}

async function getOrder(id) {
  const sql = 'SELECT * FROM orders WHERE id = ?';
  const order = await getQuery(sql, [id]);
  if (order) {
    order.items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  }
  return order;
}

async function getCustomerOrders(customerId) {
  const sql = 'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC';
  const orders = await allQuery(sql, [customerId]);
  return orders.map(o => ({ 
    ...o, 
    items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items 
  }));
}

async function getAllOrders() {
  const sql = `
    SELECT o.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone 
    FROM orders o 
    LEFT JOIN customers c ON o.customer_id = c.id 
    ORDER BY o.created_at DESC
  `;
  const orders = await allQuery(sql);
  return orders.map(o => ({ 
    ...o, 
    items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items 
  }));
}

async function updateOrderStatus(id, status) {
  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  await runQuery(sql, [status, id]);
}

async function updateOrder(id, data) {
  const fields = [];
  const values = [];
  
  if (data.paymentStatus !== undefined) {
    fields.push('payment_status = ?');
    values.push(data.paymentStatus);
  }
  if (data.transactionId !== undefined) {
    fields.push('transaction_id = ?');
    values.push(data.transactionId);
  }
  
  if (fields.length > 0) {
    values.push(id);
    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`;
    await runQuery(sql, values);
  }
}

// Contact message functions
async function createContactMessage({ name, email, phone, subject, message }) {
  const sql = 'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
  const result = await runQuery(sql, [name, email, phone || '', subject || '', message]);
  return { id: result.lastInsertRowid, name, email, phone, subject, message };
}

async function getAllContactMessages() {
  const sql = 'SELECT * FROM contact_messages ORDER BY created_at DESC';
  return await allQuery(sql);
}

async function markContactMessageRead(id) {
  const sql = 'UPDATE contact_messages SET is_read = 1 WHERE id = ?';
  await runQuery(sql, [id]);
}

// Product functions
async function getAllProducts() {
  const sql = 'SELECT * FROM products ORDER BY category, name';
  return await allQuery(sql);
}

async function getProduct(id) {
  const sql = 'SELECT * FROM products WHERE id = ?';
  return await getQuery(sql, [id]);
}

async function addProduct({ name, description, price, stock, category, imageUrl }) {
  const sql = 'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)';
  const result = await runQuery(sql, [name, description || '', price, stock || 0, category || '', imageUrl || '']);
  return { id: result.lastInsertRowid, name, description, price, stock, category, image_url: imageUrl || '' };
}

async function updateProduct(id, { name, description, price, stock, category, imageUrl }) {
  const sql = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ? WHERE id = ?';
  await runQuery(sql, [name, description || '', price, stock || 0, category || '', imageUrl || '', id]);
  return await getProduct(id);
}

async function deleteProduct(id) {
  const sql = 'DELETE FROM products WHERE id = ?';
  await runQuery(sql, [id]);
}

async function decrementProductStock(id, quantity) {
  const sql = 'UPDATE products SET stock = CASE WHEN stock - ? < 0 THEN 0 ELSE stock - ? END WHERE id = ?';
  await runQuery(sql, [quantity, quantity, id]);
}

// Statistics functions
async function getTodayStats() {
  const today = new Date().toISOString().split('T')[0];
  
  const totalRevenueRow = await getQuery("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = ?", ['paid']);
  const totalRevenue = totalRevenueRow ? parseFloat(totalRevenueRow.total) : 0;
  
  const todayRevenueSql = isPg 
    ? "SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE created_at::date = ?::date AND payment_status = ?"
    : "SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE DATE(created_at) = ? AND payment_status = ?";
  const todayRevenueRow = await getQuery(todayRevenueSql, [today, 'paid']);
  const todayRevenue = todayRevenueRow ? parseFloat(todayRevenueRow.total) : 0;
  
  const todayOrdersSql = isPg 
    ? "SELECT COUNT(*) as count FROM orders WHERE created_at::date = ?::date"
    : "SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = ?";
  const todayOrdersRow = await getQuery(todayOrdersSql, [today]);
  const todayOrders = todayOrdersRow ? parseInt(todayOrdersRow.count) : 0;
  
  const totalOrdersRow = await getQuery("SELECT COUNT(*) as count FROM orders");
  const totalOrders = totalOrdersRow ? parseInt(totalOrdersRow.count) : 0;
  
  const pendingOrdersRow = await getQuery("SELECT COUNT(*) as count FROM orders WHERE status = ?", ['pending']);
  const pendingOrders = pendingOrdersRow ? parseInt(pendingOrdersRow.count) : 0;
  
  const todayOrdersDataSql = isPg 
    ? "SELECT items FROM orders WHERE created_at::date = ?::date"
    : "SELECT items FROM orders WHERE DATE(created_at) = ?";
  const todayOrdersData = await allQuery(todayOrdersDataSql, [today]);
  
  let unitsToday = 0;
  todayOrdersData.forEach(order => {
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    items.forEach(item => {
      unitsToday += item.quantity || 1;
    });
  });
  
  return {
    totalRevenue,
    todayRevenue,
    todayOrders,
    totalOrders,
    pendingOrders,
    unitsToday
  };
}

async function getProductStats() {
  const sql = `
    SELECT p.id, p.name, p.stock, p.price,
           COALESCE((
             SELECT COUNT(*) FROM orders o WHERE o.items LIKE '%' || CAST(p.id AS varchar) || '%'
           ), 0) as times_ordered
    FROM products p
    GROUP BY p.id, p.name, p.stock, p.price
    ORDER BY times_ordered DESC
  `;
  return await allQuery(sql);
}

module.exports = {
  initializeDatabase,
  createCustomer,
  getCustomer,
  getCustomerByEmail,
  getAllCustomers,
  updateCustomer,
  createOrder,
  getOrder,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus,
  updateOrder,
  createContactMessage,
  getAllContactMessages,
  markContactMessageRead,
  getAllProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  decrementProductStock,
  getTodayStats,
  getProductStats
};