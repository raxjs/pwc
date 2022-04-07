import { validateAccessor } from './validateAccessor';

export function reactive(value, { kind, name }) {
  // Validate accessor operator
  validateAccessor(kind, '@reactive');

  return {
    get() {
      return this.getReactiveValue(name);
    },
    set(val) {
      this.setReactiveValue(name, val);
    },
    init(initialValue) {
      this.setReactiveValue(name, initialValue);
      return initialValue;
    },
  };
}
