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
    });

    it('resolves with error when Razorpay SDK is not loaded', async () => {
      // Temporarily remove window.Razorpay
      const original = window.Razorpay;
      Object.defineProperty(window, 'Razorpay', { value: undefined, configurable: true, writable: true });

      const { razorpayService } = await import('../razorpayService');
      const result = await razorpayService.openCheckout(100);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Razorpay SDK not loaded');

      // Restore
      Object.defineProperty(window, 'Razorpay', { value: original, configurable: true, writable: true });
    });
  });
});
