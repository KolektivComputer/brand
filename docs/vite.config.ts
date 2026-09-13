import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Docs are a static site served from the repository root `dist/` (matching the
// GitHub Pages workflow). `base: './'` keeps asset URLs relative so the site
// works both at a custom domain root and at a project-page subpath.
export default defineConfig({
  base: './',
  plugins: [tailwindcss(), react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 8081,
    strictPort: true,
  },
});
