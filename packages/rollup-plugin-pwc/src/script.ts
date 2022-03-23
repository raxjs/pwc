import type { SFCDescriptor, SFCScriptBlock } from '@pwc/compiler';
import { compileScript } from '@pwc/compiler';
import type { TransformPluginContext } from 'rollup';
import { createRollupError } from './utils/error';
import { transformSync } from '@babel/core';

const cache = new WeakMap<SFCDescriptor>();

export function getResolvedScript(descriptor: SFCDescriptor): SFCScriptBlock | null | undefined {
  return cache.get(descriptor);
}

export function resolveScript(
  descriptor: SFCDescriptor,
  pluginContext: TransformPluginContext,
) {
  if (!descriptor.script) {
    return null;
  }
  const cached = cache.get(descriptor);
  if (cached) {
    return cached;
  }

  let resolved: SFCScriptBlock | null = null;
  try {
    resolved = compileScript(descriptor);
  } catch (err) {
    pluginContext.error(createRollupError(descriptor.filename, err));
  }
  // Use babel to transform syntax like decorators
  const { code, map } = transformSync(resolved.content, {
    filename: resolved.filename,
    plugins: [
      ['@babel/plugin-proposal-decorators', { version: '2021-12', decoratorsBeforeExport: true }],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-class-static-block',
      '@babel/plugin-proposal-private-methods'
    ],
    sourceMaps: true,
    // TODO:
    // inputSourceMap: resolved.map
  });


  cache.set(descriptor, {
    ...resolved,
    content: code,
    map,
  });
  return resolved;
}
