import { hasOwnProperty, isArray } from '../utils';
import { ReactiveFlags } from '../constants';

function toRaw(observed: object): object {
  const raw = observed && observed[ReactiveFlags.RAW];
  return raw ? toRaw(raw) : observed;
}

function get(
  target: object,
  key: string,
  receiver: object,
): any {
  if (key === ReactiveFlags.RAW) {
    return target;
  }
  return Reflect.get(target, key, receiver);
}

function createSetter(trigger) {
  return function set(
    target: object,
    key: string,
    value: unknown,
    receiver: object,
  ) {
    const result = Reflect.set(target, key, value, receiver);
    const originTarget = toRaw(receiver);

    // Ignore the set which happened in a prototype chain
    if (originTarget !== target) {
      return result;
    }

    // Ignore the array.length changes
    if (!isArray(target) || key !== 'length') {
      trigger();
    }

    return result;
  };
}

function createDeleteProperty(trigger) {
  return function deleteProperty(
    target: object,
    key: string,
  ): boolean {
    const hadKey = hasOwnProperty(target, key);
    const result = Reflect.deleteProperty(target, key);

    if (result && hadKey) {
      trigger();
    }
    return result;
  };
}
export function getProxyHandler(callback) {
  const set = createSetter(callback);
  const deleteProperty = createDeleteProperty(callback);
  return {
    get,
    set,
    deleteProperty,
  };
}
