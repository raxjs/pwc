export const EMPTY_OBJECT = {};
export const NOOP = () => {};

export function isArray(arg: any) {
  return Array.isArray(arg);
}

export function isPrimitive(value: unknown) {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

export function isBoolean(value: unknown) {
  return typeof value === 'boolean';
}

export function isFunction(value: unknown) {
  return typeof value === 'function';
}

export function isPlainObject(value: unknown) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isSet(value: unknown) {
  return value instanceof Set;
}

export function isMap(value: unknown) {
  return value instanceof Map;
}

export function isPrivate(name: string) {
  return name.startsWith('#');
}
