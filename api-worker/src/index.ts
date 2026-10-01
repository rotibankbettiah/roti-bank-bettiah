import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createOrder, verifyPayment } from './paymentController';
import { generateChatResponse } from './geminiService';

export type Bindings = {
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  GEMINI_API_KEY: string;
  ALLOWED_ORIGINS?: string;
  RESEND_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
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

app.get('/api/debug-env', (c) => {
  return c.json({
    SUPABASE_URL: c.env.SUPABASE_URL || "undefined",
    SUPABASE_SERVICE_ROLE_KEY_SET: !!c.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY_VAL: c.env.SUPABASE_SERVICE_ROLE_KEY ? c.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 15) + "..." : "undefined",
    RESEND_API_KEY_SET: !!c.env.RESEND_API_KEY,
    RESEND_API_KEY_VAL: c.env.RESEND_API_KEY ? c.env.RESEND_API_KEY.substring(0, 15) + "..." : "undefined"
  });
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

// Type definitions for Supabase Webhook Payload
interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: {
    title?: string;
    content?: string;
    caption?: string;
    imageUrl?: string;
    [key: string]: any;
  };
}

// Webhook / API endpoint to notify subscribers of new content or admin updates
app.post('/api/webhook/notify-subscribers', async (c) => {
  try {
    const payload = await c.req.json() as any;
    
    // Ignore updates/deletes if sent via raw database webhooks
    if (payload.type && payload.type !== 'INSERT' && payload.type !== 'BROADCAST') {
      return c.json({ message: 'Ignored non-insert event' }, 200);
    }

    const table = payload.table || 'updates';
    const record = payload.record || payload;
    const title = record.title || "New Update!";
    const content = record.content || record.caption || record.description || "A new update has been posted on Roti Bank Bettiah.";
    const imageUrl = record.imageUrl || record.image_url;

    let subject = "New Update from Roti Bank Bettiah";
    let category = "Update";
    let sectionAnchor = "";
    
    if (table === 'blogs') {
      subject = `New Blog Post: ${title}`;
      category = "Blog Post";
      sectionAnchor = "#blog";
    } else if (table === 'news') {
      subject = `Latest News: ${title}`;
      category = "News Flash";
      sectionAnchor = "#news";
    } else if (table === 'notices') {
      subject = `Important Notice: ${title}`;
      category = "Official Notice";
      sectionAnchor = "#notices";
    } else if (table === 'causes') {
      subject = `Ongoing Goal Support: ${title}`;
      category = "New Cause";
      sectionAnchor = "#causes";
    } else if (table === 'gallery') {
      subject = `New Gallery Photo Added`;
      category = "Gallery Photo";
      sectionAnchor = "#gallery";
    } else if (table === 'activities') {
      subject = `New Daily Activity: ${title}`;
      category = "Daily Activity";
      sectionAnchor = "#activities";
    } else if (table === 'broadcast' || table === 'announcement') {
      subject = record.subject || `Important Announcement: ${title}`;
      category = "Announcement";
      sectionAnchor = "";
    }

    const supabaseUrl = c.env.SUPABASE_URL;
    const serviceRoleKey = c.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey || !c.env.RESEND_API_KEY) {
      console.error("Missing required environment bindings (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY)");
      return c.json({ error: 'Server configuration error' }, 500);
    }

    // Fetch active subscriber emails
    const response = await fetch(`${supabaseUrl}/rest/v1/subscribers?select=email`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch subscribers: ${await response.text()}`);
    }

    const subscribers = await response.json() as { email: string }[];
    const emailList = Array.from(new Set(subscribers.map(s => s.email?.trim()).filter(Boolean)));

    if (emailList.length === 0) {
      return c.json({ message: 'No active subscribers found in database' }, 200);
    }

    // Email templates markup
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px;">
          <h2 style="color: #059669; margin: 0; font-size: 24px;">Roti Bank Bettiah</h2>
          <p style="color: #64748b; font-size: 14px; margin: 6px 0 0 0;">Fighting Hunger & Sharing Hope in Bihar</p>
        </div>
        
        <div style="padding: 24px 0;">
          <span style="background-color: #ecfdf5; color: #065f46; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px; letter-spacing: 0.05em; display: inline-block;">
            ${category}
          </span>
          <h1 style="color: #0f172a; font-size: 22px; margin-top: 14px; margin-bottom: 12px; line-height: 1.3;">
            ${title}
          </h1>
          <div style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 24px; white-space: pre-wrap;">
            ${content}
          </div>
          
          ${imageUrl ? `<div style="text-align: center; margin-bottom: 24px;"><img src="${imageUrl}" alt="${title}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.06);" /></div>` : ''}
          
          <div style="text-align: center; margin: 32px 0 16px 0;">
            <a href="https://rotibankbettaih.org/${sectionAnchor}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 32px; font-weight: bold; border-radius: 30px; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">
              View on Official Website
            </a>
          </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 4px 0;">You received this email because you subscribed to updates from Roti Bank Bettiah.</p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Roti Bank Bettiah Trust (Reg. No. 5071/2023). Kalibag Chowk, Bettiah, Bihar - 845438.</p>
        </div>
      </div>
    `;

    // Verified domain on Resend is rotibankbettaih.org
    let sender = c.env.SENDER_EMAIL || 'Roti Bank Bettiah <updates@rotibankbettaih.org>';
    
    // Batch recipients in chunks of 45 to comply with Resend single-request limits
    const BATCH_SIZE = 45;
    let sentCount = 0;
    const errors: any[] = [];

    for (let i = 0; i < emailList.length; i += BATCH_SIZE) {
      const chunk = emailList.slice(i, i + BATCH_SIZE);
      const emailPayload = {
        from: sender,
        to: [sender], // Send to sender address
        bcc: chunk,   // BCC subscriber list
        subject: subject,
        html: htmlBody
      };

      try {
        let resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailPayload)
        });

        // Fallback for sandbox domain if needed
        if (!resendResponse.ok) {
          const errorText = await resendResponse.text();
          if (errorText.includes("not verified") && sender !== 'Roti Bank Bettiah <onboarding@resend.dev>') {
            sender = 'Roti Bank Bettiah <onboarding@resend.dev>';
            const fallbackResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: sender,
                to: [emailList[0]],
                subject: subject,
                html: htmlBody
              })
            });
            if (fallbackResponse.ok) {
              sentCount += 1;
            } else {
              errors.push(await fallbackResponse.text());
            }
          } else {
            errors.push(errorText);
          }
        } else {
          sentCount += chunk.length;
        }
      } catch (err: any) {
        errors.push(err.message || String(err));
      }
    }

    return c.json({
      success: true,
      message: `Notifications processed for ${sentCount} subscriber(s).`,
      totalSubscribers: emailList.length,
      sentCount,
      errors: errors.length > 0 ? errors : undefined
    }, 200);

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return c.json({ error: error.message || 'Internal Server Error' }, 500);
  }
});

export default app;
