let allProducts = [];
let currentFilter = 'all';

async function loadProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  // Show skeleton loaders first
  if (typeof getProductSkeletonHTML === 'function') {
    container.innerHTML = getProductSkeletonHTML(8);
  }

  try {
    const response = await fetch('/api/products');
    const productsList = await response.json();
    
    allProducts = productsList.map(p => ({
      ...p,
      inStock: p.stock > 0
    }));

    renderProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    container.innerHTML = '<div class="col-span-full text-center text-red-500 py-12">Failed to load products. Please try again.</div>';
  }
}

function renderProducts(products) {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-gray-400 py-12">No products found matching the criteria.</div>';
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card glass-card rounded-2xl overflow-hidden relative p-5 flex flex-col justify-between animate-card-hover" data-category="${p.category || ''}">
      <div>
        <div class="relative">
          ${!p.inStock ? `<span class="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">Out of Stock</span>` : ''}
        </div>
        <span class="text-xs text-accent font-semibold">${p.category || 'General'}</span>
        <h3 class="font-bold text-white mt-1 text-lg">${p.name}</h3>
        <p class="text-sm text-gray-300 mt-1 line-clamp-2">${p.description || 'Premium quality feed'}</p>
      </div>
      <div class="mt-6">
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-accent">GH₵ ${p.price.toFixed(2)}</span>
          <span class="text-xs ${p.inStock ? 'text-green-400' : 'text-red-400'} font-medium">${p.inStock ? 'In Stock' : 'Out of Stock'}</span>
        </div>
        <button onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price})" ${!p.inStock ? 'disabled' : ''} class="w-full mt-4 bg-primary text-white py-3 rounded-xl font-bold hover:bg-dark transition shadow-lg ${!p.inStock ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-primary/25'}">
          ${p.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  `).join('');
}

function filterProducts(category) {
  currentFilter = category;
  
  // Update button visual styles
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('bg-primary', 'text-white', 'border-primary');
    btn.classList.add('bg-white/5', 'text-gray-300', 'border-white/10');
  });
  
  const activeBtn = document.querySelector(`[data-filter="${category}"]`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white/5', 'text-gray-300', 'border-white/10');
    activeBtn.classList.add('bg-primary', 'text-white', 'border-primary');
  }
  
  if (category === 'all') {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(p => p.category === category);
    renderProducts(filtered);
  }
}

function searchProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allProducts.filter(p => 
    p.name.toLowerCase().includes(query) || 
    (p.description && p.description.toLowerCase().includes(query)) ||
    (p.category && p.category.toLowerCase().includes(query))
  );
  
  // Apply category filter on top if active
  if (currentFilter !== 'all') {
    const doubleFiltered = filtered.filter(p => p.category === currentFilter);
    renderProducts(doubleFiltered);
  } else {
    renderProducts(filtered);
  }
}

// Initialize shop on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', searchProducts);
  }
});
