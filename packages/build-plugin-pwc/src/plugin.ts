import type { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { transformPWC } from './pwc.js';
import { join } from 'path';
import { readFileSync } from 'fs';


interface Options {
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
}

export default function PluginPWC({
  include = /\.pwc$/,
  exclude,
}: Options): Plugin {
  const rootContext = process.cwd();
  const filter = createFilter(include, exclude);

  return {
    name: 'pwc',
    load(id) {
      // TODO: passing id and rootDir as params to get absolutePath
      if (filter(id)) {
        const tempFilePath = join(rootContext, 'src', id);
        const result = readFileSync(tempFilePath, 'utf-8');
        return {
          code: result,
        };
      }
      return null;
    },

    transform(code, id) {
      if (filter(id)) {
        const { script, style } = transformPWC(code, id, rootContext, this);
        if (typeof style === 'object') {
          // TODO: distinguish transform task and bundle task
          this.emitFile({
            type: 'asset',
            // TODO: relative path
            fileName: 'index.css',
            source: style.code,
          });
        }
        if (typeof script === 'object') {
          return {
            code: script.code,
            map: script.map,
            meta: {
              ext: '.js',
            },
          };
        }
      }
      return null;
    },
  };
}
