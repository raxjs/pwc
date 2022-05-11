import { is } from './common';
import { isEvent } from './isEvent';
import { isArray, isPrimitive } from './checkTypes';

export function shallowEqual(valueA: any, valueB: any) {
  if (typeof valueA !== typeof valueB) {
    return false;
  }
  // text node
  if (isPrimitive(valueB)) {
    return valueA === valueB;
  }
  // attribute node
  if (isArray(valueA) && isArray(valueB)) {
    if (valueA.length !== valueB.length) {
      return false;
    }
    for (let index = 0; index < valueA.length; index++) {
      const itemA = valueA[index];
      const itemB = valueB[index];
      if (isEvent(itemA.name)) {
        continue;
      }
      if (!is(itemA.value, itemB.value)) {
        return false;
      }
    }
  }
  return true;
}
