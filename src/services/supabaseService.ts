
import { createClient } from '@supabase/supabase-js';
import { Activity, Achievement, Branch, NewsItem, Notice, InternshipContent, Cause, DonationDetails, MediaItem } from '../types';
import { DEFAULT_BLOGS } from './utils/defaultBlogs';

const SUPABASE_URL = 'https://rvkgeoqrxkxjmvdjiyli.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2a2dlb3FyeGt4am12ZGppeWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NDg4NzQsImV4cCI6MjA3MTAyNDg3NH0.9N2fioPJWAWIZYisDa5X_arw2YMpngxF5zw-GP1mP3I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const supabaseService = {
  async getGalleryImages(): Promise<Activity[]> {
    const { data, error } = await supabase.from('gallery').select('*');
    if (error) throw error;
    return data || [];
  },

  async getAboutContent(): Promise<string> {
    const { data, error } = await supabase.from('about').select('content').single();
    if (error) throw error;
    return data?.content || '';
  },

  async getBanner(): Promise<string> {
    const { data, error } = await supabase.from('banners').select('imageUrl').single();
    if (error) return '';
    return data?.imageUrl || '';
  },

  async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase.from('achievements').select('*');
    if (error) throw error;
    return data || [];
  },

  async getBranches(): Promise<Branch[]> {
    const { data, error } = await supabase.from('branches').select('*');
    if (error) throw error;
    return data || [];
  },

  async getActivities(): Promise<Activity[]> {
    const { data, error } = await supabase.from('activities').select('*');
    if (error) throw error;
    return data || [];
  },

  async getNotices(): Promise<Notice[]> {
    const { data, error } = await supabase.from('notices').select('*');
    if (error) throw error;
    return data || [];
  },

  async getCauses(): Promise<Cause[]> {
    const { data, error } = await supabase.from('causes').select('*');
    if (error) throw error;
    return data || [];
  },

  async getNews(): Promise<NewsItem[]> {
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getInternshipContent(): Promise<InternshipContent[]> {
    const { data, error } = await supabase.from('internship_corner').select('*');
    if (error) throw error;
    return data || [];
  },

  async getDonationDetails(): Promise<DonationDetails> {
    try {
      const { data, error } = await supabase.from('donations').select('*').limit(1).maybeSingle();
      
      // If error occurs (like 406 Not Acceptable because table is empty or missing), silently fall back
      if (data && !error) {
        return data;
      }
    } catch (err) {
      // Ignore fetch errors to gracefully fallback
    }
    
    return {
      accountHolder: 'ROTI BANK BETTIAH',
      bankName: 'Punjab National Bank',
      accountNumber: '1919202100001486',
      ifscCode: 'PUNB0191920',
      qrUrl: '/QR.png.jpg' 
    };
  },

  async getMediaItems(): Promise<MediaItem[]> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch media:', err);
      return [];
    }
  },

  async getBlogs() {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        return DEFAULT_BLOGS;
      }
      return data;
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      return DEFAULT_BLOGS;
    }
  },

  async subscribeNewsletter(email: string): Promise<void> {
    const { error } = await supabase.from('subscribers').insert([{ email }]);
    if (error) throw error;
  }
};
