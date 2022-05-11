import '../native/HTMLElement';
import { reactive, customElement } from '../../decorators';
import { nextTick } from '../sheduler';
import { compileTemplateInRuntime as html } from '@pwc/compiler';
import { createElement, render as raxRender, useState, useCallback } from 'rax';
import * as DriverDom from 'driver-dom';

function getSimpleCustomElement() {
  return class CustomElement extends HTMLElement {
    text = 'hello';
    name = 'jack';
    onClick() {
      console.log('click!!!');
    }
    get template() {
      return {
        templateString: '<!--?pwc_p--><div id="container"><!--?pwc_t--> - <!--?pwc_t--></div>',
        templateData: [
          [
            {
              name: 'onclick',
              handler: this.onClick,
            },
          ],
          this.text,
          this.name,
        ],
        template: true,
      };
    }
  };
}

function getNestedCustomElement() {
  return class CustomElement extends HTMLElement {
    text = 'hello';
    name = 'nested';

    #title = 'title';
    onClick() {
      console.log('click!!!');
    }
    get template() {
      return {
        templateString:
          '<!--?pwc_p--><div id="nested-container"><!--?pwc_t--> <div>This is <!--?pwc_t--></div> <!--?pwc_t--></div>',
        templateData: [
          [
            {
              name: 'onclick',
              handler: this.onClick,
            },
          ],
          this.text,
          this.#title,
          this.name,
        ],
        template: true,
      };
    }
  };
}

function getReactiveCustomElement() {
  return class CustomElement extends HTMLElement {
    @reactive
    accessor #text = 'hello';
    @reactive
    accessor #className = 'red';
    @reactive
    accessor #data = {
      name: 'jack',
    };
    changedClassName = false;

    onClick() {
      this.#data.name += '!';
      this.#text += '?';
      this.#className = this.changedClassName ? 'red' : 'green';
      this.changedClassName = !this.changedClassName;
    }
    get template() {
      return {
        templateString: '<!--?pwc_p--><div id="reactive-container"><!--?pwc_t--> - <!--?pwc_t--></div>',
        templateData: [
          [
            {
              name: 'class',
              value: this.#className,
            },
            {
              name: 'onclick',
              handler: this.onClick,
            },
          ],
          this.#text,
          this.#data.name,
        ],
        template: true,
      };
    }
  };
}

function macroTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 0);
  });
}

describe('Render HTMLElement', () => {
  it('should render simple element', async () => {
    const CustomElement = getSimpleCustomElement();
    const mockClick = jest.spyOn(CustomElement.prototype, 'onClick');
    window.customElements.define('custom-element', CustomElement);
    const element = document.createElement('custom-element');
    document.body.appendChild(element);

    expect(element.innerHTML).toEqual(
      '<!--?pwc_p--><div id="container">hello<!--?pwc_t--> - jack<!--?pwc_t--></div><!--?pwc_t-->',
    );

    const container = document.getElementById('container');
    container.click();
    expect(mockClick).toBeCalled();
  });

  it('should render nested elements', async () => {
    const CustomElement = getNestedCustomElement();
    const mockClick = jest.spyOn(CustomElement.prototype, 'onClick');
    window.customElements.define('custom-nested-element', CustomElement);
    const element = document.createElement('custom-nested-element');
    document.body.appendChild(element);

    expect(element.innerHTML).toEqual(
      '<!--?pwc_p--><div id="nested-container">hello<!--?pwc_t--> <div>This is title<!--?pwc_t--></div> nested<!--?pwc_t--></div><!--?pwc_t-->',
    );

    const container = document.getElementById('nested-container');
    container.click();
    expect(mockClick).toBeCalled();
  });

  it('should render reactive element', async () => {
    const CustomElement = getReactiveCustomElement();
    window.customElements.define('custom-reactive-element', CustomElement);
    const element = document.createElement('custom-reactive-element');
    document.body.appendChild(element);

    expect(element.innerHTML).toEqual(
      '<!--?pwc_p--><div id="reactive-container" class="red">hello<!--?pwc_t--> - jack<!--?pwc_t--></div><!--?pwc_t-->',
    );

    const container = document.getElementById('reactive-container');
    container.click();

    await nextTick();
    expect(element.innerHTML).toEqual(
      '<!--?pwc_p--><div id="reactive-container" class="green">hello?<!--?pwc_t--> - jack!<!--?pwc_t--></div><!--?pwc_t-->',
    );
  });

  it('should trigger template method as expected', async () => {
    const mockFn = jest.fn().mockImplementation((text) => {
      return html`<div>${text}</div>`;
    });
    class CustomElement extends HTMLElement {
      @reactive
      accessor text = 'hello';
      constructor() {
        super();
        this.text = 'constructor';
      }
      get template() {
        return mockFn(this.text);
      }
    }
    window.customElements.define('custom-runtime-component', CustomElement);
    const element = document.createElement('custom-runtime-component');
    document.body.appendChild(element);

    expect(element.text).toEqual('constructor');
    expect(mockFn).toBeCalledTimes(1);
    element.text = 'world';
    await nextTick();
    expect(mockFn).toBeCalledTimes(2);
  });
});

describe('Render nested components', () => {
  const mockChildFn = jest.fn().mockImplementation((obj) => {
    return html`<div id="child-container">
      <div @click=${obj.callback}>${obj.title} - ${obj.data.name} - ${obj.items.join(',')}</div>
    </div>`;
  });
  @customElement('child-element')
  class ChildElement extends HTMLElement {
    @reactive
    accessor title = 'Child Element';

    @reactive
    accessor data = {};

    items = [];

    callback() {}

    get template() {
      return mockChildFn(this);
    }
  }

  let index = 0;

  @customElement('parent-element')
  class ParentElement extends HTMLElement {
    @reactive
    accessor #title = 'Hello';

    @reactive
    accessor #data = { name: 'World' };

    @reactive
    accessor #items = [];

    #callback() {
      console.log('Click in ChildElement');
    }

    onClick() {
      switch (index) {
        case 0:
          this.#title += '!';
          break;
        case 1:
          this.#data.name += '!';
          break;
        case 2:
          this.#items.push(index);
          break;
        default:
          break;
      }

      index++;
    }

    get template() {
      return html`<button id="parent-btn" @click=${this.onClick.bind(this)}>Click</button>
        <child-element
          title=${this.#title}
          data=${this.#data}
          items=${this.#items}
          callback=${this.#callback}
        ></child-element>`;
    }
  }

  const element = document.createElement('parent-element');
  document.body.appendChild(element);

  it('any reactive data should trigger the update of child components', async () => {
    const parentBtn = document.getElementById('parent-btn');
    const childElement = document.getElementById('child-container');
    expect(childElement.innerHTML).toEqual(
      '\n      <!--?pwc_p--><div>Hello<!--?pwc_t--> - World<!--?pwc_t--> - <!--?pwc_t--></div>\n    ',
    );
    expect(mockChildFn).toBeCalledTimes(1);

    // primity type
    parentBtn.click();
    await nextTick();
    expect(childElement.innerHTML).toEqual(
      '\n      <!--?pwc_p--><div>Hello!<!--?pwc_t--> - World<!--?pwc_t--> - <!--?pwc_t--></div>\n    ',
    );
    expect(mockChildFn).toBeCalledTimes(2);

    // object type
    parentBtn.click();
    await nextTick();
    expect(childElement.innerHTML).toEqual(
      '\n      <!--?pwc_p--><div>Hello!<!--?pwc_t--> - World!<!--?pwc_t--> - <!--?pwc_t--></div>\n    ',
    );
    expect(mockChildFn).toBeCalledTimes(3);

    // array type
    parentBtn.click();
    await nextTick();
    expect(childElement.innerHTML).toEqual(
      '\n      <!--?pwc_p--><div>Hello!<!--?pwc_t--> - World!<!--?pwc_t--> - 2<!--?pwc_t--></div>\n    ',
    );
    expect(mockChildFn).toBeCalledTimes(4);
  });

  it('a direct setter of property with the reactive decorator should trigger the update of components', async () => {
    const childComponent = document.getElementsByTagName('child-element')[0];
    const childElement = document.getElementById('child-container');

    // with reactive decorator
    childComponent.title = 'Hello';
    await nextTick();
    expect(childElement.innerHTML).toEqual(
      '\n      <!--?pwc_p--><div>Hello<!--?pwc_t--> - World!<!--?pwc_t--> - 2<!--?pwc_t--></div>\n    ',
    );
    expect(mockChildFn).toBeCalledTimes(5);

    // with reactive decorator
    childComponent.data = { name: 'Child Element' };
    await nextTick();
    expect(childElement.innerHTML).toEqual(
      '\n      <!--?pwc_p--><div>Hello<!--?pwc_t--> - Child Element<!--?pwc_t--> - 2<!--?pwc_t--></div>\n    ',
    );
    expect(mockChildFn).toBeCalledTimes(6);

    // without reactive decorator
    childComponent.items = [1];
    await nextTick();
    expect(childElement.innerHTML).toEqual(
      '\n      <!--?pwc_p--><div>Hello<!--?pwc_t--> - Child Element<!--?pwc_t--> - 2<!--?pwc_t--></div>\n    ',
    );
    expect(mockChildFn).toBeCalledTimes(6);
  });
});

describe('render multiple kinds template', () => {
  it('should render basic data types', async () => {
    // Return number directly
    @customElement('number-custom-element')
    class NumberCustomElement extends HTMLElement {
      get template() {
        return 123;
      }
    }
    const el = document.createElement('number-custom-element');
    document.body.appendChild(el);

    expect(el.innerHTML).toEqual('123<!--?pwc_t-->');

    // Return a property which value is number
    @customElement('number-dynamic-custom-element')
    class NumberDynamicCustomElement extends HTMLElement {
      #id = 123;
      get template() {
        return this.#id;
      }
    }
    const el1 = document.createElement('number-dynamic-custom-element');
    document.body.appendChild(el1);

    expect(el1.innerHTML).toEqual('123<!--?pwc_t-->');

    // Return null
    @customElement('null-custom-element')
    class NullCustomElement extends HTMLElement {
      get template() {
        return null;
      }
    }

    const el2 = document.createElement('null-custom-element');
    document.body.appendChild(el2);

    expect(el2.innerHTML).toEqual('<!--?pwc_t-->');

    // Return false
    @customElement('false-custom-element')
    class FalseCustomElement extends HTMLElement {
      get template() {
        return false;
      }
    }

    const el3 = document.createElement('false-custom-element');
    document.body.appendChild(el3);

    expect(el3.innerHTML).toEqual('<!--?pwc_t-->');

    // Return 0
    @customElement('zero-custom-element')
    class ZeroCustomElement extends HTMLElement {
      get template() {
        return 0;
      }
    }

    const el4 = document.createElement('zero-custom-element');
    document.body.appendChild(el4);

    expect(el4.innerHTML).toEqual('0<!--?pwc_t-->');

    // Return plain object
    @customElement('plain-object-custom-element')
    class PlainObjectCustomElement extends HTMLElement {
      get template() {
        return { x: 1 };
      }
    }

    const el5 = document.createElement('plain-object-custom-element');
    document.body.appendChild(el5);
    await nextTick();
    expect(el5.innerHTML).toEqual('[object Object]<!--?pwc_t-->');
  });

  it('should render nested template', async () => {
    // Return nested false
    @customElement('nested-false-custom-element')
    class FalseCustomElement extends HTMLElement {
      get template() {
        return html`<div>${html`${false}`}</div>`;
      }
    }
    const el = document.createElement('nested-false-custom-element');
    document.body.appendChild(el);

    expect(el.innerHTML).toEqual('<div><!--?pwc_t--><!--?pwc_t--></div><!--?pwc_t-->');

    @customElement('nested-simple-list')
    class NestedSimpleList extends HTMLElement {
      get template() {
        return html`<div>${[1, 3, 2].map((item) => html`<span>${item}</span>`)}</div>`;
      }
    }
    const el1 = document.createElement('nested-simple-list');
    document.body.appendChild(el1);
    await nextTick();
    expect(el1.innerHTML).toEqual(
      '<div><span>1<!--?pwc_t--></span><span>3<!--?pwc_t--></span><span>2<!--?pwc_t--></span><!--?pwc_t--></div><!--?pwc_t-->',
    );

    @customElement('directly-list')
    class DirectlyList extends HTMLElement {
      get template() {
        return [1, 3, 2].map((item) => {
          return html`<span>${item}</span>`;
        });
      }
    }
    const el2 = document.createElement('directly-list');
    document.body.appendChild(el2);

    expect(el2.innerHTML).toEqual(
      '<span>1<!--?pwc_t--></span><span>3<!--?pwc_t--></span><span>2<!--?pwc_t--></span><!--?pwc_t-->',
    );

    @customElement('hybrid-list')
    class HybridList extends HTMLElement {
      @reactive
      accessor list = ['item1', 'item2', 'item3', 'item4'];

      handleItemClick(index) {
        this.list = [...this.list.slice(0, index), ...this.list.slice(index + 1)];
      }

      get template() {
        return html`${this.list.map((item, index) => {
          if (item === 'item2') {
            return null;
          }
          if (item === 'item3') {
            return [1, 2, 3].map((insideItem) => {
              return html`<div class=${item} @click=${() => this.handleItemClick(index)}>
                inside list: ${insideItem}
              </div>`;
            });
          }
          return html`<div class=${item} @click=${() => this.handleItemClick(index)}>${item}</div>`;
        })}`;
      }
    }

    const el3 = document.createElement('hybrid-list');
    document.body.appendChild(el3);

    expect(el3.innerHTML)
      .toEqual(`<!--?pwc_p--><div class="item1">item1<!--?pwc_t--></div><!--?pwc_p--><div class=\"item3\">
                inside list: 1<!--?pwc_t-->
              </div><!--?pwc_p--><div class=\"item3\">
                inside list: 2<!--?pwc_t-->
              </div><!--?pwc_p--><div class=\"item3\">
                inside list: 3<!--?pwc_t-->
              </div><!--?pwc_p--><div class=\"item4\">item4<!--?pwc_t--></div><!--?pwc_t--><!--?pwc_t-->`);

    const item1 = document.getElementsByClassName('item1')[0];
    item1.click();
    await nextTick();
    expect(el3.innerHTML).toEqual(`<!--?pwc_p--><div class=\"item3\">
                inside list: 1<!--?pwc_t-->
              </div><!--?pwc_p--><div class=\"item3\">
                inside list: 2<!--?pwc_t-->
              </div><!--?pwc_p--><div class=\"item3\">
                inside list: 3<!--?pwc_t-->
              </div><!--?pwc_p--><div class=\"item4\">item4<!--?pwc_t--></div><!--?pwc_t--><!--?pwc_t-->`);
    const item3 = document.getElementsByClassName('item3')[0];
    item3.click();
    await nextTick();
    expect(el3.innerHTML).toEqual(
      `<!--?pwc_p--><div class=\"item4\">item4<!--?pwc_t--></div><!--?pwc_t--><!--?pwc_t-->`,
    );

    @customElement('nested-hybrid-list')
    class NestedHybridList extends HTMLElement {
      @reactive
      accessor list = ['item1', 'item2', 'item3', 'item4'];

      onClick() {
        this.list.push('item 5');
      }

      handleItemClick(index) {
        this.list = [...this.list.slice(0, index), ...this.list.slice(index + 1)];
      }

      get template() {
        return html`<div @click=${this.onClick}>
          ${this.list.map((item, index) => {
            return html`<div class=${item} @click=${() => this.handleItemClick(index)}>${item}</div>`;
          })}
        </div>`;
      }
    }

    const el4 = document.createElement('nested-hybrid-list');
    document.body.appendChild(el4);

    expect(el4.innerHTML).toEqual(`<!--?pwc_p--><div>
          <!--?pwc_p--><div class=\"item1\">item1<!--?pwc_t--></div><!--?pwc_p--><div class=\"item2\">item2<!--?pwc_t--></div><!--?pwc_p--><div class=\"item3\">item3<!--?pwc_t--></div><!--?pwc_p--><div class=\"item4\">item4<!--?pwc_t--></div><!--?pwc_t-->
        </div><!--?pwc_t-->`);

    const nestedItem1 = document.getElementsByClassName('item1')[0];
    nestedItem1.click();
    await macroTask();
    expect(el4.innerHTML).toEqual(`<!--?pwc_p--><div>
          <!--?pwc_p--><div class=\"item2\">item2<!--?pwc_t--></div><!--?pwc_p--><div class=\"item3\">item3<!--?pwc_t--></div><!--?pwc_p--><div class=\"item4\">item4<!--?pwc_t--></div><!--?pwc_p--><div class=\"item 5\">item 5<!--?pwc_t--></div><!--?pwc_t-->
        </div><!--?pwc_t-->`);
  });
});

describe('render with rax', () => {
  it('should pass props to PWC element in rax', async () => {
    @customElement('rax-custom-element')
    class CustomElement extends HTMLElement {
      @reactive
      accessor customTitle = 'default title';
      get template() {
        return html`<div>${this.customTitle}</div>`;
      }
    }

    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    function App() {
      const [customTitle, setCustomTitle] = useState('outside title');

      const handleClick = useCallback(() => {
        setCustomTitle('changed title');
      }, []);

      return createElement('rax-custom-element', {
        customTitle,
        onClick: handleClick,
      });
    }

    raxRender(createElement(App), root, {
      driver: DriverDom,
    });

    expect(root.innerHTML).toEqual(
      '<rax-custom-element><div>outside title<!--?pwc_t--></div><!--?pwc_t--></rax-custom-element>',
    );

    const el = document.getElementsByTagName('rax-custom-element')[0];
    el.click();

    await macroTask();

    expect(root.innerHTML).toEqual(
      '<rax-custom-element><div>changed title<!--?pwc_t--></div><!--?pwc_t--></rax-custom-element>',
    );
  });
});
