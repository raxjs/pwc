import type { TransformPluginContext, TransformResult } from 'rollup';
import { compileStyle } from '@pwc/compiler';
import { getDescriptor } from './utils/descriptorCache.js';
import { createRollupError } from './utils/error.js';

export function transformStyle(
  filename: string,
  pluginContext: TransformPluginContext,
): TransformResult {
  const descriptor = getDescriptor(filename);
  const { code, map, errors } = compileStyle(descriptor);
  if (errors.length) {
    errors.forEach(error => {
      pluginContext.error(createRollupError(descriptor.filename, error));
    });
    return null;
  }
  return {
    code,
    map: { mappings: '' },
  };
}
