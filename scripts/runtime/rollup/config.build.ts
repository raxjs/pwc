import type { RollupOptions } from 'rollup';
import { minify } from 'rollup-plugin-esbuild';
import type { DistTaskOptions } from '../type';
import getBaseConfig from './config.base';

export default function getBuildConfig(options: DistTaskOptions): RollupOptions {
  if (options.minify) {
    return getBaseConfig({
      ...options,
      plugins: [minify()],
    });
  }

  return getBaseConfig(options);
}
