import { isArray, isObject, isMap, isSet } from './checkTypes';

// Shallow Clone the Property value
// Attention, it only clones Set\Map\Array\Plain Object
export function shallowClone(value: any) {
  if (isSet(value)) {
    return new Set(value);
  }

  if (isMap(value)) {
    return new Map(value);
  }

  if (isArray(value)) {
    return [...value];
  }

  if (isObject(value)) {
    return Object.assign({}, value);
  }

  return value;
}
