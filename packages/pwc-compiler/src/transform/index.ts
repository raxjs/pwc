import type { File } from '@babel/types';
import autoAddAccessor from './autoAddAccessor.js';
import autoAddReactiveDecorator from './autoAddReactiveDecorator.js';
import autoAddCustomElementDecorator from './autoAddCustomElementDecorator.js';
import autoInjectImportPWC from './autoInjectImportPWC.js';
import genGetTemplateMethod from './genGetTemplateMethod.js';

import type { CompileTemplateResult } from '../compileTemplate.js';

export interface TransformScriptOptions {
  templateString: string | null;
  templateData?: CompileTemplateResult['templateData'];
}

export default function transformScript(ast: File, {
  templateString,
  templateData,
}: TransformScriptOptions): void {
  let shouldImportCustomElement = true;
  let shouldImportReactive = false;

  shouldImportCustomElement = autoAddCustomElementDecorator(ast);
  if (templateString !== null) {
    shouldImportReactive = autoAddReactiveDecorator(ast, templateData);
    autoAddAccessor(ast);
    genGetTemplateMethod(ast, { templateString, templateData });
  }
  autoInjectImportPWC(ast, {
    customElement: shouldImportCustomElement,
    reactive: shouldImportReactive,
  });
}
