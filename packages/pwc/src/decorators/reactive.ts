export function reactive(value, { kind, name }) {
  if (kind === 'accessor') {
    return {
      get() {
        return this.getValue(name);
      },
      set(val) {
        this.setValue(name, val);
      },
      init(initialValue) {
        this.setValue(name, initialValue);
      },
    };
  }
}
