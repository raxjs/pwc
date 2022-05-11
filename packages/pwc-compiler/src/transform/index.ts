import type { File } from '@babel/types';
import autoAddAccessor from './autoAddAccessor';
import autoAddReactiveDecorator from './autoAddReactiveDecorator';
import autoAddCustomElementDecorator from './autoAddCustomElementDecorator';
import autoInjectImportPWC from './autoInjectImportPWC';
import genGetTemplateMethod from './genGetTemplateMethod';

import type { CompileTemplateResult } from '../compileTemplate';

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
