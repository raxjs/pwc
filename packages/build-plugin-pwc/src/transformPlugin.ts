import type { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { transformPWC } from './pwc.js';
import type { Options } from './options.js';
import { basename, relative, join } from 'path';
import { readFileSync } from 'fs';

export default function TransformPluginPWC({
  include = /\.pwc$/,
  exclude,
  rootDir,
}: Options): Plugin {
  const filter = createFilter(include, exclude);

  return {
    name: 'transform-pwc',
    load(id) {
      if (filter(id)) {
        const result = readFileSync(id, 'utf-8');
        return {
          code: result,
        };
      }
      return null;
    },

    transform(code, id) {
      if (filter(id)) {
        const styleFilename = basename(id).replace(include, '.css');
        const { script, style } = transformPWC(code, {
          filename: id,
          styleFilename,
          sourceRoot: rootDir,
          pluginContext: this,
        });
        if (typeof style === 'object') { // TODO
          const relativePwcFilename = relative(join(rootDir, 'src'), id);
          const styleFilename = relativePwcFilename.replace(include, '.css');
          this.emitFile({
            type: 'asset',
            fileName: styleFilename,
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
