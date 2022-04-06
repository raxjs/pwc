import type { Plugin } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { getDescriptor } from './utils/descriptorCache';
import { parsePwcPartRequest } from './utils/query';
import { transformPwcEntry } from './pwc';
import { getResolvedScript } from './script';
import { transformStyle } from './style';


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
            return {
              code: block.content,
              map: block.map,
            };
          }
        }
      }
      return null;
    },

    transform(code, id) {
      const query = parsePwcPartRequest(id);
      // *.pwc file
      // Generate an entry module that imports the actual blocks of the PWC
      if (!query.pwc && filter(id)) {
        return transformPwcEntry(code, id, rootContext, this);
      }

      // Sub request for blocks
      if (query.pwc && query.type === 'style') {
        return transformStyle(query, this);
      }
      return null;
    },
  };
}
