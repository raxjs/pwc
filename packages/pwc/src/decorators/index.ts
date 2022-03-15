export function reactive(value, { kind, name }) {
  if (kind === 'accessor') {
    return {
      set(val) {
        this.createReactiveProperty(name, val);
      },
      get() {
        return this.getRawValue(name);
      },
    };
  }
}
