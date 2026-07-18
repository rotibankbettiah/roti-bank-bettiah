import { describe, it, expect, vi, beforeEach } from 'vitest';

// We must mock Razorpay on window before importing the service, but the test
// setup already stubs `window.Razorpay`.  We re-import dynamically so each
// test suite gets a fresh module.

describe('razorpayService', () => {
  // ── DONATION_TIERS ────────────────────────────────────────────────

  describe('DONATION_TIERS', () => {
    it('contains exactly 5 tiers', async () => {
      const { DONATION_TIERS } = await import('../razorpayService');
      expect(DONATION_TIERS).toHaveLength(5);
    });

    it('each tier has required fields', async () => {
      const { DONATION_TIERS } = await import('../razorpayService');
      for (const tier of DONATION_TIERS) {
        expect(tier).toHaveProperty('amount');
        expect(tier).toHaveProperty('label');
        expect(tier).toHaveProperty('impact');
        expect(tier).toHaveProperty('icon');
        expect(tier.amount).toBeGreaterThan(0);
      }
    });

    it('tiers are sorted by ascending amount', async () => {
      const { DONATION_TIERS } = await import('../razorpayService');
      const amounts = DONATION_TIERS.map((t) => t.amount);
      const sorted = [...amounts].sort((a, b) => a - b);
      expect(amounts).toEqual(sorted);
    });
  });

  // ── getImpactForAmount ────────────────────────────────────────────

  describe('getImpactForAmount', () => {
    it('returns tier impact for exact tier amount', async () => {
      const { razorpayService, DONATION_TIERS } = await import('../razorpayService');
      for (const tier of DONATION_TIERS) {
        expect(razorpayService.getImpactForAmount(tier.amount)).toBe(tier.impact);
      }
    });

    it('returns computed meals string for non-tier amounts', async () => {
      const { razorpayService } = await import('../razorpayService');
      const result = razorpayService.getImpactForAmount(750);
      expect(result).toContain('75'); // 750 / 10 = 75
      expect(result).toContain('people');
    });
  });

  // ── openCheckout ──────────────────────────────────────────────────

  describe('openCheckout', () => {
    beforeEach(() => {
      vi.resetModules();
      vi.stubEnv('VITE_RAZORPAY_KEY', 'test_key');
    });

    it('resolves with error when Razorpay SDK is not loaded', async () => {
      // Temporarily remove window.Razorpay
      const original = window.Razorpay;
      Object.defineProperty(window, 'Razorpay', { value: undefined, configurable: true, writable: true });

      const { razorpayService } = await import('../razorpayService');
      vi.spyOn(razorpayService, 'loadRazorpayScript').mockResolvedValue(false);
      const result = await razorpayService.openCheckout(100);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Razorpay SDK failed to load');

      // Restore
      Object.defineProperty(window, 'Razorpay', { value: original, configurable: true, writable: true });
    });

    it('resolves with error when API order creation fails', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Database error' }),
      } as Response);

      const { razorpayService } = await import('../razorpayService');
      vi.spyOn(razorpayService, 'loadRazorpayScript').mockResolvedValue(true);
      const result = await razorpayService.openCheckout(100);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
      expect(fetchSpy).toHaveBeenCalled();
      fetchSpy.mockRestore();
    });

    it('opens Razorpay modal and resolves when signature verification succeeds', async () => {
      // Mock order creation API response
      const mockOrderResponse = {
        success: true,
        orderId: 'order_123',
        amount: 10000,
        currency: 'INR',
      };

      // Mock verify API response
      const mockVerifyResponse = {
        success: true,
        paymentId: 'pay_999',
      };

      const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation((url) => {
        if (String(url).includes('/api/payments/order')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockOrderResponse,
          } as Response);
        }
        if (String(url).includes('/api/payments/verify')) {
          return Promise.resolve({
            ok: true,
            json: async () => mockVerifyResponse,
          } as Response);
        }
        return Promise.reject(new Error('Unexpected fetch call'));
      });

      // Mock Razorpay instance and constructor
      const openMock = vi.fn();
      let capturedOptions: any = null;
      const mockRzpConstructor = vi.fn().mockImplementation((options) => {
        capturedOptions = options;
        return { open: openMock };
      });

      const originalRzp = window.Razorpay;
      Object.defineProperty(window, 'Razorpay', {
        value: mockRzpConstructor,
        configurable: true,
        writable: true
      });

      const { razorpayService } = await import('../razorpayService');
      vi.spyOn(razorpayService, 'loadRazorpayScript').mockResolvedValue(true);
      
      // Start checkout
      const checkoutPromise = razorpayService.openCheckout(100, 'John Doe', 'john@example.com', '1234567890');

      // Wait a microtask for fetch to resolve and constructor to be called
      await vi.waitFor(() => expect(mockRzpConstructor).toHaveBeenCalled());

      expect(openMock).toHaveBeenCalled();
      expect(capturedOptions.order_id).toBe('order_123');
      expect(capturedOptions.prefill.name).toBe('John Doe');

      // Trigger the success handler callback
      capturedOptions.handler({
        razorpay_payment_id: 'pay_999',
        razorpay_order_id: 'order_123',
        razorpay_signature: 'valid_sig',
      });

      const result = await checkoutPromise;
      expect(result.success).toBe(true);
      expect(result.paymentId).toBe('pay_999');

      fetchSpy.mockRestore();
      Object.defineProperty(window, 'Razorpay', {
        value: originalRzp,
        configurable: true,
        writable: true
      });
    });
  });
});
