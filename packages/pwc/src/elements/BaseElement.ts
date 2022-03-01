import type { BaseElementType, CustomHTMLBaseElement } from '../type';
import { TEXT_NODE_COMMENT } from '../constants';

export default class BaseElement implements BaseElementType {
  #el: CustomHTMLBaseElement;

  #initialized = false;
  #fragment: Node;
  constructor(el: CustomHTMLBaseElement, ...args: any[]) {
    this.#el = el;
  }
  connectedCallback() {
    if (!this.#initialized) {
      const [strings = [], values = []] = this.#el.template || [];
      const template = document.createElement('template');
      template.innerHTML = strings.join(TEXT_NODE_COMMENT);
      this.#fragment = template.content.cloneNode(true);
      this.#el.appendChild(this.#fragment);
    }
    this.#initialized = true;
  }
  disconnectedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {}
  adoptedCallback() {}
}
