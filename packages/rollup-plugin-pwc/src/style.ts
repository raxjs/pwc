import { compileStyle } from '@pwc/compiler';
import type { TransformPluginContext } from 'rollup';
import { getDescriptor } from './utils/descriptorCache';
import type { StyleBlockQuery } from './utils/query';
import { createRollupError } from './utils/error';

export function transformStyle(
  query: StyleBlockQuery,
  pluginContext: TransformPluginContext,
) {
  const descriptor = getDescriptor(query.filename);
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
