import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: 'inline',

  transform: {
    formats: ['esm', 'es2017'],
    excludes: ['**/__tests__/**'],
  },
});
