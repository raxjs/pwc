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

export function isObject(value: unknown) {
  return typeof value === 'object';
}
