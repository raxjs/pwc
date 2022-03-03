import '../native/HTMLElement';

jest.useFakeTimers();


function getSimpleCustomElement() {
  return class CustomElement extends HTMLElement {
    text = 'hello';
    name = 'jack';
    onClick() {
      console.log('click!!!');
    }
    get template() {
      return [
        ['<!--?pwc_p--><div id="container">', ' - ', '</div>'],
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
});
