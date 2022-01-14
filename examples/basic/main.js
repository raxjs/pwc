import '../../packages/rax/src/elements/HTMLElement';
import { html, bindTextNode, bindEvent } from '../../packages/rax/src/html';

class CustomElement extends HTMLElement {
  data = {
    name: 'Jack',
    count: 0,
  };
  connectedCallback() {
    console.log('connected');
  };
  _onClick() {
    this.data.name = 'Solo';
    console.log(this.data.count)
    this.data.count = this.data.count + 1;
  };
  render() {
    const { data, _onClick } = this;
    const { name, count } = data;
    // <h1>{{name}}</h1>
    // <button @click=${_onClick}></button>
    return html`
      <h1>Hi ${bindTextNode(name)}!</h1>
      <button id="button" ${bindEvent.call(this, 'button', { type: 'click', fn: _onClick })}>
        Click Count: ${bindTextNode(count)}
      </button>
      <slot></slot>
    `;
  }
}

class ChildElement extends HTMLElement {
  render() {
    // <h1>{{this.name}}</h1>
    // <button @click=${this._onClick}></button>
    return html`<div>Child</div> `;
  }
}

window.customElements.define('child-element', ChildElement);
window.customElements.define('custom-element', CustomElement);


