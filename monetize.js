const AFFILIATE_CLICK_KEY = "affiliateClickSummary";
const ADMIN_PASSCODE_KEY = "dsMonetizeAdminPasscode";

function getAffiliateSummary() {
  try {
    return JSON.parse(localStorage.getItem(AFFILIATE_CLICK_KEY) || "{}");
  } catch (_error) {
    return {};
  }
}

function saveAffiliateSummary(summary) {
  localStorage.setItem(AFFILIATE_CLICK_KEY, JSON.stringify(summary));
}

function trackAffiliateClick(label, href) {
  const current = getAffiliateSummary();
  current[label] = {
    clicks: (current[label]?.clicks || 0) + 1,
    href,
    lastClickedAt: new Date().toISOString(),
  };
  saveAffiliateSummary(current);
}

function appendUtmSource(urlValue) {
  try {
    const url = new URL(urlValue, window.location.href);
    if (!url.searchParams.has("utm_source")) {
      url.searchParams.set("utm_source", "ds_torks_site");
    }
    if (!url.searchParams.has("utm_medium")) {
      url.searchParams.set("utm_medium", "affiliate_link");
    }
    return url.toString();
  } catch (_error) {
    return urlValue;
  }
}

function getTopAffiliateLabel() {
  const summary = getAffiliateSummary();
  const entries = Object.entries(summary);
  if (entries.length === 0) {
    return null;
  }

  entries.sort((a, b) => (b[1]?.clicks || 0) - (a[1]?.clicks || 0));
  return entries[0][1]?.clicks > 0 ? entries[0][0] : null;
}

function applyTopAffiliateBadges() {
  const topLabel = getTopAffiliateLabel();
  if (!topLabel) {
    return;
  }

  document.querySelectorAll(".affiliate-card").forEach((card) => {
    const link = card.querySelector(".affiliate-link");
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }

    if ((link.dataset.label || "") !== topLabel) {
      return;
    }

    if (card.querySelector(".top-affiliate-badge")) {
      return;
    }

    const badge = document.createElement("span");
    badge.className = "top-affiliate-badge";
    badge.textContent = "Top Performing";
    card.prepend(badge);
  });
}

function initAffiliateTracking() {
  document.querySelectorAll(".affiliate-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = event.currentTarget;
      if (!(target instanceof HTMLAnchorElement)) {
        return;
      }

      const label = target.dataset.label || target.textContent.trim() || "affiliate";
      const finalUrl = appendUtmSource(target.href);

      trackAffiliateClick(label, finalUrl);
      target.href = finalUrl;
    });
  });

  applyTopAffiliateBadges();
}

function createAdInsElement(clientId, slotId) {
  const ad = document.createElement("ins");
  ad.className = "adsbygoogle ad-ins";
  ad.style.display = "block";
  ad.setAttribute("data-ad-client", clientId);
  ad.setAttribute("data-ad-slot", slotId);
  ad.setAttribute("data-ad-format", "auto");
  ad.setAttribute("data-full-width-responsive", "true");
  return ad;
}

function initLazyAds() {
  const placeholders = document.querySelectorAll(".ad-placeholder[data-ad-slot]");
  if (placeholders.length === 0) {
    return;
  }

  // Replace with your real AdSense publisher ID (e.g. "ca-pub-XXXXXXXXXXXXXXXX")
  const clientId = window.DS_AD_CLIENT || "ca-pub-REPLACE_WITH_YOUR_ADSENSE_PUBLISHER_ID";

  const observer = new IntersectionObserver((entries, adObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const placeholder = entry.target;
      const slotId = placeholder.getAttribute("data-ad-slot");
      if (!slotId || placeholder.getAttribute("data-ad-loaded") === "true") {
        adObserver.unobserve(placeholder);
        return;
      }

      placeholder.innerHTML = "";
      placeholder.appendChild(createAdInsElement(clientId, slotId));

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        placeholder.setAttribute("data-ad-loaded", "true");
      } catch (_error) {
        placeholder.textContent = "Ad unavailable right now.";
      }

      adObserver.unobserve(placeholder);
    });
  }, { threshold: 0.2 });

  placeholders.forEach((placeholder) => observer.observe(placeholder));
}

function formatDate(value) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
}

function renderAdminTable() {
  const root = document.getElementById("adminDashboardApp");
  if (!root) {
    return;
  }

  const summary = getAffiliateSummary();
  const entries = Object.entries(summary).sort((a, b) => (b[1]?.clicks || 0) - (a[1]?.clicks || 0));
  const totalClicks = entries.reduce((sum, [, item]) => sum + (item?.clicks || 0), 0);
  const topLabel = entries.length > 0 ? entries[0][0] : "None";

  if (entries.length === 0) {
    root.innerHTML = `
      <p class="shop-note">No affiliate clicks recorded yet on this device/browser.</p>
      <p class="shop-note">Total clicks: 0</p>
    `;
    return;
  }

  const rows = entries.map(([label, item]) => `
    <tr>
      <td>${label}</td>
      <td>${item?.clicks || 0}</td>
      <td><a href="${item?.href || "#"}" target="_blank" rel="noopener noreferrer">Link</a></td>
      <td>${formatDate(item?.lastClickedAt)}</td>
    </tr>
  `).join("");

  root.innerHTML = `
    <div class="dashboard-metrics">
      <article class="metric-card"><h3>Total Clicks</h3><p>${totalClicks}</p></article>
      <article class="metric-card"><h3>Top Affiliate</h3><p>${topLabel}</p></article>
      <article class="metric-card"><h3>Tracked Links</h3><p>${entries.length}</p></article>
    </div>
    <div class="dashboard-table-wrap">
      <table class="dashboard-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Clicks</th>
            <th>URL</th>
            <th>Last Clicked</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function unlockAdminDashboard() {
  const gate = document.getElementById("adminGate");
  const root = document.getElementById("adminDashboardApp");
  if (!gate || !root) {
    return;
  }

  const setupForm = document.getElementById("adminSetupForm");
  const unlockForm = document.getElementById("adminUnlockForm");
  const message = document.getElementById("adminGateMessage");
  const configuredPasscode = localStorage.getItem(ADMIN_PASSCODE_KEY);

  if (!configuredPasscode && setupForm) {
    setupForm.classList.remove("hidden");
  } else if (unlockForm) {
    unlockForm.classList.remove("hidden");
  }

  setupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const passA = document.getElementById("adminPassA")?.value || "";
    const passB = document.getElementById("adminPassB")?.value || "";

    if (!passA || passA.length < 4) {
      if (message) {
        message.textContent = "Passcode must be at least 4 characters.";
      }
      return;
    }

    if (passA !== passB) {
      if (message) {
        message.textContent = "Passcodes do not match.";
      }
      return;
    }

    localStorage.setItem(ADMIN_PASSCODE_KEY, passA);
    gate.classList.add("hidden");
    root.classList.remove("hidden");
    renderAdminTable();
  });

  unlockForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("adminPassInput")?.value || "";
    const saved = localStorage.getItem(ADMIN_PASSCODE_KEY) || "";

    if (input !== saved) {
      if (message) {
        message.textContent = "Invalid passcode.";
      }
      return;
    }

    gate.classList.add("hidden");
    root.classList.remove("hidden");
    renderAdminTable();
  });
}

initAffiliateTracking();
initLazyAds();
unlockAdminDashboard();
