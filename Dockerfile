# ── Stage 1: Build ────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files first for better Docker layer caching
COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

# Copy the rest of the source code
COPY . .

# Build arguments for environment variables (passed at build time)
ARG VITE_RAZORPAY_KEY=""
ARG GEMINI_API_KEY=""
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""

ENV VITE_RAZORPAY_KEY=$VITE_RAZORPAY_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
