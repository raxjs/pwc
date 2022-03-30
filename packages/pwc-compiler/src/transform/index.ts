import type { File } from '@babel/types';
import autoAddDecorator from './autoAddDecorator.js';
import autoAddAccessor from './autoAddAccessor.js';
import autoInjectImportPWC from './autoInjectImportPWC.js';
import genGetTemplateMethod from './genGetTemplateMethod.js';

import type { compileTemplateResult } from '../compileTemplate.js';

export default function transformScript(ast: File, {
  templateString,
  values,
}: compileTemplateResult): void {
  autoInjectImportPWC(ast);
  autoAddDecorator(ast, values);
  autoAddAccessor(ast);
  genGetTemplateMethod(ast, { templateString, values });
}
