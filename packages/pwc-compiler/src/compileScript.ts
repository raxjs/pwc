import generate from '@babel/generator';
import rfdc from 'rfdc';
import type { SFCDescriptor, SFCScriptBlock } from './parse';
import { compileTemplate } from './compileTemplate';
import transformScript from './transform';

const deepClone = rfdc();

export interface SFCScriptCompileResult extends SFCScriptBlock {
  filename: string;
}

export function compileScript(descriptor: SFCDescriptor): SFCScriptCompileResult {
  const { script, filename } = descriptor;
  const ast = deepClone(descriptor.script.ast);

  // With template block
  const hasTemplate = !!descriptor.template;
  if (hasTemplate) {
    const { templateString, values } = compileTemplate(descriptor);
    transformScript(ast, {
      templateString,
      values,
    });
  } else {
    transformScript(ast, { templateString: null });
  }

  const { code, map } = generate(ast, {
    sourceMaps: true,
    decoratorsBeforeExport: true,
    filename,
    sourceFileName: filename
  });

  // TODO: source map
  return {
    ...script,
    filename,
    content: code,
    map,
  };
}
