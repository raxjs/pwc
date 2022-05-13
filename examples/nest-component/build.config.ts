import { defineConfig } from '@ice/pkg';
// import pwc from 'build-plugin-pwc';

export default defineConfig({
  bundle: {
    formats: ['umd']
  },
  plugins:[
    [
      '@ice/pkg-plugin-docusaurus',
      {
        // mobilePreview: true
      }
    ],
    'build-plugin-pwc'
  ]
});
