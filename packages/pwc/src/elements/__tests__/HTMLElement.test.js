import '../native/HTMLElement';
import { reactive, customElement } from '../../decorators';
import { nextTick } from '../sheduler';
import { compileTemplateInRuntime as html } from '@pwc/compiler';

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

describe('Render HTMLElement', () => {
  it('should render simple element', async () => {
    const CustomElement = getSimpleCustomElement();
    const mockClick = jest.spyOn(CustomElement.prototype, 'onClick');
    window.customElements.define('custom-element', CustomElement);
    const element = document.createElement('custom-element');
    document.body.appendChild(element);
    await nextTick();
    expect(element.innerHTML).toEqual('<!--?pwc_p--><div id="container">hello<!--?pwc_t--> - jack<!--?pwc_t--></div>');

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
    await nextTick();
    expect(element.innerHTML).toEqual(
      '<!--?pwc_p--><div id="nested-container">hello<!--?pwc_t--> <div>This is title<!--?pwc_t--></div> nested<!--?pwc_t--></div>',
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
    await nextTick();
    expect(element.innerHTML).toEqual(
      '<!--?pwc_p--><div id="reactive-container" class="red">hello<!--?pwc_t--> - jack<!--?pwc_t--></div>',
    );

    const container = document.getElementById('reactive-container');
    container.click();

    await nextTick();
    expect(element.innerHTML).toEqual(
      '<!--?pwc_p--><div id="reactive-container" class="green">hello?<!--?pwc_t--> - jack!<!--?pwc_t--></div>',
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
    await nextTick();
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
