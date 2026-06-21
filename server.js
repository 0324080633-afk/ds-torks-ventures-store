require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const paymentGateway = require('./server/services/paymentGateway');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ============ PUBLIC ROUTES ============

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'shop.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// ============ API ROUTES ============

app.get('/api/products', async (req, res) => {
  try {
    const products = await db.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await db.getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/customers/register', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }
    const existing = await db.getCustomerByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const customer = await db.createCustomer({ name, email, phone, address });
    res.status(201).json({ message: 'Registration successful', customer });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/customers/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const customer = await db.getCustomerByEmail(email);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Login successful', customer });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await db.getCustomer(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    console.error('Fetch customer error:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    const updated = await db.updateCustomer(req.params.id, { name, phone, address });
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    const customer = await db.getCustomer(req.params.id);
    res.json({ message: 'Profile updated successfully', customer });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer profile' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerId, items, total, deliveryAddress, paymentMethod } = req.body;
    if (!customerId || !items || items.length === 0 || !total) {
      return res.status(400).json({ error: 'Missing required order data' });
    }
    
    const customer = await db.getCustomer(customerId);
    if (!customer) {
      return res.status(400).json({ error: 'Customer not found' });
    }

    const order = await db.createOrder({
      customerId,
      items: JSON.stringify(items),
      total,
      deliveryAddress: deliveryAddress || '',
      paymentMethod: paymentMethod || 'paystack'
    });
    
    // Decrement stock for each purchased item
    for (const item of items) {
      await db.decrementProductStock(item.id, item.quantity);
    }

    // Call payment gateway based on config
    const provider = process.env.PAYMENT_GATEWAY_PROVIDER || 'mock';
    if (provider === 'paystack') {
      const paystackRes = await paymentGateway.initiatePayment({
        amount: total,
        currency: 'GHS',
        customerId,
        orderId: order.id,
        phone: customer.phone,
        email: customer.email
      });

      if (paystackRes.success) {
        return res.status(201).json({
          message: 'Order created, redirecting to payment page',
          order,
          payment: {
            provider: 'paystack',
            authorizationUrl: paystackRes.authorizationUrl,
            reference: paystackRes.reference
          }
        });
      } else {
        return res.status(500).json({ error: paystackRes.error || 'Failed to initialize payment gateway' });
      }
    }
    
    // Default mock response for other modes
    res.status(201).json({ message: 'Order created', order, payment: { provider: 'mock', success: true } });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/customer/:customerId', async (req, res) => {
  try {
    const orders = await db.getCustomerOrders(req.params.customerId);
    res.json(orders);
  } catch (error) {
    console.error('Fetch customer orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    await db.updateOrderStatus(req.params.id, status);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const contact = await db.createContactMessage({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    console.error('Create contact message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  try {
    const { orderId, reference } = req.body;
    const provider = process.env.PAYMENT_GATEWAY_PROVIDER || 'mock';
    
    if (provider === 'paystack') {
      if (!reference) {
        return res.status(400).json({ error: 'Paystack reference is required' });
      }
      
      const verifyRes = await paymentGateway.verifyPayment({ reference });
      if (verifyRes.success) {
        const orderIdToUpdate = verifyRes.orderId;
        await db.updateOrder(orderIdToUpdate, { paymentStatus: 'paid', transactionId: verifyRes.transactionId });
        return res.json({ success: true, orderId: orderIdToUpdate, transactionId: verifyRes.transactionId });
      } else {
        return res.status(400).json({ error: verifyRes.error || 'Payment verification failed' });
      }
    }
    
    // Fallback/Mock mode verification
    const transactionId = 'MOCK-' + Date.now();
    if (orderId) {
      await db.updateOrder(orderId, { paymentStatus: 'paid', transactionId });
    }
    res.json({ success: true, transactionId });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// ============ ADMIN ROUTES ============

const adminAuth = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token === process.env.ADMIN_SECRET_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await db.getTodayStats();
    const products = await db.getAllProducts();
    const lowStock = products.filter(p => p.stock < 10);
    res.json({ ...stats, totalProducts: products.length, lowStockCount: lowStock.length, lowStockProducts: lowStock });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try { 
    res.json(await db.getAllOrders()); 
  } catch (error) { 
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' }); 
  }
});

app.get('/api/admin/products', adminAuth, async (req, res) => {
  try { 
    res.json(await db.getAllProducts()); 
  } catch (error) { 
    console.error('Admin products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' }); 
  }
});

app.post('/api/admin/products', adminAuth, async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await db.addProduct({ name, description, price, stock, category });
    res.status(201).json({ message: 'Product added', product });
  } catch (error) {
    console.error('Admin add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await db.updateProduct(req.params.id, { name, description, price, stock, category });
    res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error('Admin update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/admin/products/:id', adminAuth, async (req, res) => {
  try { 
    await db.deleteProduct(req.params.id); 
    res.json({ message: 'Product deleted' }); 
  } catch (error) { 
    console.error('Admin delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' }); 
  }
});

app.get('/api/admin/contact-messages', adminAuth, async (req, res) => {
  try { 
    res.json(await db.getAllContactMessages()); 
  } catch (error) { 
    console.error('Admin messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' }); 
  }
});

app.get('/api/admin/customers', adminAuth, async (req, res) => {
  try { 
    res.json(await db.getAllCustomers()); 
  } catch (error) { 
    console.error('Admin customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' }); 
  }
});

// Initialize database and start server
db.initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log('DS TORKS VENTURES server running on port ' + PORT);
      console.log('Admin panel: http://localhost:' + PORT + '/admin');
      console.log('Admin token: ' + (process.env.ADMIN_SECRET_TOKEN || 'change_me_now'));
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });