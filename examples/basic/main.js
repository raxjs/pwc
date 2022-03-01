import 'pwc/HTMLElement';

class CustomElement extends HTMLElement {
  text = 'hello';
  name = 'jack';
  connectedCallback() {
    super.connectedCallback();
    console.log('connected');
  }
  onClick() {
    console.log('click!!!');
  }
  get template() {
    return [
      ['<!--?pwc_placeholder--><div>', ' - ', '</div>'],
      [
        {
          type: 'attr',
          __events: {
            click: this.onClick,
          },
        },
        this.text,
        this.name,
      ],
    ];
  }
}

window.customElements.define('custom-element', CustomElement);
