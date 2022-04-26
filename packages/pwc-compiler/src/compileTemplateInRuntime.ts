import { parseFragment } from 'parse5';
import { compileTemplateAST } from './compileTemplate';
import type { CompileTemplateResult } from './compileTemplate';

interface CompileTemplateInRuntimeResult {
  templateString: CompileTemplateResult['templateString'];
  templateData: CompileTemplateResult['templateData'];
  template: true;
}

/**
 * e.g.
 * bindings: ['className', function, 'title']
 * originalValues: [[{name: 'class', value: ''}, {name: 'onclick', value: '', capture: false}], '']
 * result: [[{name: 'class', value: 'className'}, {name: 'onclick', value: function, capture: false}], 'title']
 */
function injectRuntimeValue(bindings, originalValues): CompileTemplateResult['templateData'] {
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
  }) as CompileTemplateResult['templateData'];
}

export function compileTemplateInRuntime(strings: Array<string>, ...runtimeValues): CompileTemplateInRuntimeResult {
  // Make sure template binding syntax is the same as <template> block so that compileTemplateAST can work correctly
  const template = strings.join('{{}}');
  let dom;
  try {
    dom = parseFragment(template);
  } catch (err) {
    throw new Error(`template compile error: ${err}`);
  }
  const { templateString, templateData: originalTemplateData } = compileTemplateAST(dom);
  // bindings in originalValues is empty and actual values is in runtimeValues
  // injectRuntimeValue will inject corresponding runtime values into originalValues
  const templateData = injectRuntimeValue(runtimeValues, originalTemplateData);
  return {
    templateString,
    templateData,
    template: true,
  };
}
