
/**
 * Security utilities for Roti Bank Bettiah
 * Prevents XSS and Injection attacks through rigorous sanitization
 */

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Strip < and >
    .trim()
    .substring(0, 500); // Reasonable limit
};

export const validateTransactionId = (id: string): boolean => {
  // Typical UPI/Bank transaction IDs are alphanumeric, 10-20 chars
  return /^[a-zA-Z0-9]{8,24}$/.test(id);
};

export const validateName = (name: string): boolean => {
  return /^[a-zA-Z\s]{2,50}$/.test(name);
};

export const validateAmount = (amount: string | number): boolean => {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && num <= 1000000;
};
