import { ReactiveElementType } from '../type';

export class ReactiveProperty implements ReactiveElementType {
  #element: any;

  constructor(elementInstance) {
    this.#element = elementInstance;
  }

  requestUpdate() {
    this.#element?.requestUpdate();
  }

  createReactiveProperty(prop: string, initialValue: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instance = this;
    if (typeof initialValue === 'object') {
      this.#element[prop] = new Proxy(initialValue, {
        set(target, property, val) {
          target[property] = val;
          instance.requestUpdate();
          return true;
        },
        get(target, property) {
          return target[property];
        },
      });
    } else {
      instance[prop] = initialValue;
      Object.defineProperty(this.#element, prop, {
        enumerable: true,
        configurable: true,
        get() {
          return instance[prop];
        },
        set: (newValue) => {
          instance[prop] = newValue;
          instance.requestUpdate();
        },
      });
    }
  }
}
