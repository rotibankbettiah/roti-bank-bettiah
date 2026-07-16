import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',

    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
        }
      }
    },

    plugins: [react(), tailwindcss(), cloudflare()],

    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          admin: path.resolve(__dirname, 'admin.html'),
          about: path.resolve(__dirname, 'about.html'),
        },
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
  };
});