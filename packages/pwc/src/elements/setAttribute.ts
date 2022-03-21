import { hasOwnProperty } from '../utils/hasOwnProperty';
import { isEventName } from '../utils/isEventName';
import type { Attributes } from '../type';

export default function setAttribute(element: Element, attrs: Attributes) {
  for (const attrName in attrs) {
    if (hasOwnProperty(attrs, attrName)) {
      if (isEventName(attrName)) {
        const { handler, capture = false } = attrs[attrName];
        // If capture is true, the event should be trigger when capture stage
        element.addEventListener(attrName.slice(2).toLowerCase(), handler, capture);
      } else if (attrName in element) {
        // Verify that there is a target property on the element
        element[attrName] = attrs[attrName];
      } else {
        element.setAttribute(attrName, attrs[attrName]);
      }
    }
  }
}
