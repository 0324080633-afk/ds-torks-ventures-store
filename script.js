// Cart Management
let cart = JSON.parse(localStorage.getItem('dstorks_cart')) || [];

function updateCartUI() {
  const cartBadge = document.getElementById('cartBadge');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 0) {
    cartBadge.textContent = totalItems;
    cartBadge.classList.remove('hidden');
  } else {
    cartBadge.classList.add('hidden');
  }
  
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-8">
        <p class="text-gray-500">Your cart is empty</p>
      </div>
    `;
    cartTotal.textContent = 'GH₵ 0.00';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <h4 class="font-medium">${item.name}</h4>
          <p class="text-sm text-gray-500">GH₵ ${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="updateQuantity(${index}, -1)" class="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300">-</button>
          <span class="font-medium w-8 text-center">${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)" class="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300">+</button>
          <button onclick="removeFromCart(${index})" class="ml-2 text-sm text-red-500 hover:text-red-700 font-medium">
            Remove
          </button>
        </div>
      </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `GH₵ ${total.toFixed(2)}`;
  }
  
  localStorage.setItem('dstorks_cart', JSON.stringify(cart));
}

function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  
  updateCartUI();
  showToast('Added to cart!');
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  sidebar.classList.toggle('translate-x-full');
  updateCartUI();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Checkout Functions
function checkout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  toggleCart();
  openCheckout();
}

function openCheckout() {
  document.getElementById('checkoutModal').classList.remove('hidden');
  document.getElementById('checkoutModal').classList.add('flex');
  document.getElementById('checkoutForm').classList.remove('hidden');
  document.getElementById('paymentSection').classList.add('hidden');
  document.getElementById('successSection').classList.add('hidden');
  
  // Show existing customer info if logged in
  const savedEmail = localStorage.getItem('dstorks_customer_email');
  if (savedEmail) {
    document.getElementById('customerEmail').value = savedEmail;
    loadCustomerInfo(savedEmail);
  }
  
  updateOrderSummary();
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.add('hidden');
  document.getElementById('checkoutModal').classList.remove('flex');
}

function updateOrderSummary() {
  const summaryItems = document.getElementById('orderSummaryItems');
  summaryItems.innerHTML = cart.map(item => `
    <div class="flex justify-between text-sm">
      <span>${item.name} x ${item.quantity}</span>
      <span>GH₵ ${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');
  
  document.getElementById('orderTotal').textContent = `GH₵ ${getCartTotal().toFixed(2)}`;
}

let currentOrderId = null;

async function placeOrder() {
  const name = document.getElementById('customerName').value;
  const email = document.getElementById('customerEmail').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('deliveryAddress').value;
  
  try {
    // Register or get customer
    let customer;
    const existingResponse = await fetch(`/api/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (existingResponse.ok) {
      const data = await existingResponse.json();
      customer = data.customer;
    } else {
      // Register new customer
      const registerResponse = await fetch('/api/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, address })
      });
      
      if (!registerResponse.ok) {
        throw new Error('Failed to register customer');
      }
      const data = await registerResponse.json();
      customer = data.customer;
    }
    
    // Save email for future visits
    localStorage.setItem('dstorks_customer_email', email);
    localStorage.setItem('dstorks_customer_id', customer.id);
    
    // Create order
    const orderResponse = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: customer.id,
        items: cart,
        total: getCartTotal(),
        deliveryAddress: address,
        paymentMethod: 'mtn'
      })
    });
    
    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }
    
    const orderData = await orderResponse.json();
    currentOrderId = orderData.order.id;
    
    // If the payment provider is Paystack, redirect to authorization page
    if (orderData.payment && orderData.payment.provider === 'paystack') {
      showToast('Redirecting to Paystack secure checkout...');
      setTimeout(() => {
        window.location.href = orderData.payment.authorizationUrl;
      }, 800);
      return;
    }
    
    // Show payment processing (mock/MTN mode fallback)
    document.getElementById('checkoutForm').classList.add('hidden');
    document.getElementById('paymentSection').classList.remove('hidden');
    
    // In mock mode, show OTP input after delay
    setTimeout(() => {
      document.getElementById('otpSection').classList.remove('hidden');
    }, 1500);
    
  } catch (error) {
    console.error('Order error:', error);
    showToast('Failed to place order. Please try again.', 'error');
  }
}

async function verifyOTP() {
  const otp = document.getElementById('otpInput').value;
  
  if (!otp) {
    showToast('Please enter the OTP', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: currentOrderId,
        otp: otp
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Clear cart
      cart = [];
      updateCartUI();
      
      // Show success
      document.getElementById('paymentSection').classList.add('hidden');
      document.getElementById('successSection').classList.remove('hidden');
      document.getElementById('orderIdDisplay').textContent = `#${currentOrderId}`;
    } else {
      showToast(result.error || 'Invalid OTP. Try again.', 'error');
    }
  } catch (error) {
    console.error('Verification error:', error);
    showToast('Verification failed. Please try again.', 'error');
  }
}

async function loadCustomerInfo(email) {
  try {
    const response = await fetch(`/api/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      const data = await response.json();
      const customer = data.customer;
      document.getElementById('customerName').value = customer.name || '';
      document.getElementById('customerPhone').value = customer.phone || '';
      
      // Try to find delivery address field - might be named differently
      const addressField = document.getElementById('deliveryAddress') || document.querySelector('textarea');
      if (addressField && customer.address) {
        addressField.value = customer.address;
      }
    }
  } catch (error) {
    console.error('Error loading customer info:', error);
  }
}

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-primary'
  } text-white font-medium transform translate-y-20 opacity-0 transition-all duration-300`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('translate-y-20', 'opacity-0');
  }, 10);
  
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function verifyPaystackTransaction(reference) {
  // 1. Open checkout modal
  openCheckout();
  
  // 2. Adjust modal UI to show "Verifying payment..." loading state
  document.getElementById('checkoutForm').classList.add('hidden');
  document.getElementById('paymentSection').classList.remove('hidden');
  document.getElementById('otpSection').classList.add('hidden'); // make sure OTP input is hidden
  
  // Update status messages inside paymentSection if they exist
  const statusTitle = document.querySelector('#paymentSection h3') || document.querySelector('#paymentSection p');
  const originalTitle = statusTitle ? statusTitle.innerHTML : '';
  if (statusTitle) {
    statusTitle.innerHTML = '<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Verifying Secure Payment...</span>';
  }
  
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Clear cart
      cart = [];
      updateCartUI();
      
      // Show success
      document.getElementById('paymentSection').classList.add('hidden');
      document.getElementById('successSection').classList.remove('hidden');
      document.getElementById('orderIdDisplay').textContent = `#${result.orderId}`;
      
      // Clear reference query param from URL bar
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      
      showToast('Payment successful!');
    } else {
      // Revert status message and show error
      if (statusTitle) statusTitle.innerHTML = originalTitle;
      showToast(result.error || 'Payment verification failed', 'error');
      // Show checkout form again
      document.getElementById('paymentSection').classList.add('hidden');
      document.getElementById('checkoutForm').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Verification error:', error);
    if (statusTitle) statusTitle.innerHTML = originalTitle;
    showToast('Failed to verify payment', 'error');
    document.getElementById('paymentSection').classList.add('hidden');
    document.getElementById('checkoutForm').classList.remove('hidden');
  }
}

// Interactive Particle Canvas for Hero Background
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.offsetWidth;
  let height = canvas.height = canvas.parentElement.offsetHeight;
  
  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });
  
  const particles = [];
  const particleCount = 45;
  let mouse = { x: null, y: null, radius: 120 };
  
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 30 + 1;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
      
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = dx / distance;
          let directionY = dy / distance;
          let forceX = directionX * force * 3;
          let forceY = directionY * force * 3;
          
          this.x -= forceX;
          this.y -= forceY;
        }
      }
    }
    
    draw() {
      ctx.fillStyle = 'rgba(107, 163, 190, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  
  animate();
}

// Scroll Parallax Effect
function initScrollParallax() {
  const parallaxBg = document.getElementById('heroParallaxBg');
  if (!parallaxBg) return;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxBg.style.transform = `translateY(${scrollY * 0.25}px)`;
  });
}

// Skeleton loaders for products
function getProductSkeletonHTML(count = 4) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="glass-card skeleton-card rounded-2xl p-5 flex flex-col justify-between h-[280px]">
        <div>
          <div class="w-1/3 h-4 skeleton-shimmer mb-3"></div>
          <div class="w-3/4 h-6 skeleton-shimmer mb-2"></div>
          <div class="w-full h-4 skeleton-shimmer mb-1"></div>
          <div class="w-5/6 h-4 skeleton-shimmer mb-1"></div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <div class="w-1/3 h-6 skeleton-shimmer"></div>
          <div class="w-24 h-10 skeleton-shimmer rounded-lg"></div>
        </div>
      </div>
    `;
  }
  return html;
}

// Load Featured Products on Home Page
async function loadFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;
  
  container.innerHTML = getProductSkeletonHTML(4);
  
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    
    const featured = products.slice(0, 4);
    container.innerHTML = featured.map((p, index) => {
      const inStock = p.stock > 0;
      return `
        <div class="product-card glass-card rounded-2xl overflow-hidden relative p-5 flex flex-col justify-between reveal-on-scroll delay-${(index + 1) * 100} animate-card-hover" ${inStock ? `onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price})"` : ''}>
          <div>
            <div class="relative">
              ${!inStock ? `<span class="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Out of Stock</span>` : ''}
            </div>
            <span class="text-xs text-accent font-semibold">${p.category || 'General'}</span>
            <h3 class="font-bold text-white mt-1">${p.name}</h3>
            <p class="text-sm text-gray-300 mt-1 line-clamp-2">${p.description || ''}</p>
          </div>
          <div class="mt-4">
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold text-accent">GH₵ ${p.price.toFixed(2)}</span>
              <button ${!inStock ? 'disabled' : ''} class="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-dark transition ${!inStock ? 'opacity-50 cursor-not-allowed' : ''}">
                ${inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    initScrollReveal();
  } catch (error) {
    console.error('Error loading products:', error);
    container.innerHTML = '<div class="col-span-4 text-center text-red-500 py-8">Failed to load products.</div>';
  }
}

// Scroll Reveal Observer
function initScrollReveal() {
  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        self.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// Animate numbers for stats
function animateNumbers() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 1500;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      stat.textContent = currentValue + (stat.getAttribute('data-suffix') || '');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        stat.textContent = target + (stat.getAttribute('data-suffix') || '');
      }
    }
    requestAnimationFrame(update);
  });
}

// Init Stats Counter Trigger
function initStatsCounter() {
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumbers();
        self.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(statsSection);
}

// Global DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cartBadge')) {
    updateCartUI();
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const reference = urlParams.get('reference');
  if (reference) {
    verifyPaystackTransaction(reference);
  }
  
  // Initialize Motion and Interaction effects
  initParticleCanvas();
  initScrollParallax();
  initScrollReveal();
  
  if (document.getElementById('featuredProducts')) {
    loadFeaturedProducts();
    initStatsCounter();
  }
  
  // Mobile Nav Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
});