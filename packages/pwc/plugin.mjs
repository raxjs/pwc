const plugin = (api) => {
  api.registerTask('component-bundle-es', {
    type: 'bundle',
    outputDir: 'dist',
    swcCompileOptions: {
      jsc: {
        target: 'es2022',
      },
      env: undefined,
    },
    rollupOptions: {
      output: {
        format: 'es',
        file: './dist/index.es.js',
      },
    },
  });
};

export default plugin;
