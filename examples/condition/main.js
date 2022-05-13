import { reactive, customElement, html } from 'pwc';

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #condition = true;

  @reactive
  accessor #icon = '';


  handleClick() {
    console.log('click');
    this.#condition = !this.#condition;
    this.#icon += '!';
  }

  get template() {
    return html`<div>
      <p @click=${this.handleClick}>Condition is ${this.#condition}</p>
      ${this.#condition ? html`<p>True Condition${this.#icon}</p>` : html`<p>False Condition${this.#icon}</p>`}
    </div>`;
  }
}


// <p class="${this.cls}"></p> vs <p @event=${this.event}></p>