export function reactive(value, { kind, name }) {
  if (kind === 'accessor') {
    return {
      get() {
        console.log('get', name);
        return this.getValue(name);
      },
      set(val) {
        console.log('set', name, val);
        this.setValue(name, val);
      },
      init(initialValue) {
        console.log('init', name, initialValue);
        this.setValue(name, initialValue);
      },
    };
  }
}
