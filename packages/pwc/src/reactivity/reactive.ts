import { ReactiveFlags } from '../constants';
import { ReactiveType } from '../type';
import { getProxyHandler } from './handler';

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

  createReactiveProperty(prop: string, initialValue: any) {
    if (typeof initialValue === 'object') {
      const key = Reactive.getKey(prop);
      this[key] = new Proxy(initialValue, this.#proxyHandler);
    }
    this.requestUpdate();
  }

  getRawValue(prop: string) {
    const key = Reactive.getKey(prop);
    return this[key][ReactiveFlags.RAW];
  }
}
