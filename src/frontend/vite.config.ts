import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite automatically loads matching .env* files into import.meta.env.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
