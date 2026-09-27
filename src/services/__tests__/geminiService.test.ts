import { describe, it, expect, beforeEach } from 'vitest';
import { GeminiService } from '../geminiService';

describe('Autonomous AI Assistant (GeminiService)', () => {
  let service: GeminiService;

  beforeEach(() => {
    service = new GeminiService();
  });

  it('answers donation queries with UPI and includes [SHOW_QR] trigger', async () => {
    const result = await service.generateChatResponse('How can I donate money?');
    expect(result).toContain('80G Tax Exemption');
    expect(result).toContain('rotibankbettiah@pnb');
    expect(result).toContain('[SHOW_QR]');
  });

  it('answers Section 80G tax exemption questions accurately', async () => {
    const result = await service.generateChatResponse('Is donation tax deductible under 80G?');
    expect(result).toContain('Section 80G');
    expect(result).toContain('50% tax deduction');
    expect(result).toContain('PAN Card');
  });

  it('provides official PNB bank account details', async () => {
    const result = await service.generateChatResponse('What is your bank account number and IFSC?');
    expect(result).toContain('Punjab National Bank');
    expect(result).toContain('PUNB0191920');
    expect(result).toContain('1919202100001486');
  });

  it('answers food distribution locations and timings', async () => {
    const result = await service.generateChatResponse('Where and when do you distribute food?');
    expect(result).toContain('MJK Government Hospital');
    expect(result).toContain('Bettiah Junction Railway Station');
    expect(result).toContain('6:30 PM');
    expect(result).toContain('8:30 PM');
  });

  it('answers volunteer questions and certification', async () => {
    const result = await service.generateChatResponse('How do I join as a volunteer?');
    expect(result).toContain('Volunteering');
    expect(result).toContain('Certificate of Appreciation');
  });

  it('handles wedding surplus and party food collection requests', async () => {
    const result = await service.generateChatResponse('We have leftover food from a wedding in Bettiah');
    expect(result).toContain('Surplus Food Collection');
    expect(result).toContain('+91 9473228888');
    expect(result).toContain('freshness and quality');
  });

  it('answers Hindi and Hinglish queries seamlessly', async () => {
    const hindiLoc = await service.generateChatResponse('Khana kaha milta hai aur kis time?');
    expect(hindiLoc).toContain('MJK Government Hospital');

    const hindiHelp = await service.generateChatResponse('Roti bank me madad kaise kare?');
    expect(hindiHelp.length).toBeGreaterThan(50);
  });

  it('answers founder and history questions', async () => {
    const result = await service.generateChatResponse('Who started Roti Bank Bettiah?');
    expect(result).toContain('Abishek Giri');
    expect(result).toContain('2018');
  });

  it('provides a graceful fallback with contact details for unknown queries', async () => {
    const result = await service.generateChatResponse('Can you teach me quantum physics in French?');
    expect(result).toContain('Roti Bank Bettiah');
    expect(result).toContain('+91 9473228888');
  });

  it('provides relevant follow-up suggestion chips', () => {
    const suggestions = service.getSuggestions('How to donate?');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions).toContain('How to get 80G tax receipt?');
  });
});


