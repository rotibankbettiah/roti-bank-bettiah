import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createOrder, verifyPayment } from './paymentController';
import { generateChatResponse } from './geminiService';

export type Bindings = {
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  GEMINI_API_KEY: string;
  ALLOWED_ORIGINS?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all routes under /api
app.use(
  '/api/*',
  cors({
    origin: (origin) => {
      // In production, you might want to restrict this based on env.ALLOWED_ORIGINS
      return origin; 
    },
    credentials: true,
  })
);

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (c) => {
  try {
    const body = await c.req.json();
    const message = body.message;

    if (!message || typeof message !== 'string') {
      return c.json({ error: 'Valid message string is required' }, 400);
    }

    if (message.trim().length === 0 || message.length > 1000) {
      return c.json({ error: 'Message must be between 1 and 1000 characters' }, 400);
    }

    const responseText = await generateChatResponse(message, c.env.GEMINI_API_KEY);
    return c.json({ response: responseText }, 200);
  } catch (error) {
    console.error('Chat API Error:', error);
    return c.json(
      { error: "I'm currently experiencing some technical difficulties. Please contact us directly at **+91 9473228888**." },
      500
    );
  }
});

// Payment endpoints
app.post('/api/payments/order', createOrder);
app.post('/api/payments/verify', verifyPayment);

export default app;
