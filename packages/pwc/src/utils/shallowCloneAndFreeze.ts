import { isArray, isFunction, isPrimitive } from './common';

export function shallowCloneAndFreeze(value: any) {
  if (isPrimitive(value) || isFunction(value)) {
    return value;
  }

  if (isArray(value)) {
    const props = [...value];
    Object.freeze(props);
    return props;
  }
  const props = {};
  for (let propName in value) {
    props[propName] = value[propName];
  }

  Object.freeze(props);

  return props;
}