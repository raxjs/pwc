import { parseFragment } from 'parse5';
import { compileTemplateAST } from './compileTemplate';
import type { compileTemplateResult } from './compileTemplate';

interface compileTemplateInRuntimeResult {
  [0]: compileTemplateResult['templateString'];
  [1]: compileTemplateResult['values'];
}

export function compileTemplateInRuntime(template: string): compileTemplateInRuntimeResult {
  let dom;
  try {
    dom = parseFragment(template);
  } catch (err) {
    throw new Error(`template compile error: ${err}`);
  }
  const { templateString, values } = compileTemplateAST(dom);
  return [templateString, values];
}
