import { defineConfig } from '@ice/pkg-cli';

export default defineConfig({
  lib: true,
  sourceMaps: 'inline',
  exclude: ['**/__tests__/**'],
});
