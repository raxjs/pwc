import type { File } from '@babel/types';
import autoAddAccessor from './autoAddAccessor.js';
import autoAddReactiveDecorator from './autoAddReactiveDecorator.js';
import autoAddCustomElementDecorator from './autoAddCustomElementDecorator.js';
import autoInjectImportPWC from './autoInjectImportPWC.js';
import genGetTemplateMethod from './genGetTemplateMethod.js';

import type { CompileTemplateResult } from '../compileTemplate.js';

export interface TransformScriptOptions {
  templateString: string | null;
  values?: CompileTemplateResult['values'];
}

export default function transformScript(ast: File, {
  templateString,
  values,
}: TransformScriptOptions): void {
  let shouldImportCustomElement = true;
  let shouldImportReactive = false;

  shouldImportCustomElement = autoAddCustomElementDecorator(ast);
  if (templateString !== null) {
    shouldImportReactive = autoAddReactiveDecorator(ast, values);
    autoAddAccessor(ast);
    genGetTemplateMethod(ast, { templateString, values });
  }
  autoInjectImportPWC(ast, {
    customElement: shouldImportCustomElement,
    reactive: shouldImportReactive,
  });
}
