import { parse, compileScript } from '../src';

const simpeComponent = `
<template>
  <p>{{#text}}</p>
</template>
<script>
  export default class CustomElement extends HTMLElement {
    #text = '';
  }
</script>`;

const noTemplateComponent = `
<script>
  export default class CustomElement extends HTMLElement {
    #text = '';
  }
</script>`;

describe('compileScript', () => {
  test('It should inject pwc', () => {
    const { descriptor } = parse(simpeComponent);
    const result = compileScript(descriptor);

    expect(result.content).toContain('import { reactive, customElement } from "pwc"');
  });

  test('It should inject decorators', () => {
    const { descriptor } = parse(simpeComponent);
    const result = compileScript(descriptor);

    expect(result.content).toContain(`@customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @reactive
  accessor #text = '';`);
  });

  test('It should inject template getter method', () => {
    const { descriptor } = parse(simpeComponent);
    const result = compileScript(descriptor);

    expect(result.content).toContain(`get template() {
    return [\"\\n  <p><!--?pwc_t--></p>\\n\", [this.#text]];
  }`);
  });

  test('It should not inject template getter method', () => {
    const { descriptor } = parse(noTemplateComponent);
    const result = compileScript(descriptor);

    expect(result.content).not.toContain('get template()');
  });
});
