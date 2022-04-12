import { hasOwnProperty } from '../../utils';

export function attributeGetter(name: string) {
  const store = this._getReflectProperties().get(name);
  const { isBoolean, attrName, initialValue } = store;

  // Store value is highest weight
  if (hasOwnProperty(store, 'value')) {
    return store.value;
  }

  const attrValue = this.getAttribute(attrName);
  if (attrValue === null && initialValue !== undefined) return initialValue;

  return isBoolean || attrValue;
}
