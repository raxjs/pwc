export default (definition, BaseElement) => {
  return class extends definition {
    #instance;
    constructor(...args) {
      super();
      // Init base element instance
      this.#instance = new BaseElement();

      // Bind element to instance
      this.#instance.el = this;
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
