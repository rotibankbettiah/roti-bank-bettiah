import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Supabase client
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();
const mockMaybeSingle = vi.fn();
const mockLimit = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
  })),
}));

// Build chain helper
function buildChain(data: any, error: any = null) {
  mockMaybeSingle.mockResolvedValue({ data, error });
  mockSingle.mockResolvedValue({ data, error });
  mockOrder.mockResolvedValue({ data, error });
  mockLimit.mockReturnValue({ maybeSingle: mockMaybeSingle });
  mockSelect.mockReturnValue({
    single: mockSingle,
    order: mockOrder,
    limit: mockLimit,
    then: (resolve: any) => resolve({ data, error }),
  });
  mockInsert.mockResolvedValue({ data: null, error });
  mockFrom.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
  });
}

describe('supabaseService', () => {
  let supabaseService: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Dynamically re-import to get fresh module
    const mod = await import('../supabaseService');
    supabaseService = mod.supabaseService;
  });

  // ── getGalleryImages ────────────────────────────────────────────

  describe('getGalleryImages', () => {
    it('returns gallery data from Supabase', async () => {
      const mockData = [{ id: '1', title: 'Photo 1', imageUrl: 'url1' }];
      buildChain(mockData);

      const result = await supabaseService.getGalleryImages();
      expect(mockFrom).toHaveBeenCalledWith('gallery');
      expect(result).toEqual(mockData);
    });

    it('returns empty array when data is null', async () => {
      buildChain(null);
      const result = await supabaseService.getGalleryImages();
      expect(result).toEqual([]);
    });

    it('throws when Supabase returns an error', async () => {
      buildChain(null, { message: 'DB error', code: '500' });
      await expect(supabaseService.getGalleryImages()).rejects.toEqual(
        expect.objectContaining({ message: 'DB error' })
      );
    });
  });

  // ── getAboutContent ─────────────────────────────────────────────

  describe('getAboutContent', () => {
    it('returns about content string', async () => {
      buildChain({ content: 'We are Roti Bank' });
      const result = await supabaseService.getAboutContent();
      expect(result).toBe('We are Roti Bank');
    });

    it('returns empty string when data is null', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });
      mockSelect.mockReturnValue({ single: mockSingle });
      mockFrom.mockReturnValue({ select: mockSelect });
      const result = await supabaseService.getAboutContent();
      expect(result).toBe('');
    });
  });

  // ── getDonationDetails ──────────────────────────────────────────

  describe('getDonationDetails', () => {
    it('returns donation details from Supabase', async () => {
      const donationData = {
        accountHolder: 'ROTI BANK BETTIAH',
        bankName: 'Punjab National Bank',
        accountNumber: '1919202100001486',
        ifscCode: 'PUNB0191920',
        qrUrl: '/QR.png.jpg',
      };
      buildChain(donationData);
      const result = await supabaseService.getDonationDetails();
      expect(result).toEqual(donationData);
    });

    it('returns default fallback when data is null', async () => {
      buildChain(null);
      const result = await supabaseService.getDonationDetails();
      expect(result.accountHolder).toBe('ROTI BANK BETTIAH');
      expect(result.bankName).toBe('Punjab National Bank');
      expect(result.accountNumber).toBe('1919202100001486');
    });
  });

  // ── subscribeNewsletter ─────────────────────────────────────────

  describe('subscribeNewsletter', () => {
    it('inserts the email into subscribers table', async () => {
      buildChain(null);
      await supabaseService.subscribeNewsletter('test@example.com');
      expect(mockFrom).toHaveBeenCalledWith('subscribers');
      expect(mockInsert).toHaveBeenCalledWith([{ email: 'test@example.com' }]);
    });

    it('throws on insert error', async () => {
      buildChain(null, { message: 'Duplicate', code: '23505' });
      await expect(
        supabaseService.subscribeNewsletter('existing@example.com')
      ).rejects.toEqual(expect.objectContaining({ code: '23505' }));
    });
  });

  // ── getAchievements ─────────────────────────────────────────────

  describe('getAchievements', () => {
    it('returns achievements array', async () => {
      const data = [{ id: '1', icon: 'fa-medal', count: '500K', description: 'Meals' }];
      buildChain(data);
      const result = await supabaseService.getAchievements();
      expect(result).toEqual(data);
    });
  });

  // ── getCauses ───────────────────────────────────────────────────

  describe('getCauses', () => {
    it('returns causes array', async () => {
      const data = [{ id: '1', name: 'Hunger Free', target: 100000, completed: 50000 }];
      buildChain(data);
      const result = await supabaseService.getCauses();
      expect(result).toEqual(data);
    });
  });
});
