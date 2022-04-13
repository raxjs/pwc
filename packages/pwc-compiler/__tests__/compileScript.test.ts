import { parse, compileScript } from '../src';

const simpeComponent = `
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

const multipleKindsOfUsingBindingsComponent = `
<template>
  <div
    attr1="{{this.#data1}}"
    attr2="{{this.#data2.name1}}"
    attr3="{{this.data3.arr1[0]}}"
    attr4="{{this['data-five']}}"
    @click="{{this.#fn}}"
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

  test('It should add @reactive decorator to object property', () => {
    const { descriptor } = parse(useObjectPropertyComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement, reactive } from "pwc";
@customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @reactive
  accessor data = {};
  @reactive
  accessor arr = [];
  @reactive
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

    expect(result.content).toEqual(`import { customElement, reactive } from "pwc";
import outsideName from './data';
@customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @reactive
  accessor insideName = '';

  get template() {
    return ["\\n  <p><!--?pwc_t--></p>\\n  <p><!--?pwc_t--></p>\\n", [outsideName, this.insideName]];
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

  test('It should handle multiple kinds of bindings', () => {
    const { descriptor } = parse(multipleKindsOfUsingBindingsComponent);
    const result = compileScript(descriptor);

    expect(result.content).toEqual(`import { customElement, reactive } from "pwc";
@customElement("custom-element")
export default class CustomElement extends HTMLElement {
  @reactive
  accessor #data1 = '';
  @reactive
  accessor #data2 = {
    name1: 'pwc'
  };
  @reactive
  accessor data3 = {
    arr1: []
  };
  @reactive
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
    return ["\\n  <!--?pwc_p--><div>\\n    <div><!--?pwc_t--></div>\\n    <div><!--?pwc_t--></div>\\n    <div><!--?pwc_t--></div>\\n    <div><!--?pwc_t--></div>\\n    <div><!--?pwc_t--></div>\\n  </div>\\n", [[{
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
      value: this.#fn,
      capture: false
    }, {
      name: "oninput",
      value: this.methods.fn2,
      capture: false
    }], this.#data1, this.#data2.name1, this.data3.arr1[0], this.data4.obj1.name2, this['data-five']]];
  }

}`);
  });
});
