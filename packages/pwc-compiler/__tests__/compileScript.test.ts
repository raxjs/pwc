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

const mixNormalPropertyComponent = `
<template>
  <p>{{#text}}</p>
</template>
<script>
  export default class CustomElement extends HTMLElement {
    #text = '';
    data = {};
  }
</script>
`;

const pureComponent = `
<template>
  <p>hello</p>
</template>
<script>
export default class CustomElement extends HTMLElement {}
</script>`;

const definedComponent = `
<template>
  <p>hello</p>
</template>
<script>
import { customElement } from 'pwc';

@customElement('custom-element')
export default class CustomElement extends HTMLElement {}
</script>
`;

describe('compileScript', () => {
  test('It should inject pwc', () => {
    const { descriptor } = parse(simpeComponent);
    const result = compileScript(descriptor);

    expect(result.content).toContain(`import { customElement, reactive } from \"pwc\";`);
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

  test('It should not add @reactive decorator to normal property', () => {
    const { descriptor } = parse(mixNormalPropertyComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement, reactive } from "pwc";
@customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @reactive
  accessor #text = '';
  data = {};

  get template() {
    return ["\\n  <p><!--?pwc_t--></p>\\n", [this.#text]];
  }

}`);
  });

  test('It should not import pwc with pure component', () => {
    const { descriptor } = parse(pureComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement } from \"pwc\";
@customElement(\"custom-element\")
export default class CustomElement extends HTMLElement {
  get template() {
    return [\"\\n  <p>hello</p>\\n\", []];
  }

}`);
  });

  test('It should not import customElement again with defined component', () => {
    const { descriptor } = parse(definedComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement } from 'pwc';
@customElement('custom-element')
export default class CustomElement extends HTMLElement {
  get template() {
    return [\"\\n  <p>hello</p>\\n\", []];
  }

}`);
  });
});
