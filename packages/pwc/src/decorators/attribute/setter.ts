export function attributeSetter(val: unknown, name: string) {
  // Boolean attribute not reflect to attribute
  const { isBoolean, attrName } = this._getReflectProperties().get(name);
  if (isBoolean && val === false) {
    this.removeAttribute(attrName);
  } else {
    this.setAttribute(attrName, val);
  }
}
