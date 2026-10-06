// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Vite bundler build setup, React plugin configuration, and dev server proxy
// Key Interface/Contract: Runs dev server on port 5173 and proxies `/api` calls to FastAPI backend on port 8000

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
