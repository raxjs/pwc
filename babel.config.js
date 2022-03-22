module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    '@babel/preset-typescript',
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
  ],
  ignore: ['node_modules', 'dist', 'es', 'esnext'],
};
