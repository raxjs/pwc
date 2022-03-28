import { hasOwnProperty } from '../utils/common';
import { isEventName } from '../utils/isEventName';
import type { Attributes } from '../type';
import { shallowCloneAndFreeze } from '../utils';

export function commitAttributes(element: Element, attrs: Attributes, isInitial: boolean) {
  for (const attrName in attrs) {
    if (hasOwnProperty(attrs, attrName)) {
      if (isEventName(attrName) && isInitial) {
        const { handler, capture = false } = attrs[attrName];
        // If capture is true, the event should be triggered when capture stage
        element.addEventListener(attrName.slice(2).toLowerCase(), handler, capture);
      } else if (attrName in element) {
        // Verify that there is a target property on the element
        element[attrName] = shallowCloneAndFreeze(attrs[attrName]);
      } else {
        element.setAttribute(attrName, attrs[attrName]);
      }
    }
  }
}
