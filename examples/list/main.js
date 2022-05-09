import { reactive, customElement, html, toRaw } from 'pwc';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #title = 'default title';

  @reactive
  accessor #list = ['item 1', 'item 2', 'item 3', 'item 4'];

  onClick() {
    this.#title = '123';
    // this.#list.push('item 4');
  }

  handleItemClick(index) {
    this.#list = [...this.#list.slice(0, index), ...this.#list.slice(index + 1)];
  }

  get template() {
    return html`${this.#list.map((item, index) => {
      if (item === 'item 2') {
        return null;
      }
      if (item === 'item 3') {
        return [1, 2, 3].map((insideItem) => {
          return html`<div @click=${() => this.handleItemClick(index)}>inside list: ${insideItem}</div>`;
        });
      }
      return html`<div @click=${() => this.handleItemClick(index)}>${item}</div>`;
    })}`;
  }
}
