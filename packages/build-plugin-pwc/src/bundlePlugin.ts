import type { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { transformPWC } from './pwc.js';
import type { Options } from './options.js';
import { basename, extname, resolve, dirname } from 'path';
import { readFileSync, existsSync } from 'fs';
import { PWC_CSS_EXT, PWC_EXT } from './utils/constants.js';

const styleCodeCache = {};

const isWithoutExtname = (filename: string) => extname(filename) === '';
const isPwcFile = (filename: string | undefined) => filename && filename.endsWith(PWC_EXT);
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
      if (isPwcFile(importer) && isWithoutExtname(source)) {
        // When a pwc file imports another pwc file without adding .pwc extension
        // Should fill up the .pwc extension
        const pwcFilename = `${resolve(dirname(importer), source)}${PWC_EXT}`;
        if (existsSync(pwcFilename)) {
          return pwcFilename;
        }
      }
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
