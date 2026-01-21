
import { createClient } from '@supabase/supabase-js';
import { Activity, Achievement, Branch, NewsItem, Notice, InternshipContent, Cause, DonationDetails } from '../../types';

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
    const { data, error } = await supabase.from('donations').select('*').single();
    if (error) throw error;
    return data;
  }
};
