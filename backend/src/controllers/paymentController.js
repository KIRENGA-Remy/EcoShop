import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { Client, Currency } from 'bitpay-sdk';

dotenv.config();

// Initialize payment providers
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize BitPay client
const bitpay = new Client(
  process.env.BITPAY_TOKEN,
  {
    environment: process.env.BITPAY_ENV === 'production' ? 'prod' : 'test'
  }
);

// @desc    Process Stripe payment
// @route   POST /api/payments/stripe
// @access  Private
export const processStripePayment = asyncHandler(async (req, res) => {
  const { amount, paymentMethodId, description } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      description,
      confirm: true,
      return_url: `${req.headers.origin}/order/success`,
    });

    res.json({
      success: true,
      id: paymentIntent.id,
      status: paymentIntent.status,
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create BitPay invoice
// @route   POST /api/payments/bitpay
// @access  Private
export const createBitpayInvoice = asyncHandler(async (req, res) => {
  const { amount, orderId, buyerEmail } = req.body;

  try {
    const invoice = await bitpay.createInvoice({
      price: amount,
      currency: Currency.USD,
      orderId: orderId.toString(),
      notificationURL: `${req.headers.origin}/api/payments/bitpay/webhook`,
      redirectURL: `${req.headers.origin}/order/success`,
      buyerEmail,
      fullNotifications: true,
      transactionSpeed: 'medium',
      extendedNotifications: true,
    });

    res.json({
      success: true,
      invoiceId: invoice.id,
      url: invoice.url,
      status: invoice.status,
      expirationTime: invoice.expirationTime
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    BitPay webhook handler
// @route   POST /api/payments/bitpay/webhook
// @access  Public
export const bitpayWebhook = asyncHandler(async (req, res) => {
  const event = req.body;

  // Verify the webhook is from BitPay (implement signature verification)
  // This is a simplified version - in production you should verify the webhook
  console.log('Received BitPay webhook:', event);

  // Process webhook event based on status
  if (event.status === 'confirmed' || event.status === 'complete') {
    // Update order status in your database
    // await Order.findOneAndUpdate({ _id: event.orderId }, { isPaid: true, paidAt: Date.now() });
    
    // Implement order status update logic here
    
    console.log(`Payment confirmed for order ${event.orderId}`);
  }

  res.status(200).end();
});