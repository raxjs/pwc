import { isArray, isPlainObject, isPrivate, shallowClone } from '../utils';
import { createReactive } from './createReactive';

interface ReactiveType {
  initValue: (prop: string, value: unknown) => void;

  setValue: (prop: string, value: unknown, forceUpdate: boolean) => void;

  getValue: (prop: string) => unknown;

  // If the reactive property changes, it  will request a update
  requestUpdate: (prop: string) => void;
}

export class Reactive implements ReactiveType {
  changedProperties: Set<string> = new Set();

  static getKey(key: string): string {
    return `#_${key}`;
  }

  #element: any;

  constructor(elementInstance) {
    this.#element = elementInstance;
  }

  requestUpdate(prop: string) {
    this.changedProperties.add(prop);
    this.#element?._requestUpdate();
  }

  initValue(prop: string, value: unknown) {
    this.setValue(prop, value, false);
  }

  getValue(prop: string) {
    const key = Reactive.getKey(prop);
    return this.#element[key];
  }

  setValue(prop: string, value: unknown, forceUpdate = true) {
    if (isPrivate(prop)) {
      this.#setReactiveValue(prop, value);
    } else {
      // It should shallow clone public props to prevent effects of passing by reference
      this.#setReactiveValue(prop, shallowClone(value));
    }

    if (forceUpdate) {
      this.requestUpdate(prop);
    }
  }

  #setReactiveValue(prop: string, value: unknown) {
    if (isArray(value) || isPlainObject(value)) {
      this.#createReactiveProperty(prop, value);
    } else {
      this.#setNormalValue(prop, value);
    }
  }

  #setNormalValue(prop: string, value: unknown) {
    const key = Reactive.getKey(prop);
    this.#element[key] = value;
  }

  #createReactiveProperty(prop: string, initialValue: any) {
    const key = Reactive.getKey(prop);
    this.#element[key] = createReactive(initialValue, prop, this.requestUpdate.bind(this, prop));
  }
}
