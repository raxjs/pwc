import { reactive, customElement, attribute, html } from 'pwc';

@customElement('child-element')
class Child extends HTMLElement {
  name = 'Child';

  @reactive
  @attribute('data-class-name')
  accessor className = 'red';

  @attribute('checked')
  accessor checked = false;

  connectedCallback() {
    super.connectedCallback();
    console.log('connected');
    console.log('checked => ', this.checked);
  }

  get template() {
    return html`<div>
      Child ${this.name}
      <div>parent class name is ${this.className}</div>
    </div>`;
  }
}

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #data = {
    name: 'jack!',
  };

  @reactive
  accessor #text = 'hello';

  @attribute('custom')
  accessor custom = false;

  @reactive
  accessor #className = 'red';

  onClick = () => {
    this.#data.name += '!';
    this.#text += '?';
    this.className = this.className === 'green' ? 'red' : 'green';
  };

  get template() {
    return html`<div class=${this.className} @click=${this.onClick}>
      ${this.#text} - ${this.#data.name}
      <child-element name=${this.#data.name} checked=${true} data-class-name=${this.className} />
    </div>`;
  }
}
