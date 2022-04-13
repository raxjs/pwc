import { attributeGetter } from './attribute/getter';
import { attributeSetter } from './attribute/setter';
import { validateAccessor } from './validateAccessor';

export function reactive(value, { kind, name }) {
  // Validate accessor operator
  validateAccessor(kind, '@reactive', name);

  return {
    get() {
      if (this._getReflectProperties().has(name)) {
        const attrValue = attributeGetter.call(this, name);
        // if not set attribute value, return default value
        if (attrValue !== null) return attrValue;
      }

      return this._getValue(name);
    },
    set(val) {
      this._setValue(name, val);
      // Set reflected attribute
      if (this._getReflectProperties().has(name)) {
        attributeSetter.call(this, val, name);
      }
    },
    init(initialValue) {
      this._initValue(name, initialValue);
      return initialValue;
    },
  };
}
