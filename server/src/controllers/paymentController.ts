import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayClient: any = null;

/**
 * Lazily initialize Razorpay client so server startup does not fail 
 * if credentials are not provided initially.
 */
const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are missing.');
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayClient;
};

/**
 * Creates a new Razorpay order
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body; // Amount in INR

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required.' });
    }

    const client = getRazorpayClient();
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await client.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create payment order.'
    });
  }
};

/**
 * Verifies the signature of a Razorpay payment
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification details.' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ error: 'Razorpay Key Secret is not configured on the server.' });
    }

    // Verify the payment signature
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully.',
        paymentId: razorpay_payment_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Payment signature verification failed. The transaction might be spoofed.',
      });
    }
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      error: error.message || 'Payment verification failed.'
    });
  }
};
