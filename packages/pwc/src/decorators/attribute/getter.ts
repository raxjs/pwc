export function attributeGetter(name: string) {
  const { isBoolean, attrName } = this._getReflectProperties().get(name);
  const attrValue = this.getAttribute(attrName);
  if (isBoolean) {
    return attrValue !== null;
  }
  return attrValue;
}
