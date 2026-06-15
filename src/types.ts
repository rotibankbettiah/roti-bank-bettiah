
export interface Achievement {
  id: string;
  icon: string;
  count: string;
  description: string;
  caption?: string;
  imageUrl?: string;
}

export interface Activity {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  caption?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  imageUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface InternshipContent {
  id: string;
  type: 'text' | 'photo' | 'youtube' | 'instagram' | 'certificate' | 'criteria';
  content?: string;
  url?: string;
}

export interface Cause {
  id: string;
  name: string;
  target: number;
  completed: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface DonationDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  qrUrl: string;
}

export interface DonationTier {
  amount: number;
  label: string;
  impact: string;
  icon: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  notes?: Record<string, string>;
}

export interface MediaItem {
  id: string;
  type: 'youtube' | 'instagram';
  title: string;
  url: string;
  created_at?: string;
}
