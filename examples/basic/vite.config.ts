import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import * as babelConfig from '../../babel.config.js';

export default defineConfig({
  plugins: [
    babel({
      babelConfig,
    }),
  ],
});
