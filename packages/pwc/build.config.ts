import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: 'inline',

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
