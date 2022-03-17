import type { ModuleFormat, Plugin } from 'rollup';

export interface DistTaskOptions {
  minify?: boolean;
  input: string;
  output: string;
  format?: ModuleFormat;
  plugins?: Plugin[];
}
