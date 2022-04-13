import { hasOwnProperty } from '../../utils';

export function attributeGetter(name: string) {
  const store = this._getReflectProperties().get(name);
  const { isBoolean, attrName, initialValue } = store;

  // Store value has highest weight
  if (hasOwnProperty(store, 'value')) {
    return store.value;
  }

  const attrValue = this.getAttribute(attrName);
  if (attrValue === null && initialValue !== undefined) {
    return initialValue;
  }

  // Boolean attribute should return Boolean(attrValue), but the result must be true, because attribute has been set
  return isBoolean || attrValue;
}
