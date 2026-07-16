// Cloudflare Worker that strips the Content-Security-Policy header
// and replaces it with the correct one.
// This is needed because the Cloudflare Workers auto-config bot
// is injecting an old, incorrect CSP header.

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const newResponse = new Response(response.body, response);
    
    // Remove the old broken CSP and replace with correct one
    newResponse.headers.delete('Content-Security-Policy');
    newResponse.headers.set('Content-Security-Policy', 
      "default-src 'self' https: wss:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com https://*.cloudflare.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
      "img-src 'self' data: blob: https:; " +
      "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
      "connect-src 'self' https: wss:; " +
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://www.youtube.com https://www.instagram.com; " +
      "object-src 'none'; " +
      "base-uri 'self';"
    );
    
    return newResponse;
  }
};
