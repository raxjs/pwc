export default class Reactive {
  constructor(data) {
    this.createProxy(data);
  }
  createProxy(data) {
    if (typeof data === 'object' && data.toString() === '[object Object]') {
      for (const k in data) {
        if (typeof data[k] === 'object') {
          this.defineObjectReactive(data, k, data[k]);
        } else {
          this.defineBasicReactive(data, k, data[k]);
        }
      }
    }
  }
  defineObjectReactive(obj, key, value) {
    // 递归
    this.createProxy(value);
    obj[key] = new Proxy(value, {
      set(target, property, val, receiver) {
        if (property !== 'length') {
          console.log('Set %s to %o', property, val);
        }
        return Reflect.set(target, property, val, receiver);
      },
    });
  }
  defineBasicReactive(obj, key, value) {
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
        return value;
      },
      set: (newValue) => {
        if (value === newValue) return;
        value = newValue;
        this.updater();
      },
    });
  }
}
