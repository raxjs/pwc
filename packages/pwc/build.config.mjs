import { defineConfig } from '@ice/pkg-cli';

export default defineConfig({
  umd: true,
  sourceMaps: 'inline',
  exclude: ['**/__tests__/**'],
});
