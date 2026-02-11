import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/mokblok-tools/',
  plugins: [react()],
  resolve: {
    alias: {
      '@data': path.resolve(__dirname, 'src/data'),
      '@settings': path.resolve(__dirname, 'src/settings'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
    },
  },
});
