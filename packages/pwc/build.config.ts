import { defineConfig } from '@ice/pkg-cli';

export default defineConfig({
  // @ts-ignore
  umd: true,
  sourceMaps: 'inline',
  exclude: ['**/__tests__/**'],
  plugins: ['./plugin.mjs'],
});
