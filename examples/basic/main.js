import 'pwc/HTMLElement';
import { reactive } from 'pwc/decorators';

class CustomElement extends HTMLElement {
  changedClassName = false;
  @reactive accessor data = {
    name: 'jack',
  };
  
  @reactive accessor text = 'hello';
  @reactive accessor className = 'red';


  constructor() {
    super();
    // reactive.call(this, 'data', {
    //   name: 'jack',
    // });
    // reactive.call(this, 'text', 'hello');
    // reactive.call(this, 'className', 'red');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name, oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();
  }
  onClick() {
    this.data.name += '!';
    this.text += '?';
    // this.className = this.changedClassName ? 'red' : 'green';
    this.changedClassName = !this.changedClassName;
    // this.names.push('Tom');
  }
  // <div class={{className}} @click={{onClick}} >{{text}} - {{name}} <child-element name={{name}}/></div>
  get template() {
    return [
      '<!--?pwc_p--><div><!--?pwc_t--> - <!--?pwc_t--><!--?pwc_p--><child-element/></div>',
      [
        {
          class: this.className,
          onclick: {
            handler: this.onClick.bind(this),
            type: 'capture',
          },
        },
        this.text,
        this.data.name,
        {
          name: this.data.name,
        },
      ],
    ];
  }
}


class Child extends HTMLElement {
  privatename = 'Child';
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name, oldValue, newValue);
  }
  connectedCallback() {
    super.connectedCallback();
    console.log('connected');
  }
  get template() {
    return ['<div><!--?pwc_t--></div>', ['Child']];
  }
}

window.customElements.define('custom-element', CustomElement);
window.customElements.define('child-element', Child);
