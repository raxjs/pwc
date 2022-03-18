import type { ModuleFormat, Plugin } from 'rollup';
import type { JscTarget } from '@swc/core';

export interface DistTaskOptions {
  minify?: boolean;
  input: string;
  output: string;
  format?: ModuleFormat;
  plugins?: Plugin[];
  esTarget?: JscTarget;
}
