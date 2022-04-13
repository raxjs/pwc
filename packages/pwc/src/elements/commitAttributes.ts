import { isEventName } from '../utils/isEventName';
import type { Attributes } from '../type';
import { toRaw } from '../utils';

export function commitAttributes(element: Element, attrs: Attributes, isInitial = false) {
  for (const attr of attrs) {
    const { name, value } = attr;
    if (isEventName(name)) {
      // Only add event listener at the first render
      if (!isInitial) continue;
      const { capture = false } = attr;
      // If capture is true, the event should be triggered when capture stage
      element.addEventListener(name.slice(2).toLowerCase(), value, capture);
    } else if (name in element) {
      // Verify that there is a target property on the element
      element[name] = toRaw(value);
    } else {
      element.setAttribute(name, value);
    }
  }
}
