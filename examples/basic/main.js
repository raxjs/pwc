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
      ['<!--?pwc_p--><div>', ' - ', '<child-element></child-element></div>'],
      [
        {
          onclick: {
            handler: this.onClick,
            type: 'capture',
          },
        },
        this.text,
        this.name,
      ],
    ];
  }
}

class Child extends HTMLElement {
  name = 'Child';
  connectedCallback() {
    super.connectedCallback();
    console.log('connected');
  }
  onClick() {
    console.log('click!!!');
  }
  get template() {
    return [['<div>', '</div>'], [this.name]];
  }
}

window.customElements.define('custom-element', CustomElement);
window.customElements.define('child-element', Child);
