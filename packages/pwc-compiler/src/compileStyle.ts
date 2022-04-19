import type { SourceMap, ProcessOptions } from 'postcss';
import postcss from 'postcss';
import type { RawSourceMap } from 'source-map';
import type { SFCDescriptor } from './parse.js';

// type definition in postcss (source-map-js) is different from source-map v0.7
interface AdaptorRawSourceMap extends Omit<RawSourceMap, 'version' | 'file'> {
  version: string;
}
export interface SFCStyleCompileResults {
  code: string;
  map: AdaptorRawSourceMap | null;
  errors: Error[];
}

export function compileStyle(descriptor: SFCDescriptor): SFCStyleCompileResults {
  const source = descriptor.style.content;
  const { filename } = descriptor;
  const errors: Error[] = [];
  const plugins = []; // TODO:
  let result;
  let code: string | undefined;
  let outMap: SourceMap | undefined;
  const postCSSOptions: ProcessOptions = {
    to: filename,
    from: filename,
    map: {
      inline: false,
      annotation: false,
    },
  };

  try {
    result = postcss(plugins).process(source, postCSSOptions);
  } catch (err) {
    errors.push(err);
  }

  code = result.css;
  outMap = result.map;

  return {
    code: code || '',
    map: outMap && outMap.toJSON(),
    errors,
  };
}
