import type { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { getDescriptor } from './utils/descriptorCache.js';
import { parsePwcPartRequest } from './utils/query.js';
import { transformPwcEntry } from './pwc.js';
import { getResolvedScript } from './script.js';
import { transformStyle } from './style.js';
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
    /**
     * meaning of query in id:
     * pwc: it is from .pwc file (script or style)
     * type: script of style
     * filename: original filename
     */
    resolveId(id) {
      console.log("🚀 ~ file: plugin.ts ~ line 31 ~ resolveId ~ resolveId", id)
      const query = parsePwcPartRequest(id);
      if (query.pwc) {
        if (!filter(query.filename)) {
          return null;
        }
        return id;
      }
      return null;
    },
    load(id) {
      console.log("🚀 ~ file: plugin.ts ~ line 42 ~ load ~ load", id)
      const query = parsePwcPartRequest(id);
      if (query.pwc) {
        const descriptor = getDescriptor(query.filename);
        if (descriptor) {
          let block = null;
          if (query.type === 'script') {
            // script has been resolved in transformPwcEntry function and has been cached
            block = getResolvedScript(descriptor);
          } else if (query.type === 'style') {
            block = descriptor.style;
          }
          if (block) {
            console.log("🚀 ~ file: plugin.ts ~ line 55 ~ load ~ block", block)
            return {
              code: block.content,
              map: block.map,
            };
          }
        }
      }
      if (filter(id)) {
        const tempFilePath = join(rootContext, 'src', id);
        const result = readFileSync(tempFilePath, 'utf-8');
        return {
          code: result
        };
      }
      return null;
    },

    transform(code, id) {
      console.log("🚀 ~ file: plugin.ts ~ line 76 ~ transform ~ id", id)
      const query = parsePwcPartRequest(id);
      if (filter(id)) {
        // *.pwc file
        // Generate an entry module that imports the actual blocks of the PWC
        if (!query.pwc) {
          const r =  transformPwcEntry(code, id, rootContext, this);
          console.log("🚀 ~ file: plugin.ts ~ line 83 ~ transform ~ r", r)
          return r;
        } else if (query.type === 'style') {
          // Sub request for blocks
          return transformStyle(query, this);
        }
      }

      return null;
    },
  };
}
