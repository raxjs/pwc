import { compileStyle } from '@pwc/compiler';
import type { TransformPluginContext } from 'rollup';
import { getDescriptor } from './utils/descriptorCache';
import type { StyleBlockQuery } from './utils/query';

export function transformStyle(
  query: StyleBlockQuery,
  pluginContext: TransformPluginContext,
) {
  const descriptor = getDescriptor(query.filename);
  // TODO: result should include errors if using postcss
  const result = compileStyle(descriptor);
  return {
    code: result,
    map: null,
  };
}
