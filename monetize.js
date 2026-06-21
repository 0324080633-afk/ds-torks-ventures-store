// DS TORKS VENTURES - Monetization Tracking
// Tracks affiliate clicks, AdSense impressions, and revenue

// Configuration - Replace with your actual IDs
const ADSENSE_CLIENT_ID = 'ca-pub-XXXXXXXXXX'; // Your AdSense Publisher ID
const ADSENSE_SLOTS = {
  'homepage-hero': '1234567890',      // Replace with your ad slot IDs
  'shop-sidebar': '0987654321'
};

// Track affiliate clicks
function trackAffiliateClick(affiliateId, productName, link) {
  const clicks = JSON.parse(localStorage.getItem('dstorks_affiliate_clicks') || '{}');
  
  if (!clicks[affiliateId]) {
    clicks[affiliateId] = { name: productName, clicks: 0, conversions: 0 };
  }
  clicks[affiliateId].clicks++;
  
  localStorage.setItem('dstorks_affiliate_clicks', JSON.stringify(clicks));
  
  console.log(`[Affiliate] Tracked click for: ${productName}`);
  
  // Open affiliate link
  window.open(link, '_blank');
}

// Load revenue data
function loadRevenueData() {
  const clicks = JSON.parse(localStorage.getItem('dstorks_affiliate_clicks') || '{}');
  const totalClicks = Object.values(clicks).reduce((sum, c) => sum + c.clicks, 0);
  
  document.getElementById('affiliateClicks').textContent = totalClicks;
  
  // Build affiliate table
  const tbody = document.getElementById('affiliateTable');
  if (Object.keys(clicks).length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-gray-500 py-8">No affiliate data yet</td></tr>';
  } else {
    tbody.innerHTML = Object.entries(clicks).map(([id, data]) => `
      <tr>
        <td class="px-4 py-3 font-medium">${data.name}</td>
        <td class="px-4 py-3">${data.clicks}</td>
        <td class="px-4 py-3">${data.conversions}</td>
        <td class="px-4 py-3 text-green-600 font-medium">GH₵ ${(data.clicks * 0.50).toFixed(2)}</td>
      </tr>
    `).join('');
  }
}

// Lazy load AdSense ads
function loadAdSense() {
  // Only load if AdSense is configured
  if (ADSENSE_CLIENT_ID === 'ca-pub-XXXXXXXXXX') {
    console.log('AdSense not configured - add your Publisher ID to monetize.js');
    return;
  }
  
  // Create and inject AdSense script
  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Track page views
  const pageViews = parseInt(localStorage.getItem('dstorks_page_views') || '0') + 1;
  localStorage.setItem('dstorks_page_views', pageViews.toString());
  
  console.log(`[Analytics] Page view #${pageViews}`);
});

// Export functions for use in other scripts
window.trackAffiliateClick = trackAffiliateClick;
window.loadRevenueData = loadRevenueData;