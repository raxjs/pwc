import { Reactive } from '../reactivity/reactive';

export function reactive(value, { kind, name }) {
  if (kind === 'accessor') {
    return {
      get() {
        return this[Reactive.getKey(name)];
      },
      set(val) {
        this.createReactiveProperty(name, val);
      },
    };
  }
}
