import generate from '@babel/generator';
import rfdc from 'rfdc';
import type { SFCDescriptor, SFCScriptBlock } from './parse';
import { compileTemplate } from './compileTemplate';
import transformScript from './transform/index';

const deepClone = rfdc();

export interface SFCScriptCompileResult extends SFCScriptBlock {
  filename: string;
}

export function compileScript(descriptor: SFCDescriptor): SFCScriptCompileResult {
  const { script, filename } = descriptor;
  const ast = deepClone(descriptor.script.ast);

  // With template block
  const hasTemplate = !!descriptor.template;
  console.log("🚀 ~ file: compileScript.ts ~ line 19 ~ compileScript ~ hasTemplate", hasTemplate)
  if (hasTemplate) {
    const { templateString, values } = compileTemplate(descriptor);
    transformScript(ast, {
      hasTemplate: true,
      templateString,
      values,
    });
  } else {
    transformScript(ast, { hasTemplate: false });
  }

  const { code, map } = generate(ast, {
    sourceMaps: false,
    decoratorsBeforeExport: true,
  });

  // TODO: source map
  return {
    ...script,
    filename,
    content: code,
    map,
  };
}
