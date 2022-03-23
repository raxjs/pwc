import type { File } from '@babel/types';
import autoAddDecorator from './autoAddDecorator';
import autoInjectImport from './autoInjectImport';
import genGetTemplateMethod from './genGetTemplateMethod';

import type { compileTemplateResult } from '../compileTemplate';

export interface transformScriptOptions extends compileTemplateResult {
  importInfo: {
    source: string;
    imported: Array<string>;
  };
}

export default function transformScript(ast: File, {
  importInfo,
  templateString,
  values,
}: transformScriptOptions): void {
  autoInjectImport(ast, importInfo);
  autoAddDecorator(ast, values);
  genGetTemplateMethod(ast, { templateString, values });
}
