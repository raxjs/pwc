import { reactive, customElement } from 'pwc';

class Child extends HTMLElement {
  privatename = 'Child';
  connectedCallback() {
    super.connectedCallback();
    console.log('connected');
  }
  get template() {
    return ['<div><!--?pwc_t--></div>', ['Child']];
  }
}

window.customElements.define('child-element', Child);
@customElement('custom-element')
class CustomElement extends HTMLElement {
  changedClassName = false;

  @reactive
  accessor #data = {
    name: 'jack!',
  };

  @reactive
  accessor #text = 'hello';
  @reactive
  accessor #className = 'red';

  connectedCallback() {
    super.connectedCallback();
  }
  onClick() {
    this.#data.name += '!';
    this.#text += '?';
    this.#className = this.changedClassName ? 'red' : 'green';
    this.changedClassName = !this.changedClassName;
  }
  // <div class={{className}} @click={{onClick}} >{{text}} - {{name}} <child-element name={{name}}/></div>
  get template() {
    return [
      '<!--?pwc_p--><div><!--?pwc_t--> - <!--?pwc_t--><!--?pwc_p--><child-element/></div><!--?pwc_p--><div>click</div>',
      [
        [{
          name: 'click',
          value: this.#className
        }],
        this.#text,
        this.#data.name,
        [{
          name: 'obj',
          value: this.#data,
        }],
        [{
          name: 'onclick',
          capture: true,
          value: this.onClick.bind(this),
        }]
      ],
    ];
  }
}
