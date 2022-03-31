import { parseFragment } from 'parse5';
import { compileTemplateAST } from './compileTemplate';
import type { compileTemplateResult } from './compileTemplate';

interface compileTemplateInRuntimeResult {
  [0]: compileTemplateResult['templateString'];
  [1]: compileTemplateResult['values'];
}

function injectRuntimeValue(bindings, originalValues): compileTemplateResult['values'] {
  let bindingIndex = 0;
  return originalValues.map(val => {
    if (typeof val === 'string') {
      return bindings[bindingIndex++];
    } else {
      val.forEach(obj => {
        obj.value = bindings[bindingIndex++];
      });
      return val;
    }
  }) as compileTemplateResult['values'];
}

export function compileTemplateInRuntime(strings: Array<string>, ...runtimeValues): compileTemplateInRuntimeResult {
  const template = strings.join('{{}}');
  let dom;
  try {
    dom = parseFragment(template);
  } catch (err) {
    throw new Error(`template compile error: ${err}`);
  }
  const { templateString, values: originalValues } = compileTemplateAST(dom);
  const values = injectRuntimeValue(runtimeValues, originalValues);
  return [ templateString, values ];
}
