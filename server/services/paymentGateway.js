require('dotenv').config();

// Mock mode for testing - OTP is always "123456"
const MOCK_MODE = process.env.PAYMENT_GATEWAY_PROVIDER !== 'mtn' && 
                   process.env.PAYMENT_GATEWAY_PROVIDER !== 'vodafone' &&
                   process.env.PAYMENT_GATEWAY_PROVIDER !== 'paystack';

// Simulate payment initiation
async function initiatePayment({ amount, currency, customerId, orderId, phone, email }) {
  console.log(`Payment initiation: ${currency} ${amount} for order ${orderId}`);
  
  // Real Paystack integration
  if (process.env.PAYMENT_GATEWAY_PROVIDER === 'paystack') {
    return initiatePaystackPayment({ amount, currency, email, orderId });
  }
  
  if (MOCK_MODE) {
    // Mock mode - return success after delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          provider: 'mock',
          message: 'Payment initiated successfully',
          otpRequired: true,
          instructions: 'Enter OTP code: 123456',
          orderId: orderId
        });
      }, 1000);
    });
  }
  
  // Real MTN Mobile Money integration
  if (process.env.PAYMENT_GATEWAY_PROVIDER === 'mtn') {
    return initiateMTNPayment({ amount, currency, customerId, orderId, phone });
  }
  
  // Real Vodafone Cash integration
  if (process.env.PAYMENT_GATEWAY_PROVIDER === 'vodafone') {
    return initiateVodafonePayment({ amount, currency, customerId, orderId, phone });
  }
  
  return { success: false, error: 'Invalid payment provider' };
}

// Verify payment
async function verifyPayment({ orderId, otp, reference }) {
  console.log(`Payment verification for order ${orderId} / ref ${reference}`);
  
  // Real Paystack verification
  if (process.env.PAYMENT_GATEWAY_PROVIDER === 'paystack') {
    return verifyPaystackPayment(reference);
  }
  
  if (MOCK_MODE) {
    // Mock mode - accept "123456" as valid OTP
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === '123456') {
          resolve({
            success: true,
            provider: 'mock',
            message: 'Payment verified successfully',
            transactionId: `MOCK-${Date.now()}`
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid OTP code'
          });
        }
      }, 500);
    });
  }
  
  // Real MTN verification
  if (process.env.PAYMENT_GATEWAY_PROVIDER === 'mtn') {
    return verifyMTNPayment({ orderId, referenceId: reference || otp });
  }
  
  return { success: false, error: 'Invalid payment provider' };
}

// Check payment status
async function checkPaymentStatus(orderId) {
  // In a real implementation, this would check with the payment provider
  return { status: 'pending' };
}

// ============ MTN Mobile Money Integration ============

async function initiateMTNPayment({ amount, currency, customerId, orderId, phone }) {
  try {
    const environment = process.env.MTN_TARGET_ENVIRONMENT || 'sandbox';
    const baseUrl = environment === 'live' 
      ? 'https://live.momodeveloper.mtn.com' 
      : 'https://sandbox.momodeveloper.mtn.com';
    
    // Step 1: Get API User (usually done once, stored in config)
    // For this implementation, we'll use the configured API User
    
    const apiUser = process.env.MTN_API_USER;
    const apiKey = process.env.MTN_API_KEY;
    const subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY;
    
    if (!apiUser || !apiKey || !subscriptionKey) {
      throw new Error('MTN API credentials not configured');
    }
    
    // Step 2: Get Bearer Token
    const tokenResponse = await fetch(`${baseUrl}/v1_0/apiuser/${apiUser}/token`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Authorization': 'Basic ' + Buffer.from(`${apiUser}:${apiKey}`).toString('base64')
      }
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get MTN API token');
    }
    
    const tokenData = await tokenResponse.json();
    const bearerToken = tokenData.access_token;
    
    // Step 3: Request to pay (initiate payment)
    const referenceId = `DS-${orderId}-${Date.now()}`;
    const payResponse = await fetch(`${baseUrl}/v1_0/requesttopay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': environment,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: currency || 'GHS',
        externalId: orderId.toString(),
        payer: {
          partyIdType: 'MSISDN',
          partyId: phone.replace(/^0/, '233') // Convert Ghana number format
        },
        payerMessage: `Payment for Order #${orderId} at DS TORKS VENTURES`,
        payeeNote: `Animal Feed Order #${orderId}`
      })
    });
    
    if (!payResponse.ok) {
      const error = await payResponse.text();
      throw new Error(`MTN payment request failed: ${error}`);
    }
    
    return {
      success: true,
      provider: 'mtn',
      referenceId: referenceId,
      message: 'MTN Mobile Money payment initiated. Check your phone.',
      orderId: orderId
    };
  } catch (error) {
    console.error('MTN Payment Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function verifyMTNPayment({ orderId, referenceId }) {
  try {
    const environment = process.env.MTN_TARGET_ENVIRONMENT || 'sandbox';
    const baseUrl = environment === 'live' 
      ? 'https://live.momodeveloper.mtn.com' 
      : 'https://sandbox.momodeveloper.mtn.com';
    
    const apiUser = process.env.MTN_API_USER;
    const apiKey = process.env.MTN_API_KEY;
    const subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY;

    // Get token
    const tokenResponse = await fetch(`${baseUrl}/v1_0/apiuser/${apiUser}/token`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Authorization': 'Basic ' + Buffer.from(`${apiUser}:${apiKey}`).toString('base64')
      }
    });
    
    const tokenData = await tokenResponse.json();
    const bearerToken = tokenData.access_token;
    
    // Check transaction status
    const statusResponse = await fetch(`${baseUrl}/v1_0/requesttopay/${referenceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'X-Target-Environment': environment,
        'Ocp-Apim-Subscription-Key': subscriptionKey
      }
    });
    
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'SUCCESSFUL') {
      return {
        success: true,
        provider: 'mtn',
        transactionId: referenceId,
        message: 'Payment successful'
      };
    } else if (statusData.status === 'PENDING') {
      return {
        success: false,
        status: 'pending',
        message: 'Payment still processing'
      };
    } else {
      return {
        success: false,
        error: `Payment ${statusData.status.toLowerCase()}`
      };
    }
  } catch (error) {
    console.error('MTN Verification Error:', error);
    return { success: false, error: error.message };
  }
}

// ============ Vodafone Cash Integration (Template) ============

async function initiateVodafonePayment({ amount, currency, customerId, orderId, phone }) {
  // Vodafone Cash integration would follow similar pattern
  // Implementation depends on Vodafone Ghana API documentation
  
  return {
    success: true,
    provider: 'vodafone',
    message: 'Vodafone Cash payment initiated. Check your phone.',
    orderId: orderId
  };
}

// ============ Paystack Integration ============

async function initiatePaystackPayment({ amount, currency, email, orderId }) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const callbackUrl = process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/shop';
    
    if (!secretKey) {
      throw new Error('Paystack API secret key not configured');
    }
    
    const reference = `DS-PAYSTACK-${orderId}-${Date.now()}`;
    const amountInPesewas = Math.round(amount * 100);
    
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amountInPesewas,
        currency: currency || 'GHS',
        reference,
        callback_url: callbackUrl,
        metadata: {
          orderId
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Paystack initialization failed: ${errorText}`);
    }
    
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(`Paystack error: ${resData.message}`);
    }
    
    return {
      success: true,
      provider: 'paystack',
      authorizationUrl: resData.data.authorization_url,
      reference: reference,
      message: 'Redirect to Paystack checkout page'
    };
  } catch (error) {
    console.error('Paystack Initiation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function verifyPaystackPayment(reference) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Paystack API secret key not configured');
    }
    
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Paystack verification API error: ${errorText}`);
    }
    
    const resData = await response.json();
    if (!resData.status) {
      throw new Error(`Paystack error: ${resData.message}`);
    }
    
    if (resData.data.status === 'success') {
      return {
        success: true,
        provider: 'paystack',
        orderId: resData.data.metadata.orderId,
        transactionId: reference,
        message: 'Payment verified successfully'
      };
    } else {
      return {
        success: false,
        error: `Transaction status is: ${resData.data.status}`
      };
    }
  } catch (error) {
    console.error('Paystack Verification Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  initiatePayment,
  verifyPayment,
  checkPaymentStatus
};