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
          const block =
          query.type === 'script'
            ? getResolvedScript(descriptor)
            : query.type === 'style'
              ? descriptor.style
              : null;
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

    async transform(code, id) {
      const query = parsePwcPartRequest(id);
      // *.pwc file
      // Generate an entry module that imports the actual blocks of the PWC
      if (!query.pwc && filter(id)) {
        const output = transformPwcEntry(code, id, rootContext, this);
        return output;
      }

      if (query.pwc) {
        if (!filter(query.filename)) {
          return null;
        }
        if (query.type === 'style') {
          return transformStyle(query, this);
        }
      }
      return null;
    },
  };
}
