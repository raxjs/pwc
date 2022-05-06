import type { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { transformPWC } from './pwc.js';
import type { Options } from './options.js';
import { basename } from 'path';
import { readFileSync } from 'fs';

const styleCodeCache = {};

const PWC_CSS_EXT = '.pwc.css';
const isPwcCssFile = (filename: string) => filename.endsWith(PWC_CSS_EXT);

export default function BundlePluginPWC({
  include = /\.pwc$/,
  exclude,
  rootDir,
}: Options): Plugin {
  const filter = createFilter(include, exclude);

  return {
    name: 'bundle-pwc',
    resolveId(source, importer) {
      if (isPwcCssFile(source)) {
        return importer.replace(include, PWC_CSS_EXT); // Key in styleCodeCache
      }
      return null;
    },
    load(id) {
      if (isPwcCssFile(id)) {
        // Directly return style cache stored in transform hook
        return {
          code: styleCodeCache[id],
          map: null,
        };
      }
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
        const styleFilename = id.replace(include, PWC_CSS_EXT);
        const baseStyleFilename = basename(styleFilename);
        const { script, style } = transformPWC(code, {
          filename: id,
          styleFilename: baseStyleFilename,
          sourceRoot: rootDir,
          pluginContext: this,
        });
        if (typeof style === 'object') {
          // Cache css code for load use in bundle task
          styleCodeCache[styleFilename] = style.code;
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
