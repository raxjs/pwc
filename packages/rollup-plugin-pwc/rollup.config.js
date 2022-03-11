import typescript from '@rollup/plugin-typescript';
import { builtinModules } from 'module';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  external: Object.keys(pkg.dependencies || {}).concat(builtinModules),
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      exports: 'auto',
    },
    {
      format: 'esm',
      file: pkg.module,
    },
  ],
  plugins: [typescript({ sourceMap: false })],
};
