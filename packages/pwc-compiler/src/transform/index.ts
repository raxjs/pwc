import type { File } from '@babel/types';
import autoAddDecorator from './autoAddDecorator';
import autoInjectImportPWC from './autoInjectImportPWC';
import genGetTemplateMethod from './genGetTemplateMethod';

import type { compileTemplateResult } from '../compileTemplate';

export default function transformScript(ast: File, {
  templateString,
  values,
}: compileTemplateResult): void {
  autoInjectImportPWC(ast);
  autoAddDecorator(ast, values);
  genGetTemplateMethod(ast, { templateString, values });
}
