export function reactive(value, { kind, name }) {
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
      },
    };
  }
}
