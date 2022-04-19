import { defineConfig } from '@ice/pkg';

export default defineConfig({
  sourceMaps: 'inline',

  transform: {
    excludes: ['**/__tests__/**'],
  },
});
