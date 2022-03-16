import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

export default defineConfig({
  plugins: [
    babel({
      babelConfig: {
        presets: [
          ['@babel/preset-env', {
            targets: { chrome: 60 },
            modules: false,
          }],
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', {
            version: '2021-12',
          }],
          '@babel/plugin-proposal-class-properties',
        ],
      },
    }),
  ],
});
