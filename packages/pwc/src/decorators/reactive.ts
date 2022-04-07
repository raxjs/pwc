import { attributeGetter } from './attribute/getter';
import { attributeSetter } from './attribute/setter';
import { validateAccessor } from './validateAccessor';

export function reactive(value, { kind, name }) {
  // Validate accessor operator
  validateAccessor(kind, '@reactive', name);

  return {
    get() {
      if (this._getReflectProperties().has(name)) {
        return attributeGetter.call(this, name);
      }
      return this.getReactiveValue(name);
    },
    set(val) {
      this.setReactiveValue(name, val);
      // Set reflected attribute
      if (this._getReflectProperties().has(name)) {
        attributeSetter.call(this, val, name);
      }
    },
    init(initialValue) {
      this.setReactiveValue(name, initialValue);
      return initialValue;
    },
  };
}
