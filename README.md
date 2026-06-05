# DS TORKS VENTURES Store with Backend Gateway

This project now includes a backend payment gateway integration.

## 1) Install Node.js

Install Node.js 20+ from https://nodejs.org/.

## 2) Install dependencies

```bash
npm install
```

## 3) Configure environment

Copy `.env.example` to `.env` and set values:

- `PAYMENT_GATEWAY_PROVIDER=mock` for local testing (default)
- `PAYMENT_GATEWAY_PROVIDER=paystack` for real gateway mode
- `PAYSTACK_SECRET_KEY` when using Paystack
- `PAYSTACK_CALLBACK_URL` should point back to your shop page
- `SMS_PROVIDER=twilio` to send OTP to customer phones
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` for OTP SMS delivery

## 4) Start the backend server

```bash
npm run dev
```

or

```bash
npm start
```

## 5) Open the app

- Home: `http://localhost:3000/`
- Shop: `http://localhost:3000/shop`

## API Endpoints

- `GET /api/health`
- `POST /api/payments/authorization/request`
- `POST /api/payments/authorization/verify`
- `GET /api/payments/:reference`

## Gateway behavior

- `mock`: creates a 6-digit authorization code server-side, sends it by SMS, and verifies it.
- `paystack`: initializes transaction with Paystack and verifies transaction status by reference.

## OTP Delivery

- OTP is not shown in the site UI.
- OTP is delivered to the customer's phone number by Twilio SMS.
- If Twilio is not configured, authorization request fails with a setup error.

## Important

Do not commit your `.env` file or gateway secret keys.
