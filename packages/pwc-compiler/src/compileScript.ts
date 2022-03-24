import generate from '@babel/generator';
import rfdc from 'rfdc';
import type { SFCDescriptor, SFCScriptBlock } from './parse';
import { compileTemplate } from './compileTemplate';
import transformScript from './transform';

const deepClone = rfdc();

export function compileScript(descriptor: SFCDescriptor): SFCScriptBlock {
  const { script } = descriptor;
  const { templateString, values } = compileTemplate(descriptor);
  const ast = deepClone(descriptor.script.ast);
  transformScript(ast, {
    templateString,
    values,
  });
  const { code, map } = generate(ast, {
    sourceMaps: false,
    decoratorsBeforeExport: true,
  });

  // TODO: source map
  return {
    ...script,
    content: code,
    map,
  };
}
