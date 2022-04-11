import { reactive, customElement, html } from 'pwc';

class Child extends HTMLElement {
  @reactive
  accessor title = 'Child';
  get template() {
    return html`<div>${this.title}</div>`;
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
  get template() {
    return html`
      <div class="${this.#className}" onClick=${this.onClick.bind(this)}>${this.#text} - ${this.#data.name}<child-element title=${this.#data.name}></child-element></div>
    `;
  }
}
