import { parse, compileScript } from '../esm';

const simpleComponent = `
<template>
  <p>{{this.#text}}</p>
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

const multipleKindsOfUsingBindingsComponent = `
<template>
  <div
    attr1="{{this.#data1}}"
    attr2="{{this.#data2.name1}}"
    attr3="{{this.data3.arr1[0]}}"
    attr4="{{this['data-five']}}"
    @click="{{this.#fn}}"
    onevent="{{this.#fn}}"
    @input="{{this.methods.fn2}}"
  >
    <div>{{ this.#data1 }}</div>
    <div>{{ this.#data2.name1 }}</div>
    <div>{{ this.data3.arr1[0] }}</div>
    <div>{{ this.data4.obj1.name2 }}</div>
    <div>{{ this['data-five'] }}</div>
  </div>
</template>
<script>
  export default class CustomElement extends HTMLElement {
    #data1 = '';
    #data2 = {
      name1: 'pwc'
    };
    data3 = {
      arr1: []
    };
    data4 = {
      obj1: {
        name2: 'pwc'
      }
    };
    'data-five' = '';

    #fn = () => {};
    methods = {
      fn2() {}
    }
  }
</script>`;

describe('compileScript', () => {
  test('It should inject template getter method', () => {
    const { descriptor } = parse(simpleComponent);
    const result = compileScript(descriptor);

    expect(result.content).toContain(`get template() {
    return {
      templateString: \"\\n  <p><!--?pwc_t--></p>\\n\",
      templateData: [this.#text],
      template: true
    };
  }`);
  });

  test('It should not inject template getter method', () => {
    const { descriptor } = parse(noTemplateComponent);
    const result = compileScript(descriptor);

    expect(result.content).not.toContain('get template()');
  });

  test('It should handle multiple kinds of bindings', () => {
    const { descriptor } = parse(multipleKindsOfUsingBindingsComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement as __customElement, reactive as __reactive } from "pwc";
@__customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @__reactive
  accessor #data1 = '';
  @__reactive
  accessor #data2 = {
    name1: 'pwc'
  };
  @__reactive
  accessor data3 = {
    arr1: []
  };
  @__reactive
  accessor data4 = {
    obj1: {
      name2: 'pwc'
    }
  };
  'data-five' = '';
  #fn = () => {};
  methods = {
    fn2() {}

  };

  get template() {
    return {
      templateString: "\\n  <!--?pwc_p--><div>\\n    <div><!--?pwc_t--></div>\\n    <div><!--?pwc_t--></div>\\n    <div><!--?pwc_t--></div>\\n    <div><!--?pwc_t--></div>\\n    <div><!--?pwc_t--></div>\\n  </div>\\n",
      templateData: [[{
        name: "attr1",
        value: this.#data1
      }, {
        name: "attr2",
        value: this.#data2.name1
      }, {
        name: "attr3",
        value: this.data3.arr1[0]
      }, {
        name: "attr4",
        value: this['data-five']
      }, {
        name: "onclick",
        handler: this.#fn,
        capture: false
      }, {
        name: "onevent",
        value: this.#fn
      }, {
        name: "oninput",
        handler: this.methods.fn2,
        capture: false
      }], this.#data1, this.#data2.name1, this.data3.arr1[0], this.data4.obj1.name2, this['data-five']],
      template: true
    };
  }

}`);
  });
});
