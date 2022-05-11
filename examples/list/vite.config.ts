import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

export default defineConfig({
  plugins: [
    babel({
      babelConfig: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                chrome: 99,
              },
              modules: false,
            },
          ],
        ],
        plugins: [
          [
            '@babel/plugin-proposal-decorators',
            {
              version: '2021-12',
            },
          ],
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-class-static-block',
          '@babel/plugin-proposal-private-methods'
        ],
      },
    }),
  ],
});
