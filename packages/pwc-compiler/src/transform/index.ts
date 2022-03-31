import type { File } from '@babel/types';
import autoAddReactiveDecorator from './autoAddReactiveDecorator';
import autoAddCustomElementDecorator from './autoAddCustomElementDecorator';
import autoInjectImportPWC from './autoInjectImportPWC';
import genGetTemplateMethod from './genGetTemplateMethod';

import type { compileTemplateResult } from '../compileTemplate';

export interface transformScriptOptions extends compileTemplateResult {
  hasTemplate: boolean;
}

export default function transformScript(ast: File, {
  templateString,
  values,
  hasTemplate
}: transformScriptOptions): void {
  autoInjectImportPWC(ast);
  autoAddCustomElementDecorator(ast);
  if (hasTemplate) {
    autoAddReactiveDecorator(ast, values);
    genGetTemplateMethod(ast, { templateString, values });
  }
}
