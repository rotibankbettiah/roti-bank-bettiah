import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GeminiService } from '../geminiService';

describe('GeminiService', () => {
  let service: GeminiService;

  beforeEach(() => {
    service = new GeminiService();
    // Mock the global fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the generated text on success', async () => {
    const mockResponse = { response: 'Hello, I am the Roti Bank Assistant.' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await service.generateChatResponse('Hi');
    
    expect(result).toBe(mockResponse.response);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/chat'), expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ message: 'Hi' })
    }));
  });

  it('returns fallback message when response.response is empty', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: '' }),
    });

    const result = await service.generateChatResponse('Hi');
    expect(result).toBe("I'm sorry, I couldn't generate a response. Please try again.");
  });

  it('returns error message when fetch fails (e.g. 500)', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await service.generateChatResponse('Hi');
    expect(result).toContain('technical difficulties');
  });

  it('returns error message on network failure', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const result = await service.generateChatResponse('Hi');
    expect(result).toContain('technical difficulties');
  });
});
