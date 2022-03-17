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
    const key = Reactive.getKey(prop);

    if (typeof initialValue === 'object') {
      this.#element[key] = new Proxy(initialValue, this.#proxyHandler);
    } else {
      this.#element[key] = initialValue;
    }

    this.requestUpdate();
  }
}
