import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock the Gemini service
vi.mock('../geminiService', () => {
  return {
    geminiService: {
      generateChatResponse: vi.fn(),
    }
  };
});

describe('API Endpoints', () => {
  let app: any;
  let geminiMock: any;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../index');
    app = mod.default;
    
    const serviceMod = await import('../geminiService');
    geminiMock = serviceMod.geminiService;
  });

  describe('GET /api/health', () => {
    it('returns 200 OK with status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/chat', () => {
    it('returns 400 if message is missing', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('returns 400 if message is too long', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'a'.repeat(1001) });
      
      expect(response.status).toBe(400);
    });

    it('returns 200 with AI response on success', async () => {
      geminiMock.generateChatResponse.mockResolvedValue('Hello from AI');

      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hi' });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ response: 'Hello from AI' });
      expect(geminiMock.generateChatResponse).toHaveBeenCalledWith('Hi');
    });

    it('returns 500 with fallback message on API failure', async () => {
      geminiMock.generateChatResponse.mockRejectedValue(new Error('API Down'));

      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hi' });
      
      expect(response.status).toBe(500);
      expect(response.body.error).toContain('technical difficulties');
    });
  });
});
