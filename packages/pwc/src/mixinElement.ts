import type { CustomHTMLBaseElement } from './type';
import BaseElement from './elements/BaseElement';

export default (definition) => {
  return class extends definition {
    #instance;
    constructor(...args) {
      super();
      // Init base element instance
      this.#instance = new BaseElement((this as unknown) as CustomHTMLBaseElement, ...args);
    }
    connectedCallback(...args) {
      this.#instance.connectedCallback(...args);
    }
    disconnectedCallback(...args) {
      this.#instance.disconnectedCallback(...args);
    }
    adoptedCallback(...args) {
      this.#instance.adoptedCallback(...args);
    }
    attributeChangedCallback(...args) {
      this.#instance.attributeChangedCallback(...args);
    }
  };
};
