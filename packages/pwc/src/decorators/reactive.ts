export function reactive(value, { kind, name }) {
  if (kind === 'accessor') {
    return {
      get() {
        return this._getValue(name);
      },
      set(val) {
        this._setValue(name, val);
      },
      init(initialValue) {
        this._initValue(name, initialValue);
        return initialValue;
      },
    };
  }
}
