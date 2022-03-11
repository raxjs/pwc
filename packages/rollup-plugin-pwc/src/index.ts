import * as path from 'path';
import type { Plugin } from 'rollup';
import { compile } from '@pwc/compiler';


interface Options {
  emitCSS: boolean;
}

export default function PluginPWC(options: Options): Plugin {
  const { emitCSS } = options;
  const extensions = ['.pwc'];

  // [filename]:[chunk]
  const cacheEmit = new Map();

  return {
    name: 'pwc',

    /**
     * Resolve an import's full filepath.
     */
    resolveId(importee, importer) {
      if (cacheEmit.has(importee)) return importee;
      if (!importer || importee[0] === '.' || importee[0] === '\0' || path.isAbsolute(importee)) return null;
    },

    /**
     * Returns CSS contents for a file, if ours
     */
    load(id) {
      return cacheEmit.get(id) || null;
    },

    /**
     * Transforms a `.pwc` file into a `.js` file.
     * NOTE: If `emitCss`, append static `import` to virtual CSS file.
     */
    async transform(code, id) {
      const extension = path.extname(id);
      if (!~extensions.indexOf(extension)) return null;

      // TODO:
      const dependencies = [];
      const filename = path.relative(process.cwd(), id);

      const compiled = compile(code, { filename });
      console.log('🚀 ~ file: index.ts ~ line 48 ~ transform ~ compiled', compiled);

      if (emitCSS && compiled.styles) {
        const fname = id.replace(new RegExp(`\\${extension}$`), '.css');
        compiled.script.code += `\nimport ${JSON.stringify(fname)};\n`;
        cacheEmit.set(fname, compiled.styles);
      }

      const result = {
        code: compiled.script.code,
        map: compiled.script.map,
      };
      console.log('code', compiled.script.code);
      console.log('map', compiled.script.map);
      return result;
    },
  };
}
