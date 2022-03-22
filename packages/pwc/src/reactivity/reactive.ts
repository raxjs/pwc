import { getProxyHandler } from './handler';

interface ReactiveType {
  setReactiveValue: (prop: string, val: unknown) => void;

  getReactiveValue: (prop: string) => unknown;

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

  getReactiveValue(prop: string) {
    const key = Reactive.getKey(prop);
    return this.#element[key];
  }

  setReactiveValue(prop: string, value: unknown) {
    const key = Reactive.getKey(prop);
    if (typeof value === 'object') {
      this.#createReactiveProperty(key, value);
    } else {
      this.#element[key] = value;
    }
    this.requestUpdate();
  }

  #createReactiveProperty(key: string, initialValue: any) {
    this.#element[key] = new Proxy(initialValue, this.#proxyHandler);
  }
}
