import { getProxyHandler } from './handler';

interface ReactiveType {
  setValue: (prop: string, val: unknown) => void;

  getValue: (prop: string) => unknown;

  setReactiveValue: (prop: string, val: unknown) => void;

  // The reactive property if changed will request a update
  requestUpdate: () => void;
}

export class Reactive implements ReactiveType {
  static getKey(key: string): string {
    return `#_${key}`;
  }

  #element: any;
  #proxyHandler = getProxyHandler(this.requestUpdate.bind(this));

  constructor(elementInstance) {
    this.#element = elementInstance;
  }

  requestUpdate() {
    this.#element?.requestUpdate();
  }

  getValue(prop: string) {
    const key = Reactive.getKey(prop);
    return this.#element[key];
  }

  setValue(prop: string, value: unknown) {
    const key = Reactive.getKey(prop);
    this.#element[key] = value;
  }

  setReactiveValue(prop: string, value: unknown) {
    if (typeof value === 'object') {
      this.#createReactiveProperty(prop, value);
    } else {
      this.setValue(prop, value);
    }
  }

  #createReactiveProperty(prop: string, initialValue: any) {
    const key = Reactive.getKey(prop);
    this.#element[key] = new Proxy(initialValue, this.#proxyHandler);
  }
}
