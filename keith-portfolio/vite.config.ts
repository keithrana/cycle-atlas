import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// INLINE=1 bakes every image and font into the JS/CSS (used for the one-file cloud preview).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { assetsInlineLimit: process.env.INLINE ? 100_000_000 : 4096 },
});
