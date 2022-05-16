import { ReactiveFlags } from '../constants';
import { hasOwnProperty, isObject, isMap } from '../utils';
import { toReactive } from './createReactive';
import { forwardTracks, getPropertyNames, runHandlers } from './track';
import { toRaw } from './methods';

export type CollectionTypes = IterableCollections | WeakCollections;

type IterableCollections = Map<any, any> | Set<any>;
type WeakCollections = WeakMap<any, any> | WeakSet<any>;
type MapTypes = Map<any, any> | WeakMap<any, any>;
type SetTypes = Set<any> | WeakSet<any>;

interface Iterable {
  [Symbol.iterator](): Iterator;
}

interface Iterator {
  next(value?: any): IterationResult;
}

interface IterationResult {
  value: any;
  done: boolean;
}

function get(
  this: MapTypes,
  key: unknown,
) {
  const raw = toRaw(this);
  const rawKey = toRaw(key);

  const result = raw.get(rawKey);
  if (result && isObject(result)) {
    forwardTracks(raw, result);
    return toReactive(result);
  }
  return result;
}

function has(
  this: CollectionTypes,
  key: unknown,
) {
  const raw = toRaw(this);
  const rawKey = toRaw(key);

  return raw.has(rawKey);
}

function size(
  target: IterableCollections,
) {
  const raw = toRaw(target);
  return raw.size;
}

function set(
  this: MapTypes,
  key: unknown,
  value: unknown,
) {
  const raw = toRaw(this);
  const rawKey = toRaw(key);
  const rawValue = toRaw(value);

  const hadKey = raw.has(rawKey);
  const isEqual = raw.get(rawKey) === rawValue;
  if (!hadKey || !isEqual) {
    raw.set(rawKey, rawValue);
    runHandlers(raw);
  }

  return this;
}

function add(
  this: SetTypes,
  value: unknown,
) {
  const raw = toRaw(this);
  const hadKey = raw.has(value);
  if (!hadKey) {
    raw.add(value);
    runHandlers(raw);
  }
  return this;
}

function deleteItem(
  this: CollectionTypes,
  key: unknown,
) {
  const raw = toRaw(this);
  const rawKey = toRaw(key);

  const hadKey = raw.has(rawKey);

  const result = raw.delete(key);
  if (hadKey) {
    runHandlers(raw);
  }
  return result;
}

function clear(
  this: IterableCollections,
) {
  const raw = toRaw(this);
  const hadItems = raw.size > 0;
  const result = raw.clear();
  if (hadItems) {
    runHandlers(raw);
  }
  return result;
}

function forEach(
  this: IterableCollections,
  callback: Function,
  thisArg?: unknown,
) {
  const raw = toRaw(this);
  return raw.forEach((value, key) => {
    forwardTracks(raw, value);
    forwardTracks(raw, key);
    return callback.call(thisArg, toReactive(value), toReactive(key), this);
  });
}

function createIterableMethod(
  method: string | symbol,
) {
  return function (
    this: IterableCollections,
    ...args: unknown[]
  ): Iterable & Iterator {
    const raw = toRaw(this);
    const innerIterator = raw[method](...args);
    const targetIsMap = isMap(raw);
    const isPair =
      method === 'entries' || (method === Symbol.iterator && targetIsMap);
    return {
      next() {
        const { value, done } = innerIterator.next();
        if (done) {
          return {
            value,
            done,
          };
        }
        if (isPair) {
          forwardTracks(raw, value[0]);
          forwardTracks(raw, value[1]);
          return {
            value: [toReactive(value[0]), toReactive(value[1])],
            done,
          };
        }
        forwardTracks(raw, value);
        return {
          value: toReactive(value),
          done,
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  };
}

function createInstrumentations() {
  const instrumentations = {
    get,
    has,
    add,
    set,
    delete: deleteItem,
    clear,
    forEach,
    get size() {
      return size(this);
    },
  };
  const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
  iteratorMethods.forEach(method => {
    instrumentations[method as string] = createIterableMethod(method);
  });

  return instrumentations;
}

const instrumentations = createInstrumentations();

export function createCollectionProxy(target: any) {
  return new Proxy(target, {
    get(
      target: CollectionTypes,
      key: string,
      receiver: CollectionTypes,
    ) {
      if (key === ReactiveFlags.PROPERTY) {
        return getPropertyNames(target);
      }
      if (key === ReactiveFlags.RAW) {
        return target;
      }
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
      }

      if (hasOwnProperty(instrumentations, key) && key in target) {
        return Reflect.get(instrumentations, key, receiver);
      }
      return Reflect.get(target, key, receiver);
    },
  });
}