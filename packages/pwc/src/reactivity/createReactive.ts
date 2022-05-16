import { isObject, toRawType } from '../utils';
import { toRaw } from './methods';
import { createBaseProxy } from './baseProxy';
import { createCollectionProxy } from './collectionProxy';
import { keepTrack } from './track';

// store the collection of original object and reactive object
const proxyMap = new WeakMap<any, any>();

export function createReactive(target: any, prop: string, handler: any) {
  if (!isObject(target)) {
    return target;
  }

  const raw = toRaw(target);
  keepTrack(target, prop, handler);
  return toReactive(raw);
}

export function toReactive(target: any) {
  let proxy = proxyMap.get(target);
  if (proxy) {
    return proxy;
  }

  const rawType = toRawType(target);
  switch (rawType) {
    case 'Object':
    case 'Array':
      proxy = createBaseProxy(target);
      break;
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      proxy = createCollectionProxy(target);
      break;
    default:
      return target;
  }
  // cache proxy
  proxyMap.set(target, proxy);

  return proxy;
}
