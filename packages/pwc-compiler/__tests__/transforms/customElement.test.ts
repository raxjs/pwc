import { parse, compileScript } from '../../esm';
import { basicComponent, useCustomElementComponent } from './components';

describe('customElement decorator', () => {
  test('It should add customElement decorator', () => {
    const { descriptor } = parse(basicComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement as __customElement, reactive as __reactive } from \"pwc\";
@__customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @__reactive
  accessor #name = '';

  get template() {
    return {
      templateString: "\\n  <p><!--?pwc_t--></p>\\n",
      templateData: [this.#name],
      template: true
    };
  }

}`);
  });

  test('It should not add customElement decorator if there is already customElement manually', () => {
    const { descriptor } = parse(useCustomElementComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement } from 'pwc';
@customElement('custom-element')
export default class CustomElement extends HTMLElement {
  get template() {
    return {
      templateString: "\\n  <p>hello</p>\\n",
      templateData: [],
      template: true
    };
  }

}`);
  });

});
