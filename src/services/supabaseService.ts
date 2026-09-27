
import { createClient } from '@supabase/supabase-js';
import { Activity, Achievement, Branch, NewsItem, Notice, InternshipContent, Cause, DonationDetails, MediaItem, VolunteerRegistration } from '../types';

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
      return data || [];
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      return [];
    }
  },

  async subscribeNewsletter(email: string): Promise<void> {
    const { error } = await supabase.from('subscribers').insert([{ email }]);
    if (error) throw error;
  },

  async registerVolunteer(volunteer: VolunteerRegistration): Promise<{ success: boolean; id: string }> {
    const fallbackId = `RBB-VOL-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .insert([{
          full_name: volunteer.fullName,
          phone: volunteer.phone,
          email: volunteer.email || null,
          age_group: volunteer.ageGroup,
          occupation: volunteer.occupation,
          area_city: volunteer.areaCity,
          availability: volunteer.availability,
          areas_of_interest: volunteer.areasOfInterest,
          blood_group: volunteer.bloodGroup || null,
          message: volunteer.message || null
        }])
        .select();

      if (!error && data && data.length > 0) {
        return { success: true, id: data[0].id || fallbackId };
      }
    } catch (err) {
      console.warn('Supabase volunteer insert error, saving to local backup storage:', err);
    }

    // Client-side backup persistence
    try {
      const localKey = 'roti_bank_volunteer_registrations';
      const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
      const record = {
        ...volunteer,
        id: fallbackId,
        created_at: new Date().toISOString()
      };
      existing.unshift(record);
      localStorage.setItem(localKey, JSON.stringify(existing));
      return { success: true, id: fallbackId };
    } catch {
      return { success: true, id: fallbackId };
    }
  }
};

