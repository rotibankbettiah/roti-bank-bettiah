
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
