import { isEventName } from '../utils/isEventName';
import type { Attributes, PWCElement } from '../type';
import { isFunction, toRaw } from '../utils';

export function commitAttributes(element: Element, attrs: Attributes, isInitial, rootElement?: PWCElement) {
  for (const attr of attrs) {
    const { name, value } = attr;
    if (isEventName(name)) {
      // Only add event listener at the first render
      // And value is valid
      if (!isInitial || !isFunction(value)) {
        continue;
      }
      const { capture = false } = attr;
      // If capture is true, the event should be triggered when capture stage
      // Bind the rootElement to ensure the handler context is the element itself
      element.addEventListener(name.slice(2).toLowerCase(), value.bind(rootElement), capture);
    } else if (name in element) {
      // Verify that there is a target property on the element
      element[name] = toRaw(value);
    } else {
      element.setAttribute(name, value);
    }
  }
}
