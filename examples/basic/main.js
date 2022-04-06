import { reactive, customElement, attribute } from 'pwc';

@customElement('child-element')
class Child extends HTMLElement {
  name = 'Child';
  connectedCallback() {
    super.connectedCallback();
    console.log('connected');
  }
  get template() {
    return ['<div><!--?pwc_t--></div>', ['Child']];
  }
}


@customElement('custom-element')
class CustomElement extends HTMLElement {
  changedClassName = false;

  @reactive
  accessor data = {
    name: 'jack',
  };

  @reactive
  accessor text = 'hello';

  @reactive
  @attribute('data-class-name')
  accessor className = 'red';

  @attribute('custom')
  accessor custom = false;

  onClick() {
    console.log('prop ===>', this.custom)
    this.data.name += '!';
    this.text += '?';
    this.className = this.changedClassName ? 'red' : 'green';
    this.changedClassName = !this.changedClassName;
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
