import { hasOwnProperty, is } from './common';
import { isEvent } from './isEvent';
import { isPrimitive } from './checkTypes';

export function shallowEqual(valueA: any, valueB: any) {
  if (typeof valueA !== typeof valueB) {
    return false;
  }
  // text node
  if (isPrimitive(valueB)) {
    return valueA === valueB;
  }
  // attribute node
  const keysA = Object.keys(valueA);
  const keysB = Object.keys(valueB);
  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const val of keysA) {
    if (!hasOwnProperty(valueB, val) || !isEvent(valueA[val]) || !is(valueA[val], valueB[val])) {
      return false;
    }
  }

  return true;
}
