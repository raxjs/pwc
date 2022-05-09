import type { SFCDescriptor, SFCScriptCompileResult } from '@pwc/compiler';
import { compileScript } from '@pwc/compiler';
import type { TransformPluginContext } from 'rollup';
import { createRollupError } from './utils/error.js';
import { transformSync } from '@babel/core';
import babelPluginProposalDecorators from '@babel/plugin-proposal-decorators';
import babelPresetEnv from '@babel/preset-env';
import removePwcExt from './babelPlugins/removePwcExt.js';

const cache = new WeakMap<SFCDescriptor>();

export function getResolvedScript(descriptor: SFCDescriptor): SFCScriptCompileResult | null | undefined {
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

  let compiled: SFCScriptCompileResult | null = null;
  try {
    compiled = compileScript(descriptor);
  } catch (err) {
    pluginContext.error(createRollupError(descriptor.filename, err));
  }
  // Use babel to transform syntax like decorators
  const { code, map } = transformSync(compiled.content, {
    filename: compiled.filename,
    presets: [
      [
        /* The following plugins are needed:
        1. @babel/plugin-proposal-class-properties;
        2. @babel/plugin-proposal-class-static-block;
        3. @babel/plugin-proposal-private-methods;
        */
        babelPresetEnv,
        {
          // TODO: to be checked with @ice/pkg
          targets: 'last 1 Chrome versions', // Make sure keep syntax as new as possible
          spec: true,
          modules: false,
        },
      ],
    ],
    plugins: [
      [
        babelPluginProposalDecorators,
        { version: '2021-12', decoratorsBeforeExport: true },
      ],
      removePwcExt
    ],
    sourceMaps: true,
    // TODO:
    // inputSourceMap: compiled.map
  });

  const resolved = {
    ...compiled,
    content: code,
    map,
  };
  cache.set(descriptor, resolved);
  return resolved;
}
