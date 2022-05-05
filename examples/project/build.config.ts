import { defineConfig } from '@ice/pkg';
// import pwc from 'build-plugin-pwc';

export default defineConfig({
  bundle: {
    formats: ['umd', 'es2017']
  },
  transform: {
    formats: ['esm', 'es2017']
  },
  plugins:[
    'build-plugin-pwc'
  ]
});
