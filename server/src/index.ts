import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { geminiService } from './geminiService';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ───────────────────────────────────────────

// 1. Helmet headers
app.use(helmet());

// 2. CORS handling
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173']; // Localdev defaults

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    // and requests from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, you might want to log blocked origins
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

// 3. Body Parsing
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks

// 4. Rate Limiting for Chat API
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 chat requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after a minute' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Routes ────────────────────────────────────────────────────────

// Health Check (Used by Render)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat Proxy Endpoint
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message string is required' });
    }

    if (message.trim().length === 0 || message.length > 1000) {
      return res.status(400).json({ error: 'Message must be between 1 and 1000 characters' });
    }

    const responseText = await geminiService.generateChatResponse(message);
    
    return res.status(200).json({ response: responseText });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ 
      error: "I'm currently experiencing some technical difficulties. Please contact us directly at **+91 9473228888**."
    });
  }
});

// ── Start Server ──────────────────────────────────────────────────

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Roti Bank API Server running on port ${PORT}`);
    console.log(`CORS Allowed Origins: ${allowedOrigins.join(', ')}`);
  });
}

// Export for testing
export default app;
