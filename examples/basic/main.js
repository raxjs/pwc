import { reactive } from 'pwc';

class CustomElement extends HTMLElement {
  changedClassName = false;

  @reactive
  accessor data = {
    name: 'jack',
  };

  @reactive
  accessor text = 'hello';
  @reactive
  accessor className = 'red';

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name, oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();
  }
  onClick() {
    // console.log(this.data);
    this.data.name += '!';
    this.text += '?';
    this.className = this.changedClassName ? 'red' : 'green';
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
            capture: true,
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
