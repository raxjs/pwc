import { parse, compileScript } from '../../src';
import { useReactiveComponent, useReactiveWithAutoAddReactiveComponent, reactiveHasBeenReactiveDecoratedManuallyComponent } from './components';


const mixNormalPropertyComponent = `
<template>
  <p>{{this.#text}}</p>
</template>
<script>
  export default class CustomElement extends HTMLElement {
    #text = '';
    data = {};
  }
</script>
`;

const useObjectPropertyComponent = `
<template>
  <p>{{this.data.name}}</p>
  <p>{{this.arr[0]}}</p>
  <p>{{this.nestedData.obj1.obj2.age}}</p>
</template>
<script>
  export default class CustomElement extends HTMLElement {
    data = {};
    arr = [];
    nestedData = {
      obj1: {
        obj2: {
          age: 10
        }
      }
    }
  }
</script>
`;

const useOutsideVariableComponent = `
<template>
  <p>{{outsideName}}</p>
  <p>{{this.insideName}}</p>
</template>
<script>
  import outsideName from './data';
  export default class CustomElement extends HTMLElement {
    insideName = '';
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

describe('reactive decorator', () => {

  test('It should not add reactive decorator when there is no reactive variable in template', () => {
    const { descriptor } = parse(useReactiveComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { reactive, customElement as __customElement } from 'pwc';
@__customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @reactive
  accessor name = '';

  get template() {
    return ["\\n  <p>hello</p>\\n", []];
  }

}`);
  });

  test('It should add reactive decorator when there is reactive variable in template even if reactive decorator has been used manually', () => {
    const { descriptor } = parse(useReactiveWithAutoAddReactiveComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { reactive, customElement as __customElement, reactive as __reactive } from 'pwc';
@__customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @__reactive
  accessor #name = '';
  @reactive
  accessor data = '';

  get template() {
    return ["\\n  <p><!--?pwc_t--></p>\\n", [this.#name]];
  }

}`);
  });


  test('It should not add reactive decorator when the variable has been reactive decorated manually', () => {
    const { descriptor } = parse(reactiveHasBeenReactiveDecoratedManuallyComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { reactive, customElement as __customElement } from 'pwc';
@__customElement(\"custom-element\")
export default class CustomElement extends HTMLElement {
  @reactive
  accessor #name = '';

  get template() {
    return [\"\\n  <p><!--?pwc_t--></p>\\n\", [this.#name]];
  }

}`);
  });

  test('It should not add @reactive decorator to normal property', () => {
    const { descriptor } = parse(mixNormalPropertyComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement as __customElement, reactive as __reactive } from "pwc";
@__customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @__reactive
  accessor #text = '';
  data = {};

  get template() {
    return ["\\n  <p><!--?pwc_t--></p>\\n", [this.#text]];
  }

}`);
  });

  test('It should add @reactive decorator to object property', () => {
    const { descriptor } = parse(useObjectPropertyComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement as __customElement, reactive as __reactive } from "pwc";
@__customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @__reactive
  accessor data = {};
  @__reactive
  accessor arr = [];
  @__reactive
  accessor nestedData = {
    obj1: {
      obj2: {
        age: 10
      }
    }
  };

  get template() {
    return ["\\n  <p><!--?pwc_t--></p>\\n  <p><!--?pwc_t--></p>\\n  <p><!--?pwc_t--></p>\\n", [this.data.name, this.arr[0], this.nestedData.obj1.obj2.age]];
  }

}`);
  });

  test('It should not add @reactive decorator to outside data', () => {
    const { descriptor } = parse(useOutsideVariableComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement as __customElement, reactive as __reactive } from "pwc";
import outsideName from './data';
@__customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @__reactive
  accessor insideName = '';

  get template() {
    return ["\\n  <p><!--?pwc_t--></p>\\n  <p><!--?pwc_t--></p>\\n", [outsideName, this.insideName]];
  }

}`);
  });

  test('It should not import reactive with pure component', () => {
    const { descriptor } = parse(pureComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement as __customElement } from \"pwc\";
@__customElement(\"custom-element\")
export default class CustomElement extends HTMLElement {
  get template() {
    return [\"\\n  <p>hello</p>\\n\", []];
  }

}`);
  });
});
