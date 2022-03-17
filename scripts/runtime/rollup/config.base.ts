import type { RollupOptions } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import swc from 'rollup-plugin-swc';
import type { DistTaskOptions } from '../type';

export default function getBaseConfig(options: DistTaskOptions): RollupOptions {
  const { input, output, format = 'umd', plugins = [] } = options;

  return {
    input: input,
    output: {
      file: output,
      format,
      sourcemap: 'hidden',
      esModule: format === 'esm',
    },
    plugins: [
      nodeResolve({
        extensions: ['.ts', '.js'],
      }),
      swc({
        jsc: {
          parser: {
            syntax: 'typescript',
          },
          target: 'es5',
        },
      }),
      ...plugins
    ],
  };
}
