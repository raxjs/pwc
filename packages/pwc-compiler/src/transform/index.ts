import type { File } from '@babel/types';
import autoAddAccessor from './autoAddAccessor';
import autoAddReactiveDecorator from './autoAddReactiveDecorator';
import autoAddCustomElementDecorator from './autoAddCustomElementDecorator';
import autoInjectImportPWC from './autoInjectImportPWC';
import genGetTemplateMethod from './genGetTemplateMethod';

import type { CompileTemplateResult } from '../compileTemplate';

export interface TransformScriptOptions {
  templateString: string | null;
  values?: CompileTemplateResult['values'];
}

export default function transformScript(ast: File, {
  templateString,
  values,
}: TransformScriptOptions): void {
  autoAddCustomElementDecorator(ast);
  let shouldImportReactive = false;
  if (templateString !== null) {
    shouldImportReactive = autoAddReactiveDecorator(ast, values);
    autoAddAccessor(ast);
    genGetTemplateMethod(ast, { templateString, values });
  }
  autoInjectImportPWC(ast, shouldImportReactive);
}
