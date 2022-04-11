import { isArray, isObject, isPrivate, shallowCloneAndFreeze } from '../utils';
import { getProxyHandler } from './handler';

interface ReactiveType {
  initValue: (prop: string, value: unknown) => void;

  setValue: (prop: string, value: unknown, forceUpdate: boolean) => void;

  getValue: (prop: string) => unknown;

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
    this.#element?._requestUpdate();
  }

  initValue(prop: string, value: unknown) {
    this.setValue(prop, value);
  }

  getValue(prop: string) {
    const key = Reactive.getKey(prop);
    return this.#element[key];
  }

  setValue(prop: string, value: unknown, forceUpdate = true) {
    if (isPrivate(prop)) {
      this.#setReactiveValue(prop, value);
    } else {
      // Clone and Freeze public props and it should not be reactive
      this.#setNormalValue(prop, shallowCloneAndFreeze(value));
    }

    if (forceUpdate) {
      this.requestUpdate();
    }
  }

  #setReactiveValue(prop: string, value: unknown) {
    if (isArray(value) || isObject(value)) {
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
    this.#element[key] = new Proxy(initialValue, this.#proxyHandler);
  }
}
