import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock Razorpay SDK
const mockCreateOrder = vi.fn();
vi.mock('razorpay', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        orders: {
          create: mockCreateOrder,
        },
      };
    }),
  };
});

describe('Payment Endpoints', () => {
  let app: any;

  beforeEach(async () => {
    vi.resetModules();
    // Setup env variables for testing
    process.env.RAZORPAY_KEY_ID = 'test_key_id';
    process.env.RAZORPAY_KEY_SECRET = 'test_key_secret';
    const mod = await import('../index');
    app = mod.default;
  });

  describe('POST /api/payments/order', () => {
    it('returns 400 if amount is missing', async () => {
      const response = await request(app)
        .post('/api/payments/order')
        .send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('returns 400 if amount is negative', async () => {
      const response = await request(app)
        .post('/api/payments/order')
        .send({ amount: -50 });
      expect(response.status).toBe(400);
    });

    it('returns 500 if Razorpay credentials are missing', async () => {
      delete process.env.RAZORPAY_KEY_ID;
      delete process.env.RAZORPAY_KEY_SECRET;
      
      const response = await request(app)
        .post('/api/payments/order')
        .send({ amount: 100 });
      
      expect(response.status).toBe(500);
      expect(response.body.error).toContain('missing');
    });

    it('returns 200 with orderId on success', async () => {
      mockCreateOrder.mockResolvedValue({
        id: 'order_ABC123',
        amount: 10000,
        currency: 'INR',
      });

      const response = await request(app)
        .post('/api/payments/order')
        .send({ amount: 100 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        orderId: 'order_ABC123',
        amount: 10000,
        currency: 'INR',
      });
      expect(mockCreateOrder).toHaveBeenCalledWith({
        amount: 10000,
        currency: 'INR',
        receipt: expect.any(String),
      });
    });
  });

  describe('POST /api/payments/verify', () => {
    it('returns 400 if details are missing', async () => {
      const response = await request(app)
        .post('/api/payments/verify')
        .send({});
      expect(response.status).toBe(400);
    });

    it('returns 400 on signature mismatch', async () => {
      const response = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpay_order_id: 'order_ABC123',
          razorpay_payment_id: 'pay_XYZ987',
          razorpay_signature: 'wrong_signature',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('returns 200 on valid signature', async () => {
      // Generate a correct signature for test_key_secret
      const crypto = await import('crypto');
      const hmac = crypto.createHmac('sha256', 'test_key_secret');
      hmac.update('order_ABC123|pay_XYZ987');
      const validSignature = hmac.digest('hex');

      const response = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpay_order_id: 'order_ABC123',
          razorpay_payment_id: 'pay_XYZ987',
          razorpay_signature: validSignature,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.paymentId).toBe('pay_XYZ987');
    });
  });
});
