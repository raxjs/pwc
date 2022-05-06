import type { TransformPluginContext, TransformResult } from 'rollup';
import { parse } from '@pwc/compiler';
import { resolveScript } from './script.js';
import { transformStyle } from './style.js';
import { setDescriptor } from './utils/descriptorCache.js';
import { createRollupError } from './utils/error.js';

interface transformPWCResult {
  script: TransformResult;
  style: TransformResult;
}

interface transformPWCOptions {
  filename: string;
  styleFilename: string;
  sourceRoot: string;
  pluginContext: TransformPluginContext;
}

export function transformPWC(
  code: string, {
    filename,
    styleFilename,
    sourceRoot,
    pluginContext,
  }: transformPWCOptions,
): transformPWCResult {
  const { descriptor, errors } = parse(code, {
    filename,
    sourceMap: true,
    sourceRoot, // TODO: for sourcemap
  });
  setDescriptor(filename, descriptor);
  if (errors.length) {
    errors.forEach(error => {
      pluginContext.error(createRollupError(filename, error));
    });
    return null;
  }

  // 1. get js code
  const script = resolveScript(descriptor, pluginContext);
  let styleCode = null;
  let importStyleCode = '';
  if (descriptor.style) {
    importStyleCode = `import './${styleFilename}';`;
    styleCode = transformStyle(filename, pluginContext);
  }
  const scriptCode = `
${importStyleCode}
${script.content}
`;
  return {
    script: {
      code: scriptCode,
      map: { mappings: '' },
    },
    style: styleCode,
  };
}
