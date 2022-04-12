export function attributeSetter(val: unknown, name: string) {
  // property not reflect to attribute
  const store = this._getReflectProperties().get(name);
  if (store.isBoolean) {
    store.value = Boolean(val);
  } else {
    store.value = val;
  }
}
