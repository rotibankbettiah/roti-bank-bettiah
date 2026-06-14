import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  validateTransactionId,
  validateName,
  validateAmount,
} from '../security';

// ── sanitizeInput ─────────────────────────────────────────────────────

describe('sanitizeInput', () => {
  it('returns empty string for falsy input', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
    expect(sanitizeInput(null as unknown as string)).toBe('');
  });

  it('strips < and > to prevent XSS', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('truncates input to 500 characters', () => {
    const longString = 'a'.repeat(600);
    expect(sanitizeInput(longString).length).toBe(500);
  });

  it('passes through clean input unchanged', () => {
    expect(sanitizeInput('Roti Bank Bettiah')).toBe('Roti Bank Bettiah');
  });

  it('handles combined edge cases (whitespace + html + long)', () => {
    const input = '   ' + '<b>' + 'x'.repeat(600) + '</b>' + '   ';
    const result = sanitizeInput(input);
    expect(result.length).toBeLessThanOrEqual(500);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });
});

// ── validateTransactionId ─────────────────────────────────────────────

describe('validateTransactionId', () => {
  it('accepts valid alphanumeric IDs (8–24 chars)', () => {
    expect(validateTransactionId('ABCD1234')).toBe(true);          // 8 chars
    expect(validateTransactionId('pay_12345678901234')).toBe(false); // contains underscore
    expect(validateTransactionId('TX1234567890ABCDEF123456')).toBe(true); // 24 chars
  });

  it('rejects IDs shorter than 8 characters', () => {
    expect(validateTransactionId('ABC1234')).toBe(false);
  });

  it('rejects IDs longer than 24 characters', () => {
    expect(validateTransactionId('a'.repeat(25))).toBe(false);
  });

  it('rejects IDs with special characters', () => {
    expect(validateTransactionId('pay_123!')).toBe(false);
    expect(validateTransactionId('TX-12345678')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateTransactionId('')).toBe(false);
  });
});

// ── validateName ──────────────────────────────────────────────────────

describe('validateName', () => {
  it('accepts valid names with letters and spaces (2–50 chars)', () => {
    expect(validateName('Bipin Kumar')).toBe(true);
    expect(validateName('AB')).toBe(true);
  });

  it('rejects names shorter than 2 characters', () => {
    expect(validateName('A')).toBe(false);
  });

  it('rejects names longer than 50 characters', () => {
    expect(validateName('A'.repeat(51))).toBe(false);
  });

  it('rejects names with numbers', () => {
    expect(validateName('Bipin123')).toBe(false);
  });

  it('rejects names with special characters', () => {
    expect(validateName('Bipin@Kumar')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateName('')).toBe(false);
  });
});

// ── validateAmount ────────────────────────────────────────────────────

describe('validateAmount', () => {
  it('accepts valid positive amounts', () => {
    expect(validateAmount(100)).toBe(true);
    expect(validateAmount(1)).toBe(true);
    expect(validateAmount(999999)).toBe(true);
    expect(validateAmount(1000000)).toBe(true);
  });

  it('accepts string representations of valid amounts', () => {
    expect(validateAmount('500')).toBe(true);
    expect(validateAmount('100.50')).toBe(true);
  });

  it('rejects zero', () => {
    expect(validateAmount(0)).toBe(false);
  });

  it('rejects negative amounts', () => {
    expect(validateAmount(-100)).toBe(false);
  });

  it('rejects amounts exceeding 1,000,000', () => {
    expect(validateAmount(1000001)).toBe(false);
  });

  it('rejects NaN values', () => {
    expect(validateAmount('not-a-number')).toBe(false);
    expect(validateAmount(NaN)).toBe(false);
  });
});
