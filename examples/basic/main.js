import { reactive, customElement, html, nextTick } from 'pwc';

@customElement('child-element')
class Child extends HTMLElement {
  name = 'Child';

  @reactive
  accessor itemtitle = 'default title';

  connectedCallback() {
    super.connectedCallback();
    console.log('child connected');
  }

  get template() {
    return html`<div>
      Child ${this.name}
      <div>parent class name is ${this.itemtitle}</div>
    </div>`;
  }
}

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor data = {
    name: 'jack',
  };

  @reactive
  accessor text = 'hello';

  @reactive
  accessor className = 'red';

  connectedCallback() {
    super.connectedCallback();
    console.log('parent connected');
  }

  onClick = () => {
    this.data.name += '!';
    this.text += '?';
    this.className = this.className === 'green' ? 'red' : 'green';
  };

  get template() {
    return html`<div class=${this.className} @click=${this.onClick}>
      ${this.text}
      <child-element name=${this.data.name} itemtitle=${'outside title'}></child-element>
      <div>Parent: ${this.data.name}</div>
    </div>`;
  }
}



