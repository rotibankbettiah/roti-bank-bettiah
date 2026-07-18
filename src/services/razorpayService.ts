
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
   * Dynamically loads the Razorpay checkout script if not already present.
   */
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window.Razorpay !== 'undefined') {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  /**
   * Opens the Razorpay checkout modal with the given amount.
   * Returns a promise that resolves with payment details on success,
   * or rejects on failure/dismissal.
   */
  async openCheckout(
    amountInRupees: number,
    donorName?: string,
    donorEmail?: string,
    donorPhone?: string
  ): Promise<PaymentResult> {
    const isLoaded = await this.loadRazorpayScript();
    if (!isLoaded || typeof window.Razorpay === 'undefined') {
      return { success: false, error: 'Razorpay SDK failed to load. Please check your internet connection and try again.' };
    }

    if (RAZORPAY_KEY === 'RAZORPAY_KEY_PLACEHOLDER') {
      return { success: false, error: 'Razorpay API Key is missing. Please configure VITE_RAZORPAY_KEY in your .env.local file.' };
    }

    const apiUrl = import.meta.env.VITE_API_URL || '';

    try {
      // 1. Create order on the backend
      const orderResponse = await fetch(`${apiUrl}/api/payments/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amountInRupees }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Server order creation failed with status ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();
      if (!orderData.success || !orderData.orderId) {
        throw new Error('Invalid order response structure from server.');
      }

      // 2. Open the Razorpay checkout modal
      return new Promise<PaymentResult>((resolve) => {
        const options: RazorpayOptions = {
          key: RAZORPAY_KEY,
          amount: orderData.amount, // from backend order (already in paise)
          currency: orderData.currency || 'INR',
          order_id: orderData.orderId, // critical for backend verification!
          name: 'Roti Bank Bettiah',
          description: `Donation of ₹${amountInRupees.toLocaleString('en-IN')} — Nourishing Lives`,
          image: '/logo.png',
          handler: async (response: RazorpayResponse) => {
            try {
              // 3. Send payment details to backend for signature verification
              const verifyResponse = await fetch(`${apiUrl}/api/payments/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id || orderData.orderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (!verifyResponse.ok) {
                const verifyError = await verifyResponse.json().catch(() => ({}));
                resolve({
                  success: false,
                  error: verifyError.error || 'Payment signature verification failed.',
                });
                return;
              }

              const verifyData = await verifyResponse.json();
              if (verifyData.success) {
                resolve({
                  success: true,
                  paymentId: verifyData.paymentId || response.razorpay_payment_id,
                });
              } else {
                resolve({
                  success: false,
                  error: verifyData.error || 'Payment verification failed.',
                });
              }
            } catch (err: any) {
              console.error('Error during backend verification call:', err);
              resolve({
                success: false,
                error: 'Error validating payment with the server. Please check your network connection.',
              });
            }
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
    } catch (error: any) {
      console.error('Razorpay payment initialization failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to start payment process. Please try again.',
      };
    }
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
