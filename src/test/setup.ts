import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// ── Mock import.meta.env ──────────────────────────────────────────────
// Provides sensible defaults so service modules don't blow up during tests.
vi.stubEnv('VITE_RAZORPAY_KEY', 'rzp_test_MOCK_KEY');
vi.stubEnv('VITE_SUPABASE_URL', 'https://mock.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'mock-anon-key');

// ── Mock process.env for Gemini ───────────────────────────────────────
Object.defineProperty(globalThis, 'process', {
  value: {
    ...globalThis.process,
    env: {
      ...globalThis.process?.env,
      API_KEY: 'mock-gemini-api-key',
    },
  },
  writable: true,
});

// ── Mock IntersectionObserver (jsdom doesn't support it) ──────────────
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

// ── Mock MutationObserver (jsdom support is incomplete) ───────────────
const mockMutationObserver = vi.fn();
mockMutationObserver.mockReturnValue({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn().mockReturnValue([]),
});
vi.stubGlobal('MutationObserver', mockMutationObserver);

// ── Mock window.Razorpay ──────────────────────────────────────────────
vi.stubGlobal('Razorpay', vi.fn());

// ── Mock window.scrollTo ──────────────────────────────────────────────
vi.stubGlobal('scrollTo', vi.fn());

// ── Mock matchMedia (used by some UI libraries) ───────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ── Suppress ResizeObserver warnings from Recharts ────────────────────
const mockResizeObserver = vi.fn();
mockResizeObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
vi.stubGlobal('ResizeObserver', mockResizeObserver);
