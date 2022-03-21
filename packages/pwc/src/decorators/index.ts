export function reactive(value, { kind, name, addInitializer }) {
  if (kind === 'accessor') {
    return {
      get() {
        return this.getReactiveValue(name);
      },
      set(val) {
        this.setReactiveValue(name, val);
      },
      init(initialValue) {
        this.setReactiveValue(name, initialValue);
        return initialValue;
      },
    };
  }
}
export function legacyReactive(name, initialValue) {
  this.setReactiveValue(name, initialValue);

  Object.defineProperty(this.constructor.prototype, name, {
    set(val) {
      this.setReactiveValue(name, val);
    },
    get() {
      return this.getReactiveValue(name);
    },
  });
}
