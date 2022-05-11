import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: 'inline',

  transform: {
    formats: ['cjs', 'es2017', 'esm'],
    excludes: ['**/__tests__/**'],
  },
});
