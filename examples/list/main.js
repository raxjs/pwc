import { reactive, customElement, html } from 'pwc';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #title = 'default title';

  @reactive
  accessor #list = ['item 1', 'item 2', 'item 3'];

  onClick() {
    this.#title = '123';
    // this.#list.push('item 4');
  }

  handleItemClick(index) {
    this.#list = [...this.#list.slice(0, index), ...this.#list.slice(index + 1)];
  }

  get template() {
    // return this.#list.map((item) => {
    //   return html`<span>${item}</span>`;
    // });
    return html`<div>123</div>`
  }
}
