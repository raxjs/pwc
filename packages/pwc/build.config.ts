import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: false,

  transform: {
    excludes: ['**/__tests__/**'],
  },

  bundle: {
    development: true,
    formats: ['umd', 'es2017'],
    filename: 'pwc',
    externals: false,
  },
});
