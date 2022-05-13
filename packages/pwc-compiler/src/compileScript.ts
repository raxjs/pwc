import generate from '@babel/generator';
import { join } from 'path';
import rfdc from 'rfdc';
import type { SFCDescriptor, SFCScriptBlock } from './parse.js';
import { compileTemplate } from './compileTemplate.js';
import transformScript from './transform/index.js';

const deepClone = rfdc();

export interface SFCScriptCompileResult extends SFCScriptBlock {
  filename: string;
  sourceRoot: string;
}

export function compileScript(descriptor: SFCDescriptor): SFCScriptCompileResult {
  const rootContext = process.cwd();
  const { script, filename } = descriptor;
  const ast = deepClone(descriptor.script.ast);

  // With template block
  const hasTemplate = !!descriptor.template;
  if (hasTemplate) {
    const { templateString, templateData } = compileTemplate(descriptor);
    transformScript(ast, {
      templateString,
      templateData,
    });
  } else {
    transformScript(ast, { templateString: null });
  }

  const sourceRoot = join(rootContext, 'src');
  const { code, map } = generate.default(ast, {
    sourceMaps: true,
    sourceRoot,
    sourceFileName: filename,
    decoratorsBeforeExport: true,
  });

  // TODO: source map
  return {
    ...script,
    filename,
    sourceRoot,
    content: code,
    map,
  };
}
