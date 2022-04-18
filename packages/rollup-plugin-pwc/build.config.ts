import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: 'inline',

  transform: {
    formats: ['cjs', 'esm', 'es2017'],
    excludes: ['**/__tests__/**'],
  },
});
