import { isEventName } from '../utils/isEventName';
import type { Attributes } from '../type';

export function commitAttributes(element: Element, attrs: Attributes, isInitial: boolean) {
  for (const attr of attrs) {
    const { name, value } = attr;
    if (isEventName(name) && isInitial) {
      const { capture = false } = attr;
      // If capture is true, the event should be triggered when capture stage
      element.addEventListener(name.slice(2).toLowerCase(), value, capture);
    } else if (name in element) {
      // Verify that there is a target property on the element
      element[name] = value;
    } else {
      element.setAttribute(name, value);
    }
  }
}
