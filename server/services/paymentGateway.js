/**
 * DS TORKS VENTURES — Payment Gateway Service
 *
 * This module handles payment authorization requests and verifications.
 * Currently supports MOCK, MTN Mobile Money, and Vodafone Cash.
 *
 * Environment variables (add to .env):
 *   PAYMENT_GATEWAY_PROVIDER=mock   # or "mtn", "vodafone"
 *
 *   MTN credentials (from MTN Developer Portal):
 *   MTN_API_USER=your_primary_key_uuid
 *   MTN_API_KEY=your_secondary_key
 *   MTN_SUBSCRIPTION_KEY=your_secondary_key   # same as secondary key in new portal
 *   MTN_PRIMARY_KEY=your_primary_key_uuid
 *   MTN_TARGET_ENVIRONMENT=sandbox  # or "live"
 *   MTN_CALLBACK_HOST=yourdomain.com
 */

const PAYMENT_GATEWAY_MODE = process.env.PAYMENT_GATEWAY_PROVIDER || "mock";

// In-memory store for mock payments (resets on server restart)
const paymentStore = new Map();

function generateReferenceId() {
  // Format: DSTV-YYYYMMDD-XXXX
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `DSTV-${date}-${rand}`;
}

/**
 * Create an authorization request for a payment.
 * Called by POST /api/payments/authorization/request
 *
 * @param {Object} params
 * @param {string} params.paymentMethod  - "Mobile Money" | "Bank Transfer" | "Cash on Delivery"
 * @param {string} params.phone          - Customer phone number in format +233...
 * @param {number} params.amount         - Payment amount in GHS
 * @param {Object} [params.customer]     - Customer details
 * @param {Object} [params.metadata]     - Additional metadata
 * @param {string} [params.currency]     - Currency code (default: GHS)
 * @returns {Promise<Object>}            - Response with reference, requiresCode, etc.
 */
async function createAuthorizationRequest({
  paymentMethod,
  phone,
  amount,
  customer,
  metadata,
  currency = "GHS",
}) {
  if (PAYMENT_GATEWAY_MODE === "mock") {
    return handleMockPayment({ paymentMethod, phone, amount, customer, metadata, currency });
  }

  // ── Live MTN MoMo Integration ──────────────────────────────────────────────
  if (PAYMENT_GATEWAY_MODE === "mtn" || PAYMENT_GATEWAY_MODE === "mtn-sandbox") {
    return handleMtnPayment({ paymentMethod, phone, amount, customer, metadata, currency });
  }

  // ── Vodaafone Pay Integration ───────────────────────────────────────────────
  if (PAYMENT_GATEWAY_MODE === "vodafone" || PAYMENT_GATEWAY_MODE === "vodafone-sandbox") {
    return handleVodafonePayment({ paymentMethod, phone, amount, customer, metadata, currency });
  }

  throw new Error(`Unknown PAYMENT_GATEWAY_PROVIDER: "${PAYMENT_GATEWAY_MODE}". Set to mock, mtn, or vodafone.`);
}

// ══════════════════════════════════════════════════════════════════════════════
//  MOCK MODE — For testing without a real payment provider
// ══════════════════════════════════════════════════════════════════════════════

function handleMockPayment({ paymentMethod, phone, amount, customer, metadata, currency }) {
  const reference = generateReferenceId();

  // Store payment in memory
  paymentStore.set(reference, {
    reference,
    paymentMethod,
    phone,
    amount,
    currency,
    customer,
    metadata,
    status: "pending",
    authorized: false,
    createdAt: new Date().toISOString(),
  });

  // MoMo payments require an OTP step in mock mode
  if (paymentMethod === "Mobile Money") {
    const mockOtp = "123456"; // Simulated OTP
    console.log(`\n[MOCK] Payment reference: ${reference}`);
    console.log(`[MOCK] Simulated OTP sent to ${phone}: ${mockOtp}`);
    console.log(`[MOCK] Use OTP ${mockOtp} to verify this payment.\n`);

    return {
      requiresCode: true,
      reference,
      message: `Mock OTP sent to ${phone}. Use code: ${mockOtp}`,
    };
  }

  // Bank Transfer and Cash on Delivery skip OTP in mock mode
  if (paymentMethod === "Bank Transfer") {
    paymentStore.set(reference, { ...paymentStore.get(reference), authorized: true, status: "authorized" });
    return {
      requiresCode: false,
      reference,
      authorized: true,
      message: "Bank transfer authorized (mock mode).",
    };
  }

  // Cash on Delivery
  paymentStore.set(reference, { ...paymentStore.get(reference), authorized: true, status: "authorized" });
  return {
    requiresCode: false,
    reference,
    authorized: true,
    message: "Order placed for Cash on Delivery (mock mode).",
  };
}

// ══════════════════════════════════════════════════════════════════════════════
//  MTN MOBILE MONEY — Production integration
//  See: https://momodeveloper.mtn.com/
// ══════════════════════════════════════════════════════════════════════════════

async function getMtnAccessToken() {
  const apiUser = process.env.MTN_API_USER;
  const apiKey = process.env.MTN_API_KEY; // This is the secondary key in newer portal
  const subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY || apiKey; // fallback to secondary key
  const environment = process.env.MTN_TARGET_ENVIRONMENT || "sandbox";

  const baseUrl =
    environment === "sandbox"
      ? "https://sandbox.momodeveloper.mtn.com"
      : "https://proxy.mymtn.com";

  // 1. Create API user
  const userRes = await fetch(`${baseUrl}/v1_0/apiuser`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ providerCallbackHost: process.env.MTN_CALLBACK_HOST || "localhost" }),
  });

  if (!userRes.ok && userRes.status !== 409) {
    throw new Error("Failed to create MTN API user");
  }

  // 2. Create API key for that user
  const keyRes = await fetch(`${baseUrl}/v1_0/apiuser/${apiUser}/apikey`, {
    method: "POST",
    headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
  });

  if (!keyRes.ok) {
    throw new Error("Failed to create MTN API key");
  }

  const { apiKey: generatedKey } = await keyRes.json();

  // 3. Get OAuth token
  const tokenRes = await fetch(`${baseUrl}/disbursement/token`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      Authorization: `Basic ${Buffer.from(`${apiUser}:${generatedKey}`).toString("base64")}`,
    },
  });

  if (!tokenRes.ok) {
    throw new Error("Failed to get MTN access token");
  }

  const { access_token } = await tokenRes.json();
  return { access_token, baseUrl };
}

async function handleMtnPayment({ paymentMethod, phone, amount, customer, metadata, currency }) {
  if (paymentMethod !== "Mobile Money") {
    throw new Error("MTN gateway only supports Mobile Money payments.");
  }

  const { access_token, baseUrl } = await getMtnAccessToken();
  const reference = generateReferenceId();
  const subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY;

  const collectionRes = await fetch(`${baseUrl}/disbursement/v1_0/transfer`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      Authorization: `Bearer ${access_token}`,
      "X-Reference-Id": reference,
      "X-Target-Environment": process.env.MTN_TARGET_ENVIRONMENT || "sandbox",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: String(amount),
      currency,
      externalId: reference,
      payer: {
        partyIdType: "MSISDN",
        partyId: phone.replace("+", ""), // MTN expects 233XXXXXXXXX without +
      },
      payeeNote: `DS TORKS VENTURES Order Payment - ${reference}`,
      language: "EN",
    }),
  });

  if (!collectionRes.ok) {
    const err = await collectionRes.json().catch(() => ({}));
    throw new Error(`MTN collection failed: ${err.message || collectionRes.statusText}`);
  }

  paymentStore.set(reference, {
    reference,
    paymentMethod,
    phone,
    amount,
    currency,
    customer,
    metadata,
    status: "pending",
    authorized: false,
    createdAt: new Date().toISOString(),
  });

  // In production, MTN will call back to your callback URL on success/failure
  // For now, we check status via polling
  return {
    requiresCode: false,
    reference,
    message: "MoMo payment request sent. Check your phone to approve.",
  };
}

// ══════════════════════════════════════════════════════════════════════════════
//  VODAFONE CASH — Alternative mobile money integration
//  See: https://developer.vodafone.com.gh/
// ══════════════════════════════════════════════════════════════════════════════

async function handleVodafonePayment({ paymentMethod, phone, amount, customer, metadata, currency }) {
  if (paymentMethod !== "Mobile Money") {
    throw new Error("Vodafone gateway only supports Mobile Money payments.");
  }

  // Replace with real Vodafone API integration
  const reference = generateReferenceId();
  console.log(`[VODAFONE] Payment request to ${phone} for ${currency} ${amount} — reference: ${reference}`);

  paymentStore.set(reference, {
    reference,
    paymentMethod,
    phone,
    amount,
    currency,
    customer,
    metadata,
    status: "pending",
    authorized: false,
    createdAt: new Date().toISOString(),
  });

  return {
    requiresCode: true,
    reference,
    message: "Vodafone Cash payment initiated. Enter the verification code.",
  };
}

// ══════════════════════════════════════════════════════════════════════════════
//  VERIFY AUTHORIZATION
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Verify an authorization code (e.g., OTP from MoMo).
 * Called by POST /api/payments/authorization/verify
 *
 * @param {Object} params
 * @param {string} params.reference  - Payment reference from createAuthorizationRequest
 * @param {string} [params.authCode] - Authorization code / OTP
 * @returns {Promise<Object>}
 */
async function verifyAuthorization({ reference, authCode }) {
  const payment = paymentStore.get(reference);

  if (!payment) {
    throw new Error(`Payment reference not found: ${reference}`);
  }

  if (PAYMENT_GATEWAY_MODE === "mock") {
    const expectedCode = "123456";
    if (authCode === expectedCode) {
      payment.authorized = true;
      payment.status = "authorized";
      payment.verifiedAt = new Date().toISOString();
      return {
        ok: true,
        authorized: true,
        message: "Payment authorized successfully (mock mode).",
        reference,
      };
    }
    return {
      ok: true,
      authorized: false,
      message: "Invalid OTP code.",
      reference,
    };
  }

  // ── Live provider verification ─────────────────────────────────────────────
  if (PAYMENT_GATEWAY_MODE === "mtn") {
    // MTN verifies automatically via callback URL; this is for polling
    return {
      ok: true,
      authorized: payment.status === "authorized",
      message: payment.status === "authorized" ? "Payment confirmed." : "Payment still processing.",
      reference,
    };
  }

  // Add Vodafone verification logic here
  if (PAYMENT_GATEWAY_MODE === "vodafone") {
    return {
      ok: true,
      authorized: authCode === "VF123456", // Replace with real verification
      message: "Verification result from Vodafone.",
      reference,
    };
  }

  throw new Error(`Unknown provider mode: ${PAYMENT_GATEWAY_MODE}`);
}

// ══════════════════════════════════════════════════════════════════════════════
//  HELPER — Lookup a payment by reference
// ══════════════════════════════════════════════════════════════════════════════

function getPaymentByReference(reference) {
  return paymentStore.get(reference) || null;
}

module.exports = {
  createAuthorizationRequest,
  verifyAuthorization,
  getPaymentByReference,
};