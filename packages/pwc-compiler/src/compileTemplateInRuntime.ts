import { parseFragment } from 'parse5';
import { compileTemplateAST } from './compileTemplate.js';
import type { compileTemplateResult } from './compileTemplate.js';
export function compileTemplateInRuntime(template: string): compileTemplateResult {
  let dom;
  try {
    dom = parseFragment(template);
  } catch (err) {
    throw new Error(`template compile error: ${err}`);
  }
  return compileTemplateAST(dom);
}
