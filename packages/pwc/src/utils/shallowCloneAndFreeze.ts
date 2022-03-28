import { isPrimitive } from './common';

export function shallowCloneAndFreeze(value: any) {
  if (isPrimitive(value)) {
    return value;
  }

  const props = {};
  for (let propName in value) {
    props[propName] = value[propName];
  }

  Object.freeze(props);

  return props;
}