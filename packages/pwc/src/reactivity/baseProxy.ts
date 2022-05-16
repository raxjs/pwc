import { ReactiveFlags } from '../constants';
import { hasOwnProperty, isArray, isObject, toRaw } from '../utils';
import { toReactive } from './createReactive';
import { forwardTracks, getPropertyNames, runHandlers } from './track';

function get(
  target: any,
  key: string,
  receiver: any,
): any {
  if (key === ReactiveFlags.PROPERTY) {
    return getPropertyNames(target);
  }
  if (key === ReactiveFlags.RAW) {
    return target;
  }
  const result = Reflect.get(target, key, receiver);
  if (isObject(result)) {
    forwardTracks(target, result);
    return toReactive(result);
  }
  return result;
}

function set(
  target: any,
  key: string,
  value: unknown,
  receiver: any,
) {
  const result = Reflect.set(target, key, value, receiver);
  const originTarget = toRaw(receiver);

  // Ignore the set which happened in a prototype chain
  if (originTarget !== target) {
    return result;
  }

  // Ignore the array.length changes
  if (!isArray(target) || key !== 'length') {
    runHandlers(target);
  }

  return result;
}

function deleteProperty(
  target: any,
  key: string,
): boolean {
  const hadKey = hasOwnProperty(target, key);
  const result = Reflect.deleteProperty(target, key);

  if (result && hadKey) {
    runHandlers(target);
  }
  return result;
}

export function createBaseProxy(target: any) {
  return new Proxy(target, {
    get,
    set,
    deleteProperty,
  });
}