import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { buildNoFlashScript } from '@kolektiv/common-docs-chrome';
import { defineConfig, type Plugin } from 'vite';

// Docs are a static site served from the repository root `dist/` (matching the
// GitHub Pages workflow). `base: './'` keeps asset URLs relative so the site
// works both at a custom domain root and at a project-page subpath.

// The shared prefs engine (`@kolektiv/common-docs-chrome`) persists the active
// site/code theme under `kdc:*` and reflects it onto `<html data-theme
// data-code-theme>`. Inline the core's no-flash snippet before first paint so
// returning visitors never flash the default theme.
const noFlashPrefs = (): Plugin => ({
  name: 'kolektiv-no-flash-prefs',
  transformIndexHtml() {
    return [
      {
        tag: 'script',
        attrs: { 'data-kolektiv-no-flash': '' },
        children: buildNoFlashScript(),
        injectTo: 'head-prepend',
      },
    ];
  },
});

export default defineConfig({
  base: './',
  plugins: [noFlashPrefs(), tailwindcss(), react()],
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
