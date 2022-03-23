import type { TransformPluginContext } from 'rollup';
import qs from 'querystring';
import { parse } from '@pwc/compiler';
import type { SFCDescriptor, SFCBlock } from '@pwc/compiler';
import { resolveScript } from './script';
import { setDescriptor } from './utils/descriptorCache';
import { createRollupError } from './utils/error';

// these are built-in query parameters so should be ignored
// if the user happen to add them as attrs
const ignoreList = ['id', 'index', 'src', 'type', 'lang'];

function attrsToQuery(
  attrs: SFCBlock['attrs'],
  langFallback?: string,
  forceLangFallback = false,
): string {
  let query = '';
  for (const name in attrs) {
    const value = attrs[name];
    if (!ignoreList.includes(name)) {
      query += `&${qs.escape(name)}${
        value ? `=${qs.escape(String(value))}` : ''
      }`;
    }
  }
  if (langFallback || attrs.lang) {
    query +=
      'lang' in attrs
        ? forceLangFallback
          ? `&lang.${langFallback}`
          : `&lang.${attrs.lang}`
        : `&lang.${langFallback}`;
  }
  return query;
}

function genScriptCode(descriptor: SFCDescriptor, pluginContext: TransformPluginContext) {
  const script = resolveScript(descriptor, pluginContext);
  const src = descriptor.filename;
  const attrQuery = attrsToQuery(script.attrs, 'js');
  const query = `?pwc&type=script${attrQuery}`;
  const scriptRequest = JSON.stringify(src + query);
  const scriptImport = `import script from ${scriptRequest}\n` + `export * from ${scriptRequest}`;
  return scriptImport;
}

function genStyleCode(descriptor: SFCDescriptor) {
  // TODO: css scoped
  let styleCode = '';
  const src = descriptor.filename;
  const attrsQuery = attrsToQuery(descriptor.style.attrs, 'css');
  const query = `?pwc&type=style${attrsQuery}`;
  const styleRequest = JSON.stringify(src + query);
  styleCode += `\nimport ${styleRequest}`;
  return styleCode;
}

export function transformPwcEntry(
  code: string,
  filename: string,
  sourceRoot: string,
  pluginContext: TransformPluginContext,
) {
  const { descriptor, errors } = parse(code, {
    filename,
    sourceMap: true,
    sourceRoot,
  });
  setDescriptor(filename, descriptor);

  if (errors.length) {
    errors.forEach(error => {
      pluginContext.error(createRollupError(filename, error));
    });
    return null;
  }

  const scriptImport = genScriptCode(descriptor, pluginContext);
  const styleCode = genStyleCode(descriptor);
  const output = [
    scriptImport,
    styleCode,
  ];
  output.push('export default script');
  return {
    code: output.join('\n'),
    map: {
      mappings: '',
    },
  };
}
