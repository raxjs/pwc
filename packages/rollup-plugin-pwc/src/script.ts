import type { SFCDescriptor, SFCScriptCompileResult } from '@pwc/compiler';
import { compileScript } from '@pwc/compiler';
import type { TransformPluginContext } from 'rollup';
import { createRollupError } from './utils/error.js';
import { transformSync } from '@babel/core';
import babelPluginProposalDecorators from '@babel/plugin-proposal-decorators';
import babelPluginProposalClassProperties from '@babel/plugin-proposal-class-properties';
import babelPluginProposalClassStaticBlock from '@babel/plugin-proposal-class-static-block';
import babalPluginProposalPrivateMethods from '@babel/plugin-proposal-private-methods';

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

  let resolved: SFCScriptCompileResult | null = null;
  try {
    resolved = compileScript(descriptor);
  } catch (err) {
    pluginContext.error(createRollupError(descriptor.filename, err));
  }
  console.log('resolved', resolved.content);
  // Use babel to transform syntax like decorators
  const { code, map } = transformSync(resolved.content, {
    filename: resolved.filename,
    plugins: [
      [babelPluginProposalDecorators, { version: '2021-12', decoratorsBeforeExport: true }],
      babelPluginProposalClassProperties,
      babelPluginProposalClassStaticBlock,
      babalPluginProposalPrivateMethods,
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
