import { getProxyHandler } from './handler';
import { isObject } from '../utils';

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

  initReactiveValue(prop: string, value: unknown) {
    const key = Reactive.getKey(prop);

    if (isObject(value)) {
      this.#createReactiveProperty(key, value);
    } else {
      this.#element[key] = value;
    }
  }

  setReactiveValue(prop: string, value: unknown) {
    if (this.#element.__initialized) {
      this.initReactiveValue(prop, value);
      this.requestUpdate();
    } else {
      // For Object.defineProperty case
      this.initReactiveValue(prop, value);
    }
  }

  #createReactiveProperty(key: string, initialValue: any) {
    this.#element[key] = new Proxy(initialValue, this.#proxyHandler);
  }
}
