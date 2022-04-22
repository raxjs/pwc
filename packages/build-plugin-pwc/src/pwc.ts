import type { TransformPluginContext, TransformResult } from 'rollup';
import { parse } from '@pwc/compiler';
import type { SFCDescriptor, SFCBlock } from '@pwc/compiler';
import { resolveScript } from './script.js';
import { transformStyle } from './style.js';
import { setDescriptor } from './utils/descriptorCache.js';
import { createRollupError } from './utils/error.js';

interface transformPWCResult {
  script: TransformResult;
  style: TransformResult;
}

export function transformPWC(
  code: string,
  filename: string,
  sourceRoot: string,
  pluginContext: TransformPluginContext,
): transformPWCResult {
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

  // 1. get js code
  const script = resolveScript(descriptor, pluginContext);
  // TODO: ${relateivePath}.css
  const importStyleCode = 'import \'./index.css\'';
  const styleCode = transformStyle(filename, pluginContext);
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
