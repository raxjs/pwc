import { reactive, customElement, attribute, html } from 'pwc';

@customElement('child-element')
class ChildElement extends HTMLElement {
  @reactive
  accessor title = 'Child Element';

  @reactive
  accessor data = {};

  items = [];

  callback() {}

  get template() {
    return html`<div id="child-container">
      <div @click=${this.callback}>${this.title} - ${this.data.name} - ${this.items.join(',')}</div>
    </div>`;
  }
}

let index = 0;

@customElement('custom-element')
class ParentElement extends HTMLElement {
  @reactive
  accessor #title = 'Hello';

  @reactive
  accessor #data = { name: 'World' };

  @reactive
  accessor #items = [];

  #callback() {
    console.log('Click in ChildElement');
  }

  onClick() {
    switch (index) {
      case 0:
        this.#title += '!';
        break;
      case 1:
        this.#data.name += '!';
        break;
      case 2:
        this.#items.push(index);
        break;
      default:
        break;
    }

    index++;
  }

  get template() {
    return html`<button id="parent-btn" @click=${this.onClick.bind(this)}>Click</button>
      <child-element
        title=${this.#title}
        data=${this.#data}
        items=${this.#items}
        callback=${this.#callback}
      ></child-element>`;
  }
}
