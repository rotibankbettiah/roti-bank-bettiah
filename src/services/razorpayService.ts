
import { RazorpayOptions, RazorpayResponse } from '../types';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

// Use environment variable or placeholder — replace with your live/test key
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'RAZORPAY_KEY_PLACEHOLDER';

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export const DONATION_TIERS = [
  { amount: 100,  label: '₹100',   impact: 'Feeds 10 people',           icon: 'fa-bowl-food' },
  { amount: 500,  label: '₹500',   impact: 'Feeds a family for a week', icon: 'fa-house-chimney' },
  { amount: 1000, label: '₹1,000', impact: 'Feeds 100 people',          icon: 'fa-people-group' },
  { amount: 2500, label: '₹2,500', impact: 'Supports a week of meals',  icon: 'fa-calendar-week' },
  { amount: 5000, label: '₹5,000', impact: 'Sponsors a food drive',     icon: 'fa-truck-field' },
];

export const razorpayService = {
  /**
   * Opens the Razorpay checkout modal with the given amount.
   * Returns a promise that resolves with payment details on success,
   * or rejects on failure/dismissal.
   */
  openCheckout(
    amountInRupees: number,
    donorName?: string,
    donorEmail?: string,
    donorPhone?: string
  ): Promise<PaymentResult> {
    return new Promise((resolve) => {
      if (typeof window.Razorpay === 'undefined') {
        resolve({ success: false, error: 'Razorpay SDK not loaded. Please refresh and try again.' });
        return;
      }

      if (RAZORPAY_KEY === 'RAZORPAY_KEY_PLACEHOLDER') {
        resolve({ success: false, error: 'Razorpay API Key is missing. Please configure VITE_RAZORPAY_KEY in your .env.local file.' });
        return;
      }

      const options: RazorpayOptions = {
        key: RAZORPAY_KEY,
        amount: amountInRupees * 100, // Razorpay expects paise
        currency: 'INR',
        name: 'Roti Bank Bettiah',
        description: `Donation of ₹${amountInRupees.toLocaleString('en-IN')} — Nourishing Lives`,
        image: '/logo.png',
        handler: (response: RazorpayResponse) => {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
          });
        },
        prefill: {
          name: donorName || '',
          email: donorEmail || '',
          contact: donorPhone || '',
        },
        theme: {
          color: '#059669',
        },
        modal: {
          ondismiss: () => {
            resolve({ success: false, error: 'Payment cancelled by user.' });
          },
        },
        notes: {
          organization: 'Roti Bank Bettiah',
          purpose: 'Food Donation',
          registration: '5071/2023',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  },

  /**
   * Get impact text for a given amount
   */
  getImpactForAmount(amount: number): string {
    const tier = DONATION_TIERS.find(t => t.amount === amount);
    if (tier) return tier.impact;
    const meals = Math.floor(amount / 10);
    return `Feeds approximately ${meals} people`;
  },
};
