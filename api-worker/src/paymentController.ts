import { Context } from 'hono';
import { Bindings } from './index';
import crypto from 'node:crypto';

export const createOrder = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const { amount } = await c.req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return c.json({ error: 'Valid amount is required.' }, 400);
    }

    const keyId = c.env.RAZORPAY_KEY_ID;
    const keySecret = c.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return c.json({ error: 'Razorpay credentials are not configured on the server.' }, 500);
    }

    const auth = btoa(`${keyId}:${keySecret}`);
    const receipt = `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const payload = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: receipt,
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Razorpay API Error:', errorText);
      throw new Error('Razorpay API request failed.');
    }

    const order = await response.json() as any;

    return c.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    }, 200);
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return c.json({ error: error.message || 'Failed to create payment order.' }, 500);
  }
};

export const verifyPayment = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return c.json({ error: 'Missing payment verification details.' }, 400);
    }

    const keySecret = c.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return c.json({ error: 'Razorpay Key Secret is not configured on the server.' }, 500);
    }

    // Verify the payment signature using node:crypto (supported via nodejs_compat)
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      return c.json({
        success: true,
        message: 'Payment verified successfully.',
        paymentId: razorpay_payment_id,
      }, 200);
    } else {
      return c.json({
        success: false,
        error: 'Payment signature verification failed. The transaction might be spoofed.',
      }, 400);
    }
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return c.json({ error: error.message || 'Payment verification failed.' }, 500);
  }
};
