import { reactive, customElement, html } from 'pwc';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #title = 'default title';

  onClick() {
    this.#title = '123';
  }

  get template() {
    return html`<div @click=${this.onClick}>title is ${this.#title}</div>`;
  }
}
