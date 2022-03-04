import '../native/HTMLElement';

function getSimpleCustomElement() {
  return class CustomElement extends HTMLElement {
    text = 'hello';
    name = 'jack';
    onClick() {
      console.log('click!!!');
    }
    get template() {
      return [
        '<!--?pwc_p--><div id="container"><!--?pwc_t--> - <!--?pwc_t--></div>',
        [
          {
            onclick: {
              handler: this.onClick,
            },
          },
          this.text,
          this.name,
        ],
      ];
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
      return [
        '<!--?pwc_p--><div id="nested-container"><!--?pwc_t--> <div>This is <!--?pwc_t--></div> <!--?pwc_t--></div>',
        [
          {
            onclick: {
              handler: this.onClick,
            },
          },
          this.text,
          this.#title,
          this.name,
        ],
      ];
    }
  };
}

describe('Render HTMLElement', () => {
  it('should render simple element', () => {
    const CustomElement = getSimpleCustomElement();
    const mockClick = jest.spyOn(CustomElement.prototype, 'onClick');
    window.customElements.define('custom-element', CustomElement);
    const element = document.createElement('custom-element');
    document.body.appendChild(element);
    expect(element.innerHTML).toEqual('<!--?pwc_p--><div id="container">hello<!--?pwc_t--> - jack<!--?pwc_t--></div>');

    const container = document.getElementById('container');
    container.click();
    expect(mockClick).toBeCalled();
  });

  it('should render nested elements', () => {
    const CustomElement = getNestedCustomElement();
    const mockClick = jest.spyOn(CustomElement.prototype, 'onClick');
    window.customElements.define('custom-nested-element', CustomElement);
    const element = document.createElement('custom-nested-element');
    document.body.appendChild(element);
    expect(element.innerHTML).toEqual(
      '<!--?pwc_p--><div id="nested-container">hello<!--?pwc_t--> <div>This is title<!--?pwc_t--></div> nested<!--?pwc_t--></div>',
    );

    const container = document.getElementById('nested-container');
    container.click();
    expect(mockClick).toBeCalled();
  });
});
