import { reactive, customElement, html } from 'pwc';

@customElement('child-element')
class ChildElement extends HTMLElement {
  @reactive
  accessor data = { foo: 0 }
  get template() {
    console.log('>>>');
    return html`<div>${this.data.foo}</div>`;
  }
}

@customElement('custom-element')
class CustomElement extends HTMLElement {
  @reactive
  accessor #condition = true;

  @reactive
  accessor #icon = '';

  @reactive
  accessor #data = { foo: 1 }


  handleClick() {
    console.log('click');
    this.#condition = !this.#condition;
    this.#icon += '!';
  }

  get template() {
    const result = html`<div>
      <p @click=${this.handleClick}>Condition is ${this.#condition + ''}</p>
      ${this.#condition ? html`<p>True Condition${this.#icon}</p>` : html`<p>False Condition${this.#icon}</p>`}
      <child-element data=${this.#data}></child-element>
    </div>`;

    console.log(result);
    return result;
  }
}
