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

// Webhook endpoint to notify subscribers of new content
app.post('/api/webhook/notify-subscribers', async (c) => {
  try {
    const payload = await c.req.json() as SupabaseWebhookPayload;
    
    // Notify only on new insertions
    if (payload.type !== 'INSERT') {
      return c.json({ message: 'Ignored non-insert event' }, 200);
    }

    const { table, record } = payload;
    const title = record.title || "New Update!";
    const content = record.content || record.caption || "A new update has been posted on Roti Bank Bettiah.";
    const imageUrl = record.imageUrl;

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
      subject = `New Gallery Update`;
      category = "Gallery Photo";
      sectionAnchor = "#gallery";
    } else if (table === 'activities') {
      subject = `New Activity Update`;
      category = "Daily Activity";
      sectionAnchor = "#activities";
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
    const emailList = subscribers.map(s => s.email);

    if (emailList.length === 0) {
      return c.json({ message: 'No active subscribers found' }, 200);
    }

    // Email templates markup
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e8ed; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px;">
          <h2 style="color: #059669; margin: 0;">Roti Bank Bettiah</h2>
          <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Nourishing Lives, Sharing Compassion</p>
        </div>
        
        <div style="padding: 20px 0;">
          <span style="background-color: #ecfdf5; color: #065f46; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.05em;">
            ${category}
          </span>
          <h1 style="color: #0f172a; font-size: 22px; margin-top: 15px; margin-bottom: 10px; line-height: 1.3;">
            ${title}
          </h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            ${content}
          </p>
          
          ${imageUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${imageUrl}" alt="${title}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);" /></div>` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://rotibankbettiah.org/${sectionAnchor}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 30px; font-size: 14px; box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);">
              View on Website
            </a>
          </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.5;">
          <p>You received this email because you subscribed to updates from Roti Bank Bettiah.</p>
          <p>&copy; ${new Date().getFullYear()} Roti Bank Bettiah Trust. Kalibag Chowk, Bettiah, Bihar - 845438.</p>
        </div>
      </div>
    `;

    // Send emails using Resend REST API
    let sender = c.env.SENDER_EMAIL || 'Roti Bank Bettiah <no-reply@rotibankbettiah.org>';
    let recipients = emailList; // Send to ALL subscribers by default
    
    // If using the sandbox onboarding domain, Resend only allows sending to the registered account email
    let isSandbox = false;
    if (sender.includes('onboarding@resend.dev')) {
      isSandbox = true;
      recipients = [emailList[0]];
    }

    const emailPayload: any = {
      from: sender,
      subject: subject,
      html: htmlBody
    };

    if (isSandbox) {
      emailPayload.to = recipients; // Send directly to the owner in sandbox
    } else {
      emailPayload.to = [sender]; // Send to self (the no-reply address)
      emailPayload.bcc = recipients; // BCC all subscribers to hide their emails
    }

    let resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    // If it fails because the custom domain is not verified, fall back to sandbox onboarding
    if (!resendResponse.ok) {
      const errorText = await resendResponse.clone().text();
      if (errorText.includes("not verified") && sender !== 'Roti Bank Bettiah <onboarding@resend.dev>') {
        console.warn("Custom domain is not verified. Falling back to Resend onboarding sandbox to deliver a test email.");
        sender = 'Roti Bank Bettiah <onboarding@resend.dev>';
        recipients = [emailList[0]]; // Send only to the first subscriber (the owner account) in sandbox
        
        resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: sender,
            to: recipients,
            subject: subject,
            html: htmlBody
          })
        });
      }
    }

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${await resendResponse.text()}`);
    }

    const resendData = await resendResponse.json();
    return c.json({ success: true, message: `Notifications sent successfully`, data: resendData }, 200);

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return c.json({ error: error.message || 'Internal Server Error' }, 500);
  }
});

export default app;
