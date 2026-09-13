import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  external: ['preact', '@kolektiv/brand-core'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'preact';
  },
});
