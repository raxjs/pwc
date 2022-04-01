import type { File } from '@babel/types';
import autoAddAccessor from './autoAddAccessor';
import autoAddReactiveDecorator from './autoAddReactiveDecorator';
import autoAddCustomElementDecorator from './autoAddCustomElementDecorator';
import autoInjectImportPWC from './autoInjectImportPWC';
import genGetTemplateMethod from './genGetTemplateMethod';

import type { compileTemplateResult } from '../compileTemplate';

export interface transformScriptOptions extends compileTemplateResult {
  hasTemplate: boolean;
}

export default function transformScript(ast: File, {
  hasTemplate,
  templateString,
  values,
}: transformScriptOptions): void {
  autoAddCustomElementDecorator(ast);
  let shouldImportReactive = false;
  if (hasTemplate) {
    shouldImportReactive = autoAddReactiveDecorator(ast, values);
    autoAddAccessor(ast);
    genGetTemplateMethod(ast, { templateString, values });
  }
  autoInjectImportPWC(ast, shouldImportReactive);
}
